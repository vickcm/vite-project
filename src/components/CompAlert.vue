<template>
  <div v-if="data.message !== ''" class="p-4 mb-4 rounded" :class="statusColorClasses">
    <div class="flex justify-between items-center">
      <div>{{ data.message }}</div>
      <button v-if="data.closable" type="button" class="px-2 text-2xl" @click="$emit('close')">&times;</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  }
});

const statusColorClasses = computed(() => {
  switch (props.data.type) {
    case 'success':
      return 'bg-green-400';

    case 'error':
      return 'bg-red-400';

    default:
      return 'bg-cyan-200';
  }
});


</script>
