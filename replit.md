# Overview

This is a multiplayer social deduction game branded as **TikJogos**. Players join game rooms and try to identify who among them is the impostor through various game modes involving secret words, locations, roles, and questions. The application is built as a full-stack web application with real-time multiplayer capabilities.

## Recent Changes (December 2025)
- **Added Palavra Secreta Submode Selection with Theme Images** - New screen for choosing themed categories with visual cards
- Five submodes: Clássico, Clash Royale, Animes, Marvel, Stranger Things
- Each submode has 20-30 themed words for variety
- Added brand images for each theme (except Clássico)
- Submode cards feature image preview with rounded corners
- Fixed "Nova Rodada" button and host back-to-lobby broadcast
- All players automatically return to lobby when host clicks back
- **Implemented Automatic Host Transfer** - When host disconnects, next player automatically becomes new host
- **Added Player Feedback System** - Visual notifications when players leave or host changes (toast-style notifications in top-right corner)
- Notifications display for 4 seconds with distinct styling (cyan for host changes, red for player departures)
- Google AdSense auto ads enabled and working
- Railway deployment fully functional with custom domain

## Environment Variables for Deployment (Railway, etc.)

**Required Variables:**
| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Set to `production` for production builds |
| `PORT` | Port number (Railway sets automatically) |
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Random secret for session encryption (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret |
| `GITHUB_CALLBACK_URL` | Full callback URL (e.g., `https://your-app.railway.app/api/auth/github/callback`) |

**How to Create GitHub OAuth App:**
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: TikJogos
   - Homepage URL: https://your-app.railway.app
   - Authorization callback URL: https://your-app.railway.app/api/auth/github/callback
4. Copy Client ID and Client Secret to Railway variables

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & Libraries**
- React with TypeScript for the UI layer
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query for server state management and API calls
- Zustand for local state management (game state store)

**UI Component System**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component library built on Radix UI
- Tailwind CSS for styling with custom theme configuration
- Poppins font family for typography
- Custom neon/cyberpunk aesthetic with animations

**State Management Strategy**
- Local game state managed through Zustand store (`gameStore.ts`)
- Server state synchronized via TanStack Query
- WebSocket connections for real-time game updates
- Store includes player info, room data, game modes, and game status

## Backend Architecture

**Server Framework**
- Express.js as the HTTP server
- Node.js with TypeScript
- HTTP server wrapped for WebSocket support
- Custom logging middleware for request/response tracking

**Real-time Communication**
- WebSocket server (ws library) for live multiplayer functionality
- Room-based architecture where players connect to specific game rooms
- Server broadcasts game state changes to all connected clients
- Message-based protocol for game actions (join, start, vote, etc.)

**Data Storage Strategy**
- In-memory storage implementation (`MemoryStorage` class)
- Interface-based design allows for future database integration
- Room state includes players, game mode, impostor assignment, and game data
- Designed for PostgreSQL via Drizzle ORM (schema defined but storage layer currently in-memory)

**API Design**
- RESTful endpoints for room creation and initial setup
- WebSocket messages for real-time game interactions
- Custom route registration system in `routes.ts`
- Static file serving for production builds

## Database Schema

**Room Model** (defined in schema.ts)
- Primary key: room code (text)
- Host tracking via hostId
- Game status (waiting/playing)
- Current game mode and category
- Impostor assignment
- Players array (JSONB)
- Game-specific data (JSONB) for different modes
- Timestamps for room creation

**Design Rationale**
- PostgreSQL with Drizzle ORM chosen for type-safe database queries
- JSONB columns for flexible game data structures across different modes
- Schema supports multiple game modes without separate tables
- Currently uses in-memory storage but ready for database migration

## Game Modes Architecture

**Five Distinct Game Types**
1. **Palavra Secreta**: Everyone gets same word except impostor
   - **Submodes** (with visual theme selection):
     - Clássico: 20 random words (gradient placeholder card)
     - Clash Royale: 20 game cards/characters (with theme image)
     - Animes: 20 anime characters/titles/powers (with theme image)
     - Marvel: 20 characters/items/movies (with theme image)
     - Stranger Things: 30 characters/items/locations (with theme image)
   - Visual submode selection screen with image previews
   - Images have rounded borders and hover zoom effect
   - Each theme stores its own curated word list
2. **Locais & Funções**: Players receive location and role assignments
3. **Duas Facções**: Two teams with different words, impostor knows neither
4. **Categoria + Item**: Category revealed to all, specific item hidden from impostor
5. **Perguntas Diferentes**: Different questions for crew and impostor

**Mode Data Structure**
- Each mode has predefined word/category lists
- Server randomly selects and assigns based on mode rules
- Game data stored flexibly in JSONB to accommodate varying structures
- Client receives role-specific information based on player assignment
- Palavra Secreta submodes stored in `client/src/lib/palavra-secreta-submodes.ts` with images
- Submode component in `client/src/pages/PalavraSuperSecretaSubmodeScreen.tsx`

## Build and Deployment

**Build Process**
- Custom build script using esbuild for server bundling
- Vite for client-side bundling and optimization
- Selective dependency bundling to reduce cold start times
- Server externals list minimizes bundle size
- Production build outputs to `dist/` directory

**Development vs Production**
- Development: Vite dev server with HMR
- Development: Replit-specific plugins (cartographer, dev banner)
- Production: Static file serving from compiled dist
- Environment-based configuration via NODE_ENV

**Asset Management**
- Custom Vite plugin for OpenGraph image meta tags
- Automatic domain detection for Replit deployments
- Support for PNG, JPG, JPEG opengraph images
- Public assets served from client/public directory

# External Dependencies

## Database & ORM
- **Neon Database** (@neondatabase/serverless): PostgreSQL serverless database
- **Drizzle ORM**: Type-safe database toolkit with schema in `shared/schema.ts`
- WebSocket constructor override for Neon compatibility

## Real-time Communication
- **ws**: WebSocket server implementation for multiplayer functionality

## UI Libraries
- **Radix UI**: Comprehensive set of accessible component primitives
- **shadcn/ui**: Pre-built components using Radix UI
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first CSS framework with custom configuration

## Monetization
- **Google AdSense**: Advertising platform (configured but requires publisher ID)
- PIX donation system (Brazilian payment method) integrated in UI

## Development Tools
- **Replit Vite Plugins**: Runtime error overlay, cartographer, dev banner
- **TypeScript**: Full type safety across client, server, and shared code
- **ESBuild**: Fast JavaScript bundler for server code

## Authentication
- **GitHub OAuth**: OAuth2 authentication using GitHub as identity provider
- Login routes: `/api/login`, `/api/auth/github/callback`, `/api/logout`
- User endpoint: `/api/auth/user` (returns current user info)
- Graceful degradation: Works without OAuth configured (shows warning)
- Session storage: PostgreSQL via connect-pg-simple (when DATABASE_URL is set)
- Fallback: In-memory session storage when no database available

## Session Management
- PostgreSQL session storage (connect-pg-simple) when DATABASE_URL is configured
- In-memory fallback when no database is available
- 7-day session TTL with secure cookies in production

## Validation
- **Zod**: Schema validation for API requests and database operations
- **drizzle-zod**: Integration between Drizzle schemas and Zod validation