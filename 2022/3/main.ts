
const inputFile: string = Deno.readTextFileSync("input.txt");

const twoDInput = inputFile.split('\n').map(element => [element.slice(0, element.length / 2), element.slice(element.length / 2)]);


const getPointOfLetter = (letter: string): number => {
    const isUppercase = letter === letter.toUpperCase();

    if (isUppercase) {
        return letter.charCodeAt(0) - 38;
    } else {
        return letter.charCodeAt(0) - 96;
    }
}

const getPointsOfMixedBags = (input: Array<string>) => {
    for (let index = 0; index < input[0].length; index++) {
        const element = input[0][index];
        if (input[1].includes(element)) {
            return getPointOfLetter(element);
        }
    }
}

const getPointsOfBadges = (): number => {
    let sum = 0;

    for (let index = 0; index < twoDInput.length; index = index + 3) {
        const firstElement = twoDInput[index].join('');
        const secondElement = twoDInput[index + 1].join('');
        const thirdElement = twoDInput[index + 2].join('');



        for (let characterIndex = 0; characterIndex < firstElement.length; characterIndex++) {
            const character = firstElement[characterIndex];
            if (secondElement.includes(character) && thirdElement.includes(character)) {
                sum += getPointOfLetter(character);
                break;
            }
        }
    }

    return sum;
}

console.log('part1', twoDInput.map(element => getPointsOfMixedBags(element)).reduce((a, b) => a! + b!, 0))
console.log('part2', getPointsOfBadges())