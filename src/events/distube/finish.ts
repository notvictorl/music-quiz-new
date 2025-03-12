import { DisTubeEvent } from "../..";
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
    }, 10 * 60 * 1000);

    this.distube.on(Events.ADD_SONG, () => {
      clearTimeout(this.leaveTimeout);
    });
  }
}
