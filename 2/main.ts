const input: string = Deno.readTextFileSync("input.txt");


interface Move {
    input: 'A' | 'B' | 'C'
    response: 'X' | 'Y' | 'Z'
    score: 1 | 2 | 3
}

const rock: Move = { input: 'A', response: 'X', score: 1 };
const paper: Move = { input: 'B', response: 'Y', score: 2 };
const scissors: Move = { input: 'C', response: 'Z', score: 3 };


const movePairs = [[rock, scissors], [paper, rock], [scissors, paper]];

let responseIsExpectedOutcome = false;

const getMovePairByCode = (code: string): Move[] => {
    const movePair = movePairs.find(movePair => movePair[0].input === code || movePair[0].response === code);
    if (movePair) {
        return movePair;
    } else {
        throw Error('invalid move');
    }
}

const getMovePairByExpectedOutcome = (input: Move[], expectedOutcome: string): Move[] => {
    if (expectedOutcome === 'X') {
        return movePairs.find(pair => pair[0] === input[1])!;
    } else if (expectedOutcome === 'Y') {
        return input;
    } else if (expectedOutcome === 'Z') {
        return movePairs.find(pair => pair[1] === input[0])!;
    }

    throw Error('invalid expected outcome')
}

const fight = (input: Move[], response: Move[]): 0 | 3 | 6 => {
    if (input[1] === response[0]) {
        return 0;
    } else if (input === response) {
        return 3;
    } else {
        return 6;
    }
}

const getPointsFromCodePair = (inputCode: string, responseCode: string): number => {
    const input = getMovePairByCode(inputCode);
    const response = responseIsExpectedOutcome ? getMovePairByExpectedOutcome(input, responseCode) : getMovePairByCode(responseCode);
    return fight(input, response) + response[0].score;
}

const calculatePoints = () => {
    const fights = input.split('\n').map(subArray => subArray.split(' '));
    return fights.map(fight => getPointsFromCodePair(fight[0], fight[1])).reduce((a, b) => a + b, 0);

}

console.log('part1', calculatePoints());
responseIsExpectedOutcome = true;
console.log('part2', calculatePoints());

