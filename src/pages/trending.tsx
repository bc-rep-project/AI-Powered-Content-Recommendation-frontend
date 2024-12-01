import { useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import RecommendationList from '../components/RecommendationList';
import InteractionChart from '../components/InteractionChart';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useAsync } from '../hooks/useAsync';
import { fetchTrendingContent } from '../services/api';
import type { TrendingData } from '../types';

export default function TrendingPage() {
  const {
    data: trendingData,
    error,
    isLoading,
    execute: loadTrending,
  } = useAsync<TrendingData>();

  const bgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    loadTrending(fetchTrendingContent);
  }, [loadTrending]);

  return (
    <Layout>
      <Box p={4}>
        <Heading mb={6}>Trending Content</Heading>

        {error && (
          <ErrorAlert
            title="Error Loading Trends"
            message="Failed to load trending content. Please try again."
          />
        )}

        {isLoading ? (
          <LoadingSpinner message="Loading trending content..." />
        ) : (
          trendingData && (
            <>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
                <Stat p={4} bg={bgColor} borderRadius="lg" shadow="base">
                  <StatLabel>Most Viewed</StatLabel>
                  <StatNumber>{trendingData.stats.totalViews}</StatNumber>
                  <StatHelpText>Last 24 hours</StatHelpText>
                </Stat>
                <Stat p={4} bg={bgColor} borderRadius="lg" shadow="base">
                  <StatLabel>Most Liked</StatLabel>
                  <StatNumber>{trendingData.stats.totalLikes}</StatNumber>
                  <StatHelpText>Last 24 hours</StatHelpText>
                </Stat>
                <Stat p={4} bg={bgColor} borderRadius="lg" shadow="base">
                  <StatLabel>Trending Categories</StatLabel>
                  <StatNumber>{trendingData.stats.trendingCategories[0]}</StatNumber>
                  <StatHelpText>Top category today</StatHelpText>
                </Stat>
              </SimpleGrid>

              <Box bg={bgColor} p={6} borderRadius="lg" shadow="base">
                <Tabs>
                  <TabList>
                    <Tab>Today</Tab>
                    <Tab>This Week</Tab>
                    <Tab>This Month</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <RecommendationList recommendations={trendingData.today} />
                    </TabPanel>
                    <TabPanel>
                      <RecommendationList recommendations={trendingData.thisWeek} />
                    </TabPanel>
                    <TabPanel>
                      <RecommendationList recommendations={trendingData.thisMonth} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>

              <Box mt={8} bg={bgColor} p={6} borderRadius="lg" shadow="base">
                <Heading size="md" mb={4}>
                  Interaction Trends
                </Heading>
                <InteractionChart />
              </Box>
            </>
          )
        )}
      </Box>
    </Layout>
  );
} 