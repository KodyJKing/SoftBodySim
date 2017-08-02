class World {
    constructor() {
        this.points = []
        this.updates = []
        this.renderers = []
        this.lastUpdate = performance.now()
        this.lastFrame = this.lastUpdate
        this.updatesAFrame = 1
        this.maxVelocity = 0.5
        this.debug = false
        this.fixedDt = undefined
        this.maxDt = 200//ms
    }

    update() {
        let currentTime = performance.now()
        let dt = this.fixedDt || (currentTime - this.lastUpdate)
        if (dt > this.maxDt) dt = this.maxDt
        this.lastUpdate = currentTime

        for (let update of this.updates) update(dt)
        for (let point of this.points) {
            if (point.anchored) continue
            point.v.add( mult(point.a, dt / point.mass) )
            clampVelocity(point, this.maxVelocity)
            point.p.add( mult(point.v, dt) )
            point.a.x = 0
            point.a.y = 0
        }
    }

    draw() {
        for(let i = 0; i < this.updatesAFrame; i++) this.update()

        let currentTime = performance.now()
        let dt = currentTime - this.lastFrame
        this.lastFrame = currentTime
        for (let renderer of this.renderers) renderer(dt)

        if (this.debug) {
            for (let pt of this.points) {
                push()
                fill(0)
                ellipse(pt.p.x, pt.p.y, 10)
                pop()
            }
        }
    }
}