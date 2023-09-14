const codepadValidator = {};

codepadValidator.isCompileCodeResourceValid = (body) => {
  let { code } = body;
  return typeof code == "string" && code.trim() != "" ? code.trim() : false;
};

codepadValidator.isCreateCodeResourceValid = (body) => {
  let { userId, code, filename } = body;
  filename = typeof filename == "string" && filename.trim() != "";
  code = typeof code == "string" && code.trim() != "";
  userId = typeof userId == "string" && userId.trim() != "" && userId.trim().length >= 12;

  return userId && code && filename;
};

codepadValidator.isGetCodeResourceByIdValid = (params) => {
  let { id } = params;
  return typeof id == "string" && id.trim() != "" && id.trim().length >= 12;
};

codepadValidator.isGetCodeResourcesByUserIdValid = (params) => {
  let { userId } = params;
  return typeof userId == "string" && userId.trim() != "" && userId.trim().length >= 12;
};

codepadValidator.isUpdateCodeResourceByIdValid = (params, body) => {
  let { id } = params;
  let { userId, filename, code } = body;
  return (
    typeof id == "string" &&
    id.trim() != "" &&
    id.trim().length >= 12 &&
    typeof userId == "string" &&
    userId.trim() != "" &&
    userId.trim().length >= 12 &&
    typeof filename == "string" &&
    filename.trim() != "" &&
    typeof code == "string" &&
    code.trim() != ""
  );
};

codepadValidator.isDeleteCodeResourceByIdValid = (params) => {
  let { id } = params;
  return typeof id == "string" && id.trim() != "" && id.trim().length >= 12;
};

codepadValidator.isDeleteAllCodeResourcesByUserId = (params) => {
  let { userId } = params;
  return typeof userId == "string" && userId.trim() != "" && userId.trim().length >= 12;
};

module.exports = codepadValidator;
