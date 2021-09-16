const T = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
];

const O = [
    [1, 1],
    [1, 1],
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

const I = [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
]


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

    move(x, y) {
        this.pos.x += x;
        this.pos.y += y;
    }

    rotate() {
        this.shape = this.shape[0].map(
            (val, i) => this.shape.map(row => row[i]).reverse()
        );
    }
}

class Field {
    constructor(context, width, heigth) {
        this.context = context;
        this.matrix = new Array(heigth).fill().map(
            () => new Array(width).fill(0)
        );
    }

    draw() {
        this.context.fillStyle = '#000';
        this.context.fillRect(0,0, canvas.width, canvas.height);
    }

    collision(tetrimino) {
        for (let y = 0; y < tetrimino.shape.length; y++) {
            let row = tetrimino.shape[y];
            for (let x = 0; x < row.length; x++) {
                let val = row[x];
                if (val !== 0) {
                    let posX = tetrimino.pos.x + x;
                    let posY = tetrimino.pos.y + y;
                    if (posX < 0 || posX >= this.matrix[0].length ||
                        posY < 0 || posY >= this.matrix.length) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}

class Tetris {
    constructor(elementId) {
        this.canvas = document.getElementById(elementId);
        this.context = canvas.getContext('2d');
        const scale = {width: 20, height: 20}
        this.context.scale(scale.width, scale.height);
        this.field = new Field(
            this.context, canvas.width/scale.width, canvas.height/scale.height
        );
        this.tetrimino = new Tetrimino(Z, {x: 6, y: 0}, this.context);
        this.elapsedTime = 0;
        this.dropInterval = 1000
        this.dropTime = 0
        this.setUpKeyBindings()
    }

    collision() {
        return this.field.collision(this.tetrimino);
    }

    move(x, y) {
        this.tetrimino.move(x, y);
        if (this.collision()) {
            this.tetrimino.move(-x, -y)
        }
    }

    setUpKeyBindings() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                this.move(-1, 0);
            } else if (event.key === "ArrowRight") {
                this.move(1, 0);
            } else if (event.key === "ArrowDown") {
                this.move(0, 1);
            } else if (event.key === "ArrowUp") {
                this.tetrimino.rotate()
            }
        });
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
            this.move(0, 1);
            this.dropTime = 0;
        }
        this.draw();
        requestAnimationFrame((time) => this.update(time));
    }

    draw() {
        this.field.draw();
        this.tetrimino.draw();
    }
}

const tetris = new Tetris('canvas');
tetris.start();

