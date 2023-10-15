import { PrivateConversation, ConversationApiResponse, ParticipantProfile, NestedRecipient } from '~/types/index';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '~/store/profile';
const { useHexRandomColor } = useUtils();

export const useConversations = () => {
    const useLoadMyConversations = async function (): Promise<PrivateConversation[] | null | false> {
        const { data } = await useFetch("/api/conversations/6505ebff00f0b6e28b0225fe");

        if (!data.value) {
            console.log("handle error")
            return false;
        }

        if (data.value?.length > 0) {
            const profileStore = useProfileStore();
            const { me } = storeToRefs(profileStore);
            return _buildConversationObject(data.value as ConversationApiResponse[], me.value!.id)
        } else {
            console.log("display start new chat message")
            return null;
        }
    };

    const _buildConversationObject = function (apiResponse: ConversationApiResponse[], myId: string): PrivateConversation[] {
        return apiResponse.map(item => {
            return <PrivateConversation>{
                id: item._id,
                recipient: _buildConversationObjectNestedRecipient(item.participantProfiles, myId),
                lastMessage: {
                    text: item.lastMessage?.text,
                    createdAt: item.lastMessage?.createdAt,
                    senderId: item.lastMessage?.senderId,
                    seen: item.lastMessage?.seen,
                }
            };
        });
    }

    const _buildConversationObjectNestedRecipient = function (participants: ParticipantProfile[], myId: string): NestedRecipient {
        const recipient = <NestedRecipient>{};
        const filteredParticipant = participants.filter(participant => participant._id != myId)[0];
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