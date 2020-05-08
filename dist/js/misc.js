export function randomString(alphabet, length) {
  return Array(length)
    .fill(0)
    .map(() => alphabet[Math.floor(alphabet.length * Math.random())])
    .join('');
}

export function randomName() {
  return `${new Date().getTime()}_${randomString('1234567890', 6)}`;
}