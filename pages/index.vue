<script setup lang="ts">
const me = ref({
    id: "a",
    avatar: null,
    name: "Derrick Mbarani",
    color: getHexRandomColor(),
    role: "normal",
});
const users = ref([
    {
        id: "b",
        avatar: null,
        name: "Ernest Hanson",
        color: getHexRandomColor(),
        conversationId: "1",
        role: "normal",
    },
    {
        id: "c",
        avatar: null,
        name: "Brian Abwenje",
        color: getHexRandomColor(),
        conversationId: "2",
        role: "normal",
    },
    {
        id: "d",
        avatar: null,
        name: "Josephine Nabwire",
        color: getHexRandomColor(),
        conversationId: "3",
        role: "normal",
    },
    {
        id: "e",
        avatar: null,
        name: "Leila Adams",
        color: getHexRandomColor(),
        conversationId: "4",
        role: "normal",
    },
]);
const groups = ref([
    {
        id: "f",
        avatar: null,
        name: "TensorFlow",
        color: getHexRandomColor(),
        conversationId: "5",
        role: "group",
    },
    {
        id: "g",
        avatar: null,
        name: "Data Cleaning",
        color: getHexRandomColor(),
        conversationId: "6",
        role: "group",
    },
]);

function getInitials(fullName: string): string {
    let initials = "";
    fullName
        .split(" ")
        .forEach((name) => (initials += name.charAt(0).toUpperCase()));
    return initials;
}

function getHexRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const activeConversationId = ref<string | null>(null);

function viewConversation(id: string) {
    activeConversationId.value = id;
}

const isRecipientProfileOpen = ref(false);

const dateISO = new Date(Date.now()).toISOString();
const messages = ref([
    {
        date: dateISO.substring(0, 10),
        content: [
            {
                conversationId: "4",
                msg: "Hello",
                senderId: "a",
                time: dateISO.substring(11, 16),
            },
            {
                conversationId: "4",
                msg: "Hello",
                senderId: "e",
                time: dateISO.substring(11, 16),
            },
            {
                conversationId: "4",
                msg: "How is the programme going?",
                senderId: "a",
                time: dateISO.substring(11, 16),
            },
            {
                conversationId: "4",
                msg: "Its great!",
                senderId: "e",
                time: dateISO.substring(11, 16),
            },
        ],
    },
]);
</script>
<template>
    <header class="flex justify-between items-center p-4">
        <img src="~/assets/logo-no-background.svg" height="60" width="160" alt="company logo" />
        <div>
            <img src="~/assets/avatar.svg" height="35" width="35" alt="user avatar" />
            <p class="text-xs text-center">{{ getInitials(me.name) }}</p>
        </div>
    </header>
    <main class="md:flex">
        <aside :class="{ hidden: true }" class="px-4 w-full md:block md:w-1/3 lg:w-[250px]">
            <button class="btn btn-black fixed bottom-8 right-8 md:static md:my-4" type="button">
                <Icon name="streamline:interface-edit-pencil-change-edit-modify-pencil-write-writing" />
                New Message
            </button>
            <ul class="divide-y">
                <li v-for="group in groups" class="flex items-center gap-x-4 py-1.5 font-bold"
                    @click="viewConversation(group.conversationId)">
                    <img class="h-10 w-10" :src="group.avatar" alt="" v-if="group.avatar" />
                    <div :style="`border:1.5px solid ${group.color}`"
                        class="h-10 w-10 rounded-full flex items-center justify-center" v-else>
                        {{ getInitials(group.name) }}
                    </div>
                    <div>{{ group.name }}</div>
                </li>
            </ul>
            <div class="flex items-center gap-4 py-4">
                <p class="text-xs">Direct&nbsp;Messages</p>
                <div class="w-full h-[0.5px] bg-gray-200">&nbsp;</div>
            </div>
            <ul class="divide-y">
                <li v-for="user in users" class="flex items-center gap-x-4 py-1.5 font-bold"
                    @click="viewConversation(user.conversationId)">
                    <img class="h-10 w-10" :src="user.avatar" alt="" v-if="user.avatar" />
                    <div :style="`border:1.5px solid ${user.color}`"
                        class="h-10 w-10 rounded-full flex items-center justify-center bg-gray-200" v-else>
                        {{ getInitials(user.name) }}
                    </div>
                    <div>{{ user.name }}</div>
                </li>
            </ul>
        </aside>
        <section class="px-4 w-full md:w-2/3" v-if="!activeConversationId">
            <h2 class="heading-2">Chat with {{ "Leila Adams" }}</h2>
            <div class="p-2 border-2 border-gray-200 rounded-md">
                <ul class="w-full flex flex-col">
                    <li v-for="msg in messages[0].content" :class="{ 'justify-end': msg.senderId == 'a' }"
                        class="relative flex items-end gap-x-4 py-1 my-4 font-semibold">
                        <img :class="{ 'order-last': msg.senderId == 'a' }" class="h-10 w-10" src="" alt="" v-if="false" />
                        <div :style="`border:1.5px solid #FF0000`" :class="{ 'order-last': msg.senderId == 'a' }"
                            class="h-10 w-10 rounded-full flex items-center justify-center" v-else>
                            {{ getInitials("Leila Adams") }}
                        </div>
                        <div>{{ msg.msg }}</div>
                        <div class="absolute -bottom-4 left-0 text-xs font-normal">
                            <span>{{ msg.senderId == "a" ? "Me" : "Leila Adams" }}</span>&nbsp;
                            <span> {{ msg.time }} </span>
                        </div>
                    </li>
                </ul>
                <div class="flex p-2 mt-8 rounded-md bg-gray-100">
                    <input class="w-full rounded-md bg-gray-100 focus:outline-none" type="text" name="send-message" id="send-message" />
                    <button class="btn btn-white--circle mx-2" type="button">
                        <Icon name="material-symbols:add" />
                    </button>
                    <button class="btn btn-red" type="button">Send</button>
                </div>
            </div>
        </section>
        <section :class="{ hidden: true }" class="w-full md:border-l-2 md:border-t-2 md:rounded-md md:rounded-b-none md:pt-2 md:border-gray-200 lg:block lg:w-1/6">
            <div class="p-2 gap-y-2 flex flex-col">
                <img class="h-32 w-32 mx-auto" src="" alt="" v-if="false" />
                <div :style="`border:1.5px solid #FF0000`"
                    class="h-32 w-32 mx-auto rounded-full flex items-center justify-center bg-gray-200" v-else>
                    {{ getInitials("Leila Adams") }}
                </div>
                <h2 class="heading-2 text-center">Leila Adams</h2>
                <p class="text-center text-xs">I live for excellent User Experiences in digital products. Biker and Hiker
                    when away from computers.</p>
            </div>
            <div class="p-2 gap-y-2 flex flex-col">
                <h2 class="heading-2 text-center text-gray-400">Recent Documents</h2>
                <ul class="p-2">
                    <li class="bg-gray-100 px-2 py-1 my-1"
                        v-for="i in 4">
                        <div>
                            document {{ i }}
                        </div>
                        <div class="text-gray-400 text-xs">Sent&nbsp;{{ "13:08" }}</div>
                    </li>
                </ul>
            </div>
        </section>
    </main>
</template>
