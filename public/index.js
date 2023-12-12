//object literal syntax
const circle = {
    radius: 1,
    location: {
        x: 1,
        y: 1
    },
    draw: function() {
        console.log('draw')
    }
}

circle.draw()

//To create new instance of circle object,
//the code needs to be duplicated,
//which makes code error-prone if the object,
//contains a method (behaviour).

//factory function

//The function returns a new object and can be
//referred as a factory function.

function createCircle(radius) {
    return {
        radius,
        location: {
            x: 1,
            y: 1
        },
        draw: () => {console.log(radius)}
    }
}

circle.draw()

//constructor function

function Circle(radius) {
    this.radius = radius

    this.location = {
        x: 1,
        y: 1
    }

    this.draw = () => {console.log(this.radius)}
}

//New operator creates a new object and,
//the this keyword points to that object.
//-----------OR CAN BE SAID
//New operator creates a new object and,
//executes the code in the context of newly
//created object.
const another = new Circle(1)

another.draw()

if ('draw' in another)
    console.log('draw exists!')