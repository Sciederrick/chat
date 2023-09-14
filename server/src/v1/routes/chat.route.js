const router = require("express").Router();

const {
  createMessage,
  updateMessageById,
  updateMessagesByConversationId,
  deleteMessage,
  createConversation,
  deleteConversation,
  getMessagesByConversationId,
} = require("./../controllers/chat.controller");

const Conversation = require("./../../../mongo/models/conversation");
const {
  paginatedConversations,
} = require("./../middleware/conversations.pagination.middleware");

router
  .route("/")
  /**
   * @api {post} /chats/ Create Message
   * @apiName CreateMessage
   * @apiGroup Chat
   *
   * @apiBody {String} conversationId Mandatory Conversation id
   * @apiBody {String} senderId       Mandatory Sender id
   * @apiBody {String} message        Mandatory text message
   * @apiBody {String} timestamp      Mandatory timestamp
   *
   * @apiSuccess {String} conversationId  Conversation id
   * @apiSuccess {String} senderId        Sender id
   * @apiSuccess {String} message         The text message
   * @apiSuccess {String} timestamp       ISO 8601 DateTime string
   * @apiSuccess {Boolean} directMessage  Is the message a direct/private message?
   *
   * @apiSuccessExample Success-Response
   *  HTTP/1/1 201 OK
   * {
   *   "_id": "64a7b86ec479aada37f29127",
   *   "conversationId": "649177982a09738eed539aea",
   *   "senderId": "6491779a2a09738eed539af4",
   *   "message": "hello",
   *   "timestamp": "2023-07-07T07:02:06.628Z",
   *   "__v": 0
   * }
   *
   */
  .post(createMessage);

router
  .route("/")
  /**
   * @api {delete} /chats/ Delete Message
   * @apiName DeleteMessage
   * @apiGroup Chat
   *
   * @apiBody {String} messageTimestamp Timestamp of message
   *
   * @apiSuccess {Boolean} Success  Indicates if it was successfully deleted
   *
   * @apiSuccessExample Success-Response
   *  HTTP/1/1 201 OK
   * {
   *   "success": true,
   * }
   *
   */
  .delete(deleteMessage);

router
  .route("/:conversationId")
  /**
   * @api {get} /chats/:conversationId Get Messages by conversation id
   * @apiName GetMessagesByConversationId
   * @apiGroup Chat
   *
   * @apiParam {String} conversationId Conversation id
   *
   * @apiSuccess {String} conversation Conversation id
   * @apiSuccess {String} sender       Sender id
   * @apiSuccess {String} content      The text message
   * @apiSuccess {String} timestamp    ISO 8601 DateTime string
   *
   * @apiSuccessExample Success-Response
   * {
   * 	"conversationId": "64a7ed6f1c36075c69e3dd48",
   * 	"messageBatches": [
   * 		{
   * 			"_id": "2023-07-07",
   * 			"allMessages": [
   * 				{
   * 					"message": "hello",
   * 					"senderId": "64a7ea71cc7efe460fc69823",
   * 					"timestamp": "2023-07-07T10:53:48.301Z"
   * 				},
   * 				{
   * 					"message": "hi back",
   * 					"senderId": "64a7e734cc7efe460fc69805",
   * 					"timestamp": "2023-07-07T10:54:41.830Z"
   * 				}
   * 			]
   * 		}
   * 	]
   * }
   */
  .get(getMessagesByConversationId);

router
  .route("/:id")
  /**
   * @api {put} /chats/:id Update Message by id
   * @apiName UpdateMessageById
   * @apiGroup Chats
   *
   * @apiParam {String} id Message id
   *
   * @apiBody {String}  [message]    Optional text message
   * @apiBody {Boolean} [seen]       Optional. Has the message been viewed by the recipient?
   *
   * @apiSuccessExample Success-Response
   * {
   *  "_id":"64c0bf6461ab5f2df4de2e43",
   *  "directMessage": true,
   *  "conversationId": "64b587202d0ddf2a54d0d1ea",
   *  "senderId": "64b5886c2d0ddf2a54d0d1fc",
   *  "message": "Good afternoon",
   *  "seen": true,
   *  "timestamp": "2023-07-26T06:38:15.244+00:00"
   * }
   */
  .put(updateMessageById);

  router
    .route("/:conversationId/seen")
    /**
     * @api {put} /chats/:conversationId/seen    Update Messages Seen Status for the given sender By conversationId
     * @apiName UpdateMessageSeenStatusByConversationId
     * @apiGroup Chat
     *
     * @apiParam {String} conversationId       Conversation id
     * 
     * @apiBody {String} senderId              Sender id
     *
     * @apiSuccess {Number}  n                 Number of documents matched
     * @apiSuccess {Number}  nModified         Number of documents modified
     * @apiSuccess {Boolean} ok                Boolean indicating everything went smoothly.
     *
     * @apiSuccessExample Success-Response
     * {
     *   "n": 5,
     *   "nModified": 5,
     *   "ok": true
     * }
     */
    .put(updateMessagesByConversationId);

router
  .route("/conversations")
  /**
   * @api {patch} /chats/conversations/ Create Conversation
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
  .route("/conversations")
  /**
   * @api {delete} /chats/conversations/ Delete Conversation
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
  .route("/conversations/:userId")
  /**
   * @api {post} /chats/conversations/:userId Get Conversations by User Id
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
  .get(paginatedConversations(Conversation), (_, res, __) => {
    return res.json(
      // @ts-ignore
      res.paginatedResults
    );
  });


module.exports = router;
