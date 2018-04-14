export class Event {
  public events: any

  constructor() {
    this.events = {}
  }

  public eventOn = (name, callback) => {
    if (!this.events[name]) {
      this.events[name] = []
    }

    this.events[name].push({
      name,
      callback,
    })
  }

  public eventTrigger = (name, data) => {
    console.log(name, data)
    if (!this.events[name]) {
      return false
    }

    const subscribe = this.events[name]
    subscribe.forEach(q => {
      q.callback.call(this, data)
    })
  }
}
