import { Conversations, GroupConversation, PrivateConversation, ConversationApiResponse, ParticipantProfile, NestedRecipient } from '~/types/index';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '~/store/profile';
const { useHexRandomColor } = useUtils();

export const useConversations = () => {
    const useLoadMyConversations = async function (): Promise<Conversations | null | false> {
        const { data } = await useFetch("/api/conversations/6505ebff00f0b6e28b0225fe")

        if (!data.value) {
            console.log("handle error")
            return false;
        }

        if (data.value?.length > 0) {
            const profileStore = useProfileStore();
            const { me } = storeToRefs(profileStore);

            let privateConversations = data.value?.filter((conversation: { private: Boolean; }) => conversation.private == true);
            let groupConversations = data.value?.filter((conversation: { private: Boolean; }) => conversation.private == false);

            privateConversations = _buildConversationArrOfObjects(privateConversations as ConversationApiResponse[], me.value!.id, true);
            groupConversations = _buildConversationArrOfObjects(groupConversations as ConversationApiResponse[], me.value!.id, false);

            return { groupConversations: groupConversations, privateConversations: privateConversations } as Conversations;
        } else {
            console.log("display start new chat message")
            return null;
        }
    };

    const _buildConversationArrOfObjects = function (apiResponse: ConversationApiResponse[], myId: string, isPrivate: boolean): (PrivateConversation | GroupConversation)[] {
        return apiResponse.map(item => {
            return <PrivateConversation | GroupConversation>{
                id: item._id,
                recipient: _buildConversationObjectNestedRecipient(item.participantProfiles, myId, isPrivate),
                lastMessage: {
                    text: item.lastMessage?.text,
                    createdAt: item.lastMessage?.createdAt,
                    senderId: item.lastMessage?.senderId,
                    seen: item.lastMessage?.seen,
                }
            };
        });
    }

    const _buildConversationObjectNestedRecipient = function (participants: ParticipantProfile[], myId: string, isPrivate: boolean): NestedRecipient | NestedRecipient[] {
        let recipient = <NestedRecipient>{};
        const recipients = <NestedRecipient[]>[];

        if (isPrivate) {
            const filteredParticipant = participants.filter(participant => participant._id != myId)[0];
            recipient = _buildRecipientObject(recipient, filteredParticipant);
        } else {
            const filteredParticipants = participants.filter(participant => participant.role == "group");
            filteredParticipants.forEach(filteredParticipant => {
                const recipientObj = _buildRecipientObject(recipient, filteredParticipant);
                recipients.push(recipientObj);
            });
        }

        return isPrivate ? recipient : recipients;
    }

    function _buildRecipientObject(recipient: NestedRecipient, filteredParticipant: ParticipantProfile): NestedRecipient {
        recipient["id"] = filteredParticipant._id;
        recipient["avatar"] = filteredParticipant?.avatar ?? "";
        recipient["name"] = filteredParticipant.bio.fullName;
        recipient["title"] = filteredParticipant.bio.title;
        recipient["about"] = filteredParticipant.bio.about;
        recipient["links"] = filteredParticipant.bio.links;
        recipient["color"] = useHexRandomColor();
        recipient["gender"] = filteredParticipant.isMale ? "M" : "F";
        return recipient;
    }

    return {
        useLoadMyConversations
    };
}