import { ClientEvent } from "../..";
import type { OmitPartialGroupDMChannel, Message } from "discord.js";

export default class MessageCreateEvent extends ClientEvent<"messageCreate"> {
  readonly name = "messageCreate";
  run(_message: OmitPartialGroupDMChannel<Message>) {
  }
}
