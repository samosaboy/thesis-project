// view-source:http://stemkoski.github.io/Three.js/Texture-Animation.html

const THREE = require('three')

export class TextureAnimator {
  private tilesHorizontal
  private tilesVertical
  private numberOfTiles
  private tileDisplayDuration
  private currentDisplayTime: number
  private currentTile

  private texture

  constructor(texture, tilesHorz, tilesVert, numTiles, tileDur) {
    this.tilesHorizontal = tilesHorz
    this.tilesVertical = tilesVert
    this.numberOfTiles = numTiles
    this.tileDisplayDuration = tileDur
    this.texture = texture

    this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping
    this.texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical)
    this.texture.offset.x = this.texture.offset.y = 1

    this.currentDisplayTime = 0
    this.currentTile = 0
  }

  public get = () => this.texture

  public update = (delta) => {
    if (!isNaN(delta)) {
      this.currentDisplayTime += delta
      while (this.currentDisplayTime > this.tileDisplayDuration) {
        this.currentDisplayTime -= this.tileDisplayDuration
        this.currentTile++
        if (this.currentTile === this.numberOfTiles - 1) {
          this.currentTile = 0
        }

        const factor = this.numberOfTiles - this.currentTile
        const currentRow = Math.floor(factor / this.tilesHorizontal)
        const currentColumn = Math.floor(factor % this.tilesHorizontal)

        this.texture.offset.x = currentColumn / this.tilesHorizontal
        this.texture.offset.y = currentRow / this.tilesVertical
      }
    }
  }
}
