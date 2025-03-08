import { Events } from "distube";
import { DisTubeEvent } from "../..";

export default class FFmpegDebugEvent extends DisTubeEvent<Events.FFMPEG_DEBUG> {
  readonly name = Events.FFMPEG_DEBUG;
  run(message: string) {
    console.log(message);
  }
}
