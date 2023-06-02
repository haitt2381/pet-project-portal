export function isNullOrUndefined(value: any) {
  return value === null || value === undefined;
}

export function getQueryStorage() {
  let queryStorageParse = JSON.parse(localStorage.getItem("queryStorage"));
  return queryStorageParse ? queryStorageParse : {};
}

export function setQueryStorage(data: any) {
  localStorage.setItem("queryStorage", JSON.stringify(data));
}
