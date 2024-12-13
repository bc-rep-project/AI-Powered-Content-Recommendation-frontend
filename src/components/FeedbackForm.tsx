import { Box, RadioGroup, Radio, Stack } from '@chakra-ui/react';

export const FeedbackForm = () => {
  return (
    <Box data-testid="feedback-form">
      <RadioGroup data-testid="relevance-rating">
        <Stack direction="row">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Radio
              key={rating}
              value={String(rating)}
              data-testid={`rating-${rating}`}
            >
              {rating}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </Box>
  );
}; 