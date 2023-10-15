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

module.exports = validate;
