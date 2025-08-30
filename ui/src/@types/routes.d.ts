import { NonIndexRouteObject, RouteObject } from "react-router-dom";
import { MenuItemType } from "antd/es/menu/hooks/useItems";

declare interface HyperRoute<
  Parm extends MenuItemType & RouteObject = MenuItemType & RouteObject
> extends NonIndexRouteObject,
    MenuItemType {
  children?: Parm[];
}

export { HyperRoute };
