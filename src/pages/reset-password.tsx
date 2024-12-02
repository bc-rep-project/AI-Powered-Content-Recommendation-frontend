import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
} from '@chakra-ui/react';
import { FiCheck, FiX } from 'react-icons/fi';
import NextLink from 'next/link';
import { api } from '../services/api';

const PASSWORD_REQUIREMENTS = [
  {
    id: 'length',
    text: 'At least 8 characters long',
    validator: (password: string) => password.length >= 8,
  },
  {
    id: 'uppercase',
    text: 'Contains uppercase letter',
    validator: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: 'lowercase',
    text: 'Contains lowercase letter',
    validator: (password: string) => /[a-z]/.test(password),
  },
  {
    id: 'number',
    text: 'Contains number',
    validator: (password: string) => /\d/.test(password),
  },
  {
    id: 'special',
    text: 'Contains special character',
    validator: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const router = useRouter();
  const toast = useToast();
  const { token } = router.query;

  useEffect(() => {
    const validateToken = async () => {
      if (!token) return;

      try {
        await api.post('/auth/validate-reset-token', { token });
        setIsValidating(false);
      } catch (error) {
        toast({
          title: 'Invalid or expired link',
          description: 'Please request a new password reset link.',
          status: 'error',
          duration: null,
          isClosable: true,
        });
        router.push('/forgot-password');
      }
    };

    validateToken();
  }, [token, router, toast]);

  const getPasswordStrength = (password: string): number => {
    if (!password) return 0;
    const meetsRequirements = PASSWORD_REQUIREMENTS.filter(req => 
      req.validator(password)
    ).length;
    return (meetsRequirements / PASSWORD_REQUIREMENTS.length) * 100;
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 40) return 'red';
    if (strength < 70) return 'yellow';
    return 'green';
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/reset-password', {
        token,
        new_password: password,
      });
      
      toast({
        title: 'Password reset successful',
        description: 'You can now log in with your new password.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      router.push('/login');
    } catch (error) {
      toast({
        title: 'Password reset failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <Container maxW="container.sm" py={10}>
        <VStack spacing={8} textAlign="center">
          <Heading size="lg">Validating Reset Link</Heading>
          <Text>Please wait while we validate your reset link...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Heading>Reset Your Password</Heading>

        <Box w="100%" as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.password}>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
              />
              <Progress
                value={getPasswordStrength(password)}
                colorScheme={getPasswordStrengthColor(getPasswordStrength(password))}
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
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
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
              Reset Password
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