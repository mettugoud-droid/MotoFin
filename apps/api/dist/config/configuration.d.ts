export declare const configuration: () => {
    app: {
        nodeEnv: string;
        port: number;
        baseUrl: string;
        webUrl: string;
        corsOrigins: string;
    };
    database: {
        url: string | undefined;
    };
    redis: {
        host: string;
        port: number;
    };
    supabase: {
        url: string | undefined;
        anonKey: string | undefined;
        serviceRoleKey: string | undefined;
        jwtSecret: string | undefined;
    };
    rateLimit: {
        calculator: number;
        authenticated: number;
    };
};
//# sourceMappingURL=configuration.d.ts.map