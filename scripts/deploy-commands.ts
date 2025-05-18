// This script deploys slash commands to Discord
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { commands } from '../src/commands';
import { config } from '../src/utils/config';

const rest = new REST({ version: '10' }).setToken(config.botToken);

(async () => {
  try {
    console.log('Started refreshing application (/) commands...');

    // Convert commands to JSON format - handle different possible types
    const commandsData = commands.map(command => {
      // If data is already in JSON format, return it
      if (!command.data.toJSON) {
        return command.data;
      }
      // Otherwise, convert to JSON
      return command.data.toJSON();
    });

    // Deploy commands
    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commandsData }
    );

    console.log('Successfully registered application (/) commands!');
  } catch (error) {
    console.error('Error deploying commands:', error);
  }
})();