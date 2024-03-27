<template>
  <div>
    <q-card class="p-5 rounded-lg mb-10">
      <!-- <p>Selected Fault Line ID: {{ props.selectedFault.id }}</p> -->
      <div class="flex flex-row gap-2 text-bold text-[16px]">
        Selected Fault Line Name:
        <div class="text-bold text-green">
          {{ props.selectedFault.fName }}
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="border border-[2px] border-black rounded-md">
          <div class="ml-5 flex flex-row gap-2 mt-2">
            - Time-series data of
            <div class="text-bold text-green">
              {{ props.selectedFault.fName }}
            </div>
            seismic event.
          </div>
          <!-- <img src="picture/figure.png" alt="" class="w-auto h-auto" /> -->
        </div>

        <div class="border border-[2px] border-black rounded-md">
          <div class="ml-5 flex flex-row gap-2 mt-2">
            - NFFT spectrum for
            <div class="text-bold text-green">
              {{ props.selectedFault.fName }}
            </div>
            fault line.
          </div>
          <!-- <img src="picture/MAE LAO.png" alt="" class="w-auto h-auto" /> -->
        </div>
      </div>

      <p></p>
    </q-card>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  selectedFault: {
    type: Object,
    required: true,
  },
});
</script>
