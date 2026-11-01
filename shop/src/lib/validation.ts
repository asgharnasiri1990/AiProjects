/**
 * Form validation helpers.
 * The API authenticates with username + password (no email field),
 * so signup validates a username instead of an email address.
 */

export const USERNAME_RULES =
  "3–30 characters: letters, numbers and underscores.";
export const PASSWORD_RULES = "At least 6 characters.";

export function validateUsername(value: string): string | null {
  const username = value.trim();
  if (!username) return "Username is required.";
  if (username.length < 3 || username.length > 30) {
    return "Username must be 3–30 characters long.";
  }
  if (!/^[a-z0-9_]+$/i.test(username)) {
    return "Username can only contain letters, numbers and underscores.";
  }
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  if (value.length > 72) return "Password must be at most 72 characters.";
  return null;
}

export function validateConfirmPassword(
  password: string,
  confirm: string,
): string | null {
  if (!confirm) return "Please confirm your password.";
  if (password !== confirm) return "Passwords do not match.";
  return null;
}

export function validateFullName(value: string): string | null {
  const name = value.trim();
  if (!name) return "Full name is required.";
  if (name.length < 3) return "Full name must be at least 3 characters.";
  if (name.length > 80) return "Full name must be at most 80 characters.";
  return null;
}

export function validatePhone(value: string): string | null {
  const phone = value.trim();
  if (!phone) return "Phone number is required.";
  if (!/^09\d{9}$/.test(phone)) {
    return "Enter a valid Iranian mobile number (e.g. 09121234567).";
  }
  return null;
}

export function validateAddress(value: string): string | null {
  const address = value.trim();
  if (!address) return "Address is required.";
  if (address.length < 10) return "Address must be at least 10 characters.";
  if (address.length > 300) return "Address must be at most 300 characters.";
  return null;
}

/** Only allow relative, single-slash paths as post-login redirects. */
export function safeRedirectPath(value: string | null | undefined): string {
  if (!value) return "/shop";
  if (!value.startsWith("/") || value.startsWith("//")) return "/shop";
  return value;
}
