const inputFile: string = Deno.readTextFileSync("input.txt");

interface Point {
    row: number,
    col: number;
}

const getMinAndMaxValues = (input: Point[][]): { minColumn: number, maxColumn: number, minRow: number, maxRow: number } => {
    let minColumn = 9007199254740991;
    let maxColumn = 0;
    let minRow = 9007199254740991;
    let maxRow = 0;

    input.forEach(row => {
        row.forEach(point => {
            if (point.col < minColumn) {
                minColumn = point.col;
            }
            if (point.col > maxColumn) {
                maxColumn = point.col;
            }

            if (point.row < minRow) {
                minRow = point.row;
            }

            if (point.row > maxRow) {
                maxRow = point.row;
            }
        })
    })

    return {
        minColumn,
        maxColumn,
        minRow,
        maxRow
    }
}


const getDistance = (a: Point, b: Point): number => {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

const pointsEqual = (a: Point, b: Point): boolean => {
    return a.row === b.row && a.col === b.col;
}


const main = () => {


    const doPart1 = () => {
        const parsedInput: Point[][] = inputFile.split("\n")
            .map(element => element.split(": ")
                .map(el => el.split(", ")))
            .map(row => {
                return row.map(el => {
                    return el.map(subEl => {
                        return +subEl.split("=")[1];
                    });
                }).map(row => {
                    return { row: row[1], col: row[0] }
                });
            });

        let { minColumn, maxColumn, minRow, maxRow } = getMinAndMaxValues(parsedInput);

        const points: Point[] = [];

        const maxDistance = parsedInput.map(pair => {
            return getDistance(pair[0], pair[1])
        }).sort((a, b) => a - b).reverse()[0];

        for (let col = minColumn - maxDistance; col <= maxColumn + maxDistance; col++) {
            points.push({ col, row: 2000000 })
        }

        const row: string[] = points.map(point => {
            let result = ".";

            parsedInput.forEach(row => {
                if (pointsEqual(point, row[0])) {
                    result = "S";
                } else if (pointsEqual(point, row[1])) {
                    result = "B";
                }
            })

            return result;
        })

        points.forEach((point, index) => {
            parsedInput.forEach(pair => {
                if (getDistance(pair[0], point) <= getDistance(pair[0], pair[1])) {
                    if (row[index] === ".") {
                        row[index] = "#";
                    }
                }
            })
        })

        return row.filter(el => el === '#').length;
    }
    const doPart2 = () => {
        const parsedInput: Point[][] = inputFile.split("\n")
            .map(element => element.split(": ")
                .map(el => el.split(", ")))
            .map(row => {
                return row.map(el => {
                    return el.map(subEl => {
                        return +subEl.split("=")[1];
                    });
                }).map(row => {
                    return { row: row[0], col: row[1] }
                });
            });

        const negLines: number[] = [];
        const posLines: number[] = [];

        parsedInput.forEach(pair => {
            const sensor = pair[0];
            const dist = getDistance(pair[0], pair[1]);
            negLines.push(sensor.row + sensor.col - dist, sensor.row + sensor.col + dist)
            posLines.push(sensor.row - sensor.col - dist, sensor.row - sensor.col + dist)
        });



        let pos;
        let neg;


        for (let i = 0; i < posLines.length; i++) {
            for (let j = i + 1; j < posLines.length; j++) {
                let lineA = posLines[i];
                let lineB = posLines[j];

                if (Math.abs(lineA - lineB) === 2) {
                    pos = Math.min(lineA, lineB) + 1;
                }

                lineA = negLines[i];
                lineB = negLines[j];

                if (Math.abs(lineA - lineB) === 2) {
                    neg = Math.min(lineA, lineB) + 1;
                }
            }
        }



        let x = (pos + neg) / 2;
        let y = (neg - pos) / 2;

        console.log('x', x);
        console.log('y', y);

        return x * 4000000 + y;

    }

    console.log('part1', doPart1());
    console.log('part2', doPart2());
}

main();



