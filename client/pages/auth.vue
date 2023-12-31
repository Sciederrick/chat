<script setup lang="ts">
function goToChat() {
    navigateTo("/");
}
const userProfile = ref<any>(null);
const gender = ref<String | null>(null);

const isAccessLocalStorage = ref<Boolean>(false);

const isAssignProfileBtnDisabled = computed(() => {
    return isAccessLocalStorage.value == false || gender.value == null;
});

const isProfileFetchError = ref<Boolean>(false);
async function assignProfile() {
    const { data, status } = await useFetch(`http://localhost:3098/api/v1/profiles/${gender.value ?? "A"}/random`);

    if (status.value != "success") {
        isProfileFetchError.value = true;
    } else {
        userProfile.value = data.value;
        localStorage.setItem("chatly-user", JSON.stringify(data.value));
    }
};

const templateImages = ref(useUtils().useAssetImages());

const userAvatar: any = computed(() => {
    const key = userProfile.isMale ? 'male-avatar' : 'female-avatar';
    return templateImages.value?.[key];
});

onBeforeMount(() => {
    const existingProfile = localStorage.getItem("chatly-user");
    if (existingProfile != undefined || existingProfile != null) goToChat()
});

</script>

<template>
    <div class="w-screen h-screen flex items-center justify-center px-2 md:flex 2xl:container 2xl:mx-auto">
        <div class="flex flex-col md:flex-row">
            <section
                class="px-4 py-8 shadow-sm bg-[--ivory] rounded-sm md:flex md:flex-col md:w-full md:min-h-[350px] md:items-center md:justify-center">
                <div v-if="!userProfile">
                    <form>
                        <h2 class="heading-2">Choose gender:</h2><br />
                        <input type="radio" id="male" name="gender" value="M" v-model="gender">
                        <label for="male">&nbsp;Male</label><br />
                        <input type="radio" id="female" name="gender" value="F" v-model="gender">
                        <label for="female">&nbsp;Female</label><br /><br /><br />
                        <input type="checkbox" id="is_access_local_storage" name="is_access_local_storage" value="true"
                            v-model="isAccessLocalStorage">
                        <label for="is_access_local_storage">&nbsp;Allow this website to store user info in local
                            storage,<br /> this is crucial to this site's functionality</label>
                    </form>
                    <br />
                    <!-- <p class="w-full text-right pr-4 text-xs md:pr-0">Steps 1/1</p> -->
                    <button type="button"
                        :class="[isAssignProfileBtnDisabled ? 'cursor-not-allowed text-red-200' : 'cursor-pointer']"
                        class="float-right text-[--deep-red] p-2 hover:text-[--red]" @click="assignProfile"
                        :disabled="isAssignProfileBtnDisabled">
                        submit&nbsp;
                        <Icon name="ic:round-navigate-next" />
                    </button>
                </div>
                <div v-else class="max-w-sm">
                    <img :src="userAvatar" width="50" height="50" alt="">
                    <h2 class="heading-2 py-1">{{ userProfile.bio.fullName }}</h2>
                    <div class="italic py-1">{{ userProfile.bio.about }}</div>
                </div>
            </section>
            <section :class="[userProfile == null ? 'md:bg-[--deep-red] order-first' : 'order-2']"
                class="relative p-4 rounded-l-0 rounded-sm md:flex md:items-center md:order-2 md:px-6 md:my-10 md:text-white">
                <div v-show="!userProfile" class="flex items-center md:flex-col md:justify-center md:items-start">
                    <Icon name="ri:user-line" size="32" />
                    <p class="pl-4 md:pt-4 md:pl-0 md:text-sm">No need to sign up. I'll assign you one random profile for
                        your convenience.</p>
                </div>
                <div v-show="userProfile"
                    class="absolute right-0 md:-left-10 md:inset-y-0 md:flex md:items-center md:justify-center">
                    <button type="button" @click="goToChat">
                        <Icon name="carbon:next-filled" size="40" class="text-[--deep-red]" />
                    </button>
                </div>
                <div v-show="isProfileFetchError" class="flex items-center md:flex-col md:justify-center md:items-start">
                    <Icon name="bx:error-alt" class="md:text-xl" />
                    <p class="pl-4 md:pt-4 md:pl-0 md:text-sm">Something went wrong.</p>
                </div>
            </section>
        </div>
    </div>
</template>