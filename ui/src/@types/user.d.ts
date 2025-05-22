export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  image?: string;
  role: Role;
}

export interface Role {
  name: string;
  permisions: string[];
}
