# Solfa - Music Notation App

A modern web application for creating and managing musical notations, particularly focused on solfa notation. Built with Next.js, TypeScript, and Supabase.

## Features

- Create and manage songs with solfa notation
- Support for multiple voice parts (soprano, alto, tenor, bass)
- Beautiful and responsive UI
- Mobile-first design
- Progressive Web App (PWA) support

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase
- Lucide Icons

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/solfa.git
cd solfa
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
solfa/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # Reusable components
│   ├── lib/             # Utility functions and configurations
│   └── styles/          # Global styles
├── public/              # Static assets
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 