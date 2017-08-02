function springForce(a, b, length, force) {
    let diff = sub(b.p, a.p)
    let d = dist(b.p, a.p)
    let displacement = d - length
    diff.setMag(displacement * force)
    a.a.add(diff)
    b.a.sub(diff)
}

function electricRepulsion(a, b, force) {
    let diff = sub(b.p, a.p)
    let d = dist(b.p, a.p)
    diff.setMag(force * a.charge * b.charge / (d * d) )
    a.a.add(diff)
    b.a.sub(diff)
}

function gravity(a, force) {
    a.a.y -= force * a.mass * a.bouyancy
}

function drag(a, ratio) {
    a.v.mult(ratio)
}

function clampVelocity(a, limit) {
    a.v.limit(limit)
}

function waves(a, force) {
    let shift = Math.sin(a.p.y / 50 + a.p.x / 200)
    a.a.x += 
        Math.sin(performance.now() * 0.001 + shift) * force
        + Math.sin(performance.now() * 0.002 + shift) * force * 0.5
        + Math.sin(performance.now() * 0.004 + shift) * force * 0.25
}

function boundry(a) {
    if(a.p.x < 0) {
        a.p.x = 1
        a.v.x *= -1
    }

    if(a.p.x > width) {
        a.p.x = width - 1
        a.v.x *= -1
    }

    if(a.p.y < 0) {
        a.p.y = 1
        a.v.y *= -1
    }

    if(a.p.y > height) {
        a.p.y = height - 1
        a.v.y *= -1
    }
}