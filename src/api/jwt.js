// src/api/jwt.js
export function decodeJwt(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getClaim(token, ...keys) {
  const claims = decodeJwt(token);
  if (!claims) return null;
  for (const k of keys) {
    if (claims[k] != null) return claims[k];
  }
  return null;
}