import { Command } from "..";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { YouTubePlugin } from "@distube/youtube";

export default class SearchCommand extends Command {
  readonly name = "search";
  readonly slashBuilder = new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search for relevant YouTube videos")
    .addStringOption(opt => opt.setName("input").setDescription("A search query").setRequired(true))
    .addIntegerOption(opt =>
      opt.setName("limit").setDescription("Maximum number of videos displayed").setMinValue(1).setMaxValue(5).setRequired(false),
    );
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    const input = interaction.options.getString("input", true);
    const limit = interaction.options.getInteger("limit", false) || 5;

    await interaction.deferReply();

    const youtubePlugin = this.client.distube.plugins.filter(plugin => plugin instanceof YouTubePlugin)[0];
    const searchResults = await youtubePlugin.search(input, { limit: limit });

    const embeds: Array<EmbedBuilder> = [];

    for (const searchResult of searchResults) {
      const embed = new EmbedBuilder()
        .setColor(0xFFB7C5)
        .setTitle(`${searchResult.name}`)
        .setURL(`${searchResult.url}`)
        .setThumbnail(`${searchResult.thumbnail ?? ''}`)
        .setDescription(`
          \[${searchResult.uploader.name ?? 'Unknown uploader'}\]\(${searchResult.uploader.url}\)\n
          ${searchResult.isLive ? 'Viewers:' : 'Views:'} \`${shortenViewCount(searchResult.views ?? 0)}\`
          ${searchResult.isLive ? '**LIVE**' : `Length: \`${searchResult.formattedDuration}\``}
        `);
      embeds.push(embed);
    };
    await interaction.editReply({ content: "**Search Results:**", embeds: embeds, });
  }
}

function shortenViewCount(views: number): string {
  if (views >= 1_000_000_000) {
    return (views / 1_000_000_000).toFixed(1) + "B";
  } else if (views >= 1_000_000) {
    return (views / 1_000_000).toFixed(1) + "M";
  } else if (views >= 1_000) {
    return (views / 1_000).toFixed(1) + "K";
  } else {
    return views.toString();
  }
}