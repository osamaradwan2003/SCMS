import bcrypt from "bcrypt";

// generate helper function to hash password usng bcrypt
export const hashPassword = (password: string) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

// generate helper function to compare password usng bcrypt
export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};
