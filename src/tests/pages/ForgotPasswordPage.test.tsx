import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import ForgotPasswordPage from '@/pages/forgot-password';
import { api } from '@/services/api';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/api', () => ({
  api: {
    post: jest.fn(),
  },
}));

describe('ForgotPasswordPage', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders forgot password form', () => {
    render(
      <ChakraProvider>
        <ForgotPasswordPage />
      </ChakraProvider>
    );

    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Reset Link' })).toBeInTheDocument();
  });

  it('validates required email', async () => {
    render(
      <ChakraProvider>
        <ForgotPasswordPage />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(
      <ChakraProvider>
        <ForgotPasswordPage />
      </ChakraProvider>
    );

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));

    expect(await screen.findByText('Email is invalid')).toBeInTheDocument();
  });

  it('handles successful password reset request', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({});

    render(
      <ChakraProvider>
        <ForgotPasswordPage />
      </ChakraProvider>
    );

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', {
        email: 'test@example.com',
      });
    });

    expect(await screen.findByText('Check Your Email')).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
  });

  it('handles failed password reset request', async () => {
    const error = new Error('Failed to send reset link');
    (api.post as jest.Mock).mockRejectedValueOnce(error);

    render(
      <ChakraProvider>
        <ForgotPasswordPage />
      </ChakraProvider>
    );

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));

    expect(await screen.findByText('Error')).toBeInTheDocument();
    expect(await screen.findByText('Failed to send reset link')).toBeInTheDocument();
  });

  it('shows loading state during submission', async () => {
    (api.post as jest.Mock).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <ChakraProvider>
        <ForgotPasswordPage />
      </ChakraProvider>
    );

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));

    expect(screen.getByRole('button', { name: 'Send Reset Link' })).toHaveAttribute(
      'data-loading'
    );
  });

  it('provides link back to login page', () => {
    render(
      <ChakraProvider>
        <ForgotPasswordPage />
      </ChakraProvider>
    );

    const loginLink = screen.getByText('Back to Login');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });
}); 