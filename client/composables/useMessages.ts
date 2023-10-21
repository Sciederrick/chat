import { MessageBatches } from '~/types/index';


export const useMessages = () => {
    const useLoadMessages = async function (conversationId: string): Promise<MessageBatches[] | null | false> {
        const { data } = await useFetch(`/api/messages/${conversationId}`);

        if (!data.value) {
            console.log("handle error")
            return false;
        }

        if (data.value?.messageBatches?.length > 0) {
            return data.value.messageBatches as MessageBatches;
        } else {
            console.log("nothing to display - empty messages")
            return null;
        }
    };

    return {
        useLoadMessages
    };
}