import { Solution, Puzzle } from "../../../types";

type Range = {
    from: number;
    to: number;
}

type Pair = {
    first: Range;
    second: Range;
}

export default class extends Puzzle {
    public sampleInput: string = "2-4,6-8\n2-3,4-5\n5-7,7-9\n2-8,3-7\n6-6,4-6\n2-6,4-8";
    public sampleSolution: Solution = {
        part1: "2",
        part2: "4",
    };

    public async solve(input: string): Promise<Solution> {
        const pairs: Pair[] = input.trim().split("\n").map(line => {
            const range1 = line.split(",")[0];
            const range2 = line.split(",")[1];

            return {
                first: {
                    from: parseInt(range1.split("-")[0]),
                    to: parseInt(range1.split("-")[1]),
                },
                second: {
                    from: parseInt(range2.split("-")[0]),
                    to: parseInt(range2.split("-")[1]),
                },
            };
        });

        const overlappingPairs1 = pairs.filter(pair => {
            if(pair.first.from >= pair.second.from && pair.first.to <= pair.second.to) {
                return true;
            }
            if(pair.second.from >= pair.first.from && pair.second.to <= pair.first.to) {
                return true;
            }
            return false;
        });

        const overlappingPairs2 = pairs.filter(pair => {
            if(pair.first.to >= pair.second.from && pair.first.to <= pair.second.to) {
                return true;
            }
            if(pair.first.from >= pair.second.from && pair.first.from <= pair.second.to) {
                return true;
            }
            if(pair.second.to >= pair.first.from && pair.second.to <= pair.first.to) {
                return true;
            }
            if(pair.second.from >= pair.first.from && pair.second.from <= pair.first.to) {
                return true;
            }
            
            return false;
        });



        return {
            part1: overlappingPairs1.length.toString(),
            part2: overlappingPairs2.length.toString(),
        }
    }

}