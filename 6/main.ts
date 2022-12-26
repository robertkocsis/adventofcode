

const inputFile: string = Deno.readTextFileSync("input.txt");

const isStringUnique = (input: string): boolean => {
    const ogLength = input.length;
    const setLength = new Set(input.split('')).size;

    return ogLength === setLength;
}

const getMarkerByOffset = (offset: number) => {

    for (let index = 0; index < inputFile.length - offset; index++) {
        let markerString = '';
        for (let y = 0; y < offset; y++) {
            markerString += inputFile[index + y];
        }

        if (isStringUnique(markerString)) {
            return index + offset;
        }

    }

    throw new Error('Marker not found!');
}


console.log('part1', getMarkerByOffset(4));
console.log('part2', getMarkerByOffset(14));
