# Solfa - Choir Management System

A modern web application for managing choirs, songs, and auditions.

## Features

- User authentication and role-based access control
- Dark/light mode support
- Responsive design with mobile navigation
- Real-time updates with Supabase
- Modern UI with Tailwind CSS and Framer Motion

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
  ├── app/              # Next.js app directory
  ├── components/       # React components
  ├── context/         # React context providers
  ├── lib/             # Utility functions and configurations
  └── types/           # TypeScript type definitions
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT 