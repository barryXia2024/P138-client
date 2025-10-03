import {TopicHandler} from './types';

class Dispatcher {
  private handlers = new Map<
    string,
    {handler: TopicHandler; logKey?: string}
  >();

  register(topic: string, handler: TopicHandler, logKey?: string) {
    this.handlers.set(topic, {handler, logKey});
  }

  unregister(topic: string) {
    this.handlers.delete(topic);
  }

  dispatch(topic: string, raw: string) {
    const h = this.handlers.get(topic);
    if (!h) return;
    try {
      const data = JSON.parse(raw);
      h.handler(topic, data, {logKey: h.logKey});
    } catch {
      h.handler(topic, raw, {logKey: h.logKey});
    }
  }

  getTopics() {
    return Array.from(this.handlers.keys());
  }
}

export const dispatcher = new Dispatcher();
