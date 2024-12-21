import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Container,
  useToast,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import RecommendationList from '../components/RecommendationList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useAsync } from '../hooks/useAsync';
import { recommendationService } from '../services/api';
import type { Recommendation } from '../types';

export default function DiscoverPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const toast = useToast();

  const {
    data: content,
    error,
    isLoading,
    execute: loadContent,
  } = useAsync<Recommendation[]>();

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  const loadDiscoverContent = useCallback(async () => {
    try {
      const response = await recommendationService.fetchRecommendations({
        page: currentPage,
        limit: 10,
        category: selectedCategory || undefined,
      });
      setTotalPages(response.totalPages);
      return response.items;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load discover content',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  }, [currentPage, selectedCategory, toast]);

  // Load content when page or category changes
  useEffect(() => {
    loadContent(loadDiscoverContent);
  }, [loadContent, loadDiscoverContent]);

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <Box>
          <Heading mb={6}>Discover Content</Heading>

          {error && (
            <ErrorAlert
              title="Error Loading Content"
              message="Failed to load discover content. Please try again later."
            />
          )}

          {isLoading ? (
            <LoadingSpinner message="Loading content..." />
          ) : (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
              {content && (
                <RecommendationList
                  recommendations={content}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  onCategoryChange={handleCategoryChange}
                  selectedCategory={selectedCategory}
                  isLoading={isLoading}
                />
              )}
            </Grid>
          )}
        </Box>
      </Container>
    </Layout>
  );
} 