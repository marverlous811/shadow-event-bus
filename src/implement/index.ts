import { EventBusConfig, EventBusType, IEventBus } from '../abstract'
import { LocalEventBus } from './local-bus'

export function eventBusBuild(config: EventBusConfig): IEventBus {
  switch (config.type) {
    case EventBusType.LOCAL:
      return new LocalEventBus()
    default:
      throw new Error('INVALID_BUS_TYPE')
  }
}
