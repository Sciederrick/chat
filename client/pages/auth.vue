<script setup lang="ts">
</script>

<template>
    <div class="w-screen h-screen flex items-center justify-center px-2 md:flex 2xl:container 2xl:mx-auto">
        <div class="flex flex-col md:flex-row">
            <section
                class="px-4 py-8 shadow-sm bg-[--ivory] rounded-sm md:flex md:flex-col md:w-full md:min-h-[350px] md:items-center md:justify-center">
                <div v-if="false">
                    <form>
                        <h2 class="heading-2">Choose gender:</h2><br />
                        <input type="radio" id="male" name="gender" value="Male">
                        <label for="male">&nbsp;Male</label><br />
                        <input type="radio" id="female" name="gender" value="Female">
                        <label for="female">&nbsp;Female</label>
                    </form>
                    <br />
                    <p class="w-full text-right pr-4 text-xs md:pr-0">Steps 1/1</p>
                </div>
                <div v-else class="max-w-sm">
                    <img src="~/assets/male-avatar.svg" width="50" height="50" alt="">
                    <h2 class="heading-2 py-1">John Doe</h2>
                    <div class="italic py-1">Software developer with an interest in Data Science. Transforming business decisions with data.</div>
                </div>
            </section>
            <section
                class="relative p-4 order-first rounded-l-0 rounded-sm md:flex md:items-center md:order-2 md:px-6 md:my-10 md:bg-[--deep-red] md:text-white">
                <div v-show="false" class="flex items-center md:flex-col md:justify-center md:items-start">
                    <Icon name="ri:user-line" size="32" />
                    <p class="pl-4 md:pt-4 md:pl-0 md:text-sm">No need to sign up. I'll assign you one random profile for
                        your convenience.</p>
                </div>
                <button v-show="true" class="inset-y-0 left-1">
                    <Icon name="carbon:next-filled" size="40" />
                </button>
            </section>
        </div>
</div></template>