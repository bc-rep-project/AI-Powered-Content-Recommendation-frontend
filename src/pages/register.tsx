import { useState } from 'react';
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
  Text,
  Link,
  FormErrorMessage,
  Progress,
  List,
  ListItem,
  ListIcon,
  Divider,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FiCheck, FiX, FiGithub } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/api';

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface PasswordRequirement {
  id: string;
  text: string;
  validator: (password: string) => boolean;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: 'length',
    text: 'At least 8 characters long',
    validator: (password) => password.length >= 8,
  },
  {
    id: 'uppercase',
    text: 'Contains uppercase letter',
    validator: (password) => /[A-Z]/.test(password),
  },
  {
    id: 'lowercase',
    text: 'Contains lowercase letter',
    validator: (password) => /[a-z]/.test(password),
  },
  {
    id: 'number',
    text: 'Contains number',
    validator: (password) => /\d/.test(password),
  },
  {
    id: 'special',
    text: 'Contains special character',
    validator: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const { login, loginWithGoogle, loginWithGithub } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const getPasswordStrength = (password: string): number => {
    if (!password) return 0;
    const meetsRequirements = PASSWORD_REQUIREMENTS.filter(req => 
      req.validator(password)
    ).length;
    return (meetsRequirements / PASSWORD_REQUIREMENTS.length) * 100;
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 40) return 'red.500';
    if (strength < 70) return 'yellow.500';
    return 'green.500';
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const failedRequirements = PASSWORD_REQUIREMENTS.filter(
        req => !req.validator(password)
      );
      if (failedRequirements.length > 0) {
        newErrors.password = 'Password does not meet requirements';
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    try {
      setSocialLoading(provider);
      if (provider === 'google') {
        await loginWithGoogle();
      } else {
        await loginWithGithub();
      }
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed`,
        description: error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSocialLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register({ username, email, password });
      await login(email, password);
      
      toast({
        title: 'Registration successful',
        description: 'Welcome to AI Recommendations!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Heading>Create Account</Heading>

        {/* Social Login Buttons */}
        <VStack w="100%" spacing={4}>
          <Button
            w="100%"
            variant="outline"
            leftIcon={<Icon as={FcGoogle} boxSize={5} />}
            onClick={() => handleSocialAuth('google')}
            isLoading={socialLoading === 'google'}
          >
            Continue with Google
          </Button>
          <Button
            w="100%"
            variant="outline"
            leftIcon={<Icon as={FiGithub} boxSize={5} />}
            onClick={() => handleSocialAuth('github')}
            isLoading={socialLoading === 'github'}
          >
            Continue with GitHub
          </Button>

          <HStack w="100%" justify="center">
            <Divider flex={1} />
            <Text px={3} color="gray.500">
              or
            </Text>
            <Divider flex={1} />
          </HStack>
        </VStack>

        {/* Email Registration Form */}
        <Box w="100%" as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.username}>
              <FormLabel>Username</FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <Progress
                value={passwordStrength}
                colorScheme={getPasswordStrengthColor(passwordStrength)}
                size="sm"
                mt={2}
              />
              <List spacing={1} mt={2} fontSize="sm">
                {PASSWORD_REQUIREMENTS.map((req) => (
                  <ListItem key={req.id}>
                    <ListIcon
                      as={req.validator(password) ? FiCheck : FiX}
                      color={req.validator(password) ? 'green.500' : 'red.500'}
                    />
                    {req.text}
                  </ListItem>
                ))}
              </List>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="brand"
              width="100%"
              isLoading={isLoading}
              mt={4}
            >
              Register
            </Button>

            <Text textAlign="center">
              Already have an account?{' '}
              <Link as={NextLink} href="/login" color="brand.500">
                Login here
              </Link>
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
} 