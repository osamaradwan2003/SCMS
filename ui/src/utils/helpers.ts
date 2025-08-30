import { Schema } from "yup";

export function getCookie(key: string) {
  const name: string = key + "=",
    decodedCookie: string = decodeURIComponent(document.cookie),
    ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return;
}
export function getStorageItem(key: string) {
  return window?.localStorage.getItem(key);
}

export function setStorageItem(key: string, value: string) {
  return window?.localStorage.setItem(key, value);
}

export function setCookie(key: string, value: string, exprDays: number) {
  const d = new Date();
  d.setTime(d.getTime() + exprDays * 24 * 60 * 60 * 1000);
  const expires: string = "expires=" + d.toUTCString();
  return (document.cookie = key + "=" + value + ";" + expires + ";path=/");
}

export const shadeColor = (color: string, percent: number): string => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(((R * (100 + percent)) / 100).toString());
  G = parseInt(((G * (100 + percent)) / 100).toString());
  B = parseInt(((B * (100 + percent)) / 100).toString());

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
};

export const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (result) {
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;
    if (max == min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
      h /= 6;
    }
    return {
      h,
      s,
      l,
    };
  } else {
    throw new Error("Non valid HEX color");
  }
};

export const yupValidator = (schema: Schema) => ({
  async validator(_: object, value: string) {
    await schema.validateSync(value);
  },
});

export function calculateAge(dateOfBirth: Date): number {
  const today: Date = new Date();
  const birthDate: Date = new Date(dateOfBirth);
  let age: number = today.getFullYear() - birthDate.getFullYear();
  const month: number = today.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CreateFormData(values: Record<string, string | any>) {
  const formData = new FormData();
  for (const name in values) {
    if (values[name] == undefined) continue;
    // console.log(values[name])
    if (name == "files") {
      for (let i = 0; i < values[name].fileList.length; i++) {
        formData.append(
          `${name}[${i}]`,
          values[name].fileList[i].originFileObj
        );
      }
      continue;
    }
    formData.append(name, values[name]);
  }
  return formData;
}
export function getLastXDay(x: number): Date {
  const today = new Date();
  const lastDay = new Date(today);
  lastDay.setDate(today.getDate() - x);
  return lastDay;
}
