import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import RegisterPage from '@/pages/register';
import { register } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock API and auth context
jest.mock('@/services/api', () => ({
  register: jest.fn(),
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('RegisterPage', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockLogin = jest.fn();
  const mockLoginWithGoogle = jest.fn();
  const mockLoginWithGithub = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      loginWithGoogle: mockLoginWithGoogle,
      loginWithGithub: mockLoginWithGithub,
    });
  });

  const fillForm = (
    username = 'testuser',
    email = 'test@example.com',
    password = 'Test123!@#',
    confirmPassword = 'Test123!@#'
  ) => {
    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: username },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: email },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: password },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: confirmPassword },
    });
  };

  it('renders registration form', () => {
    render(
      <ChakraProvider>
        <RegisterPage />
      </ChakraProvider>
    );

    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('displays password requirements', () => {
    render(
      <ChakraProvider>
        <RegisterPage />
      </ChakraProvider>
    );

    expect(screen.getByText('At least 8 characters long')).toBeInTheDocument();
    expect(screen.getByText('Contains uppercase letter')).toBeInTheDocument();
    expect(screen.getByText('Contains lowercase letter')).toBeInTheDocument();
    expect(screen.getByText('Contains number')).toBeInTheDocument();
    expect(screen.getByText('Contains special character')).toBeInTheDocument();
  });

  it('validates password requirements', async () => {
    render(
      <ChakraProvider>
        <RegisterPage />
      </ChakraProvider>
    );

    // Test weak password
    fillForm('testuser', 'test@example.com', 'weak');
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(await screen.findByText('Password does not meet requirements')).toBeInTheDocument();

    // Test password without uppercase
    fillForm('testuser', 'test@example.com', 'test123!@#');
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(await screen.findByText('Password does not meet requirements')).toBeInTheDocument();

    // Test password without special character
    fillForm('testuser', 'test@example.com', 'Test123abc');
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(await screen.findByText('Password does not meet requirements')).toBeInTheDocument();

    // Test valid password
    fillForm('testuser', 'test@example.com', 'Test123!@#');
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(screen.queryByText('Password does not meet requirements')).not.toBeInTheDocument();
  });

  it('updates password strength indicator', () => {
    render(
      <ChakraProvider>
        <RegisterPage />
      </ChakraProvider>
    );

    const passwordInput = screen.getByPlaceholderText('Enter your password');

    // Empty password
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');

    // Weak password (only length)
    fireEvent.change(passwordInput, { target: { value: '12345678' } });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '20');

    // Medium password (length + numbers + lowercase)
    fireEvent.change(passwordInput, { target: { value: 'test12345' } });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '60');

    // Strong password (all requirements)
    fireEvent.change(passwordInput, { target: { value: 'Test123!@#' } });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('validates required fields', async () => {
    render(
      <ChakraProvider>
        <RegisterPage />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(await screen.findByText('Please confirm your password')).toBeInTheDocument();
  });

  it('validates username length', async () => {
    render(
      <ChakraProvider>
        <RegisterPage />
      </ChakraProvider>
    );

    fillForm('ab');
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByText('Username must be at least 3 characters')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(
      <ChakraProvider>
        <RegisterPage />
      </ChakraProvider>
    );

    fillForm('testuser', 'invalid-email');
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByText('Email is invalid')).toBeInTheDocument();
  });

  it('validates password match', async () => {
    render(
      <ChakraProvider>
        <RegisterPage />
      </ChakraProvider>
    );

    fillForm('testuser', 'test@example.com', 'Test123!@#', 'Test123!@#different');
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('handles successful registration', async () => {
    (register as jest.Mock).mockResolvedValueOnce({});
    (mockLogin as jest.Mock).mockResolvedValueOnce({});

    render(
      <ChakraProvider>
        <RegisterPage />
      </ChakraProvider>
    );

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!@#',
      });
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'Test123!@#');
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
  });

  it('handles registration failure', async () => {
    const error = new Error('Email already exists');
    (register as jest.Mock).mockRejectedValueOnce(error);

    render(
      <ChakraProvider>
        <RegisterPage />
      </ChakraProvider>
    );

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByText('Registration failed')).toBeInTheDocument();
    expect(await screen.findByText('Email already exists')).toBeInTheDocument();
  });

  it('provides link to login page', () => {
    render(
      <ChakraProvider>
        <RegisterPage />
      </ChakraProvider>
    );

    const loginLink = screen.getByText('Login here');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });

  it('handles loading state during registration', async () => {
    (register as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <ChakraProvider>
        <RegisterPage />
      </ChakraProvider>
    );

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(screen.getByRole('button', { name: 'Register' })).toHaveAttribute(
      'data-loading'
    );
  });

  describe('Social Authentication', () => {
    it('renders social login buttons', () => {
      render(
        <ChakraProvider>
          <RegisterPage />
        </ChakraProvider>
      );

      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
      expect(screen.getByText('Continue with GitHub')).toBeInTheDocument();
    });

    it('handles successful Google login', async () => {
      mockLoginWithGoogle.mockResolvedValueOnce({});

      render(
        <ChakraProvider>
          <RegisterPage />
        </ChakraProvider>
      );

      const googleButton = screen.getByText('Continue with Google');
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(mockLoginWithGoogle).toHaveBeenCalled();
      });

      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });

    it('handles failed Google login', async () => {
      const error = new Error('Google authentication failed');
      mockLoginWithGoogle.mockRejectedValueOnce(error);

      render(
        <ChakraProvider>
          <RegisterPage />
        </ChakraProvider>
      );

      const googleButton = screen.getByText('Continue with Google');
      fireEvent.click(googleButton);

      expect(await screen.findByText('Google login failed')).toBeInTheDocument();
    });

    it('handles successful GitHub login', async () => {
      mockLoginWithGithub.mockResolvedValueOnce({});

      render(
        <ChakraProvider>
          <RegisterPage />
        </ChakraProvider>
      );

      const githubButton = screen.getByText('Continue with GitHub');
      fireEvent.click(githubButton);

      await waitFor(() => {
        expect(mockLoginWithGithub).toHaveBeenCalled();
      });

      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });

    it('handles failed GitHub login', async () => {
      const error = new Error('GitHub authentication failed');
      mockLoginWithGithub.mockRejectedValueOnce(error);

      render(
        <ChakraProvider>
          <RegisterPage />
        </ChakraProvider>
      );

      const githubButton = screen.getByText('Continue with GitHub');
      fireEvent.click(githubButton);

      expect(await screen.findByText('Github login failed')).toBeInTheDocument();
    });

    it('shows loading state during social authentication', async () => {
      mockLoginWithGoogle.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(
        <ChakraProvider>
          <RegisterPage />
        </ChakraProvider>
      );

      const googleButton = screen.getByText('Continue with Google');
      fireEvent.click(googleButton);

      expect(googleButton).toHaveAttribute('data-loading');
    });
  });
}); 