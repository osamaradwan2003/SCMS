import { TOKEN_KEY } from "./contstance";
import { getCookie } from "./cookies";
import { getFromLocalStorege } from "./localStorege";

export function getToken() {
  const token_from_storege = getFromLocalStorege(TOKEN_KEY);
  const token_from_cookie = getCookie(TOKEN_KEY);
  return token_from_cookie || token_from_storege;
}
