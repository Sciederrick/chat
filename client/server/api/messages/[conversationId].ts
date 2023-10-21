export default defineEventHandler(async (event) => {
    try {
        const conversationId = event.context.params?.conversationId;
        if (!conversationId) throw "InputError"
        const { serverURL } = useRuntimeConfig().public;
        console.log("🚀 ~ file: [userId].ts:7 ~ defineEventHandler ~ serverURL:", serverURL)
        const uri = `${serverURL}/messages/${conversationId}`;
        const resp = await $fetch(uri);
        console.log("🚀 ~ file: [userId].ts:10 ~ defineEventHandler ~ resp:", resp)
        return resp;
    } catch (err) {
        console.error(err);
        return false;
    }
});