const regularExp = {
  EMAIL_REGEXP: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  PHONE_REGEXP: /^\(\d{3}\)\s\d{3}-\d{4}/,
  PASSWORD_REGEXP: /^(?=.*\d.*)(?=.*[a-zA-Z].*)(?=.*[!#\$%&\?].*).{8,}/,
};

module.exports = regularExp;
