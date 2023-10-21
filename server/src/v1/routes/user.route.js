const router = require("express").Router();

const {
  createProfile,
  getProfileById,
  getMultipleProfilesByIds,
  getUncontactedProfiles,
  getRandomProfile,
} = require("../controllers/user.controller");

router
  .route("/")
  /**
   * @api {post} /profiles/ Create profile
   * @apiName Createprofile
   * @apiGroup profile
   *
   * @apiBody {String} email      Mandatory Email
   * @apiBody {String} avatar     Avatar location
   * @apiBody {Object} bio        Mandatory Biography
   * @apiBody {String} bio.fullName  Mandatory Full name
   * @apiBody {String} bio.title     Title of the user
   * @apiBody {String} bio.about     About the user
   * @apiBody {String[]} bio.links   Personal links of the user
   * @apiBody {String} role       Role of user
   *
   * @apiSuccess {String} email      Mandatory Email
   * @apiSuccess {String} avatar     Avatar location
   * @apiSuccess {Object} bio        Mandatory Biography
   * @apiSuccess {String} bio.fullName  Mandatory Full name
   * @apiSuccess {String} bio.title     Title of the user
   * @apiSuccess {String} bio.about     About the user
   * @apiSuccess {String[]} bio.links   Personal links of the user
   * @apiSuccess {String} role          Role of user
   * @apiSuccess {String} timestamp    ISO 8601 DateTime string
   *
   * @apiSuccessExample Success-Response
   *  HTTP/1/1 201 OK
   * {
   *   "role": "client",
   *   "_id": "64a7da788705843c2f238140",
   *   "email": "eleanor@gmail.com",
   *   "avatar": "/img/contact-avatar3.png",
   *   "bio": {
   *     "links": [],
   *     "_id": "64a7da788705843c2f238141",
   *     "fullName": "Eleanor Lindsey",
   *     "title": "QA Practitioner",
   *     "about": "I am a QA Practitioner. Consectetur ea explicabo consequuntur possimus molestias."
   *   },
   *   "createdAt": "2023-07-07T09:27:20.045Z",
   *   "updatedAt": "2023-07-07T09:27:20.045Z",
   *   "__v": 0
   * }
   *
   */
  .post(createProfile);

router
  .route("/:profileId")
  /**
   * @api {get} /profiles/:profileId Get Profile By Id
   * @apiName GetProfileById
   * @apiGroup Profile
   *
   * @apiParam {String} profileId Profile id
   *
   * @apiSuccess {Object[]} profile
   * @apiSuccess {String} profile.email      Mandatory Email
   * @apiSuccess {String} profile.avatar     Avatar location
   * @apiSuccess {Object} profile.bio        Mandatory Biography
   * @apiSuccess {String} profile.bio.fullName  Mandatory Full name
   * @apiSuccess {String} profile.bio.title     Title of the user
   * @apiSuccess {String} profile.bio.about     About the user
   * @apiSuccess {String[]} profile.bio.links   Personal links of the user
   * @apiSuccess {String} profile.role          Role of user
   * @apiSuccess {String} profile.timestamp    ISO 8601 DateTime string
   *
   * @apiSuccessExample Success-Response
   * HTTP/1/1 201 OK
   * [
   *  {
   *    "role": "client",
   *    "_id": "64a7e734cc7efe460fc69805",
   *    "email": "eleanor@gmail.com",
   *    "avatar": "/img/contact-avatar3.png",
   *    "bio": {
   *      "links": [],
   *      "_id": "64a7e734cc7efe460fc69806",
   *      "fullName": "Eleanor Lindsey",
   *      "title": "QA Practitioner",
   *      "about": "I am a QA Practitioner. Consectetur ea explicabo consequuntur possimus molestias."
   *    },
   *    "createdAt": "2023-07-07T10:21:40.476Z",
   *    "updatedAt": "2023-07-07T10:21:40.476Z",
   *    "__v": 0
   *  }
   * ]
   *
   */
  .get(getProfileById);
  
  router
  .route("/:gender/random")
  /**
   * @api {get} /profiles/:gender/random Get Random Profile
   * @apiName GetRandomProfile
   * @apiGroup Profile
   *
   * @apiParam {String} gender    Gender "M" or "F" or "A"
   *
   * @apiSuccess {String} email      Mandatory Email
   * @apiSuccess {String} avatar     Avatar location
   * @apiSuccess {Object} bio        Mandatory Biography
   * @apiSuccess {String} bio.fullName  Mandatory Full name
   * @apiSuccess {String} bio.title     Title of the user
   * @apiSuccess {String} bio.about     About the user
   * @apiSuccess {String[]} bio.links   Personal links of the user
   * @apiSuccess {String} role          Role of user
   * @apiSuccess {String} timestamp    ISO 8601 DateTime string
   *
   * @apiSuccessExample Success-Response
   * HTTP/1/1 201 OK
   * 
   *  {
   *    "role": "client",
   *    "_id": "64a7e734cc7efe460fc69805",
   *    "email": "eleanor@gmail.com",
   *    "isMale": false,
   *    "avatar": "/img/contact-avatar3.png",
   *    "bio": {
   *      "links": [],
   *      "_id": "64a7e734cc7efe460fc69806",
   *      "fullName": "Eleanor Lindsey",
   *      "title": "QA Practitioner",
   *      "about": "I am a QA Practitioner. Consectetur ea explicabo consequuntur possimus molestias."
   *    },
   *    "createdAt": "2023-07-07T10:21:40.476Z",
   *    "updatedAt": "2023-07-07T10:21:40.476Z",
   *    "__v": 0
   *  }
   * 
   *
   */
  .get(getRandomProfile);

