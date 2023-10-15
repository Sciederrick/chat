import { defineStore } from 'pinia'
import { Me } from '~/types/index'


export const useProfileStore = defineStore('profile-store', () => {
    const me = ref<Me>();
    
    function assignDefaultUser() {
        me.value = {
            id: "6505ebff00f0b6e28b0225fe",
            email: "davidjohnson@example.com",
            avatar: "",
            isMale: true,
            bio: {
                fullName: "David Johnson",
                title: "ML Engineer",
                about: "Passionate Software Engineer finding creative solutions."
            },
            role: "client"
        }
        
    }
    
    function loadMyProfileFromLocalStorage() {
        const { useHexRandomColor } = useUtils();
        const userFromLocalStorage = localStorage.getItem("chatly-user") as string;
        if (userFromLocalStorage != null) {
            const user = JSON.parse(userFromLocalStorage);
            user.color = useHexRandomColor();
            me.value = user;
        }
    }

    return { me, assignDefaultUser, loadMyProfileFromLocalStorage };
});