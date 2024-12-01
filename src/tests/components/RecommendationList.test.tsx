import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import RecommendationList from '@/components/RecommendationList';
import { recordInteraction } from '@/services/api';

jest.mock('@/services/api', () => ({
  recordInteraction: jest.fn(),
}));

const mockRecommendations = [
  {
    content_id: '1',
    title: 'Test Recommendation 1',
    description: 'Test Description 1',
    score: 0.95,
  },
  {
    content_id: '2',
    title: 'Test Recommendation 2',
    description: 'Test Description 2',
    score: 0.85,
  },
];

describe('RecommendationList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders recommendations correctly', () => {
    render(
      <ChakraProvider>
        <RecommendationList recommendations={mockRecommendations} />
      </ChakraProvider>
    );

    expect(screen.getByText('Test Recommendation 1')).toBeInTheDocument();
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('95% Match')).toBeInTheDocument();
    
    expect(screen.getByText('Test Recommendation 2')).toBeInTheDocument();
    expect(screen.getByText('Test Description 2')).toBeInTheDocument();
    expect(screen.getByText('85% Match')).toBeInTheDocument();
  });

  it('handles empty recommendations', () => {
    render(
      <ChakraProvider>
        <RecommendationList recommendations={[]} />
      </ChakraProvider>
    );

    expect(screen.getByText('No recommendations available yet.')).toBeInTheDocument();
  });

  it('handles view interaction correctly', async () => {
    (recordInteraction as jest.Mock).mockResolvedValueOnce({});

    render(
      <ChakraProvider>
        <RecommendationList recommendations={mockRecommendations} />
      </ChakraProvider>
    );

    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(recordInteraction).toHaveBeenCalledWith({
        content_id: '1',
        interaction_type: 'view',
      });
    });
  });

  it('handles like interaction correctly', async () => {
    (recordInteraction as jest.Mock).mockResolvedValueOnce({});

    render(
      <ChakraProvider>
        <RecommendationList recommendations={mockRecommendations} />
      </ChakraProvider>
    );

    const likeButtons = screen.getAllByText('Like');
    fireEvent.click(likeButtons[0]);

    await waitFor(() => {
      expect(recordInteraction).toHaveBeenCalledWith({
        content_id: '1',
        interaction_type: 'like',
      });
    });
  });

  it('handles interaction errors', async () => {
    const mockError = new Error('Failed to record interaction');
    (recordInteraction as jest.Mock).mockRejectedValueOnce(mockError);

    render(
      <ChakraProvider>
        <RecommendationList recommendations={mockRecommendations} />
      </ChakraProvider>
    );

    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Failed to record interaction. Please try again.')).toBeInTheDocument();
    });
  });
}); 