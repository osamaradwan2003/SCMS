import path from "path";
import fs from "fs";
import { type Express } from "express";

export function loadRoutes(
  app: Express,
  prefix: string = "/",
  execlude: string[] = []
) {
  const path_route = path.join(__dirname, "../", "./modules");
  fs.readdirSync(path_route, { recursive: true }).forEach(function (file) {
    if ((file as string).endsWith("route.ts")) {
      let path_name = (file as string)
        .replace(path.sep + "route.ts", "")
        .replace("\\", "/");
      if (execlude && execlude?.indexOf(path_name) > -1) return;
      // console.log(path_name);
      const route = require(path.join(path_route, file as string));
      app.use(`${prefix}/${path_name}`, route.default || route);
    }
  });
}
