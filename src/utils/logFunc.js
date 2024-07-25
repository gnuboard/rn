export function logJson(data, error=false) {
  if (error) {
    console.error(JSON.stringify(data, null, 2));
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}