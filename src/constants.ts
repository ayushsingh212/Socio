  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const PASSWORD_REGEX =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  export {
    EMAIL_REGEX,
    USERNAME_REGEX,
    PASSWORD_REGEX
  }