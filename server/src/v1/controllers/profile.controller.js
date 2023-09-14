const jwt = require("jsonwebtoken");
const Profile = require("../../../mongo/models/profile");
const {
  validateCreateProfile,
  validateGetProfileById,
  validateGetMultipleProfilesByIds,
} = require("../validate/profile.validate");
const helpers = require("./../util/helper.util");

const profileController = {};

profileController.createProfile = async (req, res) => {
  try {
    if (!validateCreateProfile(req.body))
      return res.status(400).json({ message: "invalid inputs", status: 400 });

    if (req.body.email) {
      const existingUser = await Profile.findOne({
        email: req.body.email.trim(),
      });
      if (existingUser != null)
        return res
          .status(409)
          .json({ message: "User with that email already exits", status: 409 });
    }

    const encryptedPassword = helpers.hash(req.body.password.trim());

    const payload = {
      avatar: req.body.avatar.trim(),
      bio: {
        fullName: req.body.bio.fullName.trim(),
        about: req.body.bio.about.trim(),
      },
      password: encryptedPassword,
    };

    if ("email" in req.body) {
      payload.email = req.body.email.trim();
    }
    if ("title" in req.body.bio) {
      payload.bio.title = req.body.bio.title.trim();
    }
    if ("links" in req.body.bio) {
      payload.bio.links = req.body.bio.links.trim();
    }
    // Role only needs to be specified when
    // it is not the default 'client'
    if ("role" in req.body) {
      payload.role = req.body.role.trim();
    }

    const newProfile = await Profile.create(payload);
    delete newProfile["password"];

    // Will be required on auth full integration :)
    // const token = jwt.sign(
    //   { user_id: newProfile._id, email: newProfile.email },
    //   process.env.TOKEN_KEY,
    //   { expiresIn: helpers.generateTokenExpiration() }
    // );
    // newProfile.token = token;

    return res.status(201).json(newProfile);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};

profileController.getProfileById = async (req, res) => {
  try {
    if (!validateGetProfileById(req.params))
      return res
        .status(400)
        .json({ message: "invalid profile id", status: 400 });

    const foundProfile = await Profile.find(
      {
        _id: req.params.profileId.trim(),
      },
      "-password"
    );
    if (!foundProfile)
      return res.status(404).json({
        message: `Profile with id <${req.params.profileId.trim()}> not found`,
        status: 404,
      });

    return res.status(200).json(foundProfile);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};

profileController.getMultipleProfilesByIds = async (req, res) => {
  try {
    const { profileIds } = req.query;
    const validProfileIds = validateGetMultipleProfilesByIds(
      profileIds?.split(",")
    );
    if (!validProfileIds)
      return res
        .status(400)
        .json({ message: "invalid profile id", status: 400 });

    const foundProfiles = await Profile.find(
      {
        _id: {
          $in: validProfileIds,
        },
      },
      "-password"
    );
    if (!foundProfiles)
      return res.status(404).json({
        message: `Profile with id <${req.params.profileId.trim()}> not found`,
        status: 404,
      });

    delete foundProfiles["password"];
    return res.status(200).json(foundProfiles);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};

profileController.getUncontactedProfiles = async (req, res) => {
  try {
    const { profileIds } = req.body;
    const contactedProfileIds = profileIds?.split(",");

    const validProfileIds =
      validateGetMultipleProfilesByIds(contactedProfileIds);
    if (!validProfileIds)
      return res
        .status(400)
        .json({ message: "invalid profile id", status: 400 });

    const allProfiles = await Profile.find({}, "-password");
    if (!allProfiles)
      return res.status(404).json({
        message: `Profiles were not found`,
        status: 404,
      });

    delete allProfiles["password"];

    function buildUncontactedProfiles(contactedProfileIds, allProfiles) {
      const uncontactedProfiles = allProfiles.filter((profile) => {
        return !contactedProfileIds.some((contactedProfileId) => {
          return profile._id.toString() === contactedProfileId;
        });
      });

      return uncontactedProfiles.map((profile) => {
        return {
          _id: profile._id.toString(),
          bio: {
            fullName: profile.bio.fullName,
          },
          avatar: profile.avatar,
        };
      });
    }

    const uncontactedProfiles = buildUncontactedProfiles(
      contactedProfileIds,
      allProfiles
    );

    return res.status(200).json(uncontactedProfiles);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};

module.exports = profileController;
