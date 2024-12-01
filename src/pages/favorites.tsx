import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Button,
  SimpleGrid,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import Layout from '../components/Layout';
import RecommendationList from '../components/RecommendationList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useAsync } from '../hooks/useAsync';
import { fetchFavorites, createCollection } from '../services/api';
import type { FavoritesData } from '../types';

export default function FavoritesPage() {
  const [newCollectionName, setNewCollectionName] = useState('');
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');

  const {
    data: favoritesData,
    error,
    isLoading,
    execute: loadFavorites,
  } = useAsync<FavoritesData>();

  useEffect(() => {
    loadFavorites(fetchFavorites);
  }, [loadFavorites]);

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      toast({
        title: 'Collection name required',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      await createCollection(newCollectionName);
      setNewCollectionName('');
      loadFavorites(fetchFavorites);
      toast({
        title: 'Collection created',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Failed to create collection',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Layout>
      <Box p={4}>
        <Heading mb={6}>Your Favorites</Heading>

        {error && (
          <ErrorAlert
            title="Error Loading Favorites"
            message="Failed to load your favorites. Please try again."
          />
        )}

        {isLoading ? (
          <LoadingSpinner message="Loading your favorites..." />
        ) : (
          favoritesData && (
            <VStack spacing={8} align="stretch">
              {/* Quick Favorites */}
              <Box bg={bgColor} p={6} borderRadius="lg" shadow="base">
                <Heading size="md" mb={4}>
                  Recently Favorited
                </Heading>
                <RecommendationList recommendations={favoritesData.recent} />
              </Box>

              {/* Collections */}
              <Box bg={bgColor} p={6} borderRadius="lg" shadow="base">
                <Heading size="md" mb={4}>
                  Your Collections
                </Heading>

                <InputGroup mb={6}>
                  <Input
                    placeholder="New collection name..."
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateCollection()}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleCreateCollection}
                      leftIcon={<FiPlus />}
                    >
                      Add
                    </Button>
                  </InputRightElement>
                </InputGroup>

                {favoritesData.collections.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {favoritesData.collections.map((collection) => (
                      <Box
                        key={collection.id}
                        p={4}
                        borderRadius="md"
                        border="1px"
                        borderColor="gray.200"
                      >
                        <Heading size="sm" mb={2}>
                          {collection.name}
                        </Heading>
                        <Text color="gray.500" mb={4}>
                          {collection.items.length} items
                        </Text>
                        <RecommendationList recommendations={collection.items} />
                      </Box>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text color="gray.500" textAlign="center">
                    No collections yet. Create one to organize your favorites!
                  </Text>
                )}
              </Box>
            </VStack>
          )
        )}
      </Box>
    </Layout>
  );
} 