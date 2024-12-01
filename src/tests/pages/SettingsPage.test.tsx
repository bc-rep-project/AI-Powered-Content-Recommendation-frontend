import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import SettingsPage from '@/pages/settings';
import { updateUserSettings } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

jest.mock('@/services/api', () => ({
  updateUserSettings: jest.fn(),
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/components/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="mock-layout">{children}</div>;
  };
});

const mockUser = {
  id: '1',
  email: 'test@example.com',
  username: 'testuser',
};

describe('SettingsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it('renders all settings sections', () => {
    render(
      <ChakraProvider>
        <SettingsPage />
      </ChakraProvider>
    );

    // Account settings
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Enable Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('Language')).toBeInTheDocument();

    // Recommendation settings
    expect(screen.getByText('Recommendation Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('Recommendation Frequency')).toBeInTheDocument();
    expect(screen.getByLabelText('Content Preferences')).toBeInTheDocument();
  });

  it('loads user email into form', () => {
    render(
      <ChakraProvider>
        <SettingsPage />
      </ChakraProvider>
    );

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    expect(emailInput.value).toBe(mockUser.email);
  });

  it('handles settings update successfully', async () => {
    (updateUserSettings as jest.Mock).mockResolvedValueOnce({});

    render(
      <ChakraProvider>
        <SettingsPage />
      </ChakraProvider>
    );

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateUserSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new@example.com',
        })
      );
    });

    expect(await screen.findByText('Settings updated')).toBeInTheDocument();
  });

  it('handles settings update failure', async () => {
    const error = new Error('Update failed');
    (updateUserSettings as jest.Mock).mockRejectedValueOnce(error);

    render(
      <ChakraProvider>
        <SettingsPage />
      </ChakraProvider>
    );

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    expect(await screen.findByText('Failed to update settings. Please try again.')).toBeInTheDocument();
  });

  it('handles notification toggle', () => {
    render(
      <ChakraProvider>
        <SettingsPage />
      </ChakraProvider>
    );

    const notificationToggle = screen.getByLabelText('Enable Notifications');
    fireEvent.click(notificationToggle);

    expect(notificationToggle).not.toBeChecked();
  });

  it('handles language selection', () => {
    render(
      <ChakraProvider>
        <SettingsPage />
      </ChakraProvider>
    );

    const languageSelect = screen.getByLabelText('Language');
    fireEvent.change(languageSelect, { target: { value: 'es' } });

    expect(languageSelect).toHaveValue('es');
  });

  it('handles recommendation frequency selection', () => {
    render(
      <ChakraProvider>
        <SettingsPage />
      </ChakraProvider>
    );

    const frequencySelect = screen.getByLabelText('Recommendation Frequency');
    fireEvent.change(frequencySelect, { target: { value: 'weekly' } });

    expect(frequencySelect).toHaveValue('weekly');
  });
}); 