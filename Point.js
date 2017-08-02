let uuidCounter = 0
class Point {
    constructor() {
        this.p = vec(0, 0)
        this.v = vec(0, 0)
        this.a = vec(0, 0)
        this.mass = 1
        this.bouyancy = -1
        this.charge = 1
        this.anchored = false
        this.uuid = uuidCounter++
    }
}