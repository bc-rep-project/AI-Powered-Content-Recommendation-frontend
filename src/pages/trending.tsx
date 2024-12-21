import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import RecommendationList from '../components/RecommendationList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useAsync } from '../hooks/useAsync';
import { trendingService } from '../services/api';
import type { TrendingData } from '../types';

export default function TrendingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const toast = useToast();

  const {
    data: trendingData,
    error,
    isLoading,
    execute: loadTrending,
  } = useAsync<TrendingData>();

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  // Calculate total pages based on items length
  const calculateTotalPages = (items: any[]) => {
    const itemsPerPage = 10;
    return Math.ceil(items.length / itemsPerPage);
  };

  // Paginate the recommendations
  const paginateRecommendations = (items: any[]) => {
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadTrending(trendingService.fetchTrending);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load trending content',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [loadTrending, toast]);

  if (isLoading) {
    return (
      <Layout>
        <Container maxW="container.xl">
          <LoadingSpinner message="Loading trending content..." />
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxW="container.xl">
          <ErrorAlert
            title="Error Loading Content"
            message="Failed to load trending content. Please try again later."
          />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <Box>
          <Heading mb={6}>Trending Content</Heading>

          {trendingData && (
            <Tabs>
              <TabList>
                <Tab>Today</Tab>
                <Tab>This Week</Tab>
                <Tab>This Month</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <RecommendationList
                    recommendations={paginateRecommendations(trendingData.today)}
                    currentPage={currentPage}
                    totalPages={calculateTotalPages(trendingData.today)}
                    onPageChange={handlePageChange}
                    onCategoryChange={handleCategoryChange}
                    selectedCategory={selectedCategory}
                    isLoading={isLoading}
                  />
                </TabPanel>
                <TabPanel>
                  <RecommendationList
                    recommendations={paginateRecommendations(trendingData.thisWeek)}
                    currentPage={currentPage}
                    totalPages={calculateTotalPages(trendingData.thisWeek)}
                    onPageChange={handlePageChange}
                    onCategoryChange={handleCategoryChange}
                    selectedCategory={selectedCategory}
                    isLoading={isLoading}
                  />
                </TabPanel>
                <TabPanel>
                  <RecommendationList
                    recommendations={paginateRecommendations(trendingData.thisMonth)}
                    currentPage={currentPage}
                    totalPages={calculateTotalPages(trendingData.thisMonth)}
                    onPageChange={handlePageChange}
                    onCategoryChange={handleCategoryChange}
                    selectedCategory={selectedCategory}
                    isLoading={isLoading}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </Box>
      </Container>
    </Layout>
  );
} 