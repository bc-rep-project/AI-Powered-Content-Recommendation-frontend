import {
  Box,
  VStack,
  Icon,
  Text,
  Link,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
} from 'react-icons/fi';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

interface NavItemProps {
  icon: any;
  children: string;
  href: string;
}

const NavItem = ({ icon, children, href }: NavItemProps) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  const activeBg = useColorModeValue('brand.50', 'gray.700');
  const activeColor = useColorModeValue('brand.600', 'brand.200');
  const inactiveColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Link
      as={NextLink}
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : inactiveColor}
        _hover={{
          bg: activeBg,
          color: activeColor,
        }}
      >
        <Icon
          mr="4"
          fontSize="16"
          as={icon}
        />
        {children}
      </Flex>
    </Link>
  );
};

export default function Sidebar() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
    >
      <VStack h="full" spacing={0} align="stretch">
        <Box p={5}>
          <Text fontSize="2xl" fontWeight="bold" color="brand.500">
            AI Rec
          </Text>
        </Box>

        <VStack spacing={1} align="stretch" flex={1}>
          <NavItem icon={FiHome} href="/dashboard">
            Dashboard
          </NavItem>
          <NavItem icon={FiCompass} href="/discover">
            Discover
          </NavItem>
          <NavItem icon={FiTrendingUp} href="/trending">
            Trending
          </NavItem>
          <NavItem icon={FiStar} href="/favorites">
            Favorites
          </NavItem>
        </VStack>

        <Box p={4}>
          <NavItem icon={FiSettings} href="/settings">
            Settings
          </NavItem>
        </Box>
      </VStack>
    </Box>
  );
} 