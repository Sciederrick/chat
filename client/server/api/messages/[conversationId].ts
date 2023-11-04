export default defineEventHandler(async (event) => {
    try {
        const conversationId = event.context.params?.conversationId;
        if (!conversationId) throw "InputError"
        const { serverUrl } = useRuntimeConfig().public;
        const uri = `${serverUrl}/messages/${conversationId}`;
        const resp = await $fetch(uri);
        return resp;
    } catch (err) {
        console.error(err);
        return false;
    }
});