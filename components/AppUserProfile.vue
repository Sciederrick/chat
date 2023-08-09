<template>
    <div class="p-2 gap-y-2 flex flex-col" v-if="false">
        <img class="h-32 w-32 mx-auto" src="" alt="" v-if="false" />
        <div :style="`border:1.5px solid #FF0000`"
            class="h-32 w-32 mx-auto rounded-full flex items-center justify-center bg-gray-200" v-else>
            {{ getInitials("Leila Adams") }}
        </div>
        <h2 class="heading-2 text-center">Leila Adams</h2>
        <p class="text-center text-xs">I live for excellent User Experiences in digital products. Biker and Hiker
            when away from computers.</p>
    </div>
</template>