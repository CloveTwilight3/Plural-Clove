import { 
  Client, 
  GatewayIntentBits, 
  Events, 
  REST, 
  Routes,
  Message,
  ActivityType, 
  IntentsBitField
} from 'discord.js';
import { config } from './utils/config';
import { commands } from './commands';
import { shouldProxy, sendAsMember } from './webhooks';
import * as SystemModel from './models/system';

// Define required intents explicitly
const requiredIntents = new IntentsBitField([
  GatewayIntentBits.Guilds,           // Needed for basic guild information
  GatewayIntentBits.GuildMessages,     // Needed to receive messages
  GatewayIntentBits.MessageContent,    // Needed to read message content (PRIVILEGED)
  GatewayIntentBits.GuildWebhooks      // Needed for webhook management
]);

// Create a new client instance
const client = new Client({ intents: requiredIntents });

// Log startup message with intents explanation
console.log('Starting bot with intents:', requiredIntents.toArray());
console.log('IMPORTANT: Make sure MESSAGE CONTENT INTENT is enabled in Discord Developer Portal');
console.log('Go to https://discord.com/developers/applications > Select your app > Bot > Enable Message Content Intent');

// Register slash commands
async function registerCommands() {
  try {
    console.log('Started refreshing application commands...');

    // Convert commands to JSON format - handle different possible types
    const commandsData = commands.map(command => {
      // If data is already in JSON format, return it
      if (!command.data.toJSON) {
        return command.data;
      }
      // Otherwise, convert to JSON
      return command.data.toJSON();
    });

    const rest = new REST().setToken(config.botToken);

    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commandsData }
    );

    console.log('Successfully registered application commands!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

// When the client is ready
client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  
  // Set bot activity
  client.user?.setActivity('with plural systems', { type: ActivityType.Playing });
  
  // Register the commands
  await registerCommands();
  
  // Load the user's system
  SystemModel.loadSystem(config.userId);
});

// Handle command interactions
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // Find the command
  const command = commands.find(cmd => cmd.data.name === interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Error executing command:', error);
    
    const errorMessage = 'There was an error executing this command!';
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
});

// Handle message creation for proxying
client.on(Events.MessageCreate, async (message: Message) => {
  // Ignore bot messages
  if (message.author.bot) return;
  
  // Ignore messages from other users
  if (message.author.id !== config.userId) return;
  
  // Check if the message should be proxied
  const proxy = shouldProxy(message);
  if (proxy) {
    // We have a match! Update the message content and proxy it
    const proxyMessage = { ...message, content: proxy.content };
    
    // Send the message as the system member
    await sendAsMember(client, proxyMessage as Message, proxy.member);
  }
});

// Add error handlers
client.on('error', error => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Start the bot
console.log('Attempting to log in...');
client.login(config.botToken)
  .then(() => {
    console.log('Login successful!');
  })
  .catch(error => {
    console.error('Failed to log in:', error);
    
    if (error.message.includes('disallowed intents')) {
      console.error('==========================================================');
      console.error('ERROR: PRIVILEGED INTENTS NOT ENABLED');
      console.error('You need to enable the "MESSAGE CONTENT INTENT" in the Discord Developer Portal.');
      console.error('Follow these steps:');
      console.error('1. Go to https://discord.com/developers/applications');
      console.error('2. Select your bot application');
      console.error('3. Go to the "Bot" tab in the left sidebar');
      console.error('4. Scroll down to "Privileged Gateway Intents"');
      console.error('5. Enable "MESSAGE CONTENT INTENT"');
      console.error('6. Save your changes');
      console.error('==========================================================');
    }
  });