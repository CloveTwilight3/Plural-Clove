import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../../.env') });

// Define the configuration interface
export interface Config {
  userId: string;
  botToken: string;
  clientId: string;
}

// Load and validate configuration
export function loadConfig(): Config {
  const userId = process.env.USER_ID;
  const botToken = process.env.BOT_TOKEN;
  const clientId = process.env.CLIENT_ID;

  // Validate required environment variables
  if (!userId) throw new Error('USER_ID is not defined in .env file');
  if (!botToken) throw new Error('BOT_TOKEN is not defined in .env file');
  if (!clientId) throw new Error('CLIENT_ID is not defined in .env file');

  return {
    userId,
    botToken,
    clientId
  };
}

// Export the config singleton
export const config = loadConfig();