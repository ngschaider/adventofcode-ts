import { getPuzzleInfo, setPuzzleInfo } from "./persistence";
import { SESSION_TOKEN } from "./secrets";
import { Puzzle } from "./types";

export const getPuzzleInput = async (year: number, day: number): Promise<string> => {
    const info = getPuzzleInfo(year, day);
    if(info.input) {
        return info.input;
    }

    const response = await fetch("https://adventofcode.com/" + year + "/day/" + day + "/input", {
        method: "GET",
        headers: {
            "Cookie": "session=" + SESSION_TOKEN,
            "User-Agent": "github.com/ngschaider/adventofcode-ts",
        }
    });

    const input = await response.text();

    setPuzzleInfo(year, day, puzzleInfo => puzzleInfo.input = input);

    return input;
}

export const getPuzzle = async (year: number, day: number): Promise<Puzzle> => {
    const imported = await import("./puzzles/year" + year + "/day" + day.toString().padStart(2, "0") + "/index");
    const PuzzleClass = imported.default;
	const puzzle = new PuzzleClass() as Puzzle;

    return puzzle;
}