<script setup lang="ts">
import { Socket } from "socket.io-client";
import { GroupConversation, PrivateConversation, MessageBatches, Recipient, MessageObject, Role } from '~/types/index';
import { useProfileStore } from '~/store/profile';
import { storeToRefs } from 'pinia';

const { useInitials, useLightenHexColor } = useUtils();
const profileStore = useProfileStore();

const { me } = storeToRefs(profileStore);
const { assignDefaultUser, loadMyProfileFromLocalStorage } = profileStore;

const privateConversations = ref<PrivateConversation[] | null>(null);
const groupConversations = ref<GroupConversation[] | null>(null);

const activeConversationId = ref<string | null>(null);
const activeRecipients = ref<Recipient[] | null>(null);

const isActiveConversation = computed(() => {
    return activeConversationId.value != null;
})


function viewConversation(id: string, recipients: Recipient[]) {
    activeConversationId.value = id;
    activeRecipients.value = recipients;
    loadMessages(id);
}

const isShowLeftSidebar = ref(true);

function toggleLeftSidebar() {
    if (isSmallScreen.value) {
        activeConversationId.value = null;
    } else {
        isShowLeftSidebar.value = !isShowLeftSidebar.value;
    }
}

const messages = ref<MessageBatches[] | null>(null);
async function loadMessages(conversationId: string) {
    const { useLoadMessages } = useMessages();
    const response = await useLoadMessages(conversationId);

    messages.value = response && response.length > 0 ? response : null;
}

const templateImages = ref(useUtils().useAssetImages());

const userAvatar = computed<string>(() => {
    const key = me.value!.isMale ? 'male-avatar' : 'female-avatar';
    return templateImages.value?.[key];
});

function loadMyProfile() {
    loadMyProfileFromLocalStorage();
    if (!me.value) assignDefaultUser();
}

async function loadConversations() {
    const { useLoadMyConversations } = useConversations();
    const conversationsResp = await useLoadMyConversations(me.value!.id);
    if (conversationsResp) {
        if (conversationsResp.privateConversations.length > 0)
            privateConversations.value = conversationsResp.privateConversations;

        if (conversationsResp.groupConversations.length > 0)
            groupConversations.value = conversationsResp.groupConversations;
    }
}

function getRecipientName(senderId: string): string {
    const senderProfile = activeRecipients.value!.find(recipient => recipient.id == senderId);
    return senderProfile!.name;
}

const myMessage = ref<string | null>(null);
const { socket } = useNuxtApp();

function sendMessage() {
    if (myMessage.value) {
        const messageObject = {
            conversationId: activeConversationId.value!,
            senderId: me.value!.id,
            receiverId: activeRecipients.value![0].id,
            role: activeRecipients.value!.length > 2 ? Role.Group : Role.Client,
            message: myMessage.value,
            timestamp: new Date(),
            directMessage: activeRecipients.value!.length > 2 ? false : true
        };
        (socket as Socket).emit('message', messageObject);
        addMessageToUi(messageObject);
    }

}

const messagesContainer = ref<HTMLElement|null>(null);
function addMessageToUi(messageObject: MessageObject) {
    const msgGroupId = messageObject.timestamp.toISOString().slice(0, 10);
    const uiMsgObject = {
        message: messageObject.message,
        senderId: messageObject.senderId,
        timestamp: messageObject.timestamp.toISOString()
    }
    if (messages.value == null || messages.value?.length == 0) {
        messages.value = [];
        messages.value.push({
            _id: msgGroupId,
            allMessages: []
        });
        messages.value[0].allMessages.push(uiMsgObject);
    } else {
        let isFoundMatchingMsgId = false;
        messages.value!.forEach(msg => {
            if (msg._id == msgGroupId) {
                msg.allMessages.push(uiMsgObject);
                isFoundMatchingMsgId = true;
            }
        });
        if (!isFoundMatchingMsgId) {
            messages.value.push({
                _id: msgGroupId,
                allMessages: []
            });
            messages.value[messages.value.length -1].allMessages.push(uiMsgObject);
        }
    }
    scrollDown();

}

