const validate = {};

validate.validateCreateMessage = (body) => {
  const { conversationId, senderId, message, timestamp } = body;

  if (
    body?.directMessage != undefined &&
    typeof body.directMessage != "boolean"
  ) {
    return false;
  }

  return (
    typeof conversationId == "string" &&
    typeof senderId == "string" &&
    typeof message == "string" &&
    typeof timestamp == "string" &&
    conversationId.trim() != "" &&
    senderId.trim() != "" &&
    message.trim() != "" &&
    timestamp.trim() != ""
  );
};

validate.validateUpdateMessageById = (params, body) => {
  let { message, seen } = body;
  let { id } = params;

  if (message == undefined && seen == undefined) return false;

  id = typeof id == "string" && id.trim() != "" ? id : false;
  message =
    (typeof message == "string" && message.trim() != "") || message == undefined
      ? message
      : false;
  seen = typeof seen == "boolean" || seen == undefined ? seen : undefined;

  if (message != undefined) return { params: { id }, body: { message } };
  else if (seen != undefined) return { params: { id }, body: { seen } };
};

validate.validateUpdateMessagesSeenStatusByConversationId = (params, body) => {
  return typeof params.conversationId == "string" && typeof body.senderId == "string" &&
    params.conversationId.trim() != "" && body.senderId.trim() != ""
    ? { params: { conversationId: params.conversationId.trim() }, body: { senderId: body.senderId.trim() } } 
    : false;
};

validate.validateDeleteMessage = (body) => {
  const { timestamp } = body;
  return typeof timestamp == "string" && timestamp.trim() != "";
};

validate.validateGetMessagesByConversationId = (params) => {
  const { conversationId } = params;
  return typeof conversationId == "string" && conversationId.trim() != "";
};

validate.validateCreateConversation = (body) => {
  let { participants } = body;
  if (participants?.length < 2) return false;

  participants.forEach((participant, index) => {
    if (typeof participant != "string" && participant.trim() == "")
      return false;
    participants[index] = participant.trim();
  });
  if (body?.private != undefined && typeof body.private != "boolean")
    return false;
  return { participants, private: body?.private ?? true };
};

validate.validateDeleteConversation = (body) => {
  const { conversationId } = body;
  return typeof conversationId == "string" && conversationId.trim() != "";
};

validate.validateGetConversationIdsByUserId = (params, query) => {
  let { userId } = params;
  let { page = 1, limit = 50, private } = query; // all queries option :)
  page = isNaN(parseInt(page)) ? false : parseInt(page);
  limit = isNaN(parseInt(page)) ? false : parseInt(limit);
  private =
    typeof private != "string" && private != undefined
      ? "invalid"
      : private == undefined
      ? undefined
      : private == "true"
      ? true
      : false;
  userId =
    typeof userId == "string" && userId.trim() != "" ? userId.trim() : null;

  return page && limit && private != "invalid" && userId
    ? { userId, private, page, limit }
    : null;
};

module.exports = validate;
