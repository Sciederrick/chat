<script setup lang="ts">
const me = ref({
    avatar: null,
    name: "Derrick Mbarani"
});
const users = ref([
    {
        avatar: null,
        name: "Ernest Hanson"
    },
    {
        avatar: null,
        name: "Brian Abwenje"
    }, {
        avatar: null,
        name: "Josephine Nabwire"
    }, {
        avatar: null,
        name: "Leila Adams"
    },
]);
const groups = ref([
    {
        avatar: null,
        name: "TensorFlow"
    },
    {
        avatar: null,
        name: "Data Cleaning"
    }
]);

function getInitials(fullName: string): string {
    let initials = "";
    fullName.split(" ").forEach(name => initials += name.charAt(0).toUpperCase());
    return initials
}
</script>
<template>
    <header class="flex justify-between items-center p-4">
        <img src="~/assets/logo-no-background.svg" height="60" width="160" alt="company logo">
        <div>
            <img src="~/assets/avatar.svg" height="35" width="35" alt="user avatar">
            <p class="text-xs text-center">{{ getInitials(me.name) }}</p>
        </div>
    </header>
    <main>
        <aside class="px-4">
            <ul class="divide-y">
                <li v-for="group in groups" class="flex items-center gap-x-4 py-1 font-bold">
                    <img class="h-10 w-10" :src="group.avatar" alt="" v-if="group.avatar">
                    <div class="h-10 w-10 rounded-full flex items-center justify-center bg-gray-200" v-else>{{
                        getInitials(group.name) }}</div>
                    <div>{{ group.name }}</div>
                </li>
            </ul>
            <div class="flex items-center gap-4 py-4">
                <p class="text-xs">Direct&nbsp;Messages</p>
                <div class="w-full h-[0.5px] bg-gray-200">&nbsp;</div>
            </div>
            <ul class="divide-y">
                <li v-for="user in users" class="flex items-center gap-x-4 py-1 font-bold">
                    <img class="h-10 w-10" :src="user.avatar" alt="" v-if="user.avatar">
                    <div class="h-10 w-10 rounded-full flex items-center justify-center bg-gray-200" v-else>{{
                        getInitials(user.name) }}</div>
                    <div>{{ user.name }}</div>
                </li>
            </ul>

        </aside>
    </main>
</template>