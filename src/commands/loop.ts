import { Command } from "..";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { RepeatMode } from "distube";

export default class LoopCommand extends Command {
  readonly name = "loop";
  override readonly inVoiceChannel = true;
  override readonly playing = true;
  readonly slashBuilder = new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Toggle loop mode")
    .addStringOption(option =>
      option
        .setName("mode")
        .setDescription("The repeat mode to set")
        .setRequired(true)
        .addChoices(
          { name: "off", value: RepeatMode.DISABLED.toString() },
          { name: "song", value: RepeatMode.SONG.toString() },
          { name: "queue", value: RepeatMode.QUEUE.toString() },
        )
    );

  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    const modeString = interaction.options.getString("mode", true);
    const mode = parseInt(modeString);
    
    const result = this.distube.setRepeatMode(interaction.guildId, mode);
    
    const modeNames = {
      [RepeatMode.DISABLED]: "Off",
      [RepeatMode.SONG]: "Song",
      [RepeatMode.QUEUE]: "Queue"
    };
    
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xFFB7C5)
          .setTitle("Music Quiz")
          .setDescription(`Loop Mode: \`${modeNames[result] || result}\``),
      ],
    });
  }
}