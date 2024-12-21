import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import RecommendationList from '../components/RecommendationList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { recommendationService } from '../services/api';
import type { Recommendation } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const toast = useToast();

  const loadRecommendations = useCallback(async (page: number, category?: string) => {
    try {
      setIsLoading(true);
      const response = await recommendationService.fetchRecommendations({
        page,
        limit: 10,
        category: category || undefined,
      });
      
      setRecommendations(response.items);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to load recommendations');
      toast({
        title: 'Error',
        description: 'Failed to load recommendations',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadRecommendations(currentPage, selectedCategory);
  }, [currentPage, selectedCategory, loadRecommendations]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  }, []);

  if (isLoading) {
    return (
      <Container maxW="container.xl">
        <LoadingSpinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl">
        <ErrorAlert message={error} />
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>Welcome back, {user?.name || 'User'}!</Heading>
        
        <RecommendationList
          recommendations={recommendations}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
          isLoading={isLoading}
        />
      </VStack>
    </Container>
  );
} 