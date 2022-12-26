const inputFile: string = Deno.readTextFileSync("input.txt");

const trees = inputFile.split('\n').map(element => element.split('')).map(element => element.map(subElement => +subElement));



const isOnTheEdge = (row: number, column: number) => {
    return (row === 0 || trees.length - 1 === row || column === 0 || column === trees[0].length - 1)
}

const getTreesFromAllDirections = (row: number, column: number) => {
    const result: Array<Array<number>> = [[], [], [], []];

    if (column > 0) {
        for (let index = column - 1; index > - 1; index--) {
            result[0].push(trees[row][index]);
        }
    }

    if (column < trees.length) {
        for (let index = column + 1; index < trees[row].length; index++) {
            result[1].push(trees[row][index]);
        }
    }

    if (row > 0) {
        for (let index = row - 1; index > - 1; index--) {
            result[2].push(trees[index][column]);
        }
    }

    if (row < trees.length) {
        for (let index = row + 1; index < trees.length; index++) {
            result[3].push(trees[index][column]);
        }
    }

    return result;
}


const isVisible = (row: number, column: number) => {
    if (isOnTheEdge(row, column)) {
        return true;
    }

    const heightToCompare = trees[row][column];

    const nearbyTrees = getTreesFromAllDirections(row, column);

    const isVisible = nearbyTrees.some(row => !row.some(treeHeight => treeHeight >= heightToCompare));

    return isVisible;
}


const getViewScore = (row: number, column: number) => {
    const heightToCompare = trees[row][column];

    const nearbyTrees = getTreesFromAllDirections(row, column);

    const scoreByDirection = nearbyTrees.map(treeArray => {
        if (treeArray.length === 0) {
            return 0;
        } else {
            let score = 0;
            for (let index = 0; index < treeArray.length; index++) {
                score++;
                if (treeArray[index] >= heightToCompare) {
                    break;
                }
            }
            return score;
        }
    });

    return scoreByDirection.reduce((a, b) => a * b, 1);
}

const getVisibleTrees = () => {
    const filteredTrees = trees.map((treeRow, rowNumber) => {
        return treeRow.filter((tree, columnNumber) => isVisible(rowNumber, columnNumber))
    })

    return filteredTrees.flat();
}

const getEachTreesViewingScore = () => {
    const filteredTrees = trees.map((treeRow, rowNumber) => {
        return treeRow.map((tree, columnNumber) => getViewScore(rowNumber, columnNumber))
    })

    return filteredTrees;
}

const getMaxValueFrom2DArray = (input: number[][]) => {
    let max = 0;

    input.forEach(array => {
        array.forEach(element => {
            if (element > max) {
                max = element;
            }
        })
    })

    return max;
}


console.log('part1', getVisibleTrees().length)

console.log('part2', getMaxValueFrom2DArray(getEachTreesViewingScore()))
