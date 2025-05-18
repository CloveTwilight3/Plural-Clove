import { 
  Client, 
  TextChannel, 
  WebhookClient, 
  Message, 
  EmbedBuilder
} from 'discord.js';
import { SystemMember } from './models/member';
import { config } from './utils/config';

// Map to store webhooks by channel ID
const webhooks = new Map<string, WebhookClient>();

/**
 * Ensures a webhook exists for the given channel
 * @param client Discord client
 * @param channelId ID of the channel
 * @returns WebhookClient for the channel
 */
export async function ensureWebhook(client: Client, channelId: string): Promise<WebhookClient | null> {
  // Check if we already have a webhook for this channel
  if (webhooks.has(channelId)) {
    return webhooks.get(channelId)!;
  }

  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel || !(channel instanceof TextChannel)) {
      console.error(`Channel ${channelId} is not a text channel`);
      return null;
    }

    // Check if we already have a webhook for this channel on Discord
    const existingWebhooks = await channel.fetchWebhooks();
    const webhook = existingWebhooks.find(wh => 
      wh.owner?.id === client.user?.id && wh.name === 'Plural Proxy'
    );

    if (webhook) {
      // Use existing webhook
      const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token! });
      webhooks.set(channelId, webhookClient);
      return webhookClient;
    } else {
      // Create a new webhook
      const newWebhook = await channel.createWebhook({
        name: 'Plural Proxy',
        avatar: client.user?.displayAvatarURL(),
        reason: 'Used for proxying messages from plural system members'
      });
      
      const webhookClient = new WebhookClient({ id: newWebhook.id, token: newWebhook.token! });
      webhooks.set(channelId, webhookClient);
      return webhookClient;
    }
  } catch (error) {
    console.error('Error creating webhook:', error);
    return null;
  }
}

/**
 * Sends a message as a system member using a webhook
 * @param client Discord client
 * @param message Original message to proxy
 * @param member System member to send as
 * @returns Whether the message was sent successfully
 */
export async function sendAsMember(
  client: Client, 
  message: Message, 
  member: SystemMember
): Promise<boolean> {
  try {
    // Only allow the configured user to use this feature
    if (message.author.id !== config.userId) {
      return false;
    }

    const webhook = await ensureWebhook(client, message.channelId);
    if (!webhook) return false;

    // Prepare webhook message options
    const files = Array.from(message.attachments.values());
    const embeds = [];
    
    // Add member color as embed if it exists
    if (member.color) {
      embeds.push(new EmbedBuilder().setColor(member.color as `#${string}`));
    }

    // Send the message with webhook
    await webhook.send({
      content: message.content,
      avatarURL: member.avatar,
      username: member.displayName || member.name,
      allowedMentions: { parse: ['users', 'roles'] },
      files,
      embeds: embeds.length > 0 ? embeds : undefined
    });
    
    // Delete the original message
    await message.delete().catch(console.error);
    
    return true;
  } catch (error) {
    console.error('Error sending webhook message:', error);
    return false;
  }
}

/**
 * Checks if a message should be proxied based on prefix/suffix
 * @param message Message to check
 * @returns Member to proxy as and content without prefix/suffix, or null if no match
 */
export function shouldProxy(message: Message): { member: SystemMember; content: string } | null {
  // Only process messages from the configured user
  if (message.author.id !== config.userId) return null;

  // Import here to avoid circular dependency
  const { getAllMembers } = require('./models/system');
  const members = getAllMembers();

  // Check each member's prefix/suffix
  for (const member of members) {
    if (member.prefix && member.suffix) {
      // Both prefix and suffix defined
      if (message.content.startsWith(member.prefix) && message.content.endsWith(member.suffix)) {
        const content = message.content.slice(
          member.prefix.length, 
          message.content.length - member.suffix.length
        ).trim();
        return { member, content };
      }
    } else if (member.prefix) {
      // Only prefix defined
      if (message.content.startsWith(member.prefix)) {
        const content = message.content.slice(member.prefix.length).trim();
        return { member, content };
      }
    } else if (member.suffix) {
      // Only suffix defined
      if (message.content.endsWith(member.suffix)) {
        const content = message.content.slice(0, message.content.length - member.suffix.length).trim();
        return { member, content };
      }
    }
  }

  return null;
}