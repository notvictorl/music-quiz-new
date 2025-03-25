import { CustomEvent } from "../..";

export default class EmptyChannelEvent extends CustomEvent<"emptyChannel"> {
  readonly name = "emptyChannel";
  run(_channelId: string) {

  }
}
