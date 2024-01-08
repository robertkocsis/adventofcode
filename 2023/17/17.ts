const file = Bun.file('17/file.txt');

// I couldn't have solved it without this: https://www.reddit.com/r/adventofcode/comments/18luw6q/2023_day_17_a_longform_tutorial_on_day_17/


const firstStar = async () => {
  const text = await file.text();
  const grid = text
    .split('\n')
    .map((line) => line.split('').map((char) => parseInt(char)));

  const end = `${grid.length - 1},${grid[0].length - 1}`;

  const priorityMap = new Map<number, string[]>();
  const costSoFar = new Map<string, number>();

  moveAndAddState(0, 0, 0, 1, 0, 1);
  moveAndAddState(0, 0, 0, 0, 1, 1);

  function moveAndAddState(
    cost: number,
    x: number,
    y: number,
    dx: number,
    dy: number,
    distance: number,
  ) {
    x += dx;
    y += dy;

    if (x < 0 || y < 0) {
      return;
    }
    if (x >= grid.length || y >= grid[0].length) {
      return;
    }

    const newCost = cost + grid[x][y];

    if (`${x},${y}` === end) {
      console.log('firstStar:', newCost);
      process.exit(0);
    }

    const state = [x, y, dx, dy, distance];
    const joinedState = state.join(',');

    if (!costSoFar.has(joinedState)) {
      costSoFar.set(joinedState, newCost);
      priorityMap.set(newCost, [
        ...(priorityMap.get(newCost) ?? []),
        joinedState,
      ]);
    }

  }

  while (true) {
    const currentCost = Math.min(...priorityMap.keys());

    const nextStates = priorityMap.get(currentCost)!;
    priorityMap.delete(currentCost);

    for (let state of nextStates) {
      // Break out the state variables
      const [x, y, dx, dy, distance] = state.split(',').map(Number);

      // Perform the left and right turns
      moveAndAddState(currentCost, x, y, dy, -dx, 1);
      moveAndAddState(currentCost, x, y, -dy, dx, 1);

      if (distance < 3) {
        moveAndAddState(currentCost, x, y, dx, dy, distance + 1);
      }
    }
  }
};

const secondStar = async () => {
   const text = await file.text();
   const grid = text
     .split('\n')
     .map((line) => line.split('').map((char) => parseInt(char)));

   const end = `${grid.length - 1},${grid[0].length - 1}`;

   const priorityMap = new Map<number, string[]>();
   const costSoFar = new Map<string, number>();

   moveAndAddState(0, 0, 0, 1, 0, 1);
   moveAndAddState(0, 0, 0, 0, 1, 1);

   function moveAndAddState(
     cost: number,
     x: number,
     y: number,
     dx: number,
     dy: number,
     distance: number
   ) {
     x += dx;
     y += dy;

     if (x < 0 || y < 0) {
       return;
     }
     if (x >= grid.length || y >= grid[0].length) {
       return;
     }

     const newCost = cost + grid[x][y];

     if (`${x},${y}` === end && distance > 3) {
       console.log('secondStart:', newCost);
       process.exit(0);
     }

     const state = [x, y, dx, dy, distance];
     const joinedState = state.join(',');

     if (!costSoFar.has(joinedState)) {
       costSoFar.set(joinedState, newCost);
       priorityMap.set(newCost, [
         ...(priorityMap.get(newCost) ?? []),
         joinedState,
       ]);
     }
   }

   while (true) {
     const currentCost = Math.min(...priorityMap.keys());

     const nextStates = priorityMap.get(currentCost)!;
     priorityMap.delete(currentCost);

     for (let state of nextStates) {
       // Break out the state variables
       const [x, y, dx, dy, distance] = state.split(',').map(Number);

       if (distance > 3) {
         moveAndAddState(currentCost, x, y, dy, -dx, 1);
         moveAndAddState(currentCost, x, y, -dy, dx, 1);
       }

       if (distance < 10) {
         moveAndAddState(currentCost, x, y, dx, dy, distance + 1);
       }
     }
   }
};

secondStar();
