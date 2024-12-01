import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
} from '@chakra-ui/react';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onClose?: () => void;
}

export default function ErrorAlert({
  title = 'Error',
  message,
  onClose,
}: ErrorAlertProps) {
  return (
    <Alert status="error" borderRadius="md" mb={4}>
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription display="block">{message}</AlertDescription>
      </Box>
      {onClose && <CloseButton position="absolute" right="8px" top="8px" onClick={onClose} />}
    </Alert>
  );
} 