/**
 *
 * @param key
 * @param value
 * @param expire
 * @param path
 * @param httpOnly
 *
 * expire time use houres by default
 *
 */

export function setCookie(
  key: string,
  value: string,
  expire: number = 1,
  path: string = "/",
  httpOnly: boolean = true
) {
  const d = new Date();
  d.setTime(d.getTime() + expire * 60 * 60 * 1000);
  document.cookie = `${key}=${value};expires=${d.toUTCString()} ";path=${path};httpOnly=${httpOnly}`;
}

export function getCookie(key: string): string {
  const name = key + "=",
    ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function removeCookie(key: string) {
  setCookie(key, "", -1);
}

export function hasCookie(key: string): boolean {
  return getCookie(key) !== "";
}
