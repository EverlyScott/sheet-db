const pluralize = (noun: string, count: number) => {
  if (count === 1) {
    return noun;
  } else {
    return `${noun}s`;
  }
};

export default pluralize;
