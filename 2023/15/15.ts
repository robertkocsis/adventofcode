const file = Bun.file('15/file.txt');

const hash = (text: string): number => {
  let currentValue = 0;

  for (let i = 0; i < text.length; i++) {
    currentValue += text.charCodeAt(i);
    currentValue *= 17;
    currentValue %= 256;
  }

  return currentValue;
};

const firstStar = async () => {
  const text = await file.text();
  let values = text.split(',');
  let sum = 0;

  for (let i = 0; i < values.length; i++) {
    sum += hash(values[i]);
  }

  console.log('firstStar:', sum);
};

interface LensInfo {
  label: string;
  focalLength: number;
}

const secondStar = async () => {
  const text = await file.text();
  const map = new Map<number, LensInfo[]>();

  const values = text.split(',');

  values.forEach((value) => {
    if (value.includes('-')) {
      const label = value.split('-')[0];

      if (map.has(hash(label))) {
        map.set(
          hash(label),
          map.get(hash(label))!.filter((lens) => lens.label !== label)
        );
      }
    } else {
      const label = value.split('=')[0];
      const focalLength = parseInt(value.split('=')[1]);

      if (map.has(hash(label))) {
        const lenseExists = map
          .get(hash(label))!
          .find((lens) => lens.label === label);

        if (lenseExists) {
          lenseExists.focalLength = focalLength;
        } else {
          map.set(hash(label), [
            ...map.get(hash(label))!,
            { label, focalLength },
          ]);
        }
      } else {
        map.set(hash(label), [{ label, focalLength }]);
      }
    }
  });

  let sum = 0;
  Array.from(map.entries()).forEach((entry) => {
    const [key, value] = entry;

    value.forEach((lens, index) => {
      sum += (key + 1) * (index + 1) * lens.focalLength;
    });
  });

  console.log('secondStar:', sum);
};

firstStar();
secondStar();