function scrollDown() {
    (messagesContainer.value as HTMLElement).lastElementChild!.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "end",
    });
}

function connectToSocket() {
    const { socket } = useNuxtApp();
    (socket as Socket).emit('user-connect', me.value!.id);
}
function disconnectFromSocket() {
    const { socket } = useNuxtApp();
    (socket as Socket).emit('user-disconnect');
}

onBeforeMount(async () => {
    loadMyProfile();
    if (me.value) await loadConversations();
});

const innerWidth = ref<number>(window.innerWidth);
const isSmallScreen = computed<boolean>(() => {
    return innerWidth.value < 768;
});
function handleResize() {
    innerWidth.value = window.innerWidth;
}

onMounted(() => {
    window.addEventListener('resize', handleResize);
    connectToSocket();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    disconnectFromSocket();
});
</script>
<template>
    <header class="flex justify-between items-center py-4 px-2 2xl:container 2xl:mx-auto">
        <img src="~/assets/logo-no-background.svg" height="60" width="160" alt="company logo" />
        <div class="md:flex md:gap-4 md:items-center">
            <img :src="userAvatar" height="35" width="35" alt="user avatar" :title="me!.bio.fullName" />
            <p class="text-xs text-center md:text-xl md:order-first md:font-semibold">
                {{ useInitials(me!.bio.fullName) }}
            </p>
        </div>
    </header>
    <main class="px-2 md:flex 2xl:container 2xl:mx-auto">
        <!--#region left sidebar-->
        <aside :class="{ hidden: isActiveConversation }" class="pr-2 w-full md:block md:w-1/3 lg:w-[350px]"
            v-show="isShowLeftSidebar">
            <button class="btn btn-black fixed bottom-8 right-2 md:static md:my-4" type="button">
                <Icon name="streamline:interface-edit-pencil-change-edit-modify-pencil-write-writing" />
                New Message
            </button>
            <!--#region group conversations-->
            <ul class="divide-y" v-show="groupConversations">
                <li v-for="groupConversation in groupConversations"
                    class="flex items-center gap-x-4 py-1.5 font-bold cursor-pointer hover:bg-gray-100"
                    @click="viewConversation(groupConversation.id, groupConversation.recipient)">
                    <img class="h-8 w-8" src="~/assets/hash.svg" alt="group avatar" />
                    <p class="truncate">{{ groupConversation.recipient[0].name }}</p>
                </li>
            </ul>
            <!--#endregion-->
            <div class="flex items-center gap-4 py-4">
                <p class="text-xs">Direct&nbsp;Messages</p>
                <div class="w-full h-[0.5px] bg-gray-200">&nbsp;</div>
            </div>
            <!--#region private conversations-->
            <ul class="divide-y" v-show="privateConversations">
                <li v-for="privateConversation in privateConversations"
                    class="flex items-center gap-x-4 py-1.5 font-bold cursor-pointer hover:bg-gray-100"
                    @click="viewConversation(privateConversation.id, [privateConversation.recipient])">
                    <img class="h-10 w-10" :src="privateConversation.recipient?.avatar" alt=""
                        v-if="privateConversation.recipient?.avatar" />
                    <p :style="`border:1.5px solid ${privateConversation.recipient.color}`"
                        class="h-10 w-10 rounded-full flex items-center justify-center bg-gray-200" v-else>
                        {{ useInitials(privateConversation.recipient.name) }}
                    </p>
                    <p class="truncate">{{ privateConversation.recipient.name }}</p>
                </li>
            </ul>
            <!--#endregion private conversations-->
        </aside>
        <!--#endregion-->

        <!--#region where messages live-->
        <section class="relative w-full" v-if="isActiveConversation">
            <header class="flex justify-between items-center py-1">
                <div class="flex items-center gap-2">
                    <button class="btn pl-0 shadow-none" type="button" @click="toggleLeftSidebar">
                        <Icon name="ep:back" />
                    </button>
                    <img class="h-8 w-8" src="" alt="" v-if="false" />
                    <div :style="`border:1.5px solid ${'#ED2647'}`"
                        class="h-8 w-8 rounded-full flex items-center justify-center bg-gray-200" v-else>
                        {{ useInitials(activeRecipients![0].name) }}
                    </div>
                    <h2 class="heading-2">{{ activeRecipients![0].name }}</h2>
                </div>
            </header>
            <!--#region texts box-->
            <div class="p-2 border-2 border-gray-200 rounded-md h-[75vh] flex flex-col overflow-y-hidden">
                <div v-if="messages && messages?.length > 0" ref="messagesContainer">
                    <div v-for="msg in messages" :key="msg._id">
                        <div class="w-full flex justify-center">
                            <span class="px-2 py-1 rounded-sm text-xs bg-gray-100">{{
                                useUtils().useHumanReadableDate(msg._id) }}</span>
                        </div>
                        <ul class="w-full h-full flex flex-col overflow-y-auto"
                            v-if="msg.allMessages && msg.allMessages.length > 0">
                            <li v-for="msg in msg.allMessages" :key="msg.timestamp"
                                :class="{ 'justify-end': msg.senderId == me!.id }"
                                class="relative flex items-end gap-x-4 py-1 my-4 font-semibold">
                                <img :class="{ 'order-last': msg.senderId == me!.id }" class="h-8 w-8" src="" alt=""
                                    v-if="false" />
                                <div :style="[msg.senderId == me!.id ? `border: 1.5px solid #A0D6B4` : `border:1.5px solid #ED2647`]"
                                    :class="{ 'order-last': msg.senderId == me!.id }"
                                    class="h-8 w-8 rounded-full flex items-center justify-center text-sm" v-else>
                                    {{ useInitials(msg.senderId == me!.id ? me!.bio.fullName :
                                        getRecipientName(msg.senderId)) }}
                                </div>
                                <div :style="[msg.senderId == me!.id ? `background-color:${useLightenHexColor('#A0D6B4', 75)}` : `background-color:${useLightenHexColor('#ED2647', 75)}`]"
                                    :class="[msg.senderId != me!.id ? 'rounded-bl-none' : 'rounded-br-none']"
                                    class="p-1.5 rounded-xl">
                                    {{ msg.message }}</div>
                                <div :class="[msg.senderId == me!.id ? 'right-12' : 'left-12']"
                                    class="absolute -bottom-4 text-xs font-normal">
                                    <span class="text-gray-700 font-medium">{{ msg.senderId == me!.id ? "Me" :
                                        getRecipientName(msg.senderId) }}</span>&nbsp;
                                    <span class="text-gray-400"> {{ useUtils().useHumanReadableTime(msg.timestamp) }}
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="w-full h-4 pb-48">&nbsp;</div> <!-- allows the last message to be visible through scrollIntoView JS method -->
                </div>
                <div class="w-full h-full">&nbsp;</div>
                <div class="absolute bottom-0 inset-x-0 mb-2 mx-2">
                    <!--#region typing indicator-->
                    <div class="flex items-center gap-4 ml-2">
                        <img class="h-8 w-8" src="" alt="" v-if="false" />
                        <div :style="`border:1.5px solid #FF0000`"
                            class="h-8 w-8 rounded-full flex items-center justify-center text-sm" v-else>
                            {{ useInitials(activeRecipients![0].name) }}
                        </div>
                        <AppTypingEffect />
                    </div>
                    <!--#endregion-->
                    <!--#region chat input-->
                    <div class="flex p-2 mt-1 rounded-md bg-gray-100">
                        <input class="w-full rounded-md bg-gray-100 pr-2 focus:outline-none" type="text" name="send-message"
                            id="send-message" v-model="myMessage" />
                        <button class="btn btn-red" type="button" @click="sendMessage">Send</button>
                    </div>
                    <!--#endregion-->
                </div>
            </div>
            <!--#endregion-->
        </section>
        <section
            class="hidden md:block md:w-full md:flex md:items-center md:justify-center md:border-2 md:border-gray-200 md:rounded-md md:h-[75vh]"
            v-else>
            <div class="text-center">
                <h2 class="heading-2">Its empty here</h2>
                <p>Open a conversation or start one</p>
            </div>
        </section>
        <!--#endregion-->
    </main>
</template>
