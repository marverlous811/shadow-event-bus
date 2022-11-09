export enum EventBusType {
  LOCAL = 0,
}

export type EventBusConfig = {
  type: EventBusType
}

export type MsgBusCallback = <T>(data: T) => void

export interface IEventBus {
  register(channel: string, callback: MsgBusCallback): string
  unregister(channel: string, listenerId: string): void
  publish<T>(channel: string, data: T): void
}
