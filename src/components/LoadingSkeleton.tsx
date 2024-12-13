import { Skeleton, Stack, Box } from '@chakra-ui/react';

export const RecommendationSkeleton = () => (
    <Stack spacing={4}>
        {[...Array(3)].map((_, i) => (
            <Box key={i} p={4} borderWidth="1px" borderRadius="lg">
                <Stack>
                    <Skeleton height="20px" width="200px" />
                    <Skeleton height="15px" width="300px" />
                    <Skeleton height="15px" width="250px" />
                </Stack>
            </Box>
        ))}
    </Stack>
); 