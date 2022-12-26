const inputFile: string = Deno.readTextFileSync("input.txt");
const stepInput = inputFile.split('\n\n').map(row => row.split("\n"));


const comparator = (a: Array<any> | number, b: Array<any> | number): -1 | 0 | 1 => {
    if (typeof a === 'number' && typeof b === 'number') {
        if (a === b) {
            return 0;
        } else {
            return a < b ? 1 : -1;
        }
    } else if (Array.isArray(a) && Array.isArray(b)) {

        const maxIteration = Math.max(a.length, b.length);

        for (let x = 0; x < maxIteration; x++) {
            if (a[x] === undefined) return 1;
            if (b[x] === undefined) return -1;

            if (comparator(a[x], b[x]) === 0) {
                continue;
            } else {
                return comparator(a[x], b[x]);
            }
        }

        return 0;
    } else {
        return comparator(Array.isArray(a) ? a : [a], Array.isArray(b) ? b : [b]);
    }
}

const main = () => {
    const doPart1 = () => {
        const parsedInput = stepInput.map(row => row.map(element => JSON.parse(element)));

        console.log(parsedInput.map((row, index) => {
            return comparator(row[0], row[1]) === 1 ? index + 1 : 0;
        }));

        console.log(parsedInput.map((row, index) => {
            return comparator(row[0], row[1]) === 1 ? index + 1 : 0;
        }).reduce((a, b) => a + b, 0));
    }
    const doPart2 = () => {
        const parsedInput = stepInput.map(row => row.map(element => JSON.parse(element))).flat(1);
        const dividers = [[[2]], [[6]]]
        parsedInput.push(...dividers);
        parsedInput.sort((a, b) => {
            if (comparator(a, b) === 1) {
                return -1;
            } else if (comparator(a, b) === -1) {
                return 1;
            }

            return 0;
        });


        return (parsedInput.indexOf(dividers[0]) + 1) * (parsedInput.indexOf(dividers[1]) + 1);
    }

    console.log('part1', doPart1());
    console.log('part2', doPart2());
}

main();