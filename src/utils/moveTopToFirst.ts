export default (arr: Array<any>) => {
  const tops = arr.filter((item: any) => item.data.top === true);
  const rest = arr.filter((item: any) => item.data.top !== true);
  if (tops.length) arr.splice(0, arr.length, ...tops, ...rest);
  return arr;
}