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
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { api } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setIsSubmitted(true);
      
      toast({
        title: 'Reset link sent',
        description: 'If an account exists with this email, you will receive a password reset link.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Container maxW="container.sm" py={10}>
        <VStack spacing={8} textAlign="center">
          <Heading size="lg">Check Your Email</Heading>
          <Text>
            If an account exists with the email <strong>{email}</strong>,
            you will receive a password reset link shortly.
          </Text>
          <Text>
            Don't see the email? Check your spam folder.
          </Text>
          <Link as={NextLink} href="/login" color="brand.500">
            Return to Login
          </Link>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Heading>Reset Password</Heading>
        
        <Text textAlign="center">
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <Box w="100%" as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={!!error}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="brand"
              width="100%"
              isLoading={isLoading}
              mt={4}
            >
              Send Reset Link
            </Button>

            <Link as={NextLink} href="/login" color="brand.500">
              Back to Login
            </Link>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
} 