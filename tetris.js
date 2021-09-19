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

TETRIMINO_SHAPES = [T, O, Z, S, I]

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
        this.matrix.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 0) {
                    this.context.fillStyle = '#000';
                } else {
                    this.context.fillStyle = '#28FF28'
                }
                this.context.fillRect(x, y, 1, 1)
            });
        });
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
                    } else if (this.matrix[posY][posX] !== 0) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    merge(tetrimino) {
        tetrimino.shape.forEach((row, y) => {
            row.forEach((val, x) => {
                if (val !== 0) {
                    this.matrix[tetrimino.pos.y + y][tetrimino.pos.x + x] = val
                }
            });
        });
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
        this.tetriminos = TETRIMINO_SHAPES.map(shape => new Tetrimino(shape, undefined, this.context));
        this.tetrimino = this.random_tetrimino();
        this.elapsedTime = 0;
        this.dropInterval = 1000;
        this.dropTime = 0;
        this.startTouchPos = undefined;
        this.startTouchTime = undefined;
        this.prevTouchPos = undefined;
        this.initControls();
    }

    random_tetrimino() {
        let t = this.tetriminos[
            Math.floor(Math.random() * this.tetriminos.length)
        ];
        t.pos = this.startingPos(t);
        return t;
    }

    collision() {
        return this.field.collision(this.tetrimino);
    }

    move(x, y) {
        this.tetrimino.move(x, y);
        if (this.collision()) {
            this.tetrimino.move(-x, -y)
            return false;
        }
        return true;
    }

    initKeyboardControls() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                this.move(-1, 0);
            } else if (event.key === "ArrowRight") {
                this.move(1, 0);
            } else if (event.key === "ArrowDown") {
                if (!this.move(0, 1)) {
                    this.field.merge(this.tetrimino);
                }
            } else if (event.key === "ArrowUp") {
                this.tetrimino.rotate();
            }
        });
    }

    initTouchScreenControls() {
        document.addEventListener("touchstart", (event) => {
            let touch = event.changedTouches[0];
            this.startTouchPos = {
                x: parseInt(touch.clientX),
                y: parseInt(touch.clientY)
            };
            this.startTouchTime = new Date().getTime();
            this.prevTouchPos = this.startTouchPos;
            event.preventDefault();
        });
        document.addEventListener("touchmove", (event) => {
            let touch = event.changedTouches[0];
            let currTouchPos = {
                x: parseInt(touch.clientX),
                y: parseInt(touch.clientY)
            };
            let distanceX = this.prevTouchPos.x - currTouchPos.x;
            let distanceY = this.prevTouchPos.y - currTouchPos.y;


            
            if (distanceX > 10) {
                this.prevTouchPos = currTouchPos
                tetris.move(-1, 0);
            } else if (distanceX < -10) {
                tetris.move(1, 0);
                this.prevTouchPos = currTouchPos;
            } else if (distanceY < -20) {
                this.prevTouchPos = currTouchPos;
                this.move(0, 1);
                this.dropTime = 0;
            }
            event.preventDefault();   
        });
        document.addEventListener("touchend", (event) => {
            let touch = event.changedTouches[0];
            let endTouchPos = {
                x: parseInt(touch.clientX),
                y: parseInt(touch.clientY)
            };
            if (Math.abs(this.startTouchPos.x - endTouchPos.x) < 10 &&
                Math.abs(this.startTouchPos.y - endTouchPos.y) < 10 &&
                this.startTouchTime - new Date().getTime() < 100) {
                this.tetrimino.rotate()
            }
            this.startTouchPos = undefined;
            this.startTouchTime = undefined;
            event.preventDefault();
        });
    }
    
    initControls() {
        this.initKeyboardControls() ;
        this.initTouchScreenControls();
    }

    start() {
        this.draw();
        this.update(0)
    }

    startingPos(tetrimino) {
        return {
            x: Math.floor(this.field.matrix[0].length/2) - Math.floor(tetrimino.shape[0].length/2),
            y: 0
        };
    }


    update(elapsedTime) {
        let deltaTime = elapsedTime - this.elapsedTime;
        this.elapsedTime = elapsedTime;
        this.dropTime += deltaTime;
        if (this.dropTime > this.dropInterval) {
            if (!this.move(0, 1)) {
                this.field.merge(this.tetrimino);
                this.tetrimino = this.random_tetrimino()
            }
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

