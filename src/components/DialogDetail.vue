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
import { useQuasar } from 'quasar';

const q = useQuasar();

const props = defineProps({
  selectedFault: {
    type: Object,
    required: true,
  },
});

const timeSeriesImageSrc = ref('');
const nfftImageSrc = ref('');

const preloadedImages = {
  timeSeries: `time/${props.selectedFault.id}.png`,
  nfft: `nfft/${props.selectedFault.id}.png`,
};

onMounted(async () => {
  try {
    q.loading.show({
      delay: 3000, // ms
    });
    timeSeriesImageSrc.value = preloadedImages.timeSeries;
    nfftImageSrc.value = preloadedImages.nfft;
  } catch (error) {
    console.error('Error fetching: ', error);
  } finally {
    q.loading.hide();
  }

  checkForUpdates();
});

const checkForUpdates = async () => {
  try {
    const timeSeriesMetaResponse = await axios.head(
      `https://earthquake-flask.onrender.com/generate_plot_time?id=${props.selectedFault.id}`
    );
    const timeSeriesLastModified =
      timeSeriesMetaResponse.headers['last-modified'];

    const nfftMetaResponse = await axios.head(
      `https://earthquake-flask.onrender.com/generate_plot_nfft?id=${props.selectedFault.id}`
    );
    const nfftLastModified = nfftMetaResponse.headers['last-modified'];

    if (timeSeriesLastModified !== preloadedImages.timeSeriesLastModified) {
      await fetchAndUpdateImage('timeSeries');
    }

    if (nfftLastModified !== preloadedImages.nfftLastModified) {
      await fetchAndUpdateImage('nfft');
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
};

const fetchAndUpdateImage = async (imageType) => {
  try {
    // Fetch updated image
    const response = await axios.get(
      `https://earthquake-flask.onrender.com/generate_plot_${imageType}?id=${props.selectedFault.id}`,
      { responseType: 'blob' }
    );

    preloadedImages[`${imageType}LastModified`] =
      response.headers['last-modified'];
    preloadedImages[imageType] = URL.createObjectURL(response.data);

    if (imageType === 'timeSeries') {
      timeSeriesImageSrc.value = preloadedImages.timeSeries;
    } else if (imageType === 'nfft') {
      nfftImageSrc.value = preloadedImages.nfft;
    }
  } catch (error) {
    console.error(`Error fetching or updating ${imageType} image:`, error);
  }
};
</script>
