import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="AI-Powered Content Recommendation System" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 