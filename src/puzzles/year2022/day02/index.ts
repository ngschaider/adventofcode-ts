import { Solution, Puzzle } from "../../../types";

enum Move {
    Rock,
    Paper,
    Scissors,
}

type Round = {
    playerMove: Move,
    enemyMove: Move,
}

enum RoundEnd {
    Win,
    Lose,
    Draw
}

export default class extends Puzzle {
    public sampleInput: string = "A Y\nB X\nC Z";
    public sampleSolution: Solution = {
        part1: "15",
        part2: "12",
    };

    private getScore(rounds: Round[]): number {
        let score = 0;

        for(const round of rounds) {
            if(round.playerMove == Move.Rock) {
                score += 1;
                if(round.enemyMove == Move.Rock) {
                    score += 3;
                } else if(round.enemyMove == Move.Paper) {
                    score += 0;
                } else if(round.enemyMove == Move.Scissors) {
                    score += 6;
                } else {
                    throw new Error("Forgot something when player plays Rock");
                }
            } else if(round.playerMove == Move.Paper) {
                score += 2;
                if(round.enemyMove == Move.Rock) {
                    score += 6;
                } else if(round.enemyMove == Move.Paper) {
                    score += 3;
                } else if(round.enemyMove == Move.Scissors) {
                    score += 0;
                } else {
                    throw new Error("Forgot something when player plays Paper");
                }
            } else if(round.playerMove == Move.Scissors) {
                score += 3;
                if(round.enemyMove == Move.Rock) {
                    score += 0;
                } else if(round.enemyMove == Move.Paper) {
                    score += 6;
                } else if(round.enemyMove == Move.Scissors) {
                    score += 3;
                } else {
                    throw new Error("Forgot something when player plays Scissors");
                }
            } else {
                throw new Error("Forgot something");
            }
        }

        return score;
    }

    public async solve(input: string): Promise<Solution> {
        const rounds1: Array<Round> = input.trim().split("\n").map(roundStr => {
            const [enemyMove, playerMove] = roundStr.split(" ").map(char => {
                if(["A", "X"].includes(char)) return Move.Rock;
                if(["B", "Y"].includes(char)) return Move.Paper;
                if(["C", "Z"].includes(char)) return Move.Scissors;
                throw new Error("Could not parse move '" + char + "'");
            });

            return {
                enemyMove,
                playerMove,
            }
        });

        const score1 = this.getScore(rounds1);


        const rounds2: Array<Round> = input.trim().split("\n").map(roundStr => {
            const enemyChar = roundStr.split(" ")[0];
            const enemyMove = (() => {
                if(enemyChar == "A") return Move.Rock;
                if(enemyChar == "B") return Move.Paper;
                if(enemyChar == "C") return Move.Scissors;
                throw new Error("Forgot something when deciding enemyMove");
            })();
            
            const playerChar = roundStr.split(" ")[1];
            const playerMove = (() => {
                if(playerChar == "X") {
                    // lose
                    if(enemyMove == Move.Rock) return Move.Scissors;
                    if(enemyMove == Move.Paper) return Move.Rock;
                    if(enemyMove == Move.Scissors) return Move.Paper;
                    throw new Error("Forgot something when deciding playerMove for 'X'");
                } else if(playerChar == "Y") {
                    // draw
                    return enemyMove;
                } else if(playerChar == "Z") {
                    // win
                    if(enemyMove == Move.Rock) return Move.Paper;
                    if(enemyMove == Move.Paper) return Move.Scissors;
                    if(enemyMove == Move.Scissors) return Move.Rock;
                    throw new Error("Forgot something when deciding playerMove for 'Z'");
                }
                throw new Error("Forgot something when deciding playerMove");
            })();

            return {
                enemyMove, 
                playerMove
            };
        })


        const score2 = this.getScore(rounds2);

        return {
            part1: score1.toString(),
            part2: score2.toString(),
        }
    }

}