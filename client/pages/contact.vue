<script lang="ts" setup>
import { ContactProfile } from '~/types/index';
import { useProfileStore } from '~/store/profile';
import { storeToRefs } from 'pinia';

const { useInitials } = useUtils();

const profileStore = useProfileStore();

const { me } = storeToRefs(profileStore);

const { loadMyProfileFromLocalStorage } = profileStore;

const isContactOpenedMobile = ref(false);
const contactProfiles = ref<ContactProfile[] | null>(null);
const activeContactProfile = ref<ContactProfile | null>(null);

function viewContactProfile(id: string) {
    activeContactProfile.value = contactProfiles.value?.find(contactProfile => contactProfile.id == id) ?? null;
    toggleIsContactOpenedMobile(true);
}

function toggleIsContactOpenedMobile(state: boolean) {
    isContactOpenedMobile.value = state;
}

function loadMyProfile() {
    loadMyProfileFromLocalStorage();
    if (!me.value) navigateTo('auth');
}

function loadDummyContactProfiles() {
    contactProfiles.value = [
        {
            id: '123dfg34fg12sd',
            avatar: undefined,
            name: 'Derrick Mbarani',
            title: 'Data Analyst',
            about: 'Checking modern issues with data tools. I deep-dive into government efforts and highlight weaknesses & impact. Ensuring the government of the day is put in check.',
            links: undefined,
            color: '#bbff00',
            gender: 'M'
        },
        {
            id: '123dfg34fg12se',
            avatar: undefined,
            name: 'John Doe',
            title: 'Data Engineer',
            about: 'Building data pipelines to ensure a smooth flow of information from one stage to the next. Ensuring Data Scientists do not engage in repeatable work and focus on creative work.',
            links: undefined,
            color: '#ffff10',
            gender: 'M'
        },
    ]
    activeContactProfile.value = contactProfiles.value[0];
}

function mUseInitials(fullname: string | null) {
    return fullname ? useInitials(fullname) : "";
}

const searchTerm = ref<string | null>(null);

onBeforeMount(() => {
    loadMyProfile();
    loadDummyContactProfiles();
});
</script>

<template>
    <AppHeader />
    <main class="px-2 2xl:container 2xl:mx-auto">
        <!--#region contact search-->
        <section class="w-full border-b-2 border-gray-200">
            <form class="py-2 flex items-center gap-4">
                <Icon name="akar-icons:search" class="text-gray-400" />
                <input type="text" id="contactSearch" name="contactSearch" v-model="searchTerm" class="w-full outline-none"
                    placeholder="Search contacts to save or inbox">
            </form>
        </section>
        <!--#endregion contact search-->

        <div class="md:flex">
            <!--#region left sidebar-->
            <aside :class="{ 'hidden': isContactOpenedMobile }" class="pr-2 w-full pt-1 md:pt-2 md:block md:w-1/3 lg:w-[350px]">
                <!--#region contact profiles list-->
                <ul class="divide-y">
                    <li v-for="contactProfile in contactProfiles" :key="contactProfile.id"
                        :class="{ 'bg-gray-100': contactProfile.id == activeContactProfile?.id }"
                        class="flex items-center gap-x-4 py-1.5 cursor-pointer hover:bg-gray-100"
                        @click="viewContactProfile(contactProfile.id)">
                        <img class="h-10 w-10" :src="contactProfile?.avatar" alt="" v-if="contactProfile?.avatar" />
                        <p :style="`border:1.5px solid ${contactProfile.color}`"
                            class="h-10 w-10 rounded-full flex items-center justify-center bg-gray-200" v-else>
                            {{ useInitials(contactProfile.name) }}
                        </p>
                        <ul>
                            <li class="truncate font-bold">{{ contactProfile.name }}</li>
                            <li class="truncate text-gray-500">{{ contactProfile.title }}</li>
                        </ul>
                    </li>
                </ul>
                <!--#endregion contact profiles list-->
            </aside>
            <!--#endregion-->

            <!--#region where profile description lives-->
            <section :class="{ 'hidden': !isContactOpenedMobile }"
                class="relative w-full flex-col pt-4 md:flex md:border-l md:border-gray-200">
                <button type="button" class="mb-6 md:hidden"
                    @click="toggleIsContactOpenedMobile(false)">
                    <Icon name="ep:back" />
                </button>
                <div class="px-2 flex flex-col gap-4 pb-4 md:px-4">
                    <img class="h-20 w-20" :src="activeContactProfile?.avatar" alt="" v-if="activeContactProfile?.avatar" />
                    <p :style="`border:1.5px solid ${activeContactProfile?.color}`"
                        class="h-20 w-20 rounded-full flex items-center justify-center bg-gray-200" v-else>
                        {{ mUseInitials(activeContactProfile?.name ?? "") }}
                    </p>
                    <h3 class="font-bold">{{ activeContactProfile?.name }}</h3>
                    <ul v-if="activeContactProfile?.links">
                        <li v-for="link in activeContactProfile?.links">{{ link }}</li>
                    </ul>
                    <ul class="flex gap-4 text-gray-500" v-else>
                        <li v-for="i in 3">__</li>
                    </ul>
                    <p class="max-w-md text-gray-500">{{ activeContactProfile?.about }}</p>
                </div>
                <div class="flex justify-between border-t border-gray-200 p-2 md:px-4">
                    <button type="button" class="font-bold text-green-600 hover:text-green-400">
                        <Icon name="streamline:mail-send-email-message" />&nbsp;
                        Message
                    </button>
                    <button type="button" class="font-bold text-green-600 hover:text-green-400">
                        <Icon name="material-symbols:person-add-outline" v-if="true" />
                        <Icon name="material-symbols:person-remove-outline" v-else />&nbsp;
                        Save Contact
                    </button>
                </div>
            </section>
            <!--#endregion-->
        </div>
</main></template>