export function capitalize(string) {
  if (!string) return null;
  let result = string.split(" ");
  for (let i = 0; i < result.length; i++) {
    result[i] = result[i].charAt(0).toUpperCase() + result[i].slice(1);
  }
  return result.join(" ");
}
