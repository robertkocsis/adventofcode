const inputFile: string = Deno.readTextFileSync("input.txt");
const commands = inputFile.split('\n').map(element => element.split(' '));

const createScreen = () => {
    const result: string[][] = [];

    for (let index = 0; index < 6; index++) {
        const row: string[] = [];

        for (let y = 0; y < 40; y++) {
            row.push('.');
        }

        result.push(row);
    }

    return result;
}


const main = () => {
    let cycle = 1;
    let register = 1;
    const screen = createScreen();;

    let signalStrengthSum = 0;

    const handleCommand = (input: string[]) => {
        if (input[0] === 'noop') {
            incrementCycle();
        } else if (input[0] === 'addx') {
            incrementCycle();
            incrementCycle();

            register += +input[1];
        }
    }

    const incrementCycle = () => {
        const numbersToCheck = [20, 60, 100, 140, 180, 220];

        if (numbersToCheck.includes(cycle)) {
            console.log("cycle: " + cycle + " signalStrength: " + cycle * register);
            signalStrengthSum += cycle * register;
        }

        const row = Math.floor((cycle - 1) / 40);

        let drawPositions = [cycle - 2, cycle - 1, cycle]
            .map(element => element - (row * 40));

        if (drawPositions[0] < 0) {
            drawPositions = [0, 1, 2];
        }

        if (drawPositions.includes(register)) {
            screen[row][drawPositions[1]] = '#';
        }

        cycle++;
    }

    commands.forEach(commandArray => {
        handleCommand(commandArray);
    })

    console.log('result', signalStrengthSum);
    console.log('screen', screen.map(row => row.join('')));
}

main();