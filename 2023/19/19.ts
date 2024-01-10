const text = await Bun.file('19/file.txt').text();

const getRatings = (text: string): Record<string, number>[] => {
  const ratings = text
    .split('\n\n')[1]
    .split('\n')
    .map((line) => {
      const stringJson = line
        .replaceAll('=', '":')
        .replaceAll(',', ',"')
        .replaceAll('{', '{"');
      return JSON.parse(stringJson) as Record<string, number>;
    });

  return ratings;
};

const getWorkflowMap = (text: string): Map<string, string> => {
  const result = new Map<string, string>();

  text
    .split('\n\n')[0]
    .split('\n')
    .forEach((line) => {
      const [name, workflow] = line.split('{');
      result.set(name, '{' + workflow);
    });
  return result;
};

const processWorkFlow = (
  rating: Record<string, number>,
  workflow: string,
  map: Map<string, string>
): boolean => {
  const conditions = workflow
    .replaceAll('{', '')
    .replaceAll('}', '')
    .split(',');

  for (const condition of conditions) {
    if (condition.includes(':')) {
      const biggerThan = condition.includes('>');
      const key = condition.split(biggerThan ? '>' : '<')[0];
      const value = parseInt(
        condition.split(biggerThan ? '>' : '<')[1].split(':')[0]
      );
      const destination = condition.split(':')[1];

      if (
        (biggerThan && rating[key] > value) ||
        (!biggerThan && rating[key] < value)
      ) {
        if (destination === 'R') {
          return false;
        } else if (destination === 'A') {
          return true;
        }

        return processWorkFlow(rating, map.get(destination)!, map);
      }
    } else {
      if (condition === 'R') {
        return false;
      } else if (condition === 'A') {
        return true;
      }

      return processWorkFlow(rating, map.get(condition)!, map);
    }
  }

  return false;
};

const processWorkFlowWithRanges = (
  rating: Record<string, number[]>,
  workflow: string,
  map: Map<string, string>
): Record<string, number[]>[] => {
  const conditions = workflow
    .replaceAll('{', '')
    .replaceAll('}', '')
    .split(',');

  for (const condition of conditions) {
    if (condition.includes(':')) {
      const biggerThan = condition.includes('>');
      const key = condition.split(biggerThan ? '>' : '<')[0];
      const value = parseInt(
        condition.split(biggerThan ? '>' : '<')[1].split(':')[0]
      );
      const destination = condition.split(':')[1];

      if (biggerThan) {
        if (rating[key][0] > value) {
          if (destination === 'R') {
            return [];
          } else if (destination === 'A') {
            return [rating];
          }

          return [
            ...processWorkFlowWithRanges(rating, map.get(destination)!, map),
          ];
        }

        if (rating[key][0] < value && rating[key][1] > value) {
          const ratingA = { ...rating, [key]: [rating[key][0], value] };
          const ratingB = { ...rating, [key]: [value + 1, rating[key][1]] };
          return [
            ...processWorkFlowWithRanges(ratingA, workflow, map),
            ...processWorkFlowWithRanges(ratingB, workflow, map),
          ];
        }
      } else {
        if (rating[key][1] < value) {
          if (destination === 'R') {
            return [];
          } else if (destination === 'A') {
            return [rating];
          }

          return [
            ...processWorkFlowWithRanges(rating, map.get(destination)!, map),
          ];
        }

        if (rating[key][0] < value && rating[key][1] > value) {
          const ratingA = { ...rating, [key]: [rating[key][0], value - 1] };
          const ratingB = { ...rating, [key]: [value, rating[key][1]] };
          return [
            ...processWorkFlowWithRanges(ratingA, workflow, map),
            ...processWorkFlowWithRanges(ratingB, workflow, map),
          ];
        }
      }
    } else {
      if (condition === 'R') {
        return [];
      } else if (condition === 'A') {
        return [rating];
      }

      return [...processWorkFlowWithRanges(rating, map.get(condition)!, map)];
    }
  }

  return [];
};

const firstStar = () => {
  const ratings = getRatings(text);
  const workflowMap = getWorkflowMap(text);

  let sum = 0;

  ratings.forEach((rating) => {
    if (processWorkFlow(rating, workflowMap.get('in')!, workflowMap)) {
      sum += Object.values(rating).reduce((a, b) => a + b, 0);
    }
  });

  console.log('firstStar', sum);
};

const secondStar = () => {
  const rating = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] };
  const workflowMap = getWorkflowMap(text);

  const ranges = processWorkFlowWithRanges(
    rating,
    workflowMap.get('in')!,
    workflowMap
  );

  const result = ranges
    .map((range) => {
      const x = range.x[1] - range.x[0] + 1;
      const m = range.m[1] - range.m[0] + 1;
      const a = range.a[1] - range.a[0] + 1;
      const s = range.s[1] - range.s[0] + 1;
      return x * m * a * s;
    })
    .reduce((a, b) => a + b, 0);

  console.log('secondStar', result);
};

firstStar();
secondStar();
