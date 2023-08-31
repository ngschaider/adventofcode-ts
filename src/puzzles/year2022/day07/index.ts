import { Solution, Puzzle, Sample } from "../../../types";

export default class extends Puzzle {
    public samples: Sample[] = [
        {
            input: "$ cd /\n$ ls\ndir a\n14848514 b.txt\n8504156 c.dat\ndir d\n$ cd a\n$ ls\ndir e\n29116 f\n2557 g\n62596 h.lst\n$ cd e\n$ ls\n584 i\n$ cd ..\n$ cd ..\n$ cd d\n$ ls\n4060174 j\n8033020 d.log\n5626152 d.ext\n7214296 k", 
            solution: {part1: "95437"}
        },
    ]

    public async solve(input: string): Promise<Solution> {

        return {
            part1: "",
        }
    }

}