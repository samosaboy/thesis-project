export class Event {
  public events: any
  private id: number

  constructor() {
    this.events = {}
    this.id = -1
  }

  public on = (name, callback) => {
    if (!this.events[name]) {
      this.events[name] = []
    }

    const id = (++this.id).toString()

    this.events[name].push ({
      id,
      callback,
    })

    return id
  }

  public trigger = (name, data) => {
    if (!this.events[name]) {
      return
    }

    const subscribed = this.events[name]
    subscribed.forEach(q => {
      q.callback.apply(data)
    })
  }
}
