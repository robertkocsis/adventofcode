const inputFile: string = Deno.readTextFileSync("input.txt");
const moves = inputFile.split('\n').map(element => element.split(' '));


enum MoveDirection {
    R = "R", L = "L", D = "D", U = "U"
}

class RopeNode {
    position: number[];
    next: RopeNode | null;

    constructor(position: number[], next: RopeNode | null) {
        this.position = position;
        this.next = next;
    }
}

class LinkedList {
    head: RopeNode;

    constructor(head: RopeNode) {
        this.head = head;
    }

    appendToList(newNode: RopeNode) {
        let node = this.getLastElement();
        node.next = newNode;
    }

    getLastElement() {
        let node = this.head;

        while (node.next) {
            node = node.next;
        }

        return node;
    }

    forEach(inputFunction: (rope: RopeNode) => void) {
        let node: RopeNode | null = this.head;

        while (node != null) {
            inputFunction(node);
            node = node.next;
        }
    }
}


const createBasicMap = () => {
    const result: Array<Array<string>> = [];

    for (let index = 0; index < 4; index++) {
        result[index] = [] as string[];

        for (let y = 0; y < 4; y++) {
            result[index][y] = '.';

        }

    }

    result[0][0] = "s";

    return result;
}

const createNewSimulation = (tailSize: number) => {
    const head = new RopeNode([0, 0], null);
    const rope = new LinkedList(head);


    for (let index = 0; index < tailSize; index++) {
        const node = new RopeNode([0, 0], null);
        rope.appendToList(node);
    }
    return {
        head,
        rope,
        positionMap: createBasicMap()
    }
}

let { head, rope, positionMap } = createNewSimulation(9);

const isTouching = (head: number[], tail: number[]) => {
    const isOverlapping = tail[0] === head[0] && tail[1] == head[1];

    const isOver = tail[0] - 1 === head[0] && tail[1] == head[1];

    const isInTheUpperRightCorner = tail[0] - 1 === head[0] && tail[1] + 1 == head[1];

    const isToTheRight = tail[0] === head[0] && tail[1] + 1 == head[1];

    const isInTheLowerRightCorner = tail[0] + 1 === head[0] && tail[1] + 1 == head[1];

    const isLower = tail[0] + 1 === head[0] && tail[1] == head[1];

    const isInTheLowerLeftCorner = tail[0] + 1 === head[0] && tail[1] - 1 == head[1];

    const isToTheLeft = tail[0] === head[0] && tail[1] - 1 == head[1];

    const isInTheUpperLeftCorner = tail[0] - 1 === head[0] && tail[1] - 1 == head[1];

    if (isOverlapping) {
        return true;
    } else if (isOver) {
        return true
    } else if (isInTheUpperRightCorner) {
        return true
    } else if (isToTheRight) {
        return true
    } else if (isInTheLowerRightCorner) {
        return true
    } else if (isLower) {
        return true
    } else if (isInTheLowerLeftCorner) {
        return true
    } else if (isToTheLeft) {
        return true
    } else if (isInTheUpperLeftCorner) {
        return true
    }

    return false;
}


const extendMap = (mapToExtend: string[][]) => {
    mapToExtend.forEach(row => {
        row.push('.');
        row.unshift('.');
    })

    const newRow: string[] = [];

    for (let index = 0; index < mapToExtend[0].length; index++) {
        newRow.push('.');
    }

    mapToExtend.unshift([...newRow])
    mapToExtend.push([...newRow])

    rope.forEach(node => {
        node.position[0]++;
        node.position[1]++;
    })

   // console.log('map extended');
}

const moveTails = () => {
    if (isTouching(rope.head.position, rope.head.next?.position!)) {
        return;
    }

    let node: RopeNode | null = rope.head;

    while (node != null && node.next != null) {
        moveTail(node, node.next);
        node = node.next;
    }

    let locations: string[] = [];
    let mapCopy = [...positionMap].map(row => row.map(cell => cell !== '.' ? '.' : cell));

    rope.forEach(element => {
        mapCopy[element.position[0]][element.position[1]] = locations.length + "";
        locations.push('' + element.position)
    }
    );

    locations.forEach((element, index) => {
        if (mapCopy[element[0]][element[1]] === '.') {

            mapCopy[element[0]][element[1]] = "" + index;
        }

    });
`
    console.log('');
    console.log(mapCopy.map(row => row.join('')).join('\n'));`
}


