import { DisTubeEvent } from "../..";
// import { EmbedBuilder } from "discord.js";
import { Events, type Queue } from "distube";

export default class FinishEvent extends DisTubeEvent<Events.FINISH> {
  readonly name = Events.FINISH;
  private leaveTimeout?: NodeJS.Timeout;

  run(queue: Queue) {
    queue.textChannel?.send("**Queue finished!**");

    this.leaveTimeout = setTimeout(() => {
      if (queue.voice) {
        queue.voice.leave();
        queue.textChannel?.send("**Leaving voice channel due to inactivity.**");
      }
    }, ( 5 * 60 * 1000 ));

    this.distube.on(Events.ADD_SONG, () => {
      clearTimeout(this.leaveTimeout);
      console.log('reset timeout');
    });
    
    // queue.textChannel?.send({
    //   embeds: [new EmbedBuilder().setColor(0xFFB7C5).setTitle("Music Quiz").setDescription("Finished!")],
    // });
    // queue.voice.leave();
  }
}
