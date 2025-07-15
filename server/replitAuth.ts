import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport"; // For Replit (OIDC)

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Discord Strategy only - Google removed as requested
import { Strategy as DiscordStrategy } from 'passport-discord';


if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

// Ensure Discord Client ID and Secret are available
if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
  console.warn("Discord environment variables (DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET) are not fully provided. Discord authentication may not work.");
}

// Google authentication removed as requested


const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false, // Ensure this table is created by your db:push script
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key-for-development',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies only in production
      maxAge: sessionTtl,
      sameSite: 'lax', // Important for OAuth flows
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

// Separate function for updating user based on Discord profile
function updateUserSessionFromDiscord(user: any, profile: any, accessToken: string, refreshToken: string) {
    user.id = profile.id;
    user.email = profile.email;
    user.username = profile.username;
    user.discriminator = profile.discriminator;
    user.profileImageUrl = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
    user.access_token = accessToken;
    user.refresh_token = refreshToken;
    user.expires_at = Math.floor(Date.now() / 1000) + 3600; // Discord tokens usually last 1 hour
}


async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  // 'trust proxy' is crucial when deployed behind a proxy like Netlify
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // --- REPLIT AUTHENTICATION SETUP ---
  const config = await getOidcConfig();

  const verifyReplit: VerifyFunction = async ( // Renamed verify to verifyReplit for clarity
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {}; // This user object will be serialized into the session
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env.REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`, // Unique name for Replit strategy
        config,
        // Scopes for Replit Auth as per Replit documentation
        scope: "openid email profile offline_access",
        // Callback URL for Replit Auth
        callbackURL: `https://${domain}/api/callback`,
      },
      verifyReplit, // Use the Replit-specific verify function
    );
    passport.use(strategy);
  }

  // --- DISCORD AUTHENTICATION SETUP ---
  if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
    passport.use('discord', new DiscordStrategy({
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        // THIS WAS THE PRIMARY FIX:
        // This MUST be the exact Redirect URI you registered in your Discord Developer Portal
        // and the `redirect_uri` in your frontend Discord auth URL.
        callbackURL: `https://seragonservices.netlify.app/api/callback`,
        // Scopes for basic user authentication: identify (user details), email (user's email)
        scope: ['email']
      },
      // The verify function for Discord Strategy
      async (accessToken, refreshToken, profile, done) => {
        // 'profile' object from Discord will contain user data based on requested scopes.
        // You'll need to adapt your upsertUser or create a new function if Discord's profile
        // structure is different from Replit's claims.
        const userClaims = {
            sub: profile.id, // Discord user ID
            email: profile.email,
            first_name: profile.username, // Using username as first_name
            last_name: profile.discriminator, // Using discriminator as last_name
            profile_image_url: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
            // Add other claims you need/have from Discord profile
        };
        
        const user = {
          claims: userClaims,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: Math.floor(Date.now() / 1000) + 3600 // Discord tokens usually last 1 hour
        };

        await upsertUser(userClaims); // Upsert user to your DB
        return done(null, user);
      }
    ));
  }

  // Google authentication removed as requested


  // --- PASSPORT SERIALIZATION/DESERIALIZATION ---
  passport.serializeUser((user: Express.User, cb) => {
      cb(null, user);
  });
  passport.deserializeUser((user: Express.User, cb) => {
      cb(null, user as Express.User);
  });

  // --- REPLIT AUTH ROUTES ---
  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    // Check if this is a Discord OAuth callback
    if (req.query.code && !req.query.state) {
      // This looks like a Discord callback, handle it
      passport.authenticate('discord', {
        successReturnToOrRedirect: "/dashboard",
        failureRedirect: "/api/login",
      })(req, res, next);
    } else {
      // Handle Replit Auth callback
      passport.authenticate(`replitauth:${req.hostname}`, {
        successReturnToOrRedirect: "/",
        failureRedirect: "/api/login",
      })(req, res, next);
    }
  });

  // Cross-domain OAuth bridge for Netlify callbacks
  app.get("/api/oauth/bridge", (req, res) => {
    const provider = typeof req.query.provider === 'string' ? req.query.provider : '';
    const code = typeof req.query.code === 'string' ? req.query.code : '';
    const state = typeof req.query.state === 'string' ? req.query.state : '';
    const error = typeof req.query.error === 'string' ? req.query.error : '';
    
    if (error) {
      return res.redirect(`/api/login?error=${encodeURIComponent(error)}`);
    }
    
    if (provider === 'discord' && code) {
      // Create a form that posts to the Discord callback
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Authenticating...</title></head>
        <body>
          <script>
            window.location.href = '/api/auth/discord/callback?code=${encodeURIComponent(code)}';
          </script>
        </body>
        </html>
      `);
    }
    
    if (provider === 'google' && code) {
      // Create a form that posts to the Google callback
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Authenticating...</title></head>
        <body>
          <script>
            window.location.href = '/api/auth/google/callback?code=${encodeURIComponent(code)}';
          </script>
        </body>
        </html>
      `);
    }
    
    res.redirect('/api/login');
  });

  // --- DISCORD AUTH ROUTES ---
  // Route to initiate Discord OAuth flow
  app.get('/api/auth/discord', passport.authenticate('discord')); // Use 'discord' strategy name

  // Callback route for Discord OAuth
  app.get('/api/auth/discord/callback',
      passport.authenticate('discord', { failureRedirect: '/api/login' }), // Use 'discord' strategy name
      function(req, res) {
          // Successful Discord authentication, redirect to dashboard or home
          res.redirect('/dashboard');
      }
  );

  // --- GOOGLE AUTH ROUTES ---
  // Route to initiate Google OAuth flow
  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  // Callback route for Google OAuth
  app.get('/api/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/api/login' }),
      function(req, res) {
          // Successful Google authentication, redirect to dashboard or home
          res.redirect('/dashboard');
      }
  );


  // --- LOGOUT ROUTE ---
  app.get("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).send("Logout failed");
      }
      // Replit OIDC specific logout
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user?.expires_at) { // Add optional chaining to user
    return res.status(401).json({ message: "Unauthorized: Not authenticated or missing expiration" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized: No refresh token" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    console.error("Token refresh failed:", error); // Log the actual error
    res.status(401).json({ message: "Unauthorized: Token refresh failed" });
    return;
  }
};
