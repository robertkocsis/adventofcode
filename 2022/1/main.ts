
const input: string = Deno.readTextFileSync("input.txt");
const splitInput: Array<string> = input.split('\n')


let elfCalories: Array<number> = [0];

const descSort = (a: number, b: number) => b - a;

splitInput.forEach(element => {

    if (Number.isInteger(+element)) {
        elfCalories[0] = elfCalories[0] + +element; 
    }

    if (!element) {
        elfCalories.unshift(0)
    }

});


elfCalories.sort(descSort).splice(3)

console.log('part1', elfCalories[0]);
console.log('part2', elfCalories.reduce((a, b) => a + b, 0));
