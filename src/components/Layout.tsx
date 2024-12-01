import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Sidebar />
      <Flex flexDirection="column" ml={{ base: 0, md: 60 }}>
        <Navbar />
        <Box as="main" p="4">
          {children}
        </Box>
      </Flex>
    </Box>
  );
} 