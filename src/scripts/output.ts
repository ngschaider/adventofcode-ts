import { JSDOM } from "jsdom";
import { SESSION_TOKEN } from "../secrets";
import { getPuzzle, getPuzzleInput } from "../utils";
import kleur from "kleur";
import moment from "moment";
import { getPuzzleInfo, setPuzzleInfo } from "../persistence";

const strToNum = (time: string) => {
    const entries: { [key: string]: number } = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10,
    }

    return entries[time] || NaN
}

const main = async () => {
    if(process.argv.length < 5) {
        console.error("Incorrect usage.");
        console.error("Usage: npm run test YEAR_NUMBER DAY_NUMBER PART_NUMBER");
        return;
    }
    
    const year = parseInt(process.argv[2]);
    if(isNaN(year)) {
        console.error("Could not parse year number");
        return;
    }

    const day = parseInt(process.argv[3]);
    if(isNaN(day)) {
        console.error("Could not parse day number");
        return;
    }

    const part = parseInt(process.argv[4]);
    if(isNaN(part) || (part != 1 && part != 2)) {
        console.error("Could not parse part number");
        return;
    }

    const input = await getPuzzleInput(year, day);

    const puzzle = await getPuzzle(year, day);
    const solution = await puzzle.solve(input);
    const answer = part === 1 ? solution.part1 : solution.part2;

    if(!answer) {
        console.log("Puzzle does not provide requested answer");
        return;
    }

    console.log(answer);
}

main();
