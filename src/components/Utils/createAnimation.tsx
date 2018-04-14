const TWEEN = require('@tweenjs/tween.js')

export class createAnimation {
  private cache: any
  private el: any
  private _cache: any

  constructor(mesh, params) {
    this.cache = params
    this._cache = Object.assign({}, params)
    this.el = mesh
  }

  private update = () => {
    const keys = Object.keys(this.cache)
    keys.forEach(q => {
      this.el.position ? this.el.position[q] = this.cache[q] : null
      this.el.material ? this.el.material[q] = this.cache[q] : null
    })
  }

  public in = (newParams, duration) => {
    return new TWEEN.Tween(this.cache)
      .to(newParams, duration)
      .easing(TWEEN.Easing.Circular.InOut)
      .onStart(() => this.el.visible = true)
      .onUpdate(() => this.update())
      .start()
  }

  public out = (duration) => {
    return new TWEEN.Tween(this.cache)
      .to(this._cache, duration)
      .easing(TWEEN.Easing.Circular.InOut)
      .onUpdate(() => this.update())
      .onComplete(() => this.el.visible = false)
      .start()
  }
}
