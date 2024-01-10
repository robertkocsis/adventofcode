const file = await Bun.file('20/file.txt').text();

class Queue<T> {
  private data: T[] = [];

  push(item: T) {
    this.data.push(item);
  }

  pop(): T | undefined {
    return this.data.shift();
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

  clear() {
    this.data = [];
  }
}

enum ModuleType {
  BROADCAST,
  FLIP_FLOP,
  CONJUNCTION,
}

type Module = {
  name: string;
  destinations: string[];
} & (
  | { type: ModuleType.BROADCAST }
  | { type: ModuleType.FLIP_FLOP; on: boolean }
  | { type: ModuleType.CONJUNCTION; lastPulseLow: Map<string, boolean> }
);

const createModules = (text: string): Module[] => {
  return text
    .split('\n')
    .map((line) => line.split(' -> '))
    .map((line) => {
      if (line[0] === 'broadcaster') {
        return {
          name: line[0],
          destinations: line[1].split(', '),
          type: ModuleType.BROADCAST,
        };
      } else if (line[0].includes('%')) {
        return {
          name: line[0].slice(1),
          destinations: line[1].split(', '),
          type: ModuleType.FLIP_FLOP,
          on: false,
        };
      }
      return {
        name: line[0].slice(1),
        destinations: line[1].split(', '),
        type: ModuleType.CONJUNCTION,
        lastPulseLow: new Map<string, boolean>(),
      };
    });
};

interface Action {
  from: Module;
  to: Module;
  lowPulse: boolean;
}

const handleAction = (
  action: Action,
  moduleMap: Map<string, Module>,
  actionQueue: Queue<Action>,
  count: [number, number]
) => {
  //  console.log(
  //     'from',
  //     action.from.name,
  //     'to',
  //     action.to?.name,
  //     'low',
  //     action.lowPulse,
  //     count
  //   );

  if (action.lowPulse) {
    count[0]++;
  } else {
    count[1]++;
  }

  if (!action.to) {
    return;
  }

  if (action.to.type === ModuleType.BROADCAST) {
    action.to.destinations.forEach((destination) => {
      actionQueue.push({
        from: action.to,
        to: moduleMap.get(destination)!,
        lowPulse: true,
      });
    });
  } else if (action.to.type === ModuleType.FLIP_FLOP) {
    if (!action.lowPulse) {
      return;
    }

    action.to.on = !action.to.on;
    const moduleOff = !action.to.on;

    action.to.destinations.forEach((destination) => {
      actionQueue.push({
        from: action.to,
        to: moduleMap.get(destination)!,
        lowPulse: moduleOff ? true : false,
      });
    });
  } else if (action.to.type === ModuleType.CONJUNCTION) {
    action.to.lastPulseLow.set(action.from.name, action.lowPulse);

    const allHighPulseBefore = Array.from(
      action.to.lastPulseLow.values()
    ).every((value) => !value);

    action.to.destinations.forEach((destination) => {
      actionQueue.push({
        from: action.to,
        to: moduleMap.get(destination)!,
        lowPulse: allHighPulseBefore,
      });
    });
  }
};

const fillConjunctionMaps = (
  modules: Module[],
  moduleMap: Map<string, Module>
) => {
  modules
    .filter((module) => module.type === ModuleType.CONJUNCTION)
    .forEach((module) => {
      Array.from(moduleMap.entries())
        .filter(([, value]) => value.destinations.includes(module.name))
        .forEach(([key]) => {
          if (module.type === ModuleType.CONJUNCTION) {
            module.lastPulseLow.set(key, true);
          }
        });
    });
};

const firstStar = () => {
  const modules = createModules(file);
  const moduleMap = new Map<string, Module>();
  modules.forEach((module) => {
    moduleMap.set(module.name, module);
  });

  fillConjunctionMaps(modules, moduleMap);

  const actionQueue = new Queue<Action>();

  const count: [number, number] = [0, 0];

  for (let i = 0; i < 1000; i++) {
    actionQueue.clear();

    actionQueue.push({
      from: { name: '', destinations: [], type: ModuleType.BROADCAST },
      to: moduleMap.get('broadcaster')!,
      lowPulse: true,
    });

    while (!actionQueue.isEmpty()) {
      const action = actionQueue.pop()!;
      handleAction(action, moduleMap, actionQueue, count);
    }
  }

  console.log('firstStar', count[0] * count[1]);
};

const secondStar = () => {
  const modules = createModules(file);
  const moduleMap = new Map<string, Module>();
  modules.forEach((module) => {
    moduleMap.set(module.name, module);
  });

  fillConjunctionMaps(modules, moduleMap);

  const actionQueue = new Queue<Action>();

  const count: [number, number] = [0, 0];

  const goal = Array.from(moduleMap.entries()).find(([key, value]) =>
    value.destinations.includes('rx')
  )![0];

  const beforeGoal = moduleMap.get(goal)!;
  const pointingToBeforeGoal: Map<string, number> = new Map<string, number>();

  if (beforeGoal.type === ModuleType.CONJUNCTION) {
    beforeGoal.lastPulseLow.forEach((value, key) => {
      pointingToBeforeGoal.set(key, 0);
    });
  }

  for (let i = 0; i < 10000000000; i++) {
    actionQueue.clear();

    actionQueue.push({
      from: { name: '', destinations: [], type: ModuleType.BROADCAST },
      to: moduleMap.get('broadcaster')!,
      lowPulse: true,
    });

    while (!actionQueue.isEmpty()) {
      const action = actionQueue.pop()!;

      if (
        action.from &&
        !action.lowPulse &&
        pointingToBeforeGoal.has(action.from.name) &&
        pointingToBeforeGoal.get(action.from.name) === 0
      ) {
        pointingToBeforeGoal.set(action.from.name, i + 1);

        if (
          Array.from(pointingToBeforeGoal.values()).every(
            (value) => value !== 0
          )
        ) {
          break;
        }
      }
      handleAction(action, moduleMap, actionQueue, count);
    }

    if (
      Array.from(pointingToBeforeGoal.values()).every((value) => value !== 0)
    ) {
      break;
    }
  }

  console.log(
    'secondStar',
    Array.from(pointingToBeforeGoal.values()).reduce(
      (acc, value) => acc * value,
      1
    )
  );
};

firstStar();
secondStar();
