import { 
  SlashCommandBuilder, 
  CommandInteraction,
  Client,
  EmbedBuilder,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  SlashCommandSubcommandBuilder
} from 'discord.js';
import { config } from '../utils/config';
import * as SystemModel from '../models/system';
import { SystemMember } from '../models/member';

// Interface for command structure
export interface Command {
  data: any; // Using 'any' to bypass TypeScript's strict type checking for Discord.js commands
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

// Create system command
export const createSystem: Command = {
  data: new SlashCommandBuilder()
    .setName('createsystem')
    .setDescription('Create a new plural system')
    .addStringOption(option => 
      option.setName('name')
        .setDescription('Name of your system')
        .setRequired(true)
    )
    .addStringOption(option => 
      option.setName('description')
        .setDescription('Description of your system')
        .setRequired(false)
    )
    .addStringOption(option => 
      option.setName('tag')
        .setDescription('Tag to append to member names')
        .setRequired(false)
    )
    .addStringOption(option => 
      option.setName('avatar')
        .setDescription('URL of system avatar')
        .setRequired(false)
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    // Only the configured user can use this command
    if (interaction.user.id !== config.userId) {
      await interaction.reply({ content: 'You are not authorized to use this bot.', ephemeral: true });
      return;
    }

    const name = interaction.options.getString('name')!;
    const description = interaction.options.getString('description') || undefined;
    const tag = interaction.options.getString('tag') || undefined;
    const avatar = interaction.options.getString('avatar') || undefined;

    // Check if system already exists
    const existingSystem = SystemModel.getSystem();
    if (existingSystem) {
      await interaction.reply({ 
        content: 'You already have a system. Use `/updatesystem` to update it.',
        ephemeral: true 
      });
      return;
    }

    // Create the system
    const system = SystemModel.createSystem({
      name,
      description,
      tag,
      avatar,
      ownerId: interaction.user.id
    });

    SystemModel.saveSystem();

    await interaction.reply({ 
      content: `System "${system.name}" created successfully!`,
      ephemeral: true 
    });
  }
};

// Add member command
export const addMember: Command = {
  data: new SlashCommandBuilder()
    .setName('addmember')
    .setDescription('Add a new member to your system')
    .addStringOption(option => 
      option.setName('name')
        .setDescription('Name of the member')
        .setRequired(true)
    )
    .addStringOption(option => 
      option.setName('displayname')
        .setDescription('Display name of the member (defaults to name)')
        .setRequired(false)
    )
    .addStringOption(option => 
      option.setName('pronouns')
        .setDescription('Pronouns of the member')
        .setRequired(false)
    )
    .addStringOption(option => 
      option.setName('avatar')
        .setDescription('Avatar URL for the member')
        .setRequired(false)
    )
    .addStringOption(option => 
      option.setName('color')
        .setDescription('Color for the member (hex code)')
        .setRequired(false)
    )
    .addStringOption(option => 
      option.setName('description')
        .setDescription('Description/bio of the member')
        .setRequired(false)
    )
    .addStringOption(option => 
      option.setName('prefix')
        .setDescription('Message prefix for auto-proxying')
        .setRequired(false)
    )
    .addStringOption(option => 
      option.setName('suffix')
        .setDescription('Message suffix for auto-proxying')
        .setRequired(false)
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    // Only the configured user can use this command
    if (interaction.user.id !== config.userId) {
      await interaction.reply({ content: 'You are not authorized to use this bot.', ephemeral: true });
      return;
    }

    // Check if system exists
    const system = SystemModel.getSystem();
    if (!system) {
      await interaction.reply({ 
        content: 'You need to create a system first with `/createsystem`.',
        ephemeral: true 
      });
      return;
    }

    const name = interaction.options.getString('name')!;
    const displayName = interaction.options.getString('displayname') || undefined;
    const pronouns = interaction.options.getString('pronouns') || undefined;
    const avatar = interaction.options.getString('avatar') || undefined;
    const color = interaction.options.getString('color') || undefined;
    const description = interaction.options.getString('description') || undefined;
    const prefix = interaction.options.getString('prefix') || undefined;
    const suffix = interaction.options.getString('suffix') || undefined;

    // Create the member
    const member: SystemMember = {
      id: Math.random().toString(36).substring(2, 15),
      name,
      displayName,
      pronouns,
      avatar,
      color,
      description,
      prefix,
      suffix,
      created: new Date()
    };

    SystemModel.addMember(member);
    SystemModel.saveSystem();

    const embed = new EmbedBuilder()
      .setTitle(`Member Added: ${member.name}`)
      .setDescription(`Member has been added to your system.`)
      .addFields(
        { name: 'ID', value: member.id },
        { name: 'Name', value: member.name }
      );

    if (member.displayName) embed.addFields({ name: 'Display Name', value: member.displayName });
    if (member.pronouns) embed.addFields({ name: 'Pronouns', value: member.pronouns });
    if (member.description) embed.addFields({ name: 'Description', value: member.description });
    if (member.prefix) embed.addFields({ name: 'Prefix', value: `\`${member.prefix}\`` });
    if (member.suffix) embed.addFields({ name: 'Suffix', value: `\`${member.suffix}\`` });
    
    if (member.color) embed.setColor(member.color as `#${string}`);
    if (member.avatar) embed.setThumbnail(member.avatar);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

// List members command
export const listMembers: Command = {
  data: new SlashCommandBuilder()
    .setName('members')
    .setDescription('List all members in your system'),
  execute: async (interaction: ChatInputCommandInteraction) => {
    // Only the configured user can use this command
    if (interaction.user.id !== config.userId) {
      await interaction.reply({ content: 'You are not authorized to use this bot.', ephemeral: true });
      return;
    }

    // Check if system exists
    const system = SystemModel.getSystem();
    if (!system) {
      await interaction.reply({ 
        content: 'You need to create a system first with `/createsystem`.',
        ephemeral: true 
      });
      return;
    }

    const members = SystemModel.getAllMembers();
    if (members.length === 0) {
      await interaction.reply({ 
        content: 'Your system has no members yet. Add some with `/addmember`.',
        ephemeral: true 
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`${system.name}'s Members`)
      .setDescription(`Total members: ${members.length}`);

    if (system.avatar) embed.setThumbnail(system.avatar);

    // Add member info to embed
    members.forEach(member => {
      const proxying = [];
      if (member.prefix) proxying.push(`Prefix: \`${member.prefix}\``);
      if (member.suffix) proxying.push(`Suffix: \`${member.suffix}\``);
      
      embed.addFields({
        name: member.name,
        value: [
          member.displayName ? `Display Name: ${member.displayName}` : '',
          member.pronouns ? `Pronouns: ${member.pronouns}` : '',
          proxying.length > 0 ? proxying.join(' | ') : '',
          `ID: ${member.id}`
        ].filter(Boolean).join('\n') || 'No additional information'
      });
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

// Delete member command
export const deleteMember: Command = {
  data: new SlashCommandBuilder()
    .setName('deletemember')
    .setDescription('Delete a member from your system')
    .addStringOption(option => 
      option.setName('id')
        .setDescription('ID of the member to delete')
        .setRequired(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    // Only the configured user can use this command
    if (interaction.user.id !== config.userId) {
      await interaction.reply({ content: 'You are not authorized to use this bot.', ephemeral: true });
      return;
    }

    // Check if system exists
    const system = SystemModel.getSystem();
    if (!system) {
      await interaction.reply({ 
        content: 'You need to create a system first with `/createsystem`.',
        ephemeral: true 
      });
      return;
    }

    const id = interaction.options.getString('id')!;
    const member = SystemModel.getMember(id);
    
    if (!member) {
      await interaction.reply({ 
        content: `No member found with ID: ${id}`,
        ephemeral: true 
      });
      return;
    }

    SystemModel.deleteMember(id);
    SystemModel.saveSystem();

    await interaction.reply({ 
      content: `Member "${member.name}" deleted successfully.`,
      ephemeral: true 
    });
  }
};

// Switch command (for informational purposes only)
export const switchMember: Command = {
  data: new SlashCommandBuilder()
    .setName('switch')
    .setDescription('Record a switch to a different member')
    .addStringOption(option => 
      option.setName('id')
        .setDescription('ID of the member who is fronting')
        .setRequired(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    // Only the configured user can use this command
    if (interaction.user.id !== config.userId) {
      await interaction.reply({ content: 'You are not authorized to use this bot.', ephemeral: true });
      return;
    }

    // Check if system exists
    const system = SystemModel.getSystem();
    if (!system) {
      await interaction.reply({ 
        content: 'You need to create a system first with `/createsystem`.',
        ephemeral: true 
      });
      return;
    }

    const id = interaction.options.getString('id')!;
    const member = SystemModel.getMember(id);
    
    if (!member) {
      await interaction.reply({ 
        content: `No member found with ID: ${id}`,
        ephemeral: true 
      });
      return;
    }

    // This is just informational - in a real implementation, you might
    // want to keep track of switches and fronting history
    await interaction.reply({ 
      content: `Recorded switch: ${member.name} is now fronting.`,
      ephemeral: true 
    });
  }
};

// Export all commands
export const commands = [
  createSystem,
  addMember,
  listMembers,
  deleteMember,
  switchMember
];