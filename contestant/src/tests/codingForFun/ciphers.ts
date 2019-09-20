const findBest = (ciphers: number[], expectedResult: number): void => {
  let best = Infinity;
  let bestExpression = '';
  const combine = (value: number, other: number[], expression: string): void => {
    const diff = Math.abs(expectedResult - value);
    if(diff < best) {
      best = diff;
      bestExpression = expression;
    }
    if (best !== 0 && other.length) {
      other.forEach((current): void => {
        const rest = other.filter((item): boolean => item !== current);
        combine(value + current, rest, `${expression} + ${current}`);
        combine(value - current, rest, `${expression} - ${current}`);
        combine(value / current, rest, `(${expression}) / ${current}`);
        combine(value * current, rest, `(${expression}) * ${current}`);
      });
    }
  };
  ciphers.forEach((current): void => {
    const rest = ciphers.filter((item): boolean => item !== current);
    combine(current, rest, current.toString());    
  })
  console.log(best);
  console.log(bestExpression);
};


test('Find', (): void => {
  const ciphers = [50, 10, 9, 4, 5, 7];
  const expectedResult = 877;
  findBest(ciphers, expectedResult);
});