import { OutputFileType } from "typescript";
import { Solution, Puzzle, Sample } from "../../../types";

class Directory {
    isDirectory(): this is Directory {
        return true;
    };
    isFile(): this is File { 
        return false;
    };

    name: string;

    contents: (Directory|File)[] = [];
    parentDirectory: Directory|null = null;

    constructor(name: string) {
        this.name = name;
    }

    get size(): number {
        return this.contents.map(c => c.size).reduce((a,b) => a+b, 0);
    }

    get fullPath(): string {
        if(!this.parentDirectory) return "/";
        // the regex replaces double slashes that are produced when concatinating the root dir
        // e.g. for directory "a" in the root dir: "/" + "/" + "a" = "//a" regex makes -> "/a"
        return (this.parentDirectory.fullPath + "/" + this.name).replaceAll(/\/(?=)\/*/, "/");
    }
}

class File {
    isDirectory(): this is Directory {
        return false;
    };
    isFile(): this is File { 
        return true;
    };

    name: string;
    size: number;
    directory: Directory;

    constructor(name: string, size: number, directory: Directory) {
        this.name = name;
        this.size = size;
        this.directory = directory;
    }
}

class Filesystem implements Iterable<Directory|File> {
    
    root: Directory = new Directory("/");

    build(input: string) {
        const lines = input.trim().split("\n");

        let currentDirectory = this.root;

        for(const line of lines) {
            if(line.startsWith("$ cd")) {
                const [_, name] = /^\$ cd (.*)$/.exec(line) || [];

                if(!name){
                    throw new Error("Could not parse directory name");
                }

                if(name == "..") {
                    if(!currentDirectory.parentDirectory) {
                        throw new Error("Cannot go higher than root directory");
                    }
                    currentDirectory = currentDirectory.parentDirectory;
                } else if(name == "/") {
                    currentDirectory = this.root;
                } else {
                    const subdir = currentDirectory.contents.find(c => c.isDirectory() && c.name == name);
                    if(!subdir || !subdir.isDirectory()) {
                        throw new Error();
                    }
                    currentDirectory = subdir;
                }
            } else if(line.startsWith("$ ls")) {
                continue
            } else {
                // in a "ls" output
                if(line.startsWith("dir ")) {
                    const [_, name] = /^dir ([a-z.]*)$/.exec(line) || [];
                    if(!name) {
                        throw new Error();
                    }

                    const dir = new Directory(name);
                    dir.parentDirectory = currentDirectory;
                    currentDirectory.contents.push(dir);
                } else {
                    const [_, sizeStr, name] = /^([0-9]*) ([a-z.]*)$/.exec(line) || [];
                    if(!sizeStr || !name) {
                        throw new Error();
                    }

                    const size = parseInt(sizeStr);
                    currentDirectory.contents.push(new File(name, size, currentDirectory));
                }
            }
        }
    }

    *walk(directory: Directory): Generator<Directory|File> {
        for(const c of directory.contents) {
            yield c;
            if(c.isDirectory()) {
                yield* this.walk(c);
            }
        }
    }

    *[Symbol.iterator](): Iterator<Directory|File> {
        yield* this.walk(this.root);
    }

    toString(dir = this.root, indent = 0): string {
        let output = "";

        const dirToString = (dir: Directory) => "- " + dir.name + " (dir, size=" + dir.size + ")";
        const fileToString = (file: File) => "- " + file.name + " (file, size=" + file.size + ")";
        const indentStr = Array.from({length: indent}).map(_ => " ").join("");

        output += indentStr + dirToString(dir) + "\n";
        for(const c of dir.contents) {
            if(c.isDirectory()) {
                output += this.toString(c, indent + 2) + "\n";
            }
            if(c.isFile()) {
                output += indentStr + "  " + fileToString(c) + "\n";
            }
        }

        return output.trimEnd();
    }

}


export default class extends Puzzle {
    public samples: Sample[] = [
        {
            input: "$ cd /\n$ ls\ndir a\n14848514 b.txt\n8504156 c.dat\ndir d\n$ cd a\n$ ls\ndir e\n29116 f\n2557 g\n62596 h.lst\n$ cd e\n$ ls\n584 i\n$ cd ..\n$ cd ..\n$ cd d\n$ ls\n4060174 j\n8033020 d.log\n5626152 d.ext\n7214296 k", 
            solution: {part1: "95437", part2: "24933642"}
        },
    ]

    public async solve(input: string): Promise<Solution> {
        const filesystem = new Filesystem();
        filesystem.build(input);


        // console.log(filesystem.toString());

        let part1 = 0;
        for(const c of filesystem) {
            if(c.isDirectory() && c.size <= 100_000) {
                part1 += c.size;
            }
        }


        // PART 2:
        const usedSpace = filesystem.root.size;
        const requiredSpace = 30_000_000;
        const totalSpace = 70_000_000;
        const freeSpace = totalSpace - usedSpace;
        const spaceToDelete = requiredSpace - freeSpace;

        let dir = filesystem.root;
        for(const c of filesystem) {
            if(!c.isDirectory()) {
                continue;
            }

            if(c.size >= spaceToDelete && c.size < dir.size) {
                dir = c;
            }
        }

        return {
            part1: part1.toString(),
            part2: dir.size.toString(),
        }
    }

}