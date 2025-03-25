import { ClientEvent } from "../..";
import type { VoiceState } from "discord.js";

export default class VoiceStateUpdateEvent extends ClientEvent<"voiceStateUpdate"> {
  readonly name = "voiceStateUpdate";

  async run( oldState: VoiceState, newState: VoiceState) {
    /* oldState, newState behave within guilds
    * so within a guild 1 set of \{oldState, newState\} is created
    * but between 2 guilds 2 sets are created
    */

    const currentVoiceChannelId = this.client.distube.getQueue(newState.guild)?.voiceChannel?.id;
    if (!currentVoiceChannelId) return;

    if (oldState.channelId === currentVoiceChannelId) {

    }
    if (newState.channelId === currentVoiceChannelId) {

    }
    // this.client.distube.getQueue(newState.guild)?.voiceChannel
    // TODO: check if its a voice channel we are playing in
    // const queue = this.client.distube.getQueue(newState.guild);
    // if (!queue) return;

    // TODO: check if the queue is playing/paused before attempting to pause/play
    // await this.checkEmpty(newState);
    // await this.checkNotEmpty(oldState, newState);
    // console.log('event activated');
    this.client.customEmitter.emit('emptyChannel', currentVoiceChannelId);
    this.client.customEmitter.emit('firstJoin', currentVoiceChannelId);
  }

  async checkEmpty(newState: VoiceState) {
    if (!newState.channel) return;

    const newChannel = newState.channel;
    const nonBotMemberCount = newChannel.members.filter(member => !member.user.bot).size;

    if (nonBotMemberCount === 0) {
      console.log('pausing...');
      const queue = this.client.distube.getQueue(newState.guild);
      if (!queue) return;
      await queue.pause();
      this.client.leaveTimeout = setTimeout(() => {
        if (queue.voice) {
          queue.voice.leave();
        }
      }, 5 * 60_000);
    }
  }

  async checkNotEmpty(oldState: VoiceState, newState: VoiceState) {
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;
    if (!oldChannel || !newChannel) return;

    const oldMemberCount = oldChannel.members.filter(member => !member.user.bot).size;
    if (oldMemberCount !== 0) return;
    const newMemberCount = newChannel.members.filter(member => !member.user.bot).size;
    if (oldMemberCount === newMemberCount) return;

    const queue = this.client.distube.getQueue(newState.guild);
    if (!queue) return;

    console.log('resuming...');

    queue.resume();
    clearTimeout(this.client.leaveTimeout);
  }
}