router
  .route("/")
  /**
   * @api {get} /profiles Get Multiple Profiles By Ids
   * @apiName GetMultipleProfilesByIds
   * @apiGroup Profile
   *
   * @apiQuery {String} profileIds A string delimited with "," of Profile Ids
   *
   * @apiSuccess {Object[]} profile
   * @apiSuccess {String} profile.email      Mandatory Email
   * @apiSuccess {String} profile.avatar     Avatar location
   * @apiSuccess {Object} profile.bio        Mandatory Biography
   * @apiSuccess {String} profile.bio.fullName  Mandatory Full name
   * @apiSuccess {String} profile.bio.title     Title of the user
   * @apiSuccess {String} profile.bio.about     About the user
   * @apiSuccess {String[]} profile.bio.links   Personal links of the user
   * @apiSuccess {String} profile.role          Role of user
   * @apiSuccess {String} profile.timestamp    ISO 8601 DateTime string
   *
   * @apiSuccessExample Success-Response
   * HTTP/1/1 201 OK
   * [
   *   {
   *     "role": "admin",
   *     "_id": "64b586d52d0ddf2a54d0d1e6",
   *     "email": "admin@gmail.com",
   *     "avatar": "/img/admin-avatar.png",
   *     "bio": {
   *       "links": [],
   *       "_id": "64b586d52d0ddf2a54d0d1e7",
   *       "fullName": "Admin",
   *       "title": "Administrator",
   *       "about": "I the administrator. Consectetur ea explicabo consequuntur possimus molestias."
   *     },
   *     "password": "76ba0f5de12bc6cc8340c6413b0c68d875fa9220c2645a1275d71d39d3a8d347",
   *     "createdAt": "2023-07-17T18:22:13.057Z",
   *     "updatedAt": "2023-07-17T18:22:13.057Z",
   *     "__v": 0
   *   },
   *   {
   *     "role": "client",
   *     "_id": "64b587202d0ddf2a54d0d1ea",
   *     "email": "eleanor@gmail.com",
   *     "avatar": "/img/contact-avatar3.png",
   *     "bio": {
   *       "links": [],
   *       "_id": "64b587202d0ddf2a54d0d1eb",
   *       "fullName": "Eleanor Lindsey",
   *       "title": "QA Practitioner",
   *       "about": "I am a QA Practitioner. Consectetur ea explicabo consequuntur possimus molestias."
   *     },
   *     "password": "76ba0f5de12bc6cc8340c6413b0c68d875fa9220c2645a1275d71d39d3a8d347",
   *     "createdAt": "2023-07-17T18:23:28.136Z",
   *     "updatedAt": "2023-07-17T18:23:28.136Z",
   *     "__v": 0
   *   }
   * ]
   *
   */
  .get(getMultipleProfilesByIds);

router
  .route("/uncontacted")
  /**
   * @api {post} /profiles/uncontacted Get Uncontacted Profiles
   * @apiName GetUncontactedProfiles
   * @apiGroup Profile
   *
   * @apiBody {String} profileIds A string delimited with "," of Profile Ids
   *
   * @apiSuccess {Object[]} profile
   * @apiSuccess {String} profile.fullName  Mandatory Full name
   *
   * @apiSuccessExample Success-Response
   * HTTP/1/1 201 OK
   * [
   *  {
   *    "_id": "64a7e734cc7efe460fc69805",
   *     "bio": {
   *       "fullName": "Eleanor Lindsey",
   *     },
   *     "avatar": "/img/contact-avatar3.png",
   *  }
   * ]
   *
   */
  .post(getUncontactedProfiles);

module.exports = router;
