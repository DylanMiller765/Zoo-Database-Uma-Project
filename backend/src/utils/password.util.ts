// Plain text password utilities for student project

export function validatePassword(password: string): boolean {
  // Basic validation: password must be at least 6 characters
  return password && password.length >= 6;
}

export function comparePassword(plainPassword: string, storedPassword: string): boolean {
  // Plain text comparison
  return plainPassword === storedPassword;
}
