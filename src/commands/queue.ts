import { Command } from "..";
import { RepeatMode } from "distube";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export default class QueueCommand extends Command {
  readonly name = "queue";
  override readonly inVoiceChannel = true;
  override readonly playing = true;
  readonly slashBuilder = new SlashCommandBuilder().setName("queue").setDescription("Show the current queue status");
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    const queue = this.distube.getQueue(interaction);
    if (!queue) return; // Handled by playing property
    const song = queue.songs[0];
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xFFB7C5)
          .setTitle("Music Quiz")
          .setThumbnail(song.thumbnail ?? '')
          .setDescription(
            [
              `**Current:** \`${song.name || song.url}\` - \`${queue.formattedCurrentTime}\`/\`${
                song.stream.playFromSource ? song.formattedDuration : song.stream.song?.formattedDuration
              }\`\n`,
              `**Up next**\n${
                queue.songs
                  .slice(1, 10)
                  .map((song, i) => `**${i + 1}.** \[${song.formattedDuration}\] \`${song.name || song.url}\``)
                  .join("\n") || "None"
              }`,
              `-# ${
                queue.songs.length > 10 ? `and ${queue.songs.length - 10} more...` : ''
              }`,
            ].join("\n"),
          )
          .addFields(
            {
              name: "Volume",
              value: `${queue.volume}%`,
              inline: true,
            },
            {
              name: "Autoplay",
              value: `${queue.autoplay ? "On" : "Off"}`,
              inline: true,
            },
            {
              name: "Loop",
              value: `${
                queue.repeatMode === RepeatMode.QUEUE ? "Queue" : queue.repeatMode === RepeatMode.SONG ? "Song" : "Off"
              }`,
              inline: true,
            },
            {
              name: "Filters",
              value: `${queue.filters.names.join(", ") || "Off"}`,
              inline: false,
            },
          ),
      ],
    });
  }
}
