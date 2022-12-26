const inputFile: string = Deno.readTextFileSync("input.txt");
const stepInput = inputFile.split('\n').map(row => row.split(""));


class Step {
    elevation: string;
    possibleNextSteps: Set<Step>;

    constructor(elevation: string, possibleNextSteps: Set<Step> = new Set()) {
        this.elevation = elevation;
        this.possibleNextSteps = possibleNextSteps;
    }
}

const canWalkBetweenSteps = (origin: Step, destination: Step): boolean => {
    let originElevation = origin.elevation;
    let destinationElevation = destination.elevation;

    if (originElevation === 'S') {
        originElevation = 'a';
    } else if (destinationElevation === 'S') {
        destinationElevation = 'a';
    }

    if (originElevation === 'E') {
        originElevation = 'z';
    } else if (destinationElevation === 'E') {
        destinationElevation = 'z';
    }

    if (destinationElevation.charCodeAt(0) > originElevation.charCodeAt(0)) {
        return destinationElevation.charCodeAt(0) - originElevation.charCodeAt(0) === 1;
    }

    return true;
}

const getNearbySteps = (step: Step, location: { x: number, y: number }, steps: Step[][]) => {
    const nearbyLocations: { x: number, y: number }[] = [];

    if (location.x > 0) {
        nearbyLocations.push({ x: location.x - 1, y: location.y });
    }

    if (location.x < steps.length - 1) {
        nearbyLocations.push({ x: location.x + 1, y: location.y });
    }

    if (location.y > 0) {
        nearbyLocations.push({ x: location.x, y: location.y - 1 });
    }

    if (location.y < steps[0].length - 1) {
        nearbyLocations.push({ x: location.x, y: location.y + 1 });
    }

    nearbyLocations.forEach(location => {
        const currentStep = steps[location.x][location.y];
        if (canWalkBetweenSteps(step, currentStep)) {
            step.possibleNextSteps.add(currentStep);
        }

    })

}

const getSteps = (): Step[][] => {
    const steps: Step[][] = [];

    stepInput.forEach(row => {
        const stepRow: Step[] = [];
        row.forEach(rowElement => {
            stepRow.push(new Step(rowElement));
        })
        steps.push(stepRow);
    })

    return steps;
}

const getShortestRouteBetween = (start: Step, end: Step): number => {
    const visited: Step[] = [];
    const toVisit: Step[] = [start];

    let steps = -1;
    let found = false;

    while (!found) {
        steps++;
        [...toVisit].forEach(step => {
            visited.push(step);
            toVisit.shift();

            if (step === end) {
                found = true;
                return;
            }

            step.possibleNextSteps.forEach(step => {
                if (!visited.includes(step) && !toVisit.includes(step)) {
                    toVisit.push(step);
                }
            })

        });
    }
    return steps;
}

const getShortestRouteForHike = (end: Step): number => {
    const visited: Step[] = [];
    const toVisit: Step[] = [end];

    let steps = -1;
    let found = false;

    while (!found) {
        steps++;
        [...toVisit].forEach(step => {
            visited.push(step);
            toVisit.shift();

            if (step.elevation === 'a' || step.elevation === 'S') {
                found = true;
                return;
            }

            step.possibleNextSteps.forEach(step => {
                if (!visited.includes(step) && !toVisit.includes(step)) {
                    toVisit.push(step);
                }
            })

        });
    }
    return steps;
}

const findStartAndEndStep = (steps: Step[][]): { start: Step, end: Step } => {
    let result: { start?: Step, end?: Step } = {};

    for (let x = 0; x < steps.length; x++) {
        const row = steps[x];
        for (let y = 0; y < row.length; y++) {
            const element = row[y];

            if (element.elevation === 'S') {
                result.start = element;
            } else if (element.elevation === 'E') {
                result.end = element;
            }
        }
    }

    if (result.start !== undefined && result.end !== undefined) {
        return result;

    }

    throw new Error('error');
}

const findLowestSteps = (steps: Step[][]): Step[] => {
    const result: Step[] = [];

    for (let x = 0; x < steps.length; x++) {
        const row = steps[x];
        for (let y = 0; y < row.length; y++) {
            const element = row[y];

            if (element.elevation === 'S' || element.elevation === 'a') {
                let usableStep = false;
                element.possibleNextSteps.forEach(element => {
                    if (element.elevation === 'b') {
                        usableStep = true;
                    }
                })

                if (usableStep) {
                    result.push(element);
                }
            }
        }
    }

    return result;
}

const main = () => {
    const doPart1 = () => {
        const steps: Step[][] = getSteps();
        steps.forEach((row, x) => {
            row.forEach((step, y) => {
                getNearbySteps(step, { x, y }, steps);
            })
        })

        const { start, end } = findStartAndEndStep(steps);

        return getShortestRouteBetween(start, end);

    }
    const doPart2 = () => {
        const steps: Step[][] = getSteps();
        steps.forEach((row, x) => {
            row.forEach((step, y) => {
                getNearbySteps(step, { x, y }, steps);
            })
        })

        const { end } = findStartAndEndStep(steps);

        const result: number[] = [];
        findLowestSteps(steps).forEach(element => {
            result.push(getShortestRouteBetween(element, end));
        })

        result.sort((a, b) => a - b);

        return result;

        // return getShortestRouteForHike(end);
    }

    console.log('part1', doPart1());
    console.log('part2', doPart2());
}

main();