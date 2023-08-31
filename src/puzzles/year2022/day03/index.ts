import { Solution, Puzzle } from "../../../types";

type Rucksack = {
    firstComp: string[],
    secondComp: string[],
}

export default class extends Puzzle {
    public sampleInput: string = "vJrwpWtwJgWrhcsFMMfFFhFp\njqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL\nPmmdzqPrVvPwwTWBwg\nwMqvLMZHhHMvwLHjbvcjnnSBnvTQFn\nttgJtRGJQctTZtZT\nCrZsJsPPZsGzwwsLwLmpwMDw";
    public sampleSolution: Solution = {
        part1: "157",
        part2: "70"
    };

    getPriority(char: string): number {
        if(char.toLowerCase() === char) {
            // char is lowercase
            return char.charCodeAt(0) - "a".charCodeAt(0) + 1;
        } else if(char.toUpperCase() === char) {
            // char is uppercase
            return char.charCodeAt(0) - "A".charCodeAt(0) + 27;
        }
        throw new Error("Error while getting priority of '" + char + "'");
    }

    public async solve(input: string): Promise<Solution> {
        const rucksacks: Array<Rucksack> = input.trim().split("\n").map(line => {
            const compSize = Math.round(line.length / 2);

            return {
                firstComp: line.substring(0, compSize).split(""),
                secondComp: line.substring(compSize).split(""),
            };
        });

        const duplicatedItemTypes = rucksacks.map(rucksack => {
            for(const c of rucksack.firstComp) {
                if(rucksack.secondComp.includes(c)) {
                    return c;
                }
            }
            throw new Error("Could not find duplicated item type");
        });

        const priorities = duplicatedItemTypes.map(this.getPriority);
        const sum1 = priorities.reduce((prev, curr) => prev + curr, 0);




        const groups = rucksacks.reduce((prev, curr) => {
            if(prev[prev.length - 1].length >= 3) {
                prev.push([]);    
            }

            prev[prev.length - 1].push(curr);

            return prev;
        }, [[]] as Rucksack[][]);

        const badgeChars = groups.map(rucksacks => {
            const [first, ...rest] = rucksacks;
            const badgeChar = first.firstComp.concat(first.secondComp).find(char => {
                return rest.reduce((prev, curr) => {
                    if(!prev) return false;

                    if(!curr.firstComp.includes(char) && !curr.secondComp.includes(char)) {
                        return false;
                    }

                    return true;
                }, true);
            });
            if(!badgeChar) console.log(rucksacks);
            if(!badgeChar) throw new Error("Could not find badge character");
            return badgeChar;
        });

        const badgePriorities = badgeChars.map(this.getPriority);

        const badgeSum = badgePriorities.reduce((prev, curr) => prev + curr, 0);

        return {
            part1: sum1.toString(),
            part2: badgeSum.toString(),
        }
    }

}