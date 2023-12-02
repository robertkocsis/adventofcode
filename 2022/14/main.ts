const inputFile: string = Deno.readTextFileSync("input.txt");

interface Point {
    x: number,
    y: number;
}

const getPathBetweenPoints = (a: Point, b: Point): Point[] => {
    const result: Point[] = [];

    if (a.x === b.x) {
        let startY = a.y < b.y ? a.y : b.y;
        let endY = a.y < b.y ? b.y + 1 : a.y + 1;
        for (let y = startY; y < endY; y++) {
            result.push({ x: a.x, y });
        }

    } else if (a.y === b.y) {
        let startX = a.x < b.x ? a.x : b.x;
        let endX = a.x < b.x ? b.x + 1 : a.x + 1;

        for (let x = startX; x < endX; x++) {
            result.push({ x, y: a.y });

        }
    }

    return result;
}


const createBasicMap = (height: number, width: number, withBottom = false) => {
    const result: Array<Array<string>> = [];

    for (let x = 0; x < height; x++) {
        result[x] = [] as string[];

        for (let y = 0; y < width; y++) {
            if (withBottom && x === height - 1) {
                result[x][y] = '#';
            } else {
                result[x][y] = '.';
            }
        }

    }
    return result;
}

const getMinAndMaxValues = (input: Point[][]): { minX: number, maxX: number, minY: number, maxY: number } => {
    let minX = 9007199254740991;
    let maxX = 0;
    let minY = 9007199254740991;
    let maxY = 0;

    input.forEach(row => {
        row.forEach(point => {
            if (point.x < minX) {
                minX = point.x;
            }
            if (point.x > maxX) {
                maxX = point.x;
            }

            if (point.y < minY) {
                minY = point.y;
            }

            if (point.y > maxY) {
                maxY = point.y;
            }
        })
    })

    return {
        minX,
        maxX,
        minY,
        maxY
    }

}

const fillMapWithRocks = (map: string[][], rocks: Point[][]) => {

    for (let x = 0; x < rocks.length; x++) {
        for (let y = 0; y < rocks[x].length; y++) {
            if (rocks[x][y + 1] !== undefined) {
                getPathBetweenPoints(rocks[x][y], rocks[x][y + 1]).forEach(point => {
                    map[point.x][point.y] = "#";
                });
            }
        }
    }
}

const getSandOrigin = (map: string[][], minY: number): Point => {
    let result = { x: 0, y: 500 - minY };

    map.forEach((row, x) => {
        row.forEach((element, y) => {
            if (element === "+") {
                result = { x, y };
            }
        })
    })

    return result;
}

const pointExists = (map: string[][], point: Point): boolean => {
    if (map[point.x] !== undefined && map[point.x][point.y] !== undefined) {
        return true;
    } else {
        return false;
    }
}

const getPossibleDestinations = (point: Point): Point[] => {
    return [{ x: point.x + 1, y: point.y }, { x: point.x + 1, y: point.y - 1 }, { x: point.x + 1, y: point.y + 1 }];
}

const extendMap = (mapToExtend: string[][]) => {
    mapToExtend.forEach((row, index) => {
        if (index === mapToExtend.length - 1) {
            for (let index = 0; index < 5; index++) {
                row.push('#');
                row.unshift('#');
            }
        } else {
            for (let index = 0; index < 5; index++) {
                row.push('.');
                row.unshift('.');
            }
        }
    })
}

const sandFall = (sandOrigin: Point, map: string[][], withBottom = false): boolean => {
    let fallQ: Point[] = [sandOrigin];


    let result = true;

    while (fallQ.length > 0) {
        fallQ.forEach(point => {
            fallQ.shift()

            if (withBottom && (point.y === 0 || point.y === map[0].length - 1)) {
                extendMap(map);
                point.y = point.y + 5;
            }

            let element = map[point.x][point.y];
            if (element === "." || element === "+") {
                const possibleDestinations = getPossibleDestinations(point).filter(point => {
                    return pointExists(map, point) && map[point.x][point.y] === ".";
                });

                const canFallDownwards = possibleDestinations.length > 0 && possibleDestinations[0].x === point.x + 1;
                if (canFallDownwards) {
                    fallQ.push(possibleDestinations[0]);
                } else if (possibleDestinations.length > 0) {
                    fallQ.push(...possibleDestinations);
                } else {
                    if (withBottom) {
                        if (map[point.x][point.y] === "+") {
                            map[point.x][point.y] = "o";
                            result = false;
                        } else {
                            map[point.x][point.y] = "o";
                        }

                    } else {
                        if (point.y === map[0].length || point.y === 0) {
                            result = false;
                        } else {
                            map[point.x][point.y] = "o";
                        }
                    }


                    fallQ = [];
                }

            } else if (element === "o" || "#") {
                const possibleDestinations = getPossibleDestinations(point).filter(point => {
                    return pointExists(map, point) && map[point.x][point.y] === ".";
                });
                fallQ.push(...possibleDestinations);
            }

        })
    }

    return result;
}

const main = () => {
    let parsedInput: Point[][] = inputFile.split('\n').map(row => row.split(" -> ")).map(row => row.map(el => {
        return {
            x: +el.split(",")[1],
            y: +el.split(",")[0]
        } as Point;
    }));
    let { minX, maxX, minY, maxY } = getMinAndMaxValues(parsedInput);
    parsedInput.forEach(row => row.forEach(element => {
        element.y = element.y - minY
    }))

    const doPart1 = () => {
        const map = createBasicMap(maxX + 1, maxY - minY + 1);
        fillMapWithRocks(map, parsedInput);
        map[0][500 - minY] = "+";

        let counter = 0;

        while (sandFall(getSandOrigin(map, minY), map)) {
            counter++;
        }

        return counter;

    }
    const doPart2 = () => {
        const map = createBasicMap(maxX + 3, maxY - minY + 1, true);
        fillMapWithRocks(map, parsedInput);
        map[0][500 - minY] = "+";

        let counter = 1;

        while (sandFall(getSandOrigin(map, minY), map, true)) {
            counter++;
        }
        return counter;
    }

    console.log('part1', doPart1());
    console.log('part2', doPart2());
}

main();



