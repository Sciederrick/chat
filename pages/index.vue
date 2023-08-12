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

function getHexRandomColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function lightenHexColor(hex: string, percent: number): string {  // Increase brightness by __%
    // Remove the leading '#' if present
    hex = hex.replace('#', '');

    // Convert the hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate the new RGB values
    const newR = Math.min(255, r + (255 - r) * (percent / 100));
    const newG = Math.min(255, g + (255 - g) * (percent / 100));
    const newB = Math.min(255, b + (255 - b) * (percent / 100));

    // Convert the new RGB values back to hex
    const newHex = `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;

    return newHex;
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
    <header class="flex justify-between items-center py-4 px-2">
        <img src="~/assets/logo-no-background.svg" height="60" width="160" alt="company logo" />
        <div class="md:flex md:gap-4 md:items-center">
            <img src="~/assets/avatar.svg" height="35" width="35" alt="user avatar" />
            <p class="text-xs text-center md:text-xl md:order-first md:font-semibold">
                {{ getInitials(me.name) }}
            </p>
        </div>
    </header>
    <main class="md:flex">
        <aside :class="{ hidden: true }" class="px-2 w-full md:block md:w-1/3 lg:w-[250px]">
            <button class="btn btn-black fixed bottom-8 right-8 md:static md:my-4" type="button">
                <Icon name="streamline:interface-edit-pencil-change-edit-modify-pencil-write-writing" />
                New Message
            </button>
            <!--#region group conversations-->
            <ul class="divide-y">
                <li v-for="group in groups" class="flex items-center gap-x-4 py-1.5 font-bold"
                    @click="viewConversation(group.conversationId)">
                    <img class="h-8 w-8" src="~/assets/hash.svg" alt="group avatar" />
                    <div>{{ group.name }}</div>
                </li>
            </ul>
            <!--#endregion-->
            <div class="flex items-center gap-4 py-4">
                <p class="text-xs">Direct&nbsp;Messages</p>
                <div class="w-full h-[0.5px] bg-gray-200">&nbsp;</div>
            </div>
            <!--#region private conversations-->
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
            <!--#endregion private conversations-->
        </aside>
        <section class="px-2 w-full md:w-2/3" v-if="!activeConversationId">
            <header class="flex justify-between items-center py-1">
                <div class="flex items-center gap-2">
                    <button class="btn pl-0 shadow-none"
                        type="button">
                        <Icon name="ep:back" />
                    </button>
                    <img class="h-8 w-8" src="" alt="" v-if="false" />
                    <div :style="`border:1.5px solid ${'#ED2647'}`"
                        class="h-8 w-8 rounded-full flex items-center justify-center bg-gray-200" v-else>
                        {{ getInitials("Leila Adams") }}
                    </div>
                    <h2 class="heading-2">{{ "Leila Adams" }}</h2>
                </div>
                <button class="btn shadow-none text-gray-700 lg:hidden">
                    Docs
                    <Icon name="entypo:documents" />
                </button>
            </header>
            <!--#region texts box-->
            <div class="p-2 border-2 border-gray-200 rounded-md h-[75vh] flex flex-col">
                <ul class="w-full h-full flex flex-col overflow-y-auto">
                    <li v-for="msg in  messages[0].content " :class="{ 'justify-end': msg.senderId == 'a' }"
                        class="relative flex items-end gap-x-4 py-1 my-4 font-semibold">
                        <img :class="{ 'order-last': msg.senderId == 'a' }" class="h-8 w-8" src="" alt="" v-if="false" />
                        <div :style="[msg.senderId == 'e' ? `border:1.5px solid #ED2647` : `border: 1.5px solid #A0D6B4`]"
                            :class="{ 'order-last': msg.senderId == 'a' }"
                            class="h-8 w-8 rounded-full flex items-center justify-center text-sm" v-else>
                            {{ getInitials("Leila Adams") }}
                        </div>
                        <div :style="[msg.senderId == 'e' ? `background-color:${lightenHexColor('#ED2647', 75)}` : `background-color:${lightenHexColor('#A0D6B4', 75)}`]"
                            :class="[msg.senderId == 'e' ? 'rounded-bl-none' : 'rounded-br-none']" class="p-1.5 rounded-xl">
                            {{ msg.msg }}</div>
                        <div :class="[msg.senderId == 'a' ? 'right-12' : 'left-12']"
                            class="absolute -bottom-4 text-xs font-normal">
                            <span class="text-gray-700 font-semibold">{{ msg.senderId == "a" ? "Me" : "Leila Adams"
                            }}</span>&nbsp;
                            <span class="text-gray-400"> {{ msg.time }} </span>
                        </div>
                    </li>
                </ul>
                <!--#region typing indicator-->
                <div class="flex items-center gap-4 mt-6 mb-2">
                    <img class="h-8 w-8" src="" alt="" v-if="false" />
                    <div :style="`border:1.5px solid #FF0000`"
                        class="h-8 w-8 rounded-full flex items-center justify-center text-sm" v-else>
                        {{ getInitials("Leila Adams") }}
                    </div>
                    <AppTypingEffect />
                </div>
                <!--#endregion-->
                <!--#region chat input-->
                <div class="flex p-2 mt-1 rounded-md bg-gray-100">
                    <input class="w-full rounded-md bg-gray-100 pr-2 focus:outline-none" type="text" name="send-message"
                        id="send-message" />
                    <button class="btn btn-white" type="button">
                        <Icon name="material-symbols:add" />
                    </button>&nbsp;&nbsp;
                    <button class="btn btn-red" type="button">Send</button>
                </div>
                <!--#endregion-->
            </div>
            <!--#endregion-->
        </section>
        <section :class="{ hidden: true }" class="w-full md:pt-2 md:border-gray-200 lg:block lg:w-1/6">
            <div class="p-2 gap-y-2 flex flex-col">
                <h2 class="heading-2 text-center text-gray-400">Recent Documents</h2>
                <ul class="p-2">
                    <li class="bg-gray-100 px-2 py-1 my-1" v-for=" i  in  4">
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
