import { DisTubeEvent } from "../..";
import { Events, type Queue } from "distube";

export default class FinishEvent extends DisTubeEvent<Events.FINISH> {
  readonly name = Events.FINISH;

  run(queue: Queue) {
    queue.textChannel?.send("**Queue finished!**");

    this.client.leaveTimeout = setTimeout(() => {
      if (queue.voice) {
        queue.voice.leave();
        queue.textChannel?.send("Leaving voice channel due to inactivity.");
      }
    }, 30 * 60_000);
  }
}
