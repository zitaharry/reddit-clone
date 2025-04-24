# Reddit AI Clone - Next.js 15 & Sanity CMS

A modern, AI-powered Reddit clone built with Next.js 15, Sanity CMS, Clerk, and AI content moderation. Features real-time content updates, community management, and AI-assisted content filtering.

## Features

### For Users

- 🏠 Browse posts from all communities on the homepage
- 🔍 Search for posts and communities
- 📝 Create and manage posts with rich text formatting
- 📊 Vote on posts and comments
- 💬 Participate in community discussions through comments
- 🖼️ Include images in posts for visual content
- 👤 User profiles with post history

### For Communities

- 🌐 Create and customize subreddits / communities
- 📋 Community-specific post feeds
- 🚫 Report inappropriate content

### AI Features

- 🤖 AI-powered content moderation
- 🛡️ Automatic detection and censoring of inappropriate content
- 🚩 User reporting system for violations
- 🔍 Smart content analysis for community standards enforcement

### Technical Features

- 🚀 Server Components & Server Actions with Next.js 15
- 👤 Authentication with Clerk
- 📝 Content management with Sanity.io
- 🎨 Modern UI with Tailwind CSS and Radix UI
- 📱 Responsive design
- 🔄 Real-time content updates
- 🔒 Protected routes and content
- ⚡ Turbopack for fast development

### UI/UX Features

- 🎯 Clean, Reddit-inspired interface
- 🎨 Consistent design system using Radix UI components
- ♿ Accessible components
- 📱 Responsive across all devices
- ⏱️ Time-ago timestamps for posts and comments
- 🔍 Intuitive search functionality
- 💫 Micro-interactions for better engagement

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Clerk Account
- Sanity Account
- OpenAI API key (for AI moderation)

### Environment Variables

Create a `.env.local` file with:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-sanity-read-token

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key

# OpenAI (for AI moderation)
OPENAI_API_KEY=your-openai-api-key
```

### Installation

```terminal
# Clone the repository

# Install dependencies using yarn
yarn or yarn install OR
npm install OR
pnpm install
OR YOUR PREFERRED PACKAGE MANAGER

# Start the development server with Turbopack
yarn dev

```

### Setting up Sanity CMS

1. Create a Sanity account
2. Create a new project
3. Install the Sanity CLI:
   ```bash
   npm install -g @sanity/cli
   yarn add -g @sanity/cli
   pnpm i -g @sanity/cli
   OR YOUR PREFERRED PACKAGE MANAGER
   ```
4. Initialize Sanity in your project:
   ```bash
   sanity init
   ```
5. Deploy Sanity Studio:
   ```bash
   sanity deploy
   ```

### Setting up Clerk

1. Create a Clerk application
2. Configure authentication providers
3. Set up redirect URLs
4. Add environment variables

### Core Technologies

- Next.js 15
- TypeScript
- Sanity CMS
- Clerk Auth
- OpenAI API
- Tailwind CSS
- Radix UI
- Lucide Icons

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

---

Built with ❤️ using Next.js, Sanity, Clerk, and OpenAI
