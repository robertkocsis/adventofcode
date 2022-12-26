

interface Move {
    amount: number,
    fromId: number,
    toId: number;
}


interface CrateStack {
    stackId: number;
    crates: Array<string>
}

const inputFile: string = Deno.readTextFileSync("input.txt");

const inputLines: Array<string> = inputFile.split('\n').filter(element => element != '');


const getPossibleIndexes = (infoString: string): Array<number> => {
    let result: Array<number> = [];
    const maxIndex = (stackInfo[0].length + 2);

    for (let index = 2; index < maxIndex; index += 4) {
        result.push(index - 1);
    }
    return result;
}

const createCrateStack = (index: number, stackInfo: Array<string>): CrateStack => {
    const stackId = +stackInfo[stackInfo.length - 1].charAt(index);

    const result = {
        stackId,
        crates: []
    } as CrateStack

    stackInfo.forEach(line => {
        if (line[index].toLowerCase() !== line[index]) {
            result.crates.push(line[index]);
        }
    })

    return result;
}


const createMoves = (inputLines: Array<string>): Array<Move> => {
    return inputLines
        .filter(element => element.includes('move'))
        .map(element => element.split(' '))
        .map(element => {
            return {
                amount: +element[1],
                fromId: +element[3],
                toId: +element[5]
            } as Move
        })
}


const stackInfo: Array<string> = inputLines.filter(element => !element.includes('move'));
const possibleIndexes = getPossibleIndexes(stackInfo[0]);
const crateStacks1: Array<CrateStack> = possibleIndexes.map(index => createCrateStack(index, stackInfo));
const crateStacks2: Array<CrateStack> = possibleIndexes.map(index => createCrateStack(index, stackInfo));
const moveInfo: Array<Move> = createMoves(inputLines);


const doMoves = (moves: Array<Move>, stacks: Array<CrateStack>, newCrane = false) => {
    moves.forEach(move => {
        const fromStack = stacks.find(stack => stack.stackId === move.fromId)!;
        const toStack = stacks.find(stack => stack.stackId === move.toId)!;

        const movedCrates: Array<string> = [];
        for (let index = 0; index < move.amount; index++) {
            if (fromStack.crates.length > 0) {
                movedCrates.push(fromStack.crates.shift()!);
            }
        }

        if (newCrane) {
            toStack.crates.unshift(...movedCrates);
        } else {
            toStack.crates.unshift(...movedCrates.reverse())
        }
    })
}


doMoves(moveInfo, crateStacks1);
console.log('part1', crateStacks1.map(element => element.crates[0]).join(''));

doMoves(moveInfo, crateStacks2, true);
console.log('part2', crateStacks2.map(element => element.crates[0]).join(''));
