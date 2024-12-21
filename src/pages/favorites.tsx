import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import RecommendationList from '../components/RecommendationList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useAsync } from '../hooks/useAsync';
import { favoritesService } from '../services/api';
import type { FavoritesData, Recommendation } from '../types';

export default function FavoritesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const toast = useToast();

  const {
    data: favorites,
    error,
    isLoading,
    execute: loadFavorites,
  } = useAsync<FavoritesData>();

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  // Calculate total pages based on items length
  useEffect(() => {
    if (favorites?.recent) {
      const itemsPerPage = 10;
      setTotalPages(Math.ceil(favorites.recent.length / itemsPerPage));
    }
  }, [favorites]);

  // Load favorites data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadFavorites(favoritesService.fetchFavorites);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load favorites',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [loadFavorites, toast]);

  if (isLoading) {
    return (
      <Layout>
        <Container maxW="container.xl">
          <LoadingSpinner message="Loading your favorites..." />
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxW="container.xl">
          <ErrorAlert
            title="Error Loading Favorites"
            message="Failed to load your favorites. Please try again later."
          />
        </Container>
      </Layout>
    );
  }

  // Paginate the recommendations
  const paginateRecommendations = (items: Recommendation[]) => {
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading>Your Favorites</Heading>

          {/* Recent Favorites */}
          {favorites?.recent && favorites.recent.length > 0 && (
            <Box mb={8}>
              <Heading size="md" mb={4}>
                Recent Favorites
              </Heading>
              <RecommendationList
                recommendations={paginateRecommendations(favorites.recent)}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onCategoryChange={handleCategoryChange}
                selectedCategory={selectedCategory}
                isLoading={isLoading}
              />
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
                    p={4}
                    borderRadius="lg"
                    shadow="base"
                  >
                    <Heading size="sm" mb={4}>
                      {collection.name}
                    </Heading>
                    <RecommendationList
                      recommendations={collection.items}
                      currentPage={1}
                      totalPages={1}
                      onPageChange={() => {}}
                      onCategoryChange={() => {}}
                      selectedCategory=""
                      isLoading={false}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </VStack>
      </Container>
    </Layout>
  );
} 