import {
  Box,
  Flex,
  IconButton,
  useColorModeValue,
  useColorMode,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react';
import { FiMenu, FiMoon, FiSun, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      px={4}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex="sticky"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={() => {}}
          variant="ghost"
          aria-label="open menu"
          icon={<FiMenu />}
        />

        <Text fontSize="xl" fontWeight="bold" color="brand.500">
          AI Recommendations
        </Text>

        <HStack spacing={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
          />

          <Menu>
            <MenuButton as={Button} rightIcon={<FiUser />} variant="ghost">
              {user?.username}
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiUser />}>Profile</MenuItem>
              <MenuItem icon={<FiLogOut />} onClick={logout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
} 