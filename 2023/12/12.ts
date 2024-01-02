import { defaultMaxListeners } from 'stream';

const file = Bun.file('12/file.txt');

type Spring = '#' | '.' | '?';

interface SpringInfo {
  springs: string;
  damagedSpringAmounts: number[];
}

const lineValid = (line: number[], targetRuns: number[]) => {
  let runs: number[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === 0) {
      i++;
      continue;
    }
    let c = 0;
    while (i < line.length && line[i] === 1) {
      i++;
      c++;
    }
    runs.push(c);
  }
  return JSON.stringify(runs) === JSON.stringify(targetRuns);
};

const getPossibleWays = (info: SpringInfo) => {
  let line: number[] = [];
  let idxs: number[] = [];

  for (let i = 0; i < info.springs.length; i++) {
    if (info.springs[i] === '.') line.push(0);
    else if (info.springs[i] === '?') {
      line.push(-1);
      idxs.push(i);
    } else line.push(1);
  }
  let count = 0;

  for (let mask = 0; mask < 1 << idxs.length; mask++) {
    let lineCopy = [...line];
    for (let i = 0; i < idxs.length; i++) {
      lineCopy[idxs[i]] = mask & (1 << i) ? 0 : 1;
    }
    if (lineValid(lineCopy, info.damagedSpringAmounts)) count++;
  }
  return count;
};

const firstStar = async () => {
  const text = await file.text();

  const infos: SpringInfo[] = [];
  text.split('\n').forEach((line) => {
    const springs = line.split(' ')[0].split('').join('');

    const damagedSpringAmounts: number[] = line
      .split(' ')[1]
      .split(',')
      .map((num) => parseInt(num));
    infos.push({ springs, damagedSpringAmounts });
  });

  let result = 0;

  infos.forEach((info) => {
    result += getPossibleWays(info);
  });

  console.log('firstStar:', result);
};

function ways(s: string, targetRuns: number[]): number {
  targetRuns.push(0);
  const maxRun = Math.max(...targetRuns);
  s += '.';

  const n = s.length;
  const m = targetRuns.length;
  const dp: number[][][] = Array.from({ length: n }, () =>
    Array.from({ length: m }, () => Array(maxRun + 1).fill(0))
  );

  for (let i = 0; i < n; i++) {
    const x = s[i];
    for (let j = 0; j < m; j++) {
      for (let k = 0; k <= targetRuns[j]; k++) {
        if (i === 0) {
          if (j !== 0) {
            dp[i][j][k] = 0;
            continue;
          }

          if (x === '#') {
            dp[i][j][k] = k === 1 ? 1 : 0;
            continue;
          }

          if (x === '.') {
            dp[i][j][k] = k === 0 ? 1 : 0;
            continue;
          }

          if (x === '?') {
            dp[i][j][k] = [0, 1].includes(k) ? 1 : 0;
            continue;
          }
        }

        let ansDot = 0;
        if (k === 0) {
          if (j > 0) {
            ansDot = dp[i - 1][j - 1][targetRuns[j - 1]] + dp[i - 1][j][0];
          } else {
            ansDot = s.slice(0, i).split('#').length - 1 === 0 ? 1 : 0;
          }
        }

        let ansPound = 0;
        if (k !== 0) {
          ansPound = dp[i - 1][j][k - 1];
        }

        if (x === '.') {
          dp[i][j][k] = ansDot;
        } else if (x === '#') {
          dp[i][j][k] = ansPound;
        } else {
          dp[i][j][k] = ansDot + ansPound;
        }
      }
    }
  }

  const ans = dp[n - 1][m - 1][0];

  return ans;
}

const secondStar = async () => {
  const text = await file.text();

  const infos: SpringInfo[] = [];
  text.split('\n').forEach((line) => {
    const helper = line.split(' ')[0].split('').join('');
    const springs = new Array(5).fill(helper).join('?');

    const damagedSpringAmounts: number[] = new Array(5)
      .fill(
        line
          .split(' ')[1]
          .split(',')
          .map((num) => parseInt(num))
      )
      .flat();

    infos.push({
      springs,
      damagedSpringAmounts,
    });
  });

  let result = 0;

  infos.forEach((info) => {
    result += ways(info.springs, info.damagedSpringAmounts);
  });

  console.log('secondStar:', result);
};

firstStar();
secondStar();
