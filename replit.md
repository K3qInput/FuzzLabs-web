# Seragon - Minecraft Service Platform

## Overview

Seragon is a full-stack web application designed as a comprehensive platform for Minecraft server hosting and services under the Sterix parent company. The application provides a complete marketplace where users can purchase server hosting plans, custom development services, design assets, and support packages for their Minecraft communities with dynamic currency conversion based on market rates.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Payment Processing**: Stripe integration for secure transactions

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Session Management**: Express sessions with PostgreSQL storage
- **Authentication**: Replit Auth integration with OAuth support (Google, Discord)
- **API Design**: RESTful endpoints with comprehensive error handling
- **File Serving**: Vite development server integration for SSR capabilities

### Data Storage
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple

## Key Components

### Authentication System
- Replit Auth as the primary authentication provider
- OAuth integration supporting Google and Discord
- Session-based authentication with secure cookie handling
- Role-based access control (customer, admin)
- Automatic user profile synchronization

### Service Management
- Hierarchical service categorization system
- Support for both one-time and recurring billing models
- Dynamic pricing with currency flexibility
- Service metadata for additional configuration options
- Category-based organization with custom icons

### Order Processing
- Complete order lifecycle management
- Stripe payment intent integration
- Order status tracking (pending, processing, completed, cancelled)
- Payment status monitoring (pending, paid, failed, refunded)
- Detailed billing information storage

### Shopping Cart
- Client-side cart state management
- Persistent cart data across sessions
- Support for both one-time and recurring services
- Quantity management and price calculations

### Support System
- Integrated ticketing system for customer support
- Message threading for ticket conversations
- Priority levels and status tracking
- Admin panel for support management

### Admin Dashboard
- Comprehensive administrative interface
- User management and role assignment
- Order monitoring and fulfillment
- Service management (CRUD operations)
- Support ticket oversight
- Analytics and reporting capabilities

## Data Flow

### User Registration/Authentication
1. User initiates authentication via Replit Auth
2. OAuth providers (Google/Discord) handle identity verification
3. User profile data synchronized with local database
4. Session established with PostgreSQL backing store
5. Role-based permissions applied

### Service Purchase Flow
1. User browses available services by category
2. Services added to client-side shopping cart
3. Checkout process collects billing information
4. Stripe payment intent created for transaction
5. Order record created with pending status
6. Payment processed through Stripe
7. Order status updated upon payment confirmation
8. User receives order confirmation and service access

### Support Request Flow
1. Authenticated user creates support ticket
2. Ticket assigned unique identifier and priority
3. Support messages stored with threading
4. Admin notifications for new tickets
5. Bidirectional communication until resolution
6. Ticket closure and satisfaction tracking

## External Dependencies

### Payment Processing
- **Stripe**: Complete payment infrastructure including payment intents, customer management, and subscription handling
- **Integration**: Server-side API with client-side Elements for PCI compliance

### Database Hosting
- **Neon**: Serverless PostgreSQL with connection pooling
- **Features**: Automatic scaling, branching, and point-in-time recovery

### Authentication Services
- **Replit Auth**: Primary authentication provider with OIDC support
- **OAuth Providers**: Google and Discord for social authentication
- **Session Storage**: PostgreSQL-backed session management

### Development Tools
- **Vite**: Fast development server with HMR and optimized builds
- **TypeScript**: Type safety across the entire application stack
- **ESBuild**: Fast bundling for production builds

## Deployment Strategy

### Replit Environment
- **Runtime**: Node.js 20 with web and PostgreSQL modules
- **Development**: `npm run dev` for development server with hot reload
- **Production Build**: Vite build for client assets, ESBuild for server bundle
- **Process Management**: Single process serving both static assets and API endpoints

### Environment Configuration
- **Database**: Automatic Neon PostgreSQL provisioning
- **Sessions**: Database-backed session storage for scalability
- **HTTPS**: Automatic SSL termination through Replit infrastructure
- **Port Management**: Configurable port mapping (5000 internal, 80 external)

### Build Process
1. Client assets built using Vite with React and TypeScript compilation
2. Server code bundled using ESBuild for Node.js environment
3. Static assets served from dist/public directory
4. API routes handled by Express server
5. Database migrations applied through Drizzle Kit

## Changelog

- June 25, 2025: Initial setup with full e-commerce platform
- June 25, 2025: Added authentic content from HTML file (team, pricing, services)
- June 25, 2025: Implemented UPI payment system with arhaanjain@fam
- June 25, 2025: Fixed color theme (#0a0a0a background, #00ff88 accent)
- June 25, 2025: Added Netlify deployment configuration
- July 15, 2025: Migration from Replit Agent to Replit environment
- July 15, 2025: Rebranded from FuzzLabs to Seragon by Sterix
- July 15, 2025: Updated team to only include Kiro (CTO) with contact email
- July 15, 2025: Updated Discord link to https://discord.gg/b4f8WZy4R8
- July 15, 2025: Updated partners to Sterix (parent company) and MineTree
- July 15, 2025: Implemented dynamic currency conversion with market rates
- July 15, 2025: Enhanced UI with better animations and improved color theme
- July 15, 2025: Removed office locations from contact page
- July 15, 2025: Added automatic currency detection and conversion for shop prices
- July 15, 2025: Modernized authentication system - removed Google OAuth, kept Discord + Replit
- July 15, 2025: Fixed Discord authentication runtime errors and endpoint configuration
- July 15, 2025: Made services page accessible without login requirement
- July 15, 2025: Completed migration from Replit Agent to Replit environment

## User Preferences

Preferred communication style: Simple, everyday language.
Branding: Seragon by Sterix (parent company)
Discord: https://discord.gg/b4f8WZy4R8
Team: Only Kiro (CTO) - kirodev.java@gmail.com
Partners: Sterix and MineTree
Currency: Dynamic conversion based on user location and market rates