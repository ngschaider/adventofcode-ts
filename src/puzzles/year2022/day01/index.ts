import { Solution, Puzzle } from "../../../types";

export default class extends Puzzle {
    public sampleInput: string = "1000\n2000\n3000\n\n4000\n\n5000\n6000\n\n7000\n8000\n9000\n\n10000";
    public sampleSolution: Solution = {
        part1: "24000",
        part2: "45000",
    };

    public async solve(input: string): Promise<Solution> {
        input = input.trim();

        // Split the string into arrays
        const byElfConcatedString = input.split("\n\n"); 
        /*
            [
                '1000\n2000\n3000', 
                '4000', 
                '5000\n6000', 
                '7000\n8000\n9000', 
                '10000'
            ]
        */
        
        // Split the strings into inner arrays.
        const byElfString = byElfConcatedString.map(x => x.split("\n")) 
        /*
            [
                [ '1000', '2000', '3000' ],
                [ '4000' ],
                [ '5000', '6000' ],
                [ '7000', '8000', '9000' ],
                [ '10000' ]
            ]
        */
        
        // Convert the values of the inner arrays to numbers
        const byElf = byElfString.map(x => x.map(y => parseInt(y)));
        /*
            [
                [ 1000, 2000, 3000 ],
                [ 4000 ],
                [ 5000, 6000 ],
                [ 7000, 8000, 9000 ],
                [ 10000 ]
            ]
        */

        
        // Sum up all the inner arrays
        const sumsByElf = byElf.map(x => x.reduce((prev, curr) => {
            return prev + curr;
        }, 0));
        // [ 6000, 4000, 11000, 24000, 10000 ]

        // Find the biggest number
        const value1 = Math.max(...sumsByElf);
        // 24000

        // get the biggest number's index
        const index1 = sumsByElf.indexOf(value1);
        // remove that element
        sumsByElf[index1] = 0;

        // find the now biggest number (which is the second biggest in the original array of sums)
        const value2 = Math.max(...sumsByElf);
        // find this value's index
        const index2 = sumsByElf.indexOf(value2);
        sumsByElf[index2] = 0;

        // repeat once again
        const value3 = Math.max(...sumsByElf);
        const index3 = sumsByElf.indexOf(value3);
        sumsByElf[index3] = 0;

        const top3Sum = value1 + value2 + value3;

        return {
            part1: value1.toString(),
            part2: top3Sum.toString(),
        }
    }

}