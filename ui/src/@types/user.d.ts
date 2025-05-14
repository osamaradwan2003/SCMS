export interface User {
  username: string;
  firstname: string;
  lastname: string;
  email?: string;
  image?: string;
  role: Role;
}

export interface Role {
  name: string;
  permisions: string[];
}
