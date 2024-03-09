const checkLogin = () => {
  const token = localStorage.getItem("admin-token");
  return !!token;
};

const setAuthData = (token) => {
  localStorage.setItem("admin-token", token);
};

const setRememberPassword = (email, Password) => {
  localStorage.setItem("admin-email", email);
  localStorage.setItem("admin-password", Password);
};

const removeAuthData = () => {
  localStorage.removeItem("admin-token");
};
const AuthService = {
  checkLogin: checkLogin,
  setAuthData: setAuthData,
  removeAuthData: removeAuthData,
  setRememberPassword: setRememberPassword,
};

export default AuthService;
