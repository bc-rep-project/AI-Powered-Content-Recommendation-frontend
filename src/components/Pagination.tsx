import React from 'react';
import { Button, HStack, Text } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps): JSX.Element => {
  return (
    <HStack spacing={4}>
      <Button
        data-testid="prev-page"
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        leftIcon={<FiChevronLeft />}
      >
        Previous
      </Button>
      
      <Text data-testid="page-number">
        Page <strong>{currentPage}</strong> of {totalPages}
      </Text>

      <Button
        data-testid="next-page"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        rightIcon={<FiChevronRight />}
      >
        Next
      </Button>
    </HStack>
  );
};

export default Pagination; 