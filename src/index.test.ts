import expect from "expect";
import { assert } from "chai";
import fs from "fs";
import { getPuzzle, getPuzzleInput } from "./utils";

const yearFolders = fs.readdirSync("./src/puzzles");
for(const yearFolder of yearFolders) {
	const year = yearFolder.substring(4);
	describe("Year " + year, () => {
		const dayFolders = fs.readdirSync("./src/puzzles/" + yearFolder);
		for(const dayFolder of dayFolders) {
			const day = dayFolder.substring(3);
			describe("Day " + day, async () => {
				describe("Part 1", () => {
					it("should produce the sample solution(s)", async () =>  {
						const puzzle = await getPuzzle(parseInt(year), parseInt(day));

						for(const sample of puzzle.samples) {
							const solution = await puzzle.solve(sample.input);
							if(solution !== undefined) {
								expect(solution.part1).toBe(sample.solution.part1);
							}
						}

						if(puzzle.sampleInput && puzzle.sampleSolution) {
							const sampleSolution = await puzzle.solve(puzzle.sampleInput);
							expect(sampleSolution.part1).toBe(puzzle.sampleSolution.part1);
						}
					});

					/*it("should not produce 'NaN' as the real solution", async () => {
						const puzzle = await getPuzzle(parseInt(year), parseInt(day));
						const realInput = await getPuzzleInput(parseInt(year), parseInt(day));
						const realSolution = await puzzle.solve(realInput);
						expect(realSolution.part1).not.toBe("NaN");
					})*/
				})
				
				describe("Part 2", () =>  {
					it("should produce the sample solution(s)", async () =>  {
						const puzzle = await getPuzzle(parseInt(year), parseInt(day));

						for(const sample of puzzle.samples) {
							const solution = await puzzle.solve(sample.input);
							if(solution !== undefined && sample.solution.part2 !== undefined) {
								expect(solution.part2).toBe(sample.solution.part2);
							}
						}

						if(puzzle.sampleInput && puzzle.sampleSolution) {
							const sampleSolution = await puzzle.solve(puzzle.sampleInput);
							expect(sampleSolution.part2).toBe(puzzle.sampleSolution.part2);
						}
					});

					/*it("should not produce 'NaN' as the real solution", async () => {
						const puzzle = await getPuzzle(parseInt(year), parseInt(day));
						const realInput = await getPuzzleInput(parseInt(year), parseInt(day));
						const realSolution = await puzzle.solve(realInput);
						expect(realSolution.part2).not.toBe("NaN");
					})*/
				});
			});
		}
	});
}