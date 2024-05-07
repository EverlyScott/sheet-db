const getArtistLifetimeString = (born: string, died: string) => {
  if (born) {
    if (died) {
      return `${born}-${died}`;
    }
    return `${born}-Present`;
  }

  if (died) {
    return `Unknown-${died}`;
  }
};

export default getArtistLifetimeString;
