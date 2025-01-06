import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return React.createElement(Html, { lang: 'en' },
      React.createElement(Head),
      React.createElement('body', {},
        React.createElement(Main),
        React.createElement(NextScript)
      )
    );
  }
}

export default MyDocument; 