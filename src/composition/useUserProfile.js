import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {getUserById} from "../services/users.js";

export function useUserProfile() {
    const route = useRoute()
    const user = ref({
        id: null,
        email: null,
        role: null,
        avatar: null,
    });
    const loading = ref(true);

    onMounted(async () => {
        user.value = await getUserById(route.params.id);
        loading.value = false
    });

    return {
        user,
        loading,
    }
}