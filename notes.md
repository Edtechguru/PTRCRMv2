# Project Notes

Use this file to track thoughts, ideas, and temporary information for the **PTRCRM** project.

## Current Focus

- Campaign Builder CRUD
- Promotions Builder
- QR Code Generator

## Implementation Ideas

- [ ] Add "Pin Eligibility" markers to customer profiles for the future **PTRPins** integration.
- [ ] Explore automated email notifications for new promotions.

## Temporary Sandbox

- (Add your draft content here...)

## PTRPins Integration notes NOT IN ptrcrm

Your workspace is now fully documented and "prepped" for the PTRPins project.

Summary of Results

PROJECT_MANIFEST.md
: Documents the vision for PTRPins (collectibles, community trading) and the technical roadmap for the PTRCRM project to ensure a smooth transition later.

SETUP_GUIDE.md
: A permanent technical reference for your Claude Code + OpenRouter setup, including model and environment configuration.
settings.json: Verified as correctly configured with mistralai/devstral-small and the sonnet[1m] profile.
How to Resume Later
Reference this ID: Mention conversation ID 020deaac-965c-4659-a8fa-b98e6d356407 in your next session.
Verify CRM Pre-reqs: Refer to the Manifest to ensure your CRM is ready for the "Pins" integration.
You can now safely pivot back to your PTRCRM work. I’m ready when you are!

## Discord Bot Integration Plan

To capture new community members automatically, we will set up a Discord Bot.

### Requirements

1. **Discord Developer Portal**: Create a new application and a Bot.
2. **Privileged Portal Intents**: Enable the **Server Members Intent** in the Bot settings (required to detect new joins).
3. **Environment Variables**:
   - `DISCORD_BOT_TOKEN`: The private token for your bot.
   - `DISCORD_GUILD_ID`: The unique ID of your Discord server.
4. **Invite Permissions**: The bot needs to be invited with the `View Channels` and `Members` scope.

### Integration Logic

- **Event**: `guildMemberAdd` (Guild Member joins the server)
- **Action**: Insert a new record into the `customers` table with:
  - `name`: Discord Username
  - `channel`: "Discord"
  - `tags`: `["Discord Join", "Potential Customer"]`
  - `notes`: Discord User ID (for cross-platform tracking).

Once you have the credentials, we can implement `server/src/discordBot.js` and update the frontend dashboard to display this new lead source.
