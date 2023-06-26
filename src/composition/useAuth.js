import {onMounted, onUnmounted, ref} from "vue";
import {subscribeAuth} from "../services/auth.js";

export default function useAuth() {
    const user = ref({
        id: null,
        email: null,
        role: null,
        displayName: null,

        
    });
    console.log("user", user);  

    let unsubscribe;

    onMounted( () => {
        unsubscribe = subscribeAuth(newUserData => user.value = newUserData);
    });

    onUnmounted(() => {
        unsubscribe();
    });

    return {
        user,
    }
}
