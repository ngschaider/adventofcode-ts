import { Solution, Puzzle, Sample } from "../../../types";

class Point {

    pos: Position = {
        x: 0,
        y: 0,
    };

    moveUp(){
        this.pos.y++;
    }
    moveDown() {
        //if(this.pos.y === 0) throw new Error("Cannot move further down");
        this.pos.y--;
    }

    moveRight() {
        this.pos.x++;
    }
    moveLeft() {
        //if(this.pos.x === 0) throw new Error("Cannot move further left");
        this.pos.x--;
    }

    move(direction: Direction) {
        if(direction === Direction.Right) this.moveRight();
        else if(direction === Direction.Left) this.moveLeft();
        else if(direction === Direction.Up) this.moveUp();
        else if(direction === Direction.Down) this.moveDown();
        else throw new Error("Could not execute move");
    }

    isTouching(other: Point) {
        const dx = other.pos.x - this.pos.x;
        const dy = other.pos.y - this.pos.y;

        return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
    }

    follow(other: Point) {
        const dx = other.pos.x - this.pos.x;
        const dy = other.pos.y - this.pos.y;

        //console.log([dx, dy]);

        if(this.isTouching(other)) {
            return;
        }

        if(dy === 0 || dx === 0) {
            //console.log("direct move");

            if(dx > 1) {
                this.moveRight();
            } else if(dx < -1) {
                this.moveLeft();
            } else if(dy > 1) {
                this.moveUp();
            } else if(dy < -1) {
                this.moveDown();
            }

            if(!this.isTouching(other)) {
                throw new Error("Not touching");
            }

            return;
        }

        if(dx > 1) {
            this.moveRight();
            if(dy > 0) {
                //console.log("jumping dx > 1 && dy > 0");
                this.moveUp();
            } else if(dy < 0) {
                //console.log("jumping dx > 1 && dy < 0");
                this.moveDown();
            }
            
            if(!this.isTouching(other)) {
                throw new Error("Not touching");
            }

            return;
        } else if(dx < -1) {
            this.moveLeft();
            if(dy > 0) {
                //console.log("jumping dx < -1 && dy > 0");
                this.moveUp();
            } else if(dy < 0) {
                //console.log("jumping dx < -1 && dy < 0");
                this.moveDown();
            }
            
            if(!this.isTouching(other)) {
                throw new Error("Not touching");
            }

            return;
        }

        if(dy > 1) {
            this.moveUp();
            if(dx > 0) {
                //console.log("jumping dy > 1 && dx > 0");
                this.moveRight();
            } else if(dx < 0) {
                //console.log("jumping dy > 1 && dx < 0");
                this.moveLeft();
            }
            
            if(!this.isTouching(other)) {
                throw new Error("Not touching");
            }

            return;
        } else if(dy < -1) {
            this.moveDown();
            if(dx > 0) {
                //console.log("jumping dy < -1 && dx > 0");
                this.moveRight();
            } else if(dx < 0) {
                //console.log("jumping dy < -1 && dx < 0");
                this.moveLeft();
            }
            
            if(!this.isTouching(other)) {
                throw new Error("Not touching");
            }

            return;
        }
    }

}

type Position = {
    x: number;
    y: number;
}

enum Direction {
    Up = "U",
    Down = "D",
    Left = "L",
    Right = "R"
}

type Instruction = {
    direction: Direction
    amount: number;
}

export default class extends Puzzle {
    public samples: Sample[] = [
        {
            input: "R 4\nU 4\nL 3\nD 1\nR 4\nD 1\nL 5\nR 2", 
            solution: {part1: "13", part2: "1"}
        },
        {
            input: "R 5\nU 8\nL 8\nD 3\nR 17\nD 10\nL 25\nU 20", 
            solution: {part2: "36"}
        },
    ]

    private parse(input: string): Instruction[] {
        return input.trim().split("\n").map((line, index) => {
            const [_, directionChar, amountStr] = /^([RULD]) ([0-9]*)$/.exec(line) || [];
            if(!directionChar || !amountStr) {
                throw new Error("Could not parse input line " + index + ": " + line);
            }

            const direction: Direction = (() => {
                if(directionChar === "R") return Direction.Right;
                if(directionChar === "U") return Direction.Up;
                if(directionChar === "L") return Direction.Left;
                if(directionChar === "D") return Direction.Down;
                throw new Error("Cannot determine direction " + directionChar);
            })();

            return {
                direction: direction,
                amount: parseInt(amountStr), 
            }
        });
    }

    printState(head: Point, tails: Point[], visited: Position[]) {
        const width = Math.max(head.pos.x, ...tails.map(t => t.pos.x), ...visited.map(pos => pos.x)) + 1;
        const height = Math.max(head.pos.y, ...tails.map(t => t.pos.y), ...visited.map(pos => pos.y)) + 1;

        const map: string[][] = [];
        for(let y = 0; y < height; y++) {
            const row: string[] = [];
            for(let x = 0; x < width; x++) {
                row.push(".");
            }
            map.push(row);
        }

        for(const {x, y} of visited) {
            if(y > 0) {
                map[y][x] = "#";
            }
        }

        map[0][0] = "s";

        for(let i = tails.length - 1; i >= 0; i--) {
            if(tails[i].pos.y >= 0) {
                map[tails[i].pos.y][tails[i].pos.x] = (i + 1).toString();
            }
        }
    
        if(head.pos.y >= 0) {
            map[head.pos.y][head.pos.x] = "H";
        }

        for(let y = height - 1; y >= 0; y--) {
            console.log(map[y].join(""));
        }
        console.log("");
    }

    private simulate(instructions: Instruction[], numTails: number) {
        const head = new Point();
        const tails: Point[] = [];
        for(let i = 0; i < numTails; i++) {
            tails.push(new Point());
        }

        const visited: Position[] = [];

        //this.printState(head, tails, visited);

        for(const instruction of instructions) {
            for(let i = 0; i < instruction.amount; i++) {
                head.move(instruction.direction);

                tails[0].follow(head);
                for(let j = 1; j < tails.length; j++) {
                    tails[j].follow(tails[j - 1]);
                }
                
                const pos = structuredClone(tails[tails.length - 1].pos);
                if(!visited.find(p => p.x === pos.x && p.y === pos.y)) {
                    visited.push(pos);
                }

                //this.printState(head, tails, visited);
            }
        }

        return visited;
    }

    public async solve(input: string): Promise<Solution> {
        const instructions: Instruction[] = this.parse(input);

        

        return {
            part1: this.simulate(instructions, 1).length.toString(),
            part2: this.simulate(instructions, 9).length.toString(),
        }
    }

}