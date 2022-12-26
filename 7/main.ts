

const inputFile: string = Deno.readTextFileSync("input.txt");


interface TreeNode {
    parent: TreeNode | undefined,
    info: string,
    children: Array<TreeNode>;
}

const root: TreeNode = {
    parent: undefined,
    info: '/',
    children: [],
}

let currentNode: TreeNode = root;

const isCommand = (input: string) => input[0] === '$';

const isDirectory = (input: TreeNode) => input.info.substring(0, 3) === 'dir';

const handleCd = (cdArgument: string) => {
    if (cdArgument === "/") {
        currentNode = root;
    } else if (cdArgument === '..') {
        currentNode = currentNode.parent ? currentNode.parent : root;
    } else {
        const foundChild = currentNode.children.find(element => `dir ${cdArgument}` === element.info);
        if (foundChild) {
            currentNode = foundChild;
        } else {
            throw new Error('cd command argument not found')
        }
    }
}


const processCommand = (input: string) => {
    if (isCommand(input)) {
        const splitCommand = input.split(" ");

        if (splitCommand[1] === "cd") {
            handleCd(splitCommand[2]);
        }
    } else {
        currentNode.children.push({ info: input, parent: currentNode, children: [] })
    }
}

const getDirectorySize = (directory: TreeNode): number => {
    let size = 0;
    directory.children.forEach(child => {
        if (isDirectory(child)) {
            size += getDirectorySize(child);
        } else {
            size += +child.info.split(" ")[0];
        }
    })

    return size;
}

const getDirectoriesByComparison = (root: TreeNode, comparator: (directory: TreeNode) => boolean): Array<TreeNode> => {
    const result: Array<TreeNode> = [];

    if (comparator(root)) {
        result.push(root);
    }

    root.children.forEach(child => {
        if (isDirectory(child)) {
            result.push(...getDirectoriesByComparison(child, comparator));
        }
    })

    return result;
}

const directoryUnderSizeComparatorFactory = (maxSize: number) => {
    return (directory: TreeNode) => {
        return getDirectorySize(directory) < maxSize;
    }
}


inputFile.split('\n').forEach(element => processCommand(element));
console.log('part1 sum', getDirectoriesByComparison(root,
    directoryUnderSizeComparatorFactory(100000))
    .map(res => getDirectorySize(res))
    .reduce((a, b) => a + b, 0));



const totalAvailableSpace = 70000000;
const freeSpaceNeeded = 30000000;
const usedSpace = totalAvailableSpace - getDirectorySize(root);
const minAmountToDelete = freeSpaceNeeded - usedSpace;



const directoryAboveSizeComparatorFactory = (minSize: number) => {
    return (directory: TreeNode) => {
        return getDirectorySize(directory) >= minSize;
    }
}


console.log("part2 unfiltered", minAmountToDelete)

console.log('part2', getDirectoriesByComparison(root,
    directoryAboveSizeComparatorFactory(minAmountToDelete))
    .map(res => getDirectorySize(res))
    .sort((a, b) => a)
    .reduce((a, b) => a + b, 0));





