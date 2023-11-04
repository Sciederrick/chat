export default defineEventHandler(async (event) => {
    try {
        const userId = event.context.params?.userId;
        if (!userId) throw "InputError"
        const { serverUrl} = useRuntimeConfig().public;
        const uri = `${serverUrl}/conversations/${userId}`;
        const resp = await $fetch(uri);
        return resp;
    } catch (err) {
        console.error(err);
        return false;
    }
});