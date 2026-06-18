import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  API_PORT: Joi.number().default(3001),
  API_BASE_URL: Joi.string().default('http://localhost:3001'),
  WEB_URL: Joi.string().default('http://localhost:3000'),
  CORS_ORIGINS: Joi.string().default('http://localhost:3000'),

  // Database - optional in Phase 2 (no DB connection yet)
  DATABASE_URL: Joi.string().optional(),

  // Redis - optional in Phase 2
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),

  // Supabase - optional in Phase 2
  SUPABASE_URL: Joi.string().optional(),
  SUPABASE_ANON_KEY: Joi.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string().optional(),
  SUPABASE_JWT_SECRET: Joi.string().optional(),

  // Rate Limiting
  RATE_LIMIT_CALCULATOR: Joi.number().default(5000),
  RATE_LIMIT_AUTHENTICATED: Joi.number().default(100),

  // Logging
  LOG_LEVEL: Joi.string().optional(),
});
