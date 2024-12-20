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
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { FiCheck, FiX } from 'react-icons/fi';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { authService } from '../services/api';

const PASSWORD_REQUIREMENTS = [
  {
    id: 'length',
    text: 'At least 6 characters long',
    validator: (password: string) => password.length >= 6,
  },
  {
    id: 'match',
    text: 'Passwords match',
    validator: (password: string, confirmPassword: string) => password === confirmPassword,
  },
];

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const router = useRouter();
  const { token } = router.query;
  const toast = useToast();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || typeof token !== 'string') {
      toast({
        title: 'Error',
        description: 'Invalid reset token',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, password);
      
      toast({
        title: 'Success',
        description: 'Your password has been reset successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      router.push('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reset password. Please try again.',
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
        <Heading>Reset Password</Heading>
        <Box w="100%" as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.password}>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <List spacing={1} mt={2} fontSize="sm">
                {PASSWORD_REQUIREMENTS.map((req) => (
                  <ListItem key={req.id}>
                    <ListIcon
                      as={req.validator(password, confirmPassword) ? FiCheck : FiX}
                      color={req.validator(password, confirmPassword) ? 'green.500' : 'red.500'}
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
                placeholder="Confirm new password"
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
              Return to login
            </Link>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
} 