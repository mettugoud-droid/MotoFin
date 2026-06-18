"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
const configuration = () => ({
    app: {
        nodeEnv: process.env.NODE_ENV || 'development',
        port: parseInt(process.env.API_PORT || '3001', 10),
        baseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
        webUrl: process.env.WEB_URL || 'http://localhost:3000',
        corsOrigins: process.env.CORS_ORIGINS || 'http://localhost:3000',
    },
    database: {
        url: process.env.DATABASE_URL,
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    supabase: {
        url: process.env.SUPABASE_URL,
        anonKey: process.env.SUPABASE_ANON_KEY,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        jwtSecret: process.env.SUPABASE_JWT_SECRET,
    },
    rateLimit: {
        calculator: parseInt(process.env.RATE_LIMIT_CALCULATOR || '5000', 10),
        authenticated: parseInt(process.env.RATE_LIMIT_AUTHENTICATED || '100', 10),
    },
});
exports.configuration = configuration;
//# sourceMappingURL=configuration.js.map