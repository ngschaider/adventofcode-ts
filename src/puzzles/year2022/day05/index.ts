import { Solution, Puzzle } from "../../../types";

type Crate = string;

type CrateStack = (Crate|null)[];

type State = CrateStack[];

type Move = {
    amount: number;
    from: number;
    to: number;
}

type ParsedInput = {
    state: State;
    moves: Move[];
}

export default class extends Puzzle {
    public sampleInput: string = "    [D]    \n[N] [C]    \n[Z] [M] [P]\n 1   2   3 \n\nmove 1 from 2 to 1\nmove 3 from 1 to 3\nmove 2 from 2 to 1\nmove 1 from 1 to 2";
    public sampleSolution: Solution = {
        part1: "CMZ",
        part2: "MCD",
    };

    parseState(stateStr: string): State {
        const levelWithNumbering = stateStr.split("\n");
        levelWithNumbering.pop();

        let levelsStr = levelWithNumbering.join("\n");
        // remove unneeded whitespace
        levelsStr = levelsStr.replaceAll(" [", "[");
        levelsStr = levelsStr.replaceAll("    ", " "); 
        levelsStr = levelsStr.replaceAll("   ", " ");
        // remove unneeded brackets
        levelsStr = levelsStr.replaceAll("[", "");
        levelsStr = levelsStr.replaceAll("]", "");


        const crateStacks: CrateStack[] = [];


        const levels = levelsStr.split("\n");
        levels.reverse();
        for(let y = 0; y < levels.length; y++) {
            for(let x = 0; x < levels[y].length; x++) {
                if(crateStacks.length <= x) {
                    crateStacks.push([] as CrateStack);
                }
                if(levels[y][x] != " ") {
                    crateStacks[x].push(levels[y][x]); 
                }
            }
        }


        return crateStacks;
    }

    parse(input: string): ParsedInput {
        const stateStr = input.split("\n\n")[0];
        const state: CrateStack[] = this.parseState(stateStr);


        const movesStr = input.split("\n\n")[1].trim();
        const moves: Move[] = movesStr.split("\n").map(line => {
            return {
                amount: parseInt(line.substring(line.indexOf("move ") + "move ".length, line.indexOf(" from ") + 1)),
                from: parseInt(line.substring(line.indexOf("from ") + "from ".length, line.indexOf(" to ") + 1)),
                to: parseInt(line.substring(line.indexOf("to ") + "to ".length)),
            };
        });

        return {
            moves,
            state: state,
        }
    }

    public async solve(input: string): Promise<Solution> {
        const parsed: ParsedInput = this.parse(input);


        const copy1 = structuredClone(parsed.state);
        for(const move of parsed.moves) {
            for(let i = 0; i < move.amount; i++) {
                const popped = copy1[move.from - 1].pop();
                if(!popped) {
                    throw new Error("Cannot move from empty CrateStack");
                }

                copy1[move.to - 1].push(popped);
            }
        }

        const top1 = copy1.map(stack => stack[stack.length - 1]).join("");


        const copy2 = structuredClone(parsed.state);
        for(const move of parsed.moves) {
            const popped = copy2[move.from - 1].splice(copy2[move.from - 1].length - move.amount);

            copy2[move.to - 1].push(...popped);
        }

        const top2 = copy2.map(stack => stack[stack.length - 1]).join("");

        return {
            part1: top1,
            part2: top2,
        }
    }

}