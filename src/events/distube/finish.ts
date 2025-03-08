import { DisTubeEvent } from "../..";
import { EmbedBuilder } from "discord.js";
import { Events, type Queue } from "distube";

export default class FinishEvent extends DisTubeEvent<Events.FINISH> {
  readonly name = Events.FINISH;
  run(queue: Queue) {
    queue.textChannel?.send({
      embeds: [new EmbedBuilder().setColor(0xFFB7C5).setTitle("Music Quiz").setDescription("Finished!")],
    });
    // queue.voice.leave();
  }
}
