import { DARK_VALUE, LIGHT_VALUE, THEME_KEY } from "./contstance.ts";
import { getFromLocalStorege, saveInLocalStoreg } from "./localStorege.ts";

export function isDarkTheme(): boolean {
  const theme_mode = getFromLocalStorege(THEME_KEY);
  if (!theme_mode)
    return window?.matchMedia("(prefers-color-scheme: dark)")?.matches;
  return theme_mode == DARK_VALUE;
}

export function getTheme() {
  return getFromLocalStorege(THEME_KEY);
}

export function setTheme(isDark: boolean) {
  if (isDark) saveInLocalStoreg(THEME_KEY, DARK_VALUE);
  else saveInLocalStoreg(THEME_KEY, LIGHT_VALUE);
  window.location.reload();
}

export function toggleTheme() {
  if (isDarkTheme()) return setTheme(false);
  setTheme(true);
}
