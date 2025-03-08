import { Command } from "..";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { defaultFilters } from "distube";

export default class FilterCommand extends Command {
  readonly name = "filter";
  override readonly inVoiceChannel = true;
  override readonly playing = true;
  readonly slashBuilder = new SlashCommandBuilder()
    .setName("filter")
    .setDescription("Set the filter")
    .addStringOption(option =>
      option
        .setName("filter")
        .setDescription("The filter to set")
        .setRequired(true)
        .addChoices(...Object.keys(defaultFilters).map(k => ({ name: k, value: k }))),
    );
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    const filter = interaction.options.getString("filter", true);
    const filters = this.distube.getQueue(interaction)!.filters;
    if (filters.has(filter)) filters.remove(filter);
    else filters.add(filter);
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setTitle("DisTube")
          .setDescription(`Current filter: \`${filters.names.join(", ") || "Off"}\``),
      ],
    });
  }
}
