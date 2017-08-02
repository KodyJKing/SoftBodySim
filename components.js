function stinger(p, world) {
    let pts = []
    for (let i = 0; i < 4; i++) {
        let pt = new Point()
        pt.p = add(p, vec(0, 50).mult(i))
        world.points.push(pt)
        pts.push(pt)
    }
    world.updates.push( () => {
        for (let i = 0; i < 3; i++) springForce(pts[i], pts[i + 1], 20, 0.0004)
    } )
    world.renderers.push( () => {
        push()
        noFill()
        strokeWeight(7)
        strokeCap(SQUARE)
        stroke(100, 255, 255, 100)
        bezier(
            pts[0].p.x, pts[0].p.y,
            pts[1].p.x, pts[1].p.y,
            pts[2].p.x, pts[2].p.y,
            pts[3].p.x, pts[3].p.y,
        )
        noStroke()
        fill(100, 100, 200, 100)
        translate(-5, -5)
        rect(pts[3].p.x, pts[3].p.y, 10, 10)
        pop()
    } )
    return pts
}

function bell(p, world) {
    let pts = []

    let res = 6
    // Build upper curve of semi-circle.
    for (let i = 0; i <= res; i++) {

        let pt = new Point()
        pt.mass = 5
        pt.charge = 5

        pt.p = vec(
            Math.cos(i / res * PI) * 30 + p.x,
            - Math.sin(i / res * PI) * 30 + p.y
        )

        world.points.push(pt)
        pts.push(pt)
    }

    let base = [pts[0], pts[pts.length - 1]]

    // Shorten half circumference to half diameter.
    res = Math.floor(res * 2 / PI)
    let left = add(p, vec(-30, 0))
    let right = add(p, vec(30, 0))
    // Build flat bottom of semi-circle.
    for (let i = 1; i < res; i++) {

        let pt = new Point()
        pt.mass = 5
        pt.charge = 5        

        pt.p = vec(
            lerp(left.x, right.x, i / res),
            lerp(left.y, right.y, i / res),
        )

        world.points.push(pt)
        pts.push(pt)        
        base.push(pt)
    }

    // Add spring forces around the perimeter of the bell.
    for (let i = 1; i <= pts.length; i++) {
        let a = pts[i - 1]
        let b = pts[i % pts.length]
        let d = dist(a.p, b.p)
        world.updates.push( () => springForce(a, b, d, 0.0004) )
    }

    world.renderers.push( () => {
        push()
        stroke(100, 255, 255, 100)
        strokeWeight(7)
        fill(100, 255, 255, 100)
        beginShape()
        for (let i = 1; i <= pts.length; i++) {
            let a = pts[i - 1]
            let b = pts[i % pts.length]
            let c1 = p5.Vector.lerp(a.p, b.p, 0.25)
            let c2 = p5.Vector.lerp(a.p, b.p, 0.75)
            vertex(a.p.x, a.p.y)
            bezierVertex(
                c1.x, c1.y,
                c2.x, c2.y,
                b.x, b.y
            )   
        }
        endShape(CLOSE)
        pop()
    } )

    // Reinforce bell with truss springs.
    for (let trussStride = 3; trussStride <= 4; trussStride++) {
        for (let i = 0; i < pts.length; i++) {
            let a = pts[i]
            let b = pts[(i + trussStride) % pts.length]
            let d = dist(a.p, b.p)
            world.updates.push( () => springForce(a, b, d + 5, 0.0008) )
        }
    }

    // Reinforce bell with central high charge point.
    let center = new Point()
    center.p = add(p, vec(0, -15))
    center.mass = 5
    center.charge = 20
    for (let pt of pts) {
        let d = dist(center.p, pt.p)
        world.updates.push( () => { springForce(center, pt, d, 0.0004) } )
    }
    world.points.push(center)

    return {base, pts}
}

function jellfish(p, world) {
    let jelly = bell(p, world)
    for (let pt of jelly.base) {
        let s = stinger( add(pt.p, vec(0, 3)), world )
        let d = dist(pt.p, s[0].p)
        world.updates.push( () => springForce(pt, s[0], d, 0.0004) )
    }
    let shift = random(100)
    let shift2 = random(100)
    world.updates.push( () => {
        for (let pt of jelly.pts) pt.bouyancy = Math.sin(performance.now() * 0.0001 + shift) + (Math.sin(performance.now() * 0.002 + shift2) + 0.8) * 0.5
    } )
}