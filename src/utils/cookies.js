// Lightweight cookie helpers (no external dependency).

export const setCookie = (name, value, days = 7) => {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value ?? "")}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

export const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
};

export const removeCookie = (name) => {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};
