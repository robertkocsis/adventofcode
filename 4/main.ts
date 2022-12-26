
const inputFile: string = Deno.readTextFileSync("input.txt");


interface Range {
    start: number
    end: number
}

const twoDInput: Array<Array<Range>> = inputFile.split('\n').map(input => input.split(',').map(rangeString => {
    return { start: +rangeString.split('-')[0], end: +rangeString.split('-')[1] } as Range
}));


const doPairsContainEachOther = (a: Range, b: Range): boolean => {
    const aContainsB = a.start <= b.start && a.end >= b.end;
    const bContainsA = b.start <= a.start && b.end >= a.end;
    return aContainsB || bContainsA;
}

const isOverlapping = (a: Range, b: Range): boolean => {
    const aOverlapsB = a.start <= b.start && a.end >= b.start || a.start <= b.end && a.end >= b.end;
    const bOverlapsA = b.start <= a.start && b.end >= a.start || b.start <= a.end && b.end >= a.end;
    return aOverlapsB || bOverlapsA;
}

console.log('part1', twoDInput.filter(rangePair => doPairsContainEachOther(rangePair[0], rangePair[1])).length)
console.log('part2', twoDInput.filter(rangePair => isOverlapping(rangePair[0], rangePair[1])).length)
