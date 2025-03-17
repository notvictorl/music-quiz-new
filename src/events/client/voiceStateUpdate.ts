import { ClientEvent } from "../..";
import type { VoiceState/*, VoiceBasedChannel*/ } from "discord.js";

export default class VoiceStateUpdateEvent extends ClientEvent<"voiceStateUpdate"> {
  readonly name = "voiceStateUpdate";
  // private leaveTimeout?: NodeJS.Timeout;

  async run(oldState: VoiceState, newState: VoiceState) {
    await this.checkEmpty(oldState, newState);
  }

  async checkEmpty(oldState: VoiceState, newState: VoiceState) {
    oldState;
    newState;
  }
}
