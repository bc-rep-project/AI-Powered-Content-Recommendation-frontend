import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
  Link,
  Center,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { authService } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter your email address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      toast({
        title: 'Success',
        description: 'Password reset instructions have been sent to your email',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setEmail('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process password reset request. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" py={12} px={4}>
      <VStack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl">Forgot your password?</Heading>
          <Text fontSize="lg" color="gray.600">
            Enter your email below to receive password reset instructions
          </Text>
        </Stack>
        <Box
          rounded="lg"
          bg="white"
          boxShadow="lg"
          p={8}
          w="full"
          as="form"
          onSubmit={handleSubmit}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>
            <Stack spacing={10}>
              <Button
                type="submit"
                bg="blue.400"
                color="white"
                _hover={{
                  bg: 'blue.500',
                }}
                isLoading={isLoading}
              >
                Request Password Reset
              </Button>
              <Center>
                <Link as={NextLink} href="/login" color="blue.400">
                  Return to login
                </Link>
              </Center>
            </Stack>
          </Stack>
        </Box>
      </VStack>
    </Box>
  );
} 