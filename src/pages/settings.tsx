import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Container,
  Switch,
  Select,
  Text,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import type { UserSettings } from '../types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    email: '',
    notificationsEnabled: false,
    recommendationFrequency: 'daily',
    contentPreferences: [],
    language: 'en'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userSettings = await userService.getSettings();
        setSettings(userSettings);
      } catch (error) {
        setError('Failed to load settings');
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await userService.updateSettings(settings);
      toast({
        title: 'Success',
        description: 'Settings updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading settings..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorAlert
          title="Error Loading Settings"
          message={error}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading>Settings</Heading>
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  isReadOnly
                />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Contact support to change your email address
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>Notification Preferences</FormLabel>
                <Switch
                  isChecked={settings.notificationsEnabled}
                  onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Recommendation Frequency</FormLabel>
                <Select
                  value={settings.recommendationFrequency}
                  onChange={(e) => setSettings({ ...settings, recommendationFrequency: e.target.value })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Language</FormLabel>
                <Select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </Select>
              </FormControl>

              <Button
                type="submit"
                colorScheme="brand"
                width="full"
                isLoading={isSaving}
              >
                Save Changes
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Layout>
  );
} 