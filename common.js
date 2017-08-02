function shorthand() {
    let funcs = 'add,sub,mult,div,dot,cross,random2D,dist'.split(',')
    for (func of funcs) {
        console.log(func)
        window[func] = p5.Vector[func].bind(p5.Vector)
    }
    window.vec = createVector
}

function intersects(amin, amax, bmin, bmax) {
    return amin < bmax && bmin < amax
}

function forPairs(pts, radius, maxDepth, minPts, callback) {

    let pairs = new Set()

    let addPair = (a, b) => {
        pairs.add(a.uuid + ',' + b.uuid)
        pairs.add(b.uuid + ',' + a.uuid)
    }

    let hasPair = (a, b) => {
        return pairs.has(a.uuid + ',' + b.uuid) || pairs.has(b.uuid + ',' + a.uuid)
    }

    let internal = (pts, minx, maxx, miny, maxy, depth) => {

        let midx = (minx + maxx)  / 2
        let midy = (miny + maxy)  / 2

        // push()
        // stroke(255, 0, 0)
        // line(minx, miny, minx, maxy) // Down
        // line(minx, maxy, maxx, maxy) // Right
        // line(maxx, maxy, maxx, miny) // Up
        // line(maxx, miny, minx, miny) // Left
        // pop()

        if (pts.length == 0) return

        if (depth == maxDepth || pts.length < minPts) {
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    let a = pts[i]
                    let b = pts[j]
                    if (hasPair(a, b) || dist(a.p, b.p) > 2 * radius) continue
                    addPair(a, b)
                    callback(a, b)
                }
            }
            return
        }

        let topLeft = []
        let topRight = []
        let bottomLeft = []
        let bottomRight = []

        for (let pt of pts) {
            let ptMinx = pt.p.x - radius
            let ptMaxx = pt.p.x + radius
            let ptMiny = pt.p.y - radius
            let ptMaxy = pt.p.y + radius

            let top = false
            let bottom = false

            if (intersects(miny, midy, ptMiny, ptMaxy)) top = true
            if (intersects(midy, maxy, ptMiny, ptMaxy)) bottom = true

            // Left
            if (intersects(minx, midx, ptMinx, ptMaxx)) {
                if (top) topLeft.push(pt)
                if (bottom) bottomLeft.push(pt)
            }
            
            // Right
            if (intersects(midx, maxx, ptMinx, ptMaxx)) {
                if (top) topRight.push(pt)
                if (bottom) bottomRight.push(pt)
            }
        }

        internal(topLeft, minx, midx, miny, midy, depth + 1)
        internal(topRight, midx, maxx, miny, midy, depth + 1)
        internal(bottomLeft, minx, midx, midy, maxy, depth + 1)
        internal(bottomRight, midx, maxx, midy, maxy, depth + 1)
    }

    internal(pts, 0, width, 0, height, 0)

}