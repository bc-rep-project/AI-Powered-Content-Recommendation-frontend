import { useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { fetchInteractionHistory } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';
import type { InteractionData } from '../types';

export default function InteractionChart() {
  const {
    data,
    error,
    isLoading,
    execute,
  } = useAsync<InteractionData[]>();

  const lineColor = useColorModeValue('brand.600', 'brand.200');

  useEffect(() => {
    execute(fetchInteractionHistory);
  }, [execute]);

  if (isLoading) {
    return <LoadingSpinner message="Loading interaction history..." />;
  }

  if (error) {
    return (
      <ErrorAlert
        title="Error Loading Chart"
        message="Failed to load interaction history. Please try again later."
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        No interaction data available yet.
      </Box>
    );
  }

  return (
    <Box h="300px">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="interactions"
            stroke={lineColor}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
} 