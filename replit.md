# Overview

Sahaay is a comprehensive social impact platform that addresses poverty, hunger, and education gaps through three interconnected modules: FeedConnect (food distribution), EmpowerBridge (volunteer matching), and EduBridge (educational resources). The platform provides a unified digital solution for NGOs, volunteers, donors, educators, and community members to collaborate effectively in supporting underserved communities worldwide.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built with React and TypeScript, utilizing a component-based architecture with shadcn/ui design system. The application uses Wouter for client-side routing and TanStack Query for state management and API interactions. The design system is built on Tailwind CSS with a custom color palette (hope-green, trust-blue, optimism-gold) and includes comprehensive UI components from Radix UI primitives.

**Design Decision**: React with TypeScript provides type safety and component reusability, while Wouter offers a lightweight routing solution. TanStack Query handles server state management efficiently with caching and synchronization capabilities.

## Backend Architecture
The server runs on Express.js with TypeScript in an ESM environment. The architecture follows a modular pattern with separate concerns for routing, storage, and server setup. The application includes middleware for request logging and error handling, with development-specific Vite integration for hot module replacement.

**Design Decision**: Express.js provides a minimal and flexible foundation that can scale as the application grows. The modular structure allows for easy extension of API endpoints and middleware.

## Data Storage Solutions
The application uses a dual-storage approach:
- **Development**: In-memory storage implementation with a Map-based structure for rapid prototyping
- **Production**: PostgreSQL with Drizzle ORM for type-safe database operations

The database schema is defined in a shared module, ensuring consistency between client and server. Drizzle Kit handles migrations and schema synchronization.

**Design Decision**: Starting with in-memory storage allows for rapid development while the PostgreSQL setup provides production-ready persistence. Drizzle ORM offers excellent TypeScript integration and developer experience.

## Authentication and Authorization
The current implementation includes a basic user management system with role-based access control supporting six user types: NGO/Organization, Volunteer, Donor, Educator, Community Member, and Field Worker. Session management is configured but not fully implemented.

**Design Decision**: Role-based access control allows for different user experiences and permissions based on user type, essential for a multi-stakeholder platform.

## Development Tooling
The project uses Vite for fast development builds and hot module replacement. TypeScript configuration supports both client and server code with path mapping for clean imports. ESBuild handles production server bundling for optimal performance.

**Design Decision**: Vite provides excellent developer experience with fast refresh and optimized builds, while TypeScript ensures code quality and maintainability across the full stack.

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting via @neondatabase/serverless
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL integration
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind

## Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution engine for development

## State Management and Data Fetching
- **TanStack React Query**: Server state management with caching and synchronization
- **Zustand**: Lightweight client-side state management
- **React Hook Form**: Form state management with validation

## Additional Libraries
- **Wouter**: Minimalist routing library for React
- **date-fns**: Modern date utility library
- **class-variance-authority**: Utility for managing CSS class variations
- **embla-carousel-react**: Touch-friendly carousel component