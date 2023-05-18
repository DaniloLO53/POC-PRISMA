import bycript from "bcrypt";

export function hashPassword(password: string) {
  const hashedPassword = bycript.hash(password, 10);

  return hashedPassword;
}

export function validatePassword(password: string, dbPassword: string) {
  return bycript.compare(password, dbPassword);
}
