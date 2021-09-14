const T = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
];

const O = [
    [1, 1],
    [1, 1]
];

const Z = [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
];

const S = [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
];

class Tetrimino {
    constructor(shape, pos, context) {
        this.shape = shape;
        this.pos = pos;
        this.context = context;
    }

    draw() {
        this.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell !== 0) {
                    this.context.fillStyle = '#28FF28'
                    this.context.fillRect(x + this.pos.x, y + this.pos.y, 1, 1)
                }
            });
        });
    }
}

class Field {
    constructor(context) {
        this.context = context;
    }

    draw() {
        this.context.fillStyle = '#000';
        this.context.fillRect(0,0, canvas.width, canvas.height);
    }
}

class Tetris {
    constructor(elementId) {
        this.canvas = document.getElementById(elementId);
        this.context = canvas.getContext('2d');
        this.context.scale(20, 20);
        this.field = new Field(this.context);
        this.tetrimino = new Tetrimino(Z, {x: 5, y: 5}, this.context);
        this.elapsedTime = 0;
        this.dropInterval = 1000
        this.dropTime = 0
    }

    start() {
        this.draw();
        this.update(0)
    }

    update(elapsedTime) {
        let deltaTime = elapsedTime - this.elapsedTime;
        this.elapsedTime = elapsedTime;
        this.dropTime += deltaTime;
        if (this.dropTime > this.dropInterval) {
            this.tetrimino.pos.y++;
            this.dropTime = 0;
            this.draw();
        }
        requestAnimationFrame((time) => this.update(time));
    }

    draw() {
        this.field.draw();
        this.tetrimino.draw();
    }
}

const tetris = new Tetris('canvas');
tetris.start();

