# Security Policy

## Reporting a Vulnerability

The security of the Clove's Plural Discord Bot is important. If you believe you've found a security vulnerability, please follow these steps:

1. **Do not disclose the vulnerability publicly** until it has been addressed.
2. **Contact the maintainer directly** through Discord or email.
3. **Provide detailed information** about the vulnerability, including:
   - The component affected
   - Steps to reproduce
   - Potential impact
   - Any suggested mitigations (if applicable)

## Scope

This security policy applies to the latest version of Clove's Plural Discord Bot in the main branch of the repository.

### In Scope

- Code vulnerabilities in the bot's codebase
- Configuration issues that may lead to unauthorized access
- Data handling issues related to plural system information

### Out of Scope

- Issues in dependencies or third-party libraries (report these directly to the relevant project)
- Discord API limitations or issues
- Features working as intended, even if they might have security implications when misused

## Response Process

When a security vulnerability is reported:

1. The maintainer will acknowledge receipt of the vulnerability report within 72 hours.
2. The maintainer will work to verify the vulnerability and determine its potential impact.
3. Once verified, the maintainer will develop and test a fix.
4. A security update will be released as soon as practical.

## Data Security Practices

This bot implements the following security practices:

1. **Data Minimization**: The bot only stores information explicitly provided by the authorized user.
2. **Access Control**: The bot is locked to a single Discord user ID, preventing unauthorized usage.
3. **Local Storage**: System data is stored locally and not transmitted to external services.
4. **No Sensitive Storage**: The bot does not store Discord tokens or other sensitive credentials in the repository.

## Responsible Disclosure

We are committed to addressing security issues responsibly. If you report a legitimate security vulnerability:

- We will not take legal action against you or administrative action against your account
- We will work with you to understand and resolve the issue quickly
- We will recognize your contribution if you would like

Thank you for helping keep Clove's Plural Discord Bot and its users safe!