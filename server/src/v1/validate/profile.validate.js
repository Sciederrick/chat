const validate = {};

validate.validateCreateProfile = (body) => {
  const { bio, password } = body;

  const avatarExists = "avatar" in body;
  const bioKeysExist =
    "fullName" in bio && "about" in bio;
  const requiredValuesAreValid =
    typeof bio.fullName == "string" &&
    bio.fullName.trim() != "" &&
    typeof password == "string" &&
    password.trim() != "";

  return avatarExists && bioKeysExist && requiredValuesAreValid;
};

validate.validateGetProfileById = (params) => {
  const { profileId } = params;
  return typeof profileId == "string" && profileId.trim() != "";
};

validate.validateGetMultipleProfilesByIds = (queryArray) => {
  if (typeof queryArray != 'object' || queryArray.length == 0) return null;

  let result = [];
  queryArray.forEach(profileId => {
    if (typeof profileId != "string") return null;
    if (profileId.trim() != "") result.push(profileId.trim());
  });

  return result;
}

module.exports = validate;
