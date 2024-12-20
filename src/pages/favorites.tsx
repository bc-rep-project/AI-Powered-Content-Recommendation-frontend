import { useState } from 'react';
import {
  Box,
  Heading,
  VStack,
  Input,
  Button,
  useColorModeValue,
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import RecommendationList from '../components/RecommendationList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useAsync } from '../hooks/useAsync';
import { fetchFavorites, createCollection } from '../services/api';
import type { FavoritesData } from '../types';

export default function FavoritesPage() {
  const [newCollectionName, setNewCollectionName] = useState('');
  const {
    data: favorites,
    error,
    isLoading,
    execute: loadFavorites,
  } = useAsync<FavoritesData>();

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a collection name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await createCollection({ 
        name: newCollectionName.trim(),
        items: [] // Initialize with empty items array
      });
      setNewCollectionName('');
      loadFavorites(fetchFavorites);
      toast({
        title: 'Success',
        description: 'Collection created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create collection',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading your favorites..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box p={4}>
        <Heading mb={6}>Your Favorites</Heading>

        {error && (
          <ErrorAlert
            title="Error Loading Favorites"
            message="Failed to load your favorites. Please try again later."
          />
        )}

        {/* Create New Collection */}
        <Box bg={bgColor} p={4} borderRadius="lg" mb={6}>
          <VStack spacing={4}>
            <Input
              placeholder="Enter collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
            <Button
              colorScheme="blue"
              onClick={handleCreateCollection}
              isDisabled={!newCollectionName.trim()}
              width="full"
            >
              Create Collection
            </Button>
          </VStack>
        </Box>

        {/* Recent Favorites */}
        {favorites?.recent && favorites.recent.length > 0 && (
          <Box mb={8}>
            <Heading size="md" mb={4}>
              Recent Favorites
            </Heading>
            <RecommendationList recommendations={favorites.recent} />
          </Box>
        )}

        {/* Collections */}
        {favorites?.collections && favorites.collections.length > 0 && (
          <Box>
            <Heading size="md" mb={4}>
              Your Collections
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {favorites.collections.map((collection) => (
                <Box
                  key={collection.id}
                  bg={bgColor}
                  p={4}
                  borderRadius="lg"
                  shadow="base"
                >
                  <Heading size="sm" mb={4}>
                    {collection.name}
                  </Heading>
                  <RecommendationList recommendations={collection.items} />
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Box>
    </Layout>
  );
} 