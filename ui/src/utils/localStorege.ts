export function saveInLocalStoreg(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function getFromLocalStorege(key: string) {
  return localStorage.getItem(key);
}

export function isInLocalStorge(key: string) {
  return localStorage.getItem(key) !== null;
}

export function deleteFromLocalStorge(key: string) {
  return localStorage.removeItem(key);
}
