import { JSDOM } from "jsdom";
import { SESSION_TOKEN } from "../secrets";
import { getPuzzle, getPuzzleInput } from "../utils";
import kleur from "kleur";
import moment from "moment";
import { getPuzzleInfo, setPuzzleInfo } from "../persistence";
import { Puzzle } from "../types";

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
        console.error("Usage: npm run submit YEAR_NUMBER DAY_NUMBER PART_NUMBER");
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
    const answer = part == 1 ? solution.part1 : solution.part2;

    if(!answer) {
        console.log("Puzzle does not provide requested answer");
        return;
    }

    const puzzleInfo = getPuzzleInfo(year, day);
    if(part == 1 && puzzleInfo.wrongSolutionsPart1.includes(answer)) {
        console.log("Already submitted this WRONG part 1 solution.");
        return;
    }
    if(part == 2 && puzzleInfo.wrongSolutionsPart2.includes(answer)) {
        console.log("Already submitted this WRONG part 2 solution.");
        return;
    }

    const response = await fetch("https://adventofcode.com/" + year + "/day/" + day + "/answer", {
        method: "POST",
        headers: {
            Cookie: "session=" + SESSION_TOKEN,
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "github.com/ngschaider/adventofcode-ts"
        },
        body: "level=" + part + "&answer=" + answer,
    });


    if(response.status != 200) {
        console.error("Invalid response:")
        console.error(response.status)
        console.error(await response.text());
        return;
    }
    
    const body = await response.text();
    const $main = new JSDOM(body).window.document.querySelector("main");

    const info =
        $main !== null
          ? ($main.textContent as string).replace(/\[.*\]/, "").trim()
          : "Can't find the main element"

    if (info.includes("That's the right answer")) {
        console.log("Status", kleur.green(`PART ${part} SOLVED!`))
        if(part == 1) {
            setPuzzleInfo(year, day, puzzle => puzzle.correctSolutionPart1 = answer);
        } else if(part == 2) {
            setPuzzleInfo(year, day, puzzle => puzzle.correctSolutionPart2 = answer);
        }
    } else if (info.includes("That's not the right answer")) {
        console.log("Status:", kleur.red("WRONG ANSWER"))
        console.log("\n" + info + "\n");
        if(part == 1) {
            setPuzzleInfo(year, day, puzzle => puzzle.wrongSolutionsPart1.push(answer));
        } else if(part == 2) {
            setPuzzleInfo(year, day, puzzle => puzzle.wrongSolutionsPart2.push(answer));
        }
    } else if (info.includes("You gave an answer too recently")) {
        console.log("Status:", kleur.yellow("TO SOON"))
    } else if (info.includes("You don't seem to be solving the right level")) {
        console.log("Status:", kleur.yellow("ALREADY COMPLETED or LOCKED"))
    } else {
        console.log("Status:", kleur.red("UNKNOWN RESPONSE\n"))
        console.log("\n" + info + "\n");
    }

    const waitStr = info.match(/(one|two|three|four|five|six|seven|eight|nine|ten) (second|minute|hour|day)/);
    const waitNum = info.match(/\d+\s*(s|m|h|d)/g);

    if (waitStr !== null || waitNum !== null) {
        const waitTime: Record<string, number> = {
            s: 0,
            m: 0,
            h: 0,
            d: 0,
        };

        if (waitStr !== null) {
            const [_, time, unit] = waitStr
            waitTime[unit[0]] = strToNum(time)
        } else if (waitNum !== null) {
            waitNum.forEach((x) => {
                waitTime[x.slice(-1)] = Number(x.slice(0, -1));
            })
        }

        const nextTry = moment();
        nextTry.add(waitTime.d, "day");
        nextTry.add(waitTime.h, "hour");
        nextTry.add(waitTime.m, "minute");
        nextTry.add(waitTime.s, "second");

        console.log("Next request possible in: " + nextTry.fromNow())
    }
}

main();
