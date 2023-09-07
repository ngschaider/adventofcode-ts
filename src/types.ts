export type Solution = {
    part1?: string;
    part2?: string;
}

export type Sample = {
    input: string;
    solution: Solution;
}

export abstract class Puzzle {

    /**
     * @deprecated use `samples` instead
     */
    public sampleInput?: string
    /**
     * @deprecated use `samples` instead
     */
    public sampleSolution?: Solution;

    public samples: Sample[] = [];

    public abstract solve(input: string): Promise<Solution>;

}