import { Events } from "distube";
import { EmbedBuilder } from "discord.js";
import { DisTubeEvent, type Metadata, followUp } from "../..";
import type { Queue, Song } from "distube";

export default class PlaySongEvent extends DisTubeEvent<Events.PLAY_SONG> {
  readonly name = Events.PLAY_SONG;
  run(queue: Queue, song: Song<Metadata>) {
    followUp(
      song.metadata.interaction,
      "**Playing now:**",
      new EmbedBuilder()
      .setColor(0xFFB7C5)
      .setTitle(`${song.name}`)
      .setURL(`${song.url}`)
      .setDescription(`${song.uploader.name ?? 'Unknown Uploader'}`)
      .setImage(`${song.thumbnail ?? ''}`)
      .setFooter({
        text: `Requested by ${song.user?.displayName}`,
        iconURL: song.user?.displayAvatarURL({ size: 128 }),
      }),
      queue.textChannel!,
    ).catch(console.error);
  }
}
