export function addBraces(str: string) {
  return str.replace(/{/g, "{{").replace(/}/g, "}}");
}
