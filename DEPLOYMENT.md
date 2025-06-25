# Deploying Fuzz Labs to Netlify

## Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **Database**: Set up a PostgreSQL database (Neon recommended)

## Environment Variables Required

Set these in your Netlify dashboard under Site Settings > Environment Variables:

### Database Configuration
```
DATABASE_URL=your_postgresql_connection_string
PGDATABASE=your_database_name
PGHOST=your_database_host
PGPASSWORD=your_database_password
PGPORT=5432
PGUSER=your_database_user
```

### Authentication
```
SESSION_SECRET=your_session_secret_key
REPL_ID=your_replit_app_id
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=your-netlify-site.netlify.app
```

### Payment (Optional)
```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

## Deployment Steps

### 1. Database Setup
If using Neon (recommended):
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Run `npm run db:push` locally to create tables

### 2. Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build:netlify`
3. Set publish directory: `dist/public`
4. Add all environment variables listed above
5. Deploy!

### 3. OAuth Configuration
Update your OAuth app settings:
- **Google OAuth**: Add `https://your-site.netlify.app` to authorized domains
- **Discord OAuth**: Add `https://your-site.netlify.app/api/callback` to redirect URIs

### 4. Domain Configuration
In `REPLIT_DOMAINS` environment variable, set:
```
REPLIT_DOMAINS=your-site.netlify.app
```

## Build Configuration

The `netlify.toml` file is already configured with:
- Build command: `npm run build:netlify`
- Publish directory: `dist/public`
- API redirects to Netlify Functions
- SPA redirects for client-side routing

## Troubleshooting

### Common Issues:
1. **Database Connection**: Ensure DATABASE_URL is correctly set
2. **OAuth Errors**: Verify redirect URIs match your Netlify domain
3. **Function Timeouts**: Netlify Functions have a 10-second timeout limit

### Checking Logs:
- View function logs in Netlify dashboard
- Check build logs for compilation errors
- Monitor database connections

## Local Development vs Production

- **Local**: Uses Express server on port 5000
- **Production**: Uses Netlify Functions for backend API
- **Database**: Same PostgreSQL instance for both (recommended)

## Post-Deployment

1. Test all authentication flows
2. Verify payment processing (if enabled)
3. Check all API endpoints are working
4. Test the shopping cart and checkout process

Your Fuzz Labs platform will be available at: `https://your-site.netlify.app`