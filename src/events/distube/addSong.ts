import { Events } from "distube";
import { EmbedBuilder } from "discord.js";
import { DisTubeEvent, type Metadata } from "../..";
import type { Queue, Song } from "distube";

export default class AddSongEvent extends DisTubeEvent<Events.ADD_SONG> {
  readonly name = Events.ADD_SONG;
  run(_queue: Queue, song: Song<Metadata>) {
    song.metadata.interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xFFB7C5)
          .setTitle("Music Quiz")
          .setAuthor({ name: `Added by ${song.user?.username}`, iconURL: song.user?.avatarURL() ?? undefined })
          .setDescription(song.url ? `Added [\`${song.name}\`](${song.url})` : `Added \`${song.name}\` to the queue`),
      ],
    });
    clearTimeout(this.client.leaveTimeout);
  }
}
