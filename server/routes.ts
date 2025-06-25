import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
  console.warn("Discord environment variables (DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET) are not fully provided. Discord authentication may not work.");
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("Google environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) are not fully provided. Google authentication may not work.");
}


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
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
      sameSite: 'lax',
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
    user.profileImageUrl = profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null;
    user.access_token = accessToken;
    user.refresh_token = refreshToken;
    user.expires_at = Math.floor(Date.now() / 1000) + 3600; // Discord tokens typically last 1 hour
}

// Separate function for updating user based on Google profile (if needed, otherwise adapt generic)
function updateUserSessionFromGoogle(user: any, profile: any, accessToken: string, refreshToken: string) {
    user.id = profile.id;
    user.email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    user.firstName = profile.name?.givenName;
    user.lastName = profile.name?.familyName;
    user.profileImageUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;
    user.access_token = accessToken;
    user.refresh_token = refreshToken;
    user.expires_at = Math.floor(Date.now() / 1000) + 3600; // Google tokens typically last 1 hour
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
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // --- REPLIT AUTHENTICATION SETUP ---
  const config = await getOidcConfig();

  const verifyReplit: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env.REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verifyReplit,
    );
    passport.use(strategy);
  }

  // --- DISCORD AUTHENTICATION SETUP ---
  passport.use('discord', new DiscordStrategy({
      clientID: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      callbackURL: 'https://fuzzlabs.netlify.app/api/auth/discord/callback', // Correct Discord Callback URL
      scope: ['identify', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      const userClaims = {
          sub: profile.id,
          email: profile.email,
          first_name: profile.username,
          last_name: profile.discriminator,
          profile_image_url: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
      };
      const user = {};
      updateUserSessionFromDiscord(user, profile, accessToken, refreshToken); // Using Discord-specific update

      await upsertUser(userClaims);
      return done(null, user);
    }
  ));

  // --- GOOGLE AUTHENTICATION SETUP ---
  passport.use('google', new GoogleStrategy({ // Added strategy name 'google' explicitly
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'https://fuzzlabs.netlify.app/api/auth/google/callback', // Correct Google Callback URL
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      const userClaims = {
        sub: profile.id,
        email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
        first_name: profile.name?.givenName, // Renamed to match upsertUser claims
        last_name: profile.name?.familyName, // Renamed to match upsertUser claims
        profile_image_url: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
      };
      const user = {};
      updateUserSessionFromGoogle(user, profile, accessToken, refreshToken); // Using Google-specific update

      await upsertUser(userClaims);
      return done(null, user);
    }
  ));


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
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  // --- DISCORD AUTH ROUTES ---
  app.get('/api/auth/discord', passport.authenticate('discord'));

  app.get('/api/auth/discord/callback',
      passport.authenticate('discord', { failureRedirect: '/api/login' }),
      function(req, res) {
          res.redirect('/dashboard');
      }
  );

  // --- GOOGLE AUTH ROUTES ---
  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/api/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/api/login' }),
      function(req, res) {
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

  if (!req.isAuthenticated() || !user?.expires_at) {
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
    console.error("Token refresh failed:", error);
    res.status(401).json({ message: "Unauthorized: Token refresh failed" });
    return;
  }
};
