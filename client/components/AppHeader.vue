<script lang="ts" setup>
import { useProfileStore } from '~/store/profile';
import { storeToRefs } from 'pinia';

const { useInitials } = useUtils();

const profileStore = useProfileStore();
const { me } = storeToRefs(profileStore);

const templateImages = ref(useUtils().useAssetImages());

const userAvatar = computed<string>(() => {
    const key = me.value?.isMale ? 'male-avatar' : 'female-avatar';
    return templateImages.value?.[key];
});

function mUseInitials(fullname: string | null) {
    return fullname ? useInitials(fullname) : "";
}
</script>

<template>
    <header class="flex justify-between items-center py-4 px-2 2xl:container 2xl:mx-auto">
        <img src="~/assets/logo-no-background.svg" height="60" width="160" alt="company logo" class="cursor-pointer" @click="navigateTo('/')"/>
        <div class="md:flex md:gap-4 md:items-center">
            <img :src="userAvatar" height="35" width="35" alt="user avatar" :title="mUseInitials(me?.bio.fullName ?? null)" />
            <p class="text-xs text-center md:text-xl md:order-first md:font-semibold">
                {{ mUseInitials(me?.bio.fullName ?? null) }}
            </p>
        </div>
    </header>
</template>