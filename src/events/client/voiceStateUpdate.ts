import { ClientEvent } from "../..";
import type { VoiceState } from "discord.js";

export default class VoiceStateUpdateEvent extends ClientEvent<"voiceStateUpdate"> {
  readonly name = "voiceStateUpdate";

  async run(oldState: VoiceState, newState: VoiceState) {
    /* oldState, newState behave within guilds
    * so within a guild 1 set of \{oldState, newState\} is created
    * but between 2 guilds 2 sets are created
    */

    const currentVoiceChannelId = this.client.distube.getQueue(newState.guild)?.voiceChannel?.id;
    if (!currentVoiceChannelId) return;

    // Get the voice channel the bot is currently in
    const voiceChannel = this.client.distube.getQueue(newState.guild)?.voiceChannel;
    if (!voiceChannel) return;

    // Count non-bot users in the channel
    const nonBotMemberCount = voiceChannel.members.filter(member => !member.user.bot).size;

    // Check if a user left the channel
    if (oldState.channelId === currentVoiceChannelId && newState.channelId !== currentVoiceChannelId) {
      // If this was the last non-bot user leaving, emit emptyChannel event
      if (nonBotMemberCount === 0) {
        this.client.customEmitter.emit('emptyChannel', currentVoiceChannelId);
      }
    }

    // Check if a user joined the channel
    if (oldState.channelId !== currentVoiceChannelId && newState.channelId === currentVoiceChannelId) {
      // If this was the first non-bot user joining, emit firstJoin event
      if (nonBotMemberCount === 1) {
        this.client.customEmitter.emit('firstJoin', currentVoiceChannelId);
      }
    }
  }
}
