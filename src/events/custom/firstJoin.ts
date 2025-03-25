import { CustomEvent } from "../..";

export default class FirstJoinEvent extends CustomEvent<"firstJoin"> {
  readonly name = "firstJoin";
  run(_channelId: string) {

  }
}
