export const getToken = () => {
  try {
    const userData = localStorage.getItem("profile");
    if (!userData) return null;

    const user = JSON.parse(userData);

    return user.token || null;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};
export const setToken = (token) => {
  localStorage.setItem("userToken", token);
};

export const clearToken = () => {
  localStorage.removeItem("userToken");
};

export const isTokenExpired = (token) => {
  try {
    // Decode the token payload (middle part between the dots)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return true; // If we can't decode, treat as expired
  }
};
