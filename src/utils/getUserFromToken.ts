export function getUserIdFromToken(token: string): string | null {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const decoded = JSON.parse(atob(payload));

    return (
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ] ??
      decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid"
      ] ??
      decoded["nameid"] ??
      null
    );
  } catch {
    return null;
  }
}