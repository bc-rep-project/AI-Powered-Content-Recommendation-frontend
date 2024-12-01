import { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Select,
  Divider,
  useToast,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../context/AuthContext';
import { updateUserSettings } from '../services/api';

interface UserSettings {
  email: string;
  notificationsEnabled: boolean;
  recommendationFrequency: string;
  contentPreferences: string[];
  language: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');

  const [settings, setSettings] = useState<UserSettings>({
    email: user?.email || '',
    notificationsEnabled: true,
    recommendationFrequency: 'daily',
    contentPreferences: ['movies', 'books'],
    language: 'en',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await updateUserSettings(settings);
      toast({
        title: 'Settings updated',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      setError('Failed to update settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Box p={4}>
        <Heading mb={6}>Settings</Heading>

        {error && (
          <ErrorAlert
            title="Error Saving Settings"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {/* Account Settings */}
          <Box bg={bgColor} p={6} borderRadius="lg" shadow="base">
            <Heading size="md" mb={4}>
              Account Settings
            </Heading>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Enable Notifications</FormLabel>
                <Switch
                  isChecked={settings.notificationsEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notificationsEnabled: e.target.checked,
                    })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Language</FormLabel>
                <Select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({ ...settings, language: e.target.value })
                  }
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </Select>
              </FormControl>
            </VStack>
          </Box>

          {/* Recommendation Settings */}
          <Box bg={bgColor} p={6} borderRadius="lg" shadow="base">
            <Heading size="md" mb={4}>
              Recommendation Settings
            </Heading>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Recommendation Frequency</FormLabel>
                <Select
                  value={settings.recommendationFrequency}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      recommendationFrequency: e.target.value,
                    })
                  }
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Content Preferences</FormLabel>
                <Select
                  multiple
                  height="100px"
                  value={settings.contentPreferences}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contentPreferences: Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      ),
                    })
                  }
                >
                  <option value="movies">Movies</option>
                  <option value="books">Books</option>
                  <option value="music">Music</option>
                  <option value="articles">Articles</option>
                </Select>
              </FormControl>
            </VStack>
          </Box>
        </SimpleGrid>

        <Divider my={8} />

        <Button
          colorScheme="brand"
          size="lg"
          onClick={handleSave}
          isLoading={isLoading}
        >
          Save Changes
        </Button>
      </Box>
    </Layout>
  );
} 