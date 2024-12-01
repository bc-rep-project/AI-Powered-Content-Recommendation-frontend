import { useEffect, useState } from 'react';
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

export default function InteractionChart() {
  const [data, setData] = useState([]);
  const lineColor = useColorModeValue('brand.600', 'brand.200');

  useEffect(() => {
    const loadData = async () => {
      try {
        const history = await fetchInteractionHistory();
        setData(history);
      } catch (error) {
        console.error('Error loading interaction history:', error);
      }
    };

    loadData();
  }, []);

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