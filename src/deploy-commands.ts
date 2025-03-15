import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

async function registerCommands() {
  try {
    const commands = [];
    const commandFiles = readdirSync(join(__dirname, 'commands'));
    
    for (const file of commandFiles) {
      const CMD = await import(`./commands/${file}`);
      const command = new CMD.default({} as any);
      commands.push(command.slashBuilder.toJSON());
      console.log(`Added command: ${command.name} for registration.`);
    }

    const rest = new REST({ version: '10' }).setToken(TOKEN!);
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(CLIENT_ID!),
      { body: commands }
    );

    console.log('Successfully registered application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

registerCommands();