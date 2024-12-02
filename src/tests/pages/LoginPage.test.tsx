import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import LoginPage from '@/pages/login';
import { useAuth } from '@/context/AuthContext';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock auth context
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('LoginPage', () => {
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
    email = 'test@example.com',
    password = 'Test123!@#'
  ) => {
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: email },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: password },
    });
  };

  it('renders login form', () => {
    render(
      <ChakraProvider>
        <LoginPage />
      </ChakraProvider>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders social login buttons', () => {
    render(
      <ChakraProvider>
        <LoginPage />
      </ChakraProvider>
    );

    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Continue with GitHub')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <ChakraProvider>
        <LoginPage />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(
      <ChakraProvider>
        <LoginPage />
      </ChakraProvider>
    );

    fillForm('invalid-email');
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Email is invalid')).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    mockLogin.mockResolvedValueOnce({});

    render(
      <ChakraProvider>
        <LoginPage />
      </ChakraProvider>
    );

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'Test123!@#');
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
  });

  it('handles login failure', async () => {
    const error = new Error('Invalid credentials');
    mockLogin.mockRejectedValueOnce(error);

    render(
      <ChakraProvider>
        <LoginPage />
      </ChakraProvider>
    );

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Login failed')).toBeInTheDocument();
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });

  describe('Social Authentication', () => {
    it('handles successful Google login', async () => {
      mockLoginWithGoogle.mockResolvedValueOnce({});

      render(
        <ChakraProvider>
          <LoginPage />
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
          <LoginPage />
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
          <LoginPage />
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
          <LoginPage />
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
          <LoginPage />
        </ChakraProvider>
      );

      const googleButton = screen.getByText('Continue with Google');
      fireEvent.click(googleButton);

      expect(googleButton).toHaveAttribute('data-loading');
    });
  });

  it('provides link to registration page', () => {
    render(
      <ChakraProvider>
        <LoginPage />
      </ChakraProvider>
    );

    const registerLink = screen.getByText('Register here');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });

  it('provides link to forgot password page', () => {
    render(
      <ChakraProvider>
        <LoginPage />
      </ChakraProvider>
    );

    const forgotPasswordLink = screen.getByText('Forgot your password?');
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/forgot-password');
  });
}); 