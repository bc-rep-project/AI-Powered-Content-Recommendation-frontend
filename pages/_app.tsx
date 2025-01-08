import React from 'react';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/app/globals.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;