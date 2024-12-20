import React from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '../context/AuthContext';
import theme from '../theme';

function MyApp({ Component, pageProps }: AppProps) {
  return React.createElement(
    ChakraProvider,
    { theme },
    React.createElement(
      AuthProvider,
      null,
      React.createElement(Component, pageProps)
    )
  );
}

export default MyApp; 