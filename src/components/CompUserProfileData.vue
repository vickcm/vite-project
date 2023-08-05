<template>
    <div class="flex gap-4 mb-4">
        <div class="w-3/12">
            <CompImage :src="user.photoURL" />
        </div>
        <div class="w-9/12">
            <dl>
                <dt class="font-bold">Nombre de usuario</dt>
                <dd class="mb-2">{{ user.displayName || 'No especificado' }}</dd>

            </dl>
        </div>
    </div>
</template>

<script setup>
import CompImage from "./CompImage.vue";

defineProps({
    user: {
        type: Object,
        required: true,
    }
})
</script>
