<script setup>
import {computed} from 'vue';
import defaultavatar from '../assets/img/defaultavatar.png' ;

const props = defineProps({
    src: {
        required: true,
    },

    alt: {
        type: String,
        default: 'avatar',
    }
});

const showSrc = computed(() => props.src != null && props.src !== '' ? props.src : defaultavatar);
</script>

<template>
    <img class="h-16 w-16 rounded-full"
        :src="showSrc"
        :alt="alt"
    />
</template>

