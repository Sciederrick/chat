export default defineEventHandler(async (event) => {
    try {
        const userId = event.context.params?.userId;
        console.log("🚀 ~ file: [userId].ts:4 ~ defineEventHandler ~ userId:", userId)
        if (!userId) throw "InputError"
        const { serverURL } = useRuntimeConfig().public;
        console.log("🚀 ~ file: [userId].ts:7 ~ defineEventHandler ~ serverURL:", serverURL)
        const uri = `${serverURL}/conversations/${userId}`;
        const resp = await $fetch(uri);
        console.log("🚀 ~ file: [userId].ts:10 ~ defineEventHandler ~ resp:", resp)
        return resp;
    } catch (err) {
        console.error(err);
        return false;
    }
});