import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import DiscoverPage from '@/pages/discover';
import { fetchDiscoverContent } from '@/services/api';

jest.mock('@/services/api', () => ({
  fetchDiscoverContent: jest.fn(),
}));

jest.mock('@/components/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="mock-layout">{children}</div>;
  };
});

const mockRecommendations = [
  {
    content_id: '1',
    title: 'Test Content 1',
    description: 'Test Description 1',
    score: 0.95,
    category: 'movies',
  },
  {
    content_id: '2',
    title: 'Test Content 2',
    description: 'Test Description 2',
    score: 0.85,
    category: 'books',
  },
];

describe('DiscoverPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search and category filters', () => {
    render(
      <ChakraProvider>
        <DiscoverPage />
      </ChakraProvider>
    );

    expect(screen.getByPlaceholderText('Search content...')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('All Categories')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    (fetchDiscoverContent as jest.Mock).mockResolvedValueOnce(mockRecommendations);

    render(
      <ChakraProvider>
        <DiscoverPage />
      </ChakraProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search content...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 });

    await waitFor(() => {
      expect(fetchDiscoverContent).toHaveBeenCalledWith({
        searchQuery: 'test',
        category: 'all',
      });
    });
  });

  it('handles category filter', async () => {
    (fetchDiscoverContent as jest.Mock).mockResolvedValueOnce(mockRecommendations);

    render(
      <ChakraProvider>
        <DiscoverPage />
      </ChakraProvider>
    );

    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'movies' } });

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveValue('movies');
    });
  });

  it('displays loading state', async () => {
    (fetchDiscoverContent as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <ChakraProvider>
        <DiscoverPage />
      </ChakraProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search content...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 });

    expect(await screen.findByText('Discovering content for you...')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    const error = new Error('Failed to load content');
    (fetchDiscoverContent as jest.Mock).mockRejectedValueOnce(error);

    render(
      <ChakraProvider>
        <DiscoverPage />
      </ChakraProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search content...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 });

    expect(await screen.findByText('Failed to load discover content. Please try again.')).toBeInTheDocument();
  });
}); 