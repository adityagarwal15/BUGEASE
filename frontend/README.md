# Campus Buggy Frontend

A modern, responsive web application built with Vite, React, TypeScript, and Shadcn/ui for managing campus buggy services.

## 🚀 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Maps**: Google Maps JavaScript API
- **Code Quality**: ESLint + Prettier + Husky

## 📋 Prerequisites

- **Node.js**: 18.0.0 or higher (Current: v22.13.1)
- **npm**: 10.0.0 or higher (Current: 11.5.2)

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd BUGEASE/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_API_BASE_URL=your_backend_api_url_here
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development mode |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## 🔧 Development Tools

### Code Quality
- **ESLint**: Code linting with React + TypeScript rules
- **Prettier**: Code formatting with consistent style
- **Husky**: Git hooks for pre-commit validation
- **lint-staged**: Run linters only on staged files

### Pre-commit Hooks
The project uses Husky to automatically run linting and formatting before each commit:
- ESLint checks for code quality issues
- Prettier ensures consistent code formatting
- Only staged files are processed for performance

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   └── ...             # Custom components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
└── data/               # Static data and constants
```

## 🚨 Security Notes

**Current Status**: 2 moderate severity vulnerabilities detected
- **Issue**: esbuild vulnerability in development dependencies
- **Impact**: Development server only (not production builds)
- **Risk Level**: Moderate - affects local development environment
- **Recommendation**: Monitor for updates, consider upgrading to Vite 7+ when stable

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - The dev server runs on port 3000 by default
   - If port is busy, Vite will automatically find an available port

2. **TypeScript Errors**
   - Run `npm run lint` to identify issues
   - Use `npm run lint:fix` to auto-fix many problems

3. **Build Failures**
   - Ensure all dependencies are installed: `npm install`
   - Check for TypeScript compilation errors: `npm run lint`

### Performance Tips

- Use `npm run build:dev` for faster development builds
- The project includes path aliases (`@/*`) for cleaner imports
- Hot Module Replacement (HMR) is enabled for fast development

## 🤝 Contributing

1. Ensure code passes linting: `npm run lint`
2. Format code before committing: `npm run format`
3. Pre-commit hooks will automatically validate your changes

## 📄 License

This project is part of the Campus Buggy system. See the main project README for license information.
