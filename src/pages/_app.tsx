import * as React from 'react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps): React.ReactElement {
  return React.createElement(Component, pageProps);
} 