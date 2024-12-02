import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import ResetPasswordPage from '@/pages/reset-password';
import { api } from '@/services/api';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/api', () => ({
  api: {
    post: jest.fn(),
  },
}));

describe('ResetPasswordPage', () => {
  const mockRouter = {
    push: jest.fn(),
    query: { token: 'valid-token' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (api.post as jest.Mock).mockResolvedValueOnce({}); // For token validation
  });

  const fillForm = (
    password = 'Test123!@#',
    confirmPassword = 'Test123!@#'
  ) => {
    fireEvent.change(screen.getByPlaceholderText('Enter your new password'), {
      target: { value: password },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your new password'), {
      target: { value: confirmPassword },
    });
  };

  it('renders reset password form', async () => {
    render(
      <ChakraProvider>
        <ResetPasswordPage />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
    });
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
  });

  it('validates token on mount', async () => {
    render(
      <ChakraProvider>
        <ResetPasswordPage />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/validate-reset-token', {
        token: 'valid-token',
      });
    });
  });

  it('redirects on invalid token', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Invalid token'));

    render(
      <ChakraProvider>
        <ResetPasswordPage />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/forgot-password');
    });
  });

  it('validates password requirements', async () => {
    render(
      <ChakraProvider>
        <ResetPasswordPage />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('At least 8 characters long')).toBeInTheDocument();
    });

    // Test weak password
    fillForm('weak');
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));
    expect(await screen.findByText('Password does not meet requirements')).toBeInTheDocument();

    // Test password without uppercase
    fillForm('test123!@#');
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));
    expect(await screen.findByText('Password does not meet requirements')).toBeInTheDocument();

    // Test password without special character
    fillForm('Test123abc');
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));
    expect(await screen.findByText('Password does not meet requirements')).toBeInTheDocument();
  });

  it('validates password match', async () => {
    render(
      <ChakraProvider>
        <ResetPasswordPage />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
    });

    fillForm('Test123!@#', 'Test123!@#different');
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('handles successful password reset', async () => {
    (api.post as jest.Mock)
      .mockResolvedValueOnce({}) // For token validation
      .mockResolvedValueOnce({}); // For password reset

    render(
      <ChakraProvider>
        <ResetPasswordPage />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
    });

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/reset-password', {
        token: 'valid-token',
        new_password: 'Test123!@#',
      });
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('handles failed password reset', async () => {
    const error = new Error('Failed to reset password');
    (api.post as jest.Mock)
      .mockResolvedValueOnce({}) // For token validation
      .mockRejectedValueOnce(error); // For password reset

    render(
      <ChakraProvider>
        <ResetPasswordPage />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
    });

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    expect(await screen.findByText('Password reset failed')).toBeInTheDocument();
    expect(await screen.findByText('Failed to reset password')).toBeInTheDocument();
  });

  it('shows loading state during submission', async () => {
    (api.post as jest.Mock)
      .mockResolvedValueOnce({}) // For token validation
      .mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 100))); // For password reset

    render(
      <ChakraProvider>
        <ResetPasswordPage />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
    });

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    expect(screen.getByRole('button', { name: 'Reset Password' })).toHaveAttribute(
      'data-loading'
    );
  });

  it('provides link back to login page', async () => {
    render(
      <ChakraProvider>
        <ResetPasswordPage />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
    });

    const loginLink = screen.getByText('Back to Login');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });
}); 