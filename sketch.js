var world

function draw() {
    background(30, 70, 80)
    world.draw()
}

function setup() {
    shorthand()
    createCanvas(window.innerWidth, window.innerHeight);

    world = new World()
    // world.debug = true
    // world.fixedDt = 10//ms
    world.maxVelocity = 0.1
    let points = world.points

    for (let i = 0; i < 60; i++) jellfish(vec(random(width), random(height)), world)

    world.updates.push( () => {

        forPairs(world.points, 15, 7, 20, (a, b) => {
            electricRepulsion(a, b, -0.03)            
        } )

        for (let pt of points) {
            gravity(pt, 0.001)
            drag(pt, 0.95)
            waves(pt, 0.002)
            boundry(pt)
        }

    } )

    // world.renderers.push( () => {
    //     forPairs(world.points, 15, 7, 20, (a, b) => {
    //         push()
    //             noFill()
    //             stroke(0)
    //             strokeWeight(1)
    //             line(
    //                 a.p.x, a.p.y,
    //                 b.p.x, b.p.y
    //             )
    //         pop()
    //     } )
    // } )

}