import decode from "jwt-decode";

export const TOKEN_KEY = "aicare-token";

export const isAuthenticated = () => {
    const token = getToken();
    return !!token && !isTokenExpired(token);
}

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const login = token => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const isTokenExpired = token => {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  };

  export const jwtSubject = () => {
    try {
      const decoded = decode(getToken());
      return decoded.sub;
    } catch (err) {
      return false;
    }
  };