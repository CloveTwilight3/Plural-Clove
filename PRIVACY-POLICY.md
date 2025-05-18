# Privacy Policy

## Introduction

This Privacy Policy explains how Clove's Plural Discord Bot ("the Bot", "we", "us", or "our") collects, uses, and protects information when you use our Discord bot service. We are committed to ensuring the privacy and security of your data.

## Information We Collect

### 1. User-Provided Information

The Bot collects and stores:

- **Plural System Data**: Information about your plural system, including system name, description, and optional avatar URL.
- **Member Data**: Information about system members, including names, pronouns, descriptions, avatar URLs, colors, and proxy settings (prefixes/suffixes).
- **Discord User ID**: The authorized user's Discord ID to enforce access restrictions.

### 2. Automatically Collected Information

- **Message Content**: The Bot temporarily processes message content to check for proxy prefixes/suffixes. This content is not permanently stored except during the proxying process.
- **Channel Information**: The Bot accesses channel IDs to create and manage webhooks for message proxying.

## How We Use Information

The information we collect is used solely for the following purposes:

1. **Providing Bot Functionality**: To enable the creation and management of plural system members and facilitate message proxying.
2. **Access Control**: To ensure only the authorized user can interact with the Bot.
3. **Webhook Management**: To create and maintain Discord webhooks for message proxying.

## Data Storage

### Local Storage

- All system and member data is stored locally in the `data` directory on the machine where the Bot is hosted.
- Data is stored in JSON format.
- No data is transmitted to external servers beyond what is necessary for Discord API communication.

### Data Retention

- System and member data is retained until manually deleted by the authorized user.
- Message content is processed in memory and is not permanently stored by the Bot.

## Data Sharing

We do not sell, trade, or otherwise transfer your information to third parties. Information is only shared with Discord as necessary for the Bot's core functionality:

- **Discord API**: The Bot interacts with Discord's API to create webhooks and send messages.
- **Webhooks**: Messages are sent through Discord webhooks, which display the member's name and avatar.

## User Control and Rights

As the sole authorized user of the Bot, you have the following rights:

1. **Access**: You can view all stored data using the Bot's commands (e.g., `/members`).
2. **Correction**: You can update any information about your system or members using the Bot's commands.
3. **Deletion**: You can delete members or entire systems using the Bot's commands.
4. **Data Portability**: The data is stored in standard JSON format for easy portability.

## Data Security

We implement appropriate technical measures to protect your information:

- The Bot is locked to a single user ID, preventing unauthorized access to commands.
- Data is stored locally, minimizing exposure to external threats.
- No sensitive authentication details are stored in code repositories.

## Children's Privacy

The Bot is not intended for use by individuals under the minimum age required to use Discord (13 in most countries, 16 in others). We do not knowingly collect personal information from children.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date at the top of this policy. Your continued use of the Bot after such modifications constitutes your acknowledgment of the modified policy.

## Contact Us

If you have any questions about this Privacy Policy, please contact us through Discord or via the repository's issues section.

---

Last updated: May 18, 2025