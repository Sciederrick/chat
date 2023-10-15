const validate = {};

validate.validateGetConversationsByParticipant = (params) => {
  let { userId } = params;

  return typeof userId == "string" && userId.trim().length > 0
    ? { userId }
    : false;
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
