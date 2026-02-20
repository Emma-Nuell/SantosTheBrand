/**
 * Interface for the user profile stored in localStorage
 */
interface UserProfile {
  token: string;
}

/**
 * Interface for the JWT payload
 */
interface JwtPayload {
  exp: number;
  iat?: number;
  [key: string]: any; // Allows for other custom claims
}

export const getToken = (): string | null => {
  try {
    if (typeof window === "undefined") return null;

    const userData = localStorage.getItem("profile");
    if (!userData) return null;

    const user: UserProfile = JSON.parse(userData);
    return user.token || null;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userToken", token);
  }
};

export const clearToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userToken");
    localStorage.removeItem("profile"); 
  }
};

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const payload: JwtPayload = JSON.parse(window.atob(base64));
    const exp = payload.exp * 1000; 

    return Date.now() >= exp;
  } catch (error) {
    return true; // If we can't decode, treat as expired
  }
};
