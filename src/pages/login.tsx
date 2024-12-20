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
  Divider,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FiGithub } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const { login, loginWithGoogle, loginWithGithub, loginWithFacebook } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      switch (provider) {
        case 'google':
          await loginWithGoogle();
          break;
        case 'github':
          await loginWithGithub();
          break;
        case 'facebook':
          await loginWithFacebook();
          break;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to login with ${provider}. Please try again.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Please check your credentials and try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Heading>Login</Heading>

        {/* Social Login Buttons */}
        <VStack w="100%" spacing={4}>
          <Button
            w="100%"
            variant="outline"
            leftIcon={<Icon as={FcGoogle} boxSize={5} />}
            onClick={() => handleSocialLogin('google')}
            isLoading={socialLoading === 'google'}
          >
            Continue with Google
          </Button>
          <Button
            w="100%"
            variant="outline"
            leftIcon={<Icon as={FiGithub} boxSize={5} />}
            onClick={() => handleSocialLogin('github')}
            isLoading={socialLoading === 'github'}
          >
            Continue with GitHub
          </Button>
          <Button
            w="100%"
            variant="outline"
            leftIcon={<Icon as={FaFacebook} boxSize={5} color="facebook.500" />}
            onClick={() => handleSocialLogin('facebook')}
            isLoading={socialLoading === 'facebook'}
          >
            Continue with Facebook
          </Button>

          <HStack w="100%" justify="center">
            <Divider flex={1} />
            <Text px={3} color="gray.500">
              or
            </Text>
            <Divider flex={1} />
          </HStack>
        </VStack>

        {/* Email Login Form */}
        <Box w="100%" as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
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
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="brand"
              width="100%"
              isLoading={isLoading}
              mt={4}
            >
              Login
            </Button>

            <Text textAlign="center">
              Don't have an account?{' '}
              <Link as={NextLink} href="/register" color="brand.500">
                Register here
              </Link>
            </Text>

            <Link as={NextLink} href="/forgot-password" color="brand.500">
              Forgot your password?
            </Link>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
} 