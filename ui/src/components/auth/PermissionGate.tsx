import React from "react";
import type { AppModel, PermissionAction, User } from "@/@types/user";
import { hasPermission } from "@/utils/permissions";

type Props = React.PropsWithChildren<{
  model: AppModel;
  action: PermissionAction;
  user?: User;
  fallback?: React.ReactNode;
}>;

const PermissionGate: React.FC<Props> = ({ model, action, user, fallback = null, children }) => {
  const allowed = hasPermission(user, model, action);
  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
};

export default PermissionGate;
