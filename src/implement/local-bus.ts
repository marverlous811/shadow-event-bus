import { IEventBus, MsgBusCallback } from '../abstract'
import { makeRandomString } from '../util'

function matchRuleShort(str: string, rule: string): boolean {
  const escapeRegex = (str: string) =>
    str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
  return new RegExp(
    '^' + rule.split('*').map(escapeRegex).join('.*') + '$'
  ).test(str)
}

export class LocalEventBus implements IEventBus {
  private _channels: Map<string, Map<string, MsgBusCallback>>
  constructor() {
    this._channels = new Map()
  }

  public register = (channel: string, callback: MsgBusCallback): string => {
    const listenerId = makeRandomString(10)
    let channelListeners = this._channels.get(channel)
    if (!channelListeners) {
      channelListeners = new Map()
    }
    channelListeners.set(listenerId, callback)
    this._channels.set(channel, channelListeners)
    return listenerId
  }

  public unregister = (channel: string, listenerId: string): void => {
    const channelListeners = this._channels.get(channel)
    if (channelListeners) {
      channelListeners.delete(listenerId)
      if (channelListeners.size === 0) {
        this._channels.delete(channel)
      }
    }
  }

  public publish = <T>(channel: string, data: T): void => {
    const listChannel = [...this._channels.keys()]
    const listChannelMatched = listChannel.filter((c) =>
      matchRuleShort(c, channel)
    )
    // console.log(listChannelMatched)
    listChannelMatched.forEach((c) => {
      const listenerMap = this._channels.get(c)
      if (listenerMap) {
        const listListener = [...listenerMap.values()]
        listListener.forEach((l) => l(data))
      }
    })
  }
}
