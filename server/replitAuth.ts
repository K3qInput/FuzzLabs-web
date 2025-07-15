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
    // Discord OAuth routes
    app.get("/api/auth/discord", passport.authenticate('discord'));
    
    passport.use('discord', new DiscordStrategy({
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/api/auth/discord/callback`,
        scope: ['identify', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userClaims = {
            sub: profile.id,
            email: profile.email || null,
            first_name: profile.username || profile.global_name || 'Unknown',
            last_name: profile.discriminator || '',
            profile_image_url: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
          };
          
          const user = {
            claims: userClaims,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: Math.floor(Date.now() / 1000) + 3600
          };

          await upsertUser(userClaims);
          return done(null, user);
        } catch (error) {
          console.error('Discord auth error:', error);
          return done(error, null);
        }
      }
    ));
    
    app.get("/api/auth/discord/callback", 
      passport.authenticate('discord', { failureRedirect: '/login' }),
      (req, res) => {
        res.redirect('/dashboard');
      }
    );
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

  // Logout route
  app.get("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
      }
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
        }
        res.redirect("/");
      });
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
