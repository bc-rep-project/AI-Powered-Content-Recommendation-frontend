# AI Recommendation Engine Frontend

Modern, responsive frontend for the AI-Powered Content Recommendation Engine. Built with Next.js and TypeScript for optimal performance and developer experience.

## Tech Stack

- **Next.js 13+**: React framework with App Router
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase**: Authentication and real-time features
- **TanStack Query**: Data fetching and caching
- **Zustand**: State management
- **Framer Motion**: Animations
- **Radix UI**: Accessible component primitives

## Features

- 🎨 Modern, responsive design
- 🔒 Secure authentication
- 📱 Mobile-first approach
- 🌙 Dark/Light mode
- 🔍 Advanced search
- 📊 Interactive analytics
- 🔄 Real-time updates
- 🌐 Internationalization ready

## Getting Started

1. **Installation**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Update environment variables
   ```

3. **Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## Project Structure

```
src/
├── app/          # App Router pages
├── components/   # Reusable components
├── hooks/        # Custom hooks
├── services/     # API services
├── stores/       # State management
├── styles/       # Global styles
├── types/        # TypeScript types
└── utils/        # Utility functions
```

## Component Library

- Custom UI components built on Radix UI
- Consistent styling with Tailwind CSS
- Fully accessible and responsive
- Dark mode support

## State Management

- Zustand for global state
- TanStack Query for server state
- Local storage persistence
- Real-time sync with backend

## Performance

- Optimized images and assets
- Code splitting
- Progressive loading
- SEO optimization
- Analytics integration

## Development

1. Follow coding standards
2. Write tests for components
3. Use conventional commits
4. Document new features
5. Ensure accessibility

## Deployment

Automatically deployed to Vercel on main branch updates.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.io/docs)

## Wikipedia Integration

The app integrates with Wikipedia's API to provide supplemental content. Features include:

- Real-time search of Wikipedia articles
- Cached results for better performance
- Clean presentation of article snippets
- Direct links to full articles

To use the Wikipedia integration:
1. Enter a search term in the Wikipedia search field
2. Browse results in the grid below
3. Click "Read more" to view full articles