import { useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import RecommendationList from '../components/RecommendationList';
import InteractionChart from '../components/InteractionChart';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { fetchRecommendations, fetchUserStats } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import type { Recommendation, UserStats } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    data: recommendations,
    error: recommendationsError,
    isLoading: recommendationsLoading,
    execute: executeRecommendations,
  } = useAsync<Recommendation[]>();

  const {
    data: stats,
    error: statsError,
    isLoading: statsLoading,
    execute: executeStats,
  } = useAsync<UserStats>();

  const bgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          executeRecommendations(fetchRecommendations),
          executeStats(fetchUserStats),
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadData();
  }, [executeRecommendations, executeStats]);

  if (recommendationsLoading || statsLoading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading your personalized dashboard..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box p={4}>
        <Heading mb={6}>Welcome back, {user?.username}!</Heading>

        {(recommendationsError || statsError) && (
          <ErrorAlert
            title="Error Loading Data"
            message="There was an error loading your dashboard data. Please try again later."
          />
        )}

        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          <Stat p={4} bg={bgColor} borderRadius="lg" shadow="base">
            <StatLabel>Total Interactions</StatLabel>
            <StatNumber>{stats?.totalInteractions ?? 0}</StatNumber>
          </Stat>
          <Stat p={4} bg={bgColor} borderRadius="lg" shadow="base">
            <StatLabel>Recommendation Accuracy</StatLabel>
            <StatNumber>{stats?.recommendationAccuracy ?? 0}%</StatNumber>
          </Stat>
          <Stat p={4} bg={bgColor} borderRadius="lg" shadow="base">
            <StatLabel>Content Viewed</StatLabel>
            <StatNumber>{stats?.contentViewed ?? 0}</StatNumber>
          </Stat>
        </SimpleGrid>

        {/* Main Content */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Recommendations List */}
          <Box bg={bgColor} p={6} borderRadius="lg" shadow="base">
            <Heading size="md" mb={4}>
              Your Recommendations
            </Heading>
            <RecommendationList recommendations={recommendations ?? []} />
          </Box>

          {/* Interaction Chart */}
          <Box bg={bgColor} p={6} borderRadius="lg" shadow="base">
            <Heading size="md" mb={4}>
              Interaction History
            </Heading>
            <InteractionChart />
          </Box>
        </Grid>
      </Box>
    </Layout>
  );
} 