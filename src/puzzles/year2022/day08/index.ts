import { Solution, Puzzle, Sample } from "../../../types";

class Node<T> {
    x: number;
    y: number;

    value: T;

    right: Node<T>|null = null;
    left: Node<T>|null = null;
    up: Node<T>|null = null;
    down: Node<T>|null = null;

    constructor(x: number, y: number, value: T) {
        this.x = x;
        this.y = y;
        this.value = value;
    }

    get visible(): boolean {
        const up = this.allUp.reverse().reduce((prev, curr) => {
            if(!prev) return false;
            if(curr.value < this.value) return true;
            return false;
        }, true);
        const down = this.allDown.reverse().reduce((prev, curr) => {
            if(!prev) return false;
            if(curr.value < this.value) return true;
            return false;
        }, true);
        const right = this.allRight.reverse().reduce((prev, curr) => {
            if(!prev) return false;
            if(curr.value < this.value) return true;
            return false;
        }, true);
        const left = this.allLeft.reverse().reduce((prev, curr) => {
            if(!prev) return false;
            if(curr.value < this.value) return true;
            return false;
        }, true);

        return right || up || left || down;
    }

    get visibleRight(): boolean {
        return this.allRight.reverse().reduce((prev, curr) => {
            if(!prev) return false;
            if(curr.value < this.value) return true;
            return false;
        }, true);
    }

    get allRight(): Node<T>[] {
        const nodes: Node<T>[] = [];
        let node: Node<T>|null = this.right;
        while(node) {
            nodes.push(node)
            node = node.right;
        }
        return nodes;
    }

    get allLeft(): Node<T>[] {
        const nodes: Node<T>[] = [];
        let node: Node<T>|null = this.left;
        while(node) {
            nodes.push(node)
            node = node.left;
        }
        return nodes;
    }

    get allDown(): Node<T>[] {
        const nodes: Node<T>[] = [];
        let node: Node<T>|null = this.down;
        while(node) {
            nodes.push(node)
            node = node.down;
        }
        return nodes;
    }

    get allUp(): Node<T>[] {
        const nodes: Node<T>[] = [];
        let node: Node<T>|null = this.up;
        while(node) {
            nodes.push(node)
            node = node.up;
        }
        return nodes;
    }
}

class LinkedList2D<T> {
    values: (Node<T>|null)[][] = [];

    get height(): number {
        return this.values.length
    }

    get width(): number {
        return Math.max(...this.values.map(r => r.length));
    }

    get nodes(): (Node<T>|null)[] {
        return ([] as (Node<T>|null)[]).concat(...this.values);
    }

    set(x: number, y: number, value: T) {
        if(x < 0 || y < 0) {
            throw new Error("Index out of bounds");
        }

        while(y >= this.values.length) {
            this.values.push([]);
        }

        while(x >= this.values[y].length) {
            this.values[y].push(null);
        }

        // create new node
        const node = new Node<T>(x, y, value);
        node.right = this.get(x + 1, y);
        node.left = this.get(x - 1, y);
        node.up = this.get(x, y - 1);
        node.down = this.get(x, y + 1);
        this.values[y][x] = node;

        // update adjacent nodes
        const right = this.get(x + 1, y);
        if(right) right.left = node;
        const left = this.get(x - 1, y);
        if(left) left.right = node;
        const up = this.get(x, y - 1);
        if(up) up.down = node;
        const down = this.get(x, y + 1);
        if(down) down.up = node;
    }

    get(x: number, y: number): Node<T>|null {
        if(x < 0 || y < 0) {
            return null;
        }

        if(y >= this.values.length) {
            return null;
        }
        if(x >= this.values[y].length) {
            return null;
        }

        return this.values[y][x];
    }
}

export default class extends Puzzle {
    public samples: Sample[] = [
        {
            input: "30373\n25512\n65332\n33549\n35390", 
            solution: {part1: "21"}
        },
    ]

    parse(input: string): LinkedList2D<number> {
        const map = new LinkedList2D<number>();

        const lines = input.trim().split("\n");
        for(let y = 0; y < lines.length; y++) {
            const line = lines[y];
            for(let x = 0; x < line.length; x++) {
                const value = parseInt(line[x]);
                map.set(x, y, value);
            }
        }

        return map;
    }

    public async solve(input: string): Promise<Solution> {
        const map = this.parse(input);

        const visibleNodesCount = map.nodes.filter(node => node !== null && node.visible).length;

        return {
            part1: visibleNodesCount.toString(),
        }
    }

}