const moveTail = (nodeToFollow: RopeNode, tail: RopeNode) => {
    let tailPosition = tail.position;
    let headPosition = nodeToFollow.position;

    if (isTouching(headPosition, tailPosition)) {
        return;
    }


    const isOverLeftSide = tailPosition[0] - 2 === headPosition[0] && tailPosition[1] - 1 == headPosition[1];
    const isOver = tailPosition[0] - 2 === headPosition[0] && tailPosition[1] == headPosition[1];
    const isOverRightSide = tailPosition[0] - 2 === headPosition[0] && tailPosition[1] + 1 == headPosition[1];

    const isInFarUpperRightCorner = tailPosition[0] - 2 === headPosition[0] && tailPosition[1] + 2 == headPosition[1]
    const isInFarLowerRightCorner = tailPosition[0] + 2 === headPosition[0] && tailPosition[1] + 2 == headPosition[1]

    const isInFarUpperLeftCorner = tailPosition[0] - 2 === headPosition[0] && tailPosition[1] - 2 == headPosition[1]
    const isInFarLowerLeftCorner = tailPosition[0] + 2 === headPosition[0] && tailPosition[1] - 2 == headPosition[1]

    const isOnRightUpperSide = tailPosition[0] - 1 === headPosition[0] && tailPosition[1] + 2 == headPosition[1];
    const isToTheRight = tailPosition[0] === headPosition[0] && tailPosition[1] + 2 == headPosition[1];
    const isToTheRightLowerSide = tailPosition[0] + 1 === headPosition[0] && tailPosition[1] + 2 == headPosition[1];

    const isOnTheLowerRightSide = tailPosition[0] + 2 === headPosition[0] && tailPosition[1] + 1 == headPosition[1];
    const isLower = tailPosition[0] + 2 === headPosition[0] && tailPosition[1] == headPosition[1];
    const isOnTheLowerLeftSide = tailPosition[0] + 2 === headPosition[0] && tailPosition[1] - 1 == headPosition[1];

    const isToTheLeftLowerSide = tailPosition[0] + 1 === headPosition[0] && tailPosition[1] - 2 == headPosition[1];
    const isToTheLeft = tailPosition[0] === headPosition[0] && tailPosition[1] - 2 == headPosition[1];
    const isOnLeftUpperSide = tailPosition[0] - 1 === headPosition[0] && tailPosition[1] - 2 == headPosition[1];

    if (isOver) {
        tailPosition[0]--;
    } else if (isOnRightUpperSide || isOverRightSide || isInFarUpperRightCorner) {
        tailPosition[0]--;
        tailPosition[1]++;
    } else if (isOnLeftUpperSide || isOverLeftSide || isInFarUpperLeftCorner) {
        tailPosition[0]--;
        tailPosition[1]--;
    } else if (isToTheRight) {
        tailPosition[1]++;
    } else if (isToTheRightLowerSide || isOnTheLowerRightSide || isInFarLowerRightCorner) {
        tailPosition[0]++;
        tailPosition[1]++;
    } else if (isLower) {
        tailPosition[0]++;
    } else if (isToTheLeftLowerSide || isOnTheLowerLeftSide || isInFarLowerLeftCorner) {
        tailPosition[0]++;
        tailPosition[1]--;
    } else if (isToTheLeft) {
        tailPosition[1]--;
    }


    if (rope.getLastElement() === tail) {
        positionMap[tail.position[0]][tail.position[1]] = "#";
    }

}



const moveHead = (direction: MoveDirection, amount: number) => {
    if (amount === 0) {
        return;
    }

    const headPosition = rope.head.position;

    if (headPosition[1] + 1 === positionMap[0].length ||
        headPosition[0] + 1 === positionMap.length ||
        headPosition[1] - 1 < 1 ||
        headPosition[0] - 1 < 1) {
        extendMap(positionMap);
    }

    if (direction === MoveDirection.R) {
        headPosition[1]++;
    } else if (direction === MoveDirection.D) {
        headPosition[0]++;
    } else if (direction === MoveDirection.L) {
        headPosition[1]--;
    } else if (direction === MoveDirection.U) {
        headPosition[0]--;
    }

    moveTails();

    moveHead(direction, amount - 1);
}

moves.forEach(element => {
    moveHead(element[0] as unknown as MoveDirection, +element[1]);
});


console.log('result', positionMap.map(row => row.filter(cell => cell === '#' || cell === 's').length).reduce((a, b) => a + b, 0))

















