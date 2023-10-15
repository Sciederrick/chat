const router = require("express").Router();

const {
  getConversationsByParticipant,
  createConversation,
  deleteConversation,
} = require("./../controllers/conversation.controller");

router
  .route("/")
  /**
   * @api {patch} /conversations/ Create Conversation
   * @apiName CreateConversation
   * @apiGroup Chat
   *
   * @apiBody {String[]} participants        Mandatory user ids, minimum of 2 ids
   * @apiBody {Boolean}  [private=true]      Optional converation type i.e "group" or "private" conversation
   *
   * @apiSuccess {String[]} participants User ids
   *
   * @apiSuccessExample Success-Response
   * {
   *   "private": false,
   *   "participants": [
   *     "64a7ea71cc7efe460fc69823",
   *     "64a7e734cc7efe460fc69805"
   *   ],
   *   "_id": "64a7ed6f1c36075c69e3dd48",
   *   "__v": 0
   * }
   *
   */
  .post(createConversation);

router
  .route("/")
  /**
   * @api {delete} /conversations/ Delete Conversation
   * @apiName DeleteConversation
   * @apiGroup Chat
   *
   * @apiBody {String} conversationId  Conversation id
   *
   * @apiSuccess {Boolean} Success  Indicates if it was successfully deleted
   *
   * @apiSuccessExample Success-Response
   * {
   *   "success": true,
   * }
   *
   */
  .delete(deleteConversation);

router
  .route("/:userId")
  /**
   * @api {post} /conversations/:userId Get Conversations by User Id
   * @apiName GetConversationsByUserId
   * @apiGroup Chat
   *
   * @apiParam {String} userId User Id
   *
   * @apiQuery {Number} [page=1]       Optional page number
   * @apiQuery {Number} [limit=50]     Optional results limit per page
   * @apiQuery {String} [private=true] Optional conversation type (private or group conversation)
   *
   * @apiSuccessExample Success-Response
   * {
   *   "info": {
   *     "limit": 50,
   *     "next": null,
   *     "previous": null,
   *     "count": 1,
   *     "pages": 1
   *   },
   *   "results": [
   *     {
   *       "private": true,
   *       "participants": [
   *         "64b5886c2d0ddf2a54d0d1fc",
   *         "64b587202d0ddf2a54d0d1ea"
   *       ],
   *       "_id": "64be98f5d4a34c3c98fdbbbf",
   *       "__v": 0
   *     }
   *   ]
   * }
   */
  .get(getConversationsByParticipant);
//   .get(paginatedConversations(Conversation), (_, res, __) => {
//     return res.json(
//       // @ts-ignore
//       res.paginatedResults
//     );
//   });

module.exports = router;
