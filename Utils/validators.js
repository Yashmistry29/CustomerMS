const isValidName = (name) => /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name);

const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/.test(email);

const isValidAge = (dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return age > 18 || (age === 18 && today >= new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()));
};

const isValidMobile = (mobile) => /^[6789]\d{9}$/.test(mobile);

const isValidPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,20}$/.test(password);

module.exports = {
  isValidName,
  isValidEmail,
  isValidAge,
  isValidMobile,
  isValidPassword
};
