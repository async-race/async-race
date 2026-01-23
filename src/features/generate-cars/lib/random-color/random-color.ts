export function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  const colorLength = 6;
  for (let index = 0; index < colorLength; index++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
