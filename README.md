# The Benedictine Academy — School Website & Management Portal

A modern, responsive school website and management portal built for The Benedictine Academy, a school in Benin City, Edo State, Nigeria.

The platform presents the school's mission, academic programmes, admissions information, announcements, and contact details. It also provides entry points for administrative staff, teachers, and students.

Live Website: https://thebenedictineacademyportal.com

## Overview

The Benedictine Academy website is designed to improve the school's online presence and make essential school information easier for parents, students, and prospective applicants to access.

The public website communicates the school's educational philosophy, showcases its academic offerings, and guides prospective families through the admissions process. Dedicated portal links provide access points for different school user groups.

## Features

### Public Website
- Responsive homepage introducing the school and its educational mission.
- About page presenting the school's history, vision, mission, and core values.
- Academics page covering primary and secondary education.
- Admissions page with application guidance, requirements, and supporting information.
- News and announcements section.
- School gallery for showcasing the school community and facilities.
- Frequently Asked Questions (FAQ) page.
- Contact information and school opening hours.
- Navigation links for easy access to important sections.

### Admissions
- Information about available school levels and admission requirements.
- Guidance on the online application process.
- Information about required documents.
- Application tracking entry point.
- Contact details for admission enquiries.

### School Portal Entry Points
The website provides separate entry points for:
- Administrators
- Teachers
- Students

The availability of individual portal features depends on the functionality implemented in the application.

## Technology Stack

### Frontend
- **Next.js 16** — React framework and application routing.
- **React 19** — Component-based user interfaces.
- **TypeScript** — Static typing.
- **Tailwind CSS** — Styling and responsive layouts.
- **Framer Motion** — Interface animations.
- **Lucide React** — Icons.
- **Recharts** — Data visualisation.
- **React Hot Toast** — User notifications.

### Backend and Data
- **Next.js API Routes** — Application backend endpoints.
- **PostgreSQL** — Relational database.
- **Supabase** — Database and related backend services.
- **Prisma ORM** — Database access and schema management.
- **Neon Prisma Adapter** (`@prisma/adapter-neon`) — Database connectivity where configured.
- **Zod** — Data validation.
- **JWT** — Token-based authentication where implemented.
- **bcrypt** — Password hashing.
- **HTTP-only cookies** — Secure handling of authentication cookies.

### Additional Integrations
- **Resend** — Email delivery.
- **Upstash Redis** — Redis-based caching or other configured data operations.
- **React-to-Print** — Print functionality.
- **html-to-image** — DOM-to-image export functionality.

### Development and Deployment
- Git and GitHub
- Vercel
- Google Search Console
- Namecheap

## Security Considerations

Security-related implementation includes authentication and password hashing, request or form validation, and HTTP-only cookie handling.

For production deployments:
- Keep database credentials, authentication secrets, and email API keys in environment variables.
- Never commit `.env` files containing secrets.
- Validate incoming data on the server, even when client-side validation is present.
- Enforce authorization on protected API endpoints and server-side operations.
- Use secure cookie settings in production.
- Apply appropriate rate limiting to sensitive endpoints.
- Avoid exposing private student, staff, or school records to unauthorized users.

## SEO and Performance

The project incorporates website optimisation and SEO practices, including metadata management, responsive layouts, and Google Search Console integration.

SEO and performance should be evaluated on the deployed website using tools such as Google Search Console and PageSpeed Insights.

## Local Development

### Prerequisites

- Node.js version compatible with the project's Next.js version.
- npm or another package manager supported by the repository.
- Access to the configured PostgreSQL database.
- Environment variables required by the application.

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/MaryGrace-lab/the-benedictine.git
   cd the-benedictine
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Environment Configuration:

   Configure the environment variables required by the application before running it locally. These may include database connection
   settings and credentials for external services.

   Keep all secrets and credentials private. Do not commit environment files containing sensitive values to GitHub.

4. Configure the database connection and other required environment variables.

5. Run the database setup commands specified by the repository's Prisma configuration and project scripts.

6. Start the development server using the script defined in `package.json`. For a standard Next.js development script:

   ```bash
   npm run dev
   ```

7. Open http://localhost:3000 in your browser.

### Production Build

For a standard Next.js project, the production build command is:

```bash
npm run build
```

Run the production server using the script configured in `package.json`, commonly:

```bash
npm run start
```

The exact database, migration, and deployment commands should follow the repository's actual configuration.

## Deployment

The website is deployed at:

https://thebenedictineacademyportal.com

The project uses Vercel for deployment and Google Search Console for search visibility monitoring. Domain and DNS configuration should be managed through the relevant domain provider.

## Project Purpose

This project demonstrates the development of a school website with a focus on responsive design, structured content, admissions information, backend integration, and school portal access.

## Developer

**Mary Umoize**  
GitHub: https://github.com/MaryGrace-lab

## Acknowledgements

Developed for The Benedictine Academy, Benin City, Edo State, Nigeria.

**Live Website:** https://thebenedictineacademyportal.com
