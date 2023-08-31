import fs from "fs";
import { getEmitHelpers } from "typescript";

export type PuzzleInfo = {
    year: number;
    day: number;
    nextSubmit: number;
    input?: string;
    wrongSolutionsPart1: string[];
    wrongSolutionsPart2: string[];
    correctSolutionPart1?: string;
    correctSolutionPart2?: string;
}

export type PersistenceInfo = {
    puzzles: PuzzleInfo[];
}

const infoFile = "./data.json";

export const readInfo = (): PersistenceInfo => {
    if(!fs.existsSync(infoFile)) {
        writeInfo({puzzles: []});
    }

    const buffer = fs.readFileSync(infoFile);
    const json = buffer.toString("utf-8");
    const data = JSON.parse(json);

    if(!data) {
        return {
            puzzles: [],
        };
    }

    return data as PersistenceInfo;
}

export const writeInfo = (info: PersistenceInfo) => {
    const json = JSON.stringify(info, null, 4);
    fs.writeFileSync(infoFile, json)
};

export const setInfo = (func: (info: PersistenceInfo) => void) => {
    const info = readInfo();
    func(info);
    writeInfo(info);
};

export const setPuzzleInfo = (year: number, day: number, func: (puzzleInfo: PuzzleInfo) => void) => {
    setInfo((info) => {
        for(const puzzleInfo of info.puzzles) {
            if(puzzleInfo.year == year && puzzleInfo.day == day) {
                func(puzzleInfo);
                return;
            }
        }

        const puzzleInfo = getEmptyPuzzle(year, day);
        func(puzzleInfo);
        info.puzzles.push(puzzleInfo);
    });
};

const getEmptyPuzzle = (year: number, day: number): PuzzleInfo => {
    const puzzleInfo = {
        year: year,
        day: day,
        nextSubmit: 0,
        wrongSolutionsPart1: [],
        wrongSolutionsPart2: [],
    };

    return puzzleInfo;
};

export const getPuzzleInfo = (year: number, day: number): PuzzleInfo => {
    for(const puzzleInfo of readInfo().puzzles) {
        if(puzzleInfo.year == year && puzzleInfo.day == day) {
            return puzzleInfo;
        }
    }
    
    const puzzleInfo = getEmptyPuzzle(year, day);
    setInfo(info => {
        info.puzzles.push(puzzleInfo);
    })
    return puzzleInfo;
};