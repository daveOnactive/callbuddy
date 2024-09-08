export function generateTextRef() {
  const prefix = "ref-";
  let randomPart = "";

  for (let i = 0; i < 11; i++) {
    randomPart += Math.floor(Math.random() * 10);
  }

  return prefix + randomPart;
}
