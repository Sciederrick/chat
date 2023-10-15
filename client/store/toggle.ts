import { defineStore } from 'pinia'

export const useToggleStore = defineStore('toggle-store', () => {
    let showModal = ref(false);
    let showPageAlert = ref(true);

    function toggleModal() {
        showModal.value = !showModal.value;
    }

    function togglePageAlert(display = true) {
        showPageAlert.value = display;
    }

    return { showModal, toggleModal, showPageAlert, togglePageAlert };
});