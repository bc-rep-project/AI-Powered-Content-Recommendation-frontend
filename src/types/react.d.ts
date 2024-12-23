import 'react';

declare module 'react' {
  export type ReactNode =
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | boolean
    | null
    | undefined;
} 