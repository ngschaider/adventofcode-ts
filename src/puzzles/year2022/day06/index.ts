import { Solution, Puzzle, Sample } from "../../../types";

export default class extends Puzzle {
    public samples: Sample[] = [
        {input: "mjqjpqmgbljsphdztnvjfqwrcgsmlb", solution: {part1: "7", part2: "19"}},
        {input: "bvwbjplbgvbhsrlpgdmjqwftvncz", solution: {part1: "5", part2: "23"}},
        {input: "nppdvjthqldpwncqszvftbrmjlhg", solution: {part1: "6", part2: "23"}},
        {input: "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", solution: {part1: "10", part2: "29"}},
        {input: "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", solution: {part1: "11", part2: "26"}},
    ]

    findMarker(input: string, markerLength: number): number {
        const prevChars: string[] = [];
        for(let i = 0; i < input.length; i++) {
            for(let j = 0; j < markerLength; j++) {
                prevChars[j] = input[i - markerLength + j];
            }

            if(i < markerLength) {
                continue;
            }

            const markerFound = prevChars.reduce((prev, curr) => {
                if(!prev) {
                    return false;
                }

                if(prevChars.filter(char => char === curr).length > 1) {
                    return false;
                }

                return true;
            }, true);

            if(markerFound) {
                return i;
            }
        }

        throw new Error("No marker found");
    }

    public async solve(input: string): Promise<Solution> {
        const marker1 = this.findMarker(input, 4);
        const marker2 = this.findMarker(input, 14); 

        return {
            part1: marker1.toString(),
            part2: marker2.toString(),
        }
    }

}