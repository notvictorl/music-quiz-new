import { Command } from "..";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export default class SeekCommand extends Command {
  readonly name = "seek";
  override readonly inVoiceChannel = true;
  override readonly playing = true;
  readonly slashBuilder = new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Seek the current song")
    .addNumberOption(option =>
      option.setName("time").setDescription("The time to seek (in seconds)").setMinValue(0).setRequired(true),
    );
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    const time = interaction.options.getNumber("time", true);
    this.distube.seek(interaction, time);
    await interaction.reply({
      embeds: [
        new EmbedBuilder().setColor("Blurple").setTitle("DisTube").setDescription(`Seeked to \`${time}\` seconds`),
      ],
    });
  }
}
