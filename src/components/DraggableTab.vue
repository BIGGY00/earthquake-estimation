<template>
  <div
    class="fixed z-50 bg-white shadow-md p-4 rounded-t-lg transition-transform duration-300"
    :class="{
      'left-0 top-0 h-full w-64': !isMobile,
      'bottom-0 left-0 w-full': isMobile,
      '-translate-y-full': isMobile && !isTabOpen,
      '-translate-y-0': isMobile && isTabOpen,
    }"
    :style="{ transform: isDragging ? `translateY(${dragY}px)` : '' }"
    @touchstart="onDragStart"
    @touchmove="onDragMove"
    @touchend="onDragEnd"
  >
    <div class="flex justify-between items-center">
      <h3 class="font-semibold">Menu</h3>
      <button
        v-if="isMobile"
        @click="$emit('toggleTab')"
        class="text-sm text-blue-500"
      >
        Close
      </button>
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps(['isMobile', 'isTabOpen', 'dragY']);
defineEmits(['toggleTab', 'onDragStart', 'onDragMove', 'onDragEnd']);
</script>
