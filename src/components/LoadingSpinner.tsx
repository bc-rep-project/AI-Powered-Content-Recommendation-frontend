import { Flex, Spinner, Text } from '@chakra-ui/react';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <Flex direction="column" align="center" justify="center" h="200px">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="brand.500"
        size="xl"
      />
      <Text mt={4} color="gray.500">
        {message}
      </Text>
    </Flex>
  );
} 