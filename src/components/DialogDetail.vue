<template>
  <div>
    <q-card class="p-5 rounded-lg mb-10">
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
          <img
            v-if="timeSeriesImageSrc"
            :src="timeSeriesImageSrc"
            alt="Time Series Image"
            class="w-auto h-auto"
          />
        </div>

        <div class="border border-[2px] border-black rounded-md">
          <div class="ml-5 flex flex-row gap-2 mt-2">
            - NFFT spectrum for
            <div class="text-bold text-green">
              {{ props.selectedFault.fName }}
            </div>
            fault line.
          </div>
          <img
            v-if="nfftImageSrc"
            :src="nfftImageSrc"
            alt="NFFT Spectrum Image"
            class="w-auto h-auto"
          />
        </div>
      </div>

      <p></p>
    </q-card>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  selectedFault: {
    type: Object,
    required: true,
  },
});

const timeSeriesImageSrc = ref('');
const nfftImageSrc = ref('');

// Fetch images when the component is mounted
onMounted(() => {
  fetchImages();
});

const fetchImages = async () => {
  try {
    // Fetch time series image
    const timeSeriesResponse = await axios.get(
      `https://earthquake-flask.onrender.com/generate_plot_time?id=${props.selectedFault.id}`,
      { responseType: 'blob' }
    );
    const imageUrlTime = URL.createObjectURL(timeSeriesResponse.data);
    timeSeriesImageSrc.value = await imageUrlTime;

    // Fetch NFFT spectrum image
    const nfftResponse = await axios.get(
      `https://earthquake-flask.onrender.com/generate_plot_nfft?id=${props.selectedFault.id}`,
      { responseType: 'blob' }
    );
    const imageUrlNfft = URL.createObjectURL(nfftResponse.data);
    nfftImageSrc.value = await imageUrlNfft;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};
</script>
