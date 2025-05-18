# Clove's Plural Discord Bot

This repo is based off the popular Discord Bot "PluralKit", created in TypeScript, and locked to my personal use, created for use with Brooke's Vipers Discord server.

## Prerequisites

- Node.js v16.9.0 or higher
- A Discord Bot Token
- Access to the Discord Developer Portal

## Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd cloves-plural-discord-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # Copy the .env.example file
   cp .env.example .env
   
   # Edit the .env file with your Discord information
   nano .env
   ```

4. **Enable Required Privileged Intents:**
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications)
   - Select your application
   - Go to the "Bot" tab in the left sidebar
   - Scroll down to the "Privileged Gateway Intents" section
   - Enable "MESSAGE CONTENT INTENT"
   - Save your changes

5. **Build and start the bot:**
   ```bash
   # Build the TypeScript code
   npm run build
   
   # Start the bot
   npm start
   ```

## Command Usage

The bot includes the following slash commands:

1. **Create your system:**
   ```
   /createsystem name:Your System Name description:Optional system description
   ```

2. **Add members to your system:**
   ```
   /addmember name:Member Name displayname:Display Name pronouns:they/them avatar:URL prefix:{ suffix:}
   ```

3. **List all members in your system:**
   ```
   /members
   ```

4. **Delete a member:**
   ```
   /deletemember id:member-id
   ```

5. **Record a switch:**
   ```
   /switch id:member-id
   ```

## Auto-Proxying Messages

After setting up members with prefixes and/or suffixes, you can send messages as them by using the configured prefix/suffix:

- If a member has prefix `{` and suffix `}`, typing `{Hello!}` will send "Hello!" as that member
- If a member only has prefix `J:`, typing `J: Hello everyone` will send "Hello everyone" as that member
- If a member only has suffix `~S`, typing `How's it going?~S` will send "How's it going?" as that member

## Troubleshooting

### "Used disallowed intents" Error

If you see an error about "disallowed intents", you need to enable the necessary privileged intents:

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your bot application
3. Go to the "Bot" tab in the left sidebar
4. Scroll down to the "Privileged Gateway Intents" section
5. Enable the "MESSAGE CONTENT INTENT"
6. Save your changes

### Other Common Issues

- **Bot not responding to commands:** Make sure you've invited the bot to your server with the `applications.commands` scope
- **Webhook errors:** Ensure the bot has the "Manage Webhooks" permission in the channels where you want to use proxying
- **Storage issues:** Check if the `data` directory exists and is writable

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.