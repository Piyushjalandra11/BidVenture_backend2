import 'dotenv/config';
import * as z from 'zod';

const configSchema = z
  .object({
    PORT: z.preprocess(Number, z.number()).default(8080).readonly(),
    NODE_ENV: z
      .enum(['DEVELOPMENT', 'PRODUCTION', 'STAGING'])
      .default('DEVELOPMENT')
      .readonly(),
    ALLOWED_ORIGINS: z.string().default('*'),
    MAIL_HOST: z.string().optional(),
    MAIL_PORT: z.preprocess(Number, z.number()).optional(),
    MAIL_USERNAME: z.string().optional(),
    MAIL_PASSWORD: z.string().optional(),
    MAIL_FROM: z.string().optional(),
    MAIL_DISPLAY_NAME: z.string().optional(),

    DB_NAME: z.string().optional(),
    DB_USER: z.string().optional(),
    DB_PASSWORD: z.string().optional(),
    DB_HOST: z.string().optional(),
    DB_PORT: z.string().optional(),

// for product images used cloudnary key
    CLOUD_NAME: z.string().optional(),
    API_KEY: z.string().optional(),
    API_SECRET: z.string().optional(),
    JWT_SECRET: z.string().optional()
  })
  .readonly();

export type TConfig = z.infer<typeof configSchema>;

export const config = configSchema.parse(process.env);
