const inputFile: string = Deno.readTextFileSync("input.txt");
const monkeyInfo = inputFile.split('\n\n').map(row => row.split("\n"));


class Monkey {
    id: number = 0;
    items: number[] = [];
    inspectCount: number = 0;
    operation: (old: number) => number;
    test: (worryLevel: number) => number;
}


const createMonkey = (input: string[]): Monkey => {
    const id = +input[0].split('Monkey ')[1].replace(':', '');
    const items = input[1].split('  Starting items: ')[1].replace(' ', '').split(',').map(el => +el);
    const operationInput = input[2].split('  Operation: new = old ')[1].split(' ');


    const createOperation = () => {
        return (old: number) => {
            const argument = operationInput[1] === 'old' ? old : +operationInput[1];

            if (operationInput[0] === '+') {
                return old + argument;
            } else if (operationInput[0] === '*') {
                return old * argument;
            } else {
                throw new Error('invalid branch' + operationInput)
            }
        }

    }

    const operation = createOperation();
    const createTestOperation = () => {
        const testDivisionArgument = +input[3].split('  Test: divisible by ')[1];
        const trueResult = +input[4].split('    If true: throw to monkey ')[1];
        const falseResult = +input[5].split('    If false: throw to monkey ')[1];

        return (worryLevel: number) => {
            if (worryLevel % testDivisionArgument === 0) {
                return trueResult;
            } else {
                return falseResult;
            }

        }
    }

    const test = createTestOperation();

    return {
        id,
        items,
        operation,
        test,
        inspectCount: 0
    }
}

const playTurn = (monkeys: Monkey[], chillMode = true, modulo: number = 0) => {

    monkeys.forEach(monkey => {
        while (monkey.items.length > 0) {
            monkey.inspectCount += 1;
            let worryLevel = monkey.items.shift();

            worryLevel = monkey.operation(worryLevel!);

            if (chillMode) {
                worryLevel = Math.floor(worryLevel / 3);
            } else {
                worryLevel! %= modulo;
            }

            const monkeyToThrowTo = monkeys.find(element => element.id === monkey.test(worryLevel!));

            monkeyToThrowTo?.items.push(worryLevel);
        }
    })
}

const main = () => {
    const doPart1 = () => {
        const monkeys: Monkey[] = monkeyInfo.map(monkey => createMonkey(monkey));

        for (let index = 0; index < 20; index++) {
            playTurn(monkeys);
        }

        const monkeyBusiness = monkeys.sort((a, b) => {
            if (a.inspectCount < b.inspectCount) {
                return 1;
            } else if (a.inspectCount === b.inspectCount) {
                return 0;
            } else {
                return - 1;
            }
        })

        return monkeyBusiness[0].inspectCount * monkeyBusiness[1].inspectCount;
    }


    const doPart2 = () => {
        const monkeys: Monkey[] = monkeyInfo.map(monkey => createMonkey(monkey));
        const divider = monkeyInfo.map(input => +input[3].split('  Test: divisible by ')[1])
            .reduce((a, b) => a * b, 1);

        for (let index = 0; index < 10000; index++) {
            playTurn(monkeys, false, divider);
        }

        const monkeyBusiness = monkeys.sort((a, b) => {
            if (a.inspectCount < b.inspectCount) {
                return 1;
            } else if (a.inspectCount === b.inspectCount) {
                return 0;
            } else {
                return - 1;
            }
        })
        console.log('part 2 monkeys', monkeyBusiness);

        return monkeyBusiness[0].inspectCount * monkeyBusiness[1].inspectCount;
    }

    console.log('part1', doPart1());
    console.log('part2', doPart2());
}

main();