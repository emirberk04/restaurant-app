# Elegance Restaurant

A modern restaurant website built with Next.js and TailwindCSS, featuring a beautiful UI and responsive design.

## Features

- Modern and responsive design
- Interactive menu page
- Online reservation system
- Contact form
- Beautiful animations using Framer Motion
- Mobile-friendly navigation

## Pages

- Home: Showcasing the restaurant's ambiance and featured items
- Menu: Displaying our curated selection of dishes
- Reservations: Online table booking system
- Contact: Contact form and location information

## Tech Stack

- Next.js 14
- React 18
- TailwindCSS
- Framer Motion
- Heroicons
- TypeScript

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
restaurant-app/
├── app/                # Next.js app directory
│   ├── contact/       # Contact page
│   ├── menu/          # Menu page
│   ├── reservations/  # Reservations page
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/        # React components
│   ├── Navbar.tsx    # Navigation component
│   └── Footer.tsx    # Footer component
├── public/           # Static files
└── styles/          # Global styles
```

## Customization

- Colors and theme can be modified in `tailwind.config.js`
- Global styles are defined in `app/globals.css`
- Content can be updated in respective page components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 