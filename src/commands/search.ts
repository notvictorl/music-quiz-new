import { Command /*, followUp */ } from "..";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Metadata } from "..";
import type { ChatInputCommandInteraction } from "discord.js";
import { YouTubePlugin } from "@distube/youtube";

export default class SearchCommand extends Command {
  readonly name = "search";
  readonly slashBuilder = new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search for relevant YouTube videos")
    .addStringOption(opt => opt.setName("input").setDescription("A search query").setRequired(true))
    .addIntegerOption(opt =>
      opt.setName("limit").setDescription("Maximum number of videos displayed").setMinValue(1).setMaxValue(10).setRequired(false),
    );
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    const input = interaction.options.getString("input", true);
    const limit = interaction.options.getInteger("limit", false) || 5;
    const vc = interaction.member?.voice?.channel;

    await interaction.deferReply();

    const youtubePlugin = this.client.distube.plugins.filter(plugin => plugin instanceof YouTubePlugin)[0];
    const searchResults = await youtubePlugin.search(input, { limit: limit });

    const embeds: Array<EmbedBuilder> = [];
    const buttons = new ActionRowBuilder<ButtonBuilder>();

    let index = 1;
    for (const searchResult of searchResults) {
      const embed = new EmbedBuilder()
        .setColor(0xFFB7C5)
        .setTitle(`${searchResult.name}`)
        .setURL(`${searchResult.url}`)
        .setThumbnail(`${searchResult.thumbnail ?? ''}`)
        .addFields(
          { name: searchResult.isLive ? '**LIVE**' : 'Duration', value: searchResult.isLive ? '' : searchResult.formattedDuration, inline: true },
          { name: searchResult.isLive ? 'Viewers' : 'Views:', value: shortenViewCount(searchResult.views ?? 0), inline: true },
        )
        .setDescription(`\[${searchResult.uploader.name ?? 'Unknown uploader'}\]\(${searchResult.uploader.url}\))`);
      embeds.push(embed);
      if (!vc) continue;
      const button = new ButtonBuilder()
        .setCustomId(searchResult.id)
        .setLabel(index.toString())  
        .setStyle(ButtonStyle.Primary);
      buttons.addComponents(button);
      index++;
    };
    
    
    if (!vc) {
      await interaction.editReply({ content: "**Search Results:**", embeds: embeds });
      return;
    }

    try {
      const message = await interaction.editReply({ 
        content: "**Search Results:** (Click a button to play)",
        embeds: embeds, 
        components: [buttons] 
      });
      
      const collector = message.createMessageComponentCollector({ time: 60_000 });
      
      collector.on('collect', async (buttonInteraction) => {
        await buttonInteraction.deferUpdate();
        
        collector.stop();

        interaction.editReply({ content: '', embeds: embeds, components: [] });
        
        this.client.distube.play<Metadata>(
          vc, 
          `https://www.youtube.com/watch?v=${buttonInteraction.customId}`, 
          {
            textChannel: buttonInteraction.channel ?? undefined,
            member: buttonInteraction.member,
            metadata: { interaction },
          }
        ).catch(e => {
          console.error(e);
          interaction.channel?.send({
            embeds: [
              new EmbedBuilder()
                .setColor(0xFFB7C5)
                .setTitle("Music Quiz")
                .setDescription(`Error: \`${e.message}\``)
            ],
            components: []
          });
        });
        
      });
      
      collector.on('end', async (collected, reason) => {
        if (reason === 'time' && collected.size === 0) {
          await interaction.editReply({
            content: "**Search Results:**",
            embeds: embeds,
            components: []
          });
        }
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ 
        content: "**An error occurred while displaying search results**",
        embeds: embeds,
        components: [] 
      });
    }
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