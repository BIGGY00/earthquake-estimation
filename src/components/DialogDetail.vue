<template>
  <div>
    <q-card class="p-5 rounded-lg mb-10">
      <div class="flex flex-row gap-2 text-bold text-[16px]">
        Selected Fault Line Name:
        <div class="text-bold text-green">
          {{ props.selectedFault.fName }}
        </div>
      </div>

      <!-- Flex direction switches based on screen size and grid for larger screens -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Time-series data image 1 -->
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
            class="w-full h-auto"
          />
          <div class="mt-2">
            <div class="ml-5 flex flex-row gap-2">
              - This fault line has range in
              <div class="text-bold text-green">
                {{ selectedData?.range || 'N/A' }}
              </div>
              days
            </div>
          </div>
        </div>

        <!-- laplace 3D spectrum -->
        <div class="border border-[2px] border-black rounded-md">
          <div class="ml-5 flex flex-row gap-2 mt-2">
            - Laplace 3D spectrum for
            <div class="text-bold text-green">
              {{ props.selectedFault.fName }}
            </div>
            fault line.
          </div>
          <img
            v-if="ltImageSrc"
            :src="ltImageSrc"
            alt="laplace Spectrum Image"
            class="w-full h-auto"
          />
          <div class="mt-2">
            <div class="ml-5 flex flex-row gap-2">
              - The visualize of NFFT spectrum in 3D plot
            </div>
          </div>
        </div>

        <!-- NFFT Spectrum Image image -->
        <div class="border border-[2px] border-black rounded-md">
          <div class="ml-5 flex flex-row gap-2 mt-2">
            - NFFT spectrum for
            <div class="text-bold text-green">
              {{ props.selectedFault.fName }}
            </div>
            seismic event.
          </div>
          <img
            v-if="nfftImageSrc"
            :src="nfftImageSrc"
            alt="NFFT Spectrum Image"
            class="w-full h-auto"
          />

          <div class="mt-2">
            <div class="ml-5 flex flex-row gap-2">
              - A prominent peak frequency in the NFFT spectrum is
              <div class="text-bold text-red">
                {{ selectedData?.frequency_nfft_r || 'N/A' }}
              </div>
              Hz
              <div>and</div>
              <div class="text-bold text-blue">
                {{ selectedData?.frequency_nfft_b || 'N/A' }}
              </div>
              Hz
            </div>
          </div>
        </div>

        <!-- lsp spectrum image -->
        <div class="border border-[2px] border-black rounded-md">
          <div class="ml-5 flex flex-row gap-2 mt-2">
            - Lomp-Scargle Periodograms spectrum for
            <div class="text-bold text-green">
              {{ props.selectedFault.fName }}
            </div>
            fault line.
          </div>
          <img
            v-if="lsImageSrc"
            :src="lsImageSrc"
            alt="LSP Spectrum Image"
            class="w-full h-auto"
          />
          <div class="ml-5 flex flex-row gap-2">
            - A prominent peak frequency in the Lomb-Scargle Periodograms
            spectrum is
            <div class="text-bold text-red">
              {{ selectedData?.frequency_lsp_r || 'N/A' }}
            </div>
            Hz
            <div>and</div>
            <div class="text-bold text-blue">
              {{ selectedData?.frequency_lsp_b || 'N/A' }}
            </div>
            Hz
          </div>
        </div>
      </div>
      <div class="p-2 border border-[5px]">
        <div class="flex flex-row gap-1">
          - NFFT for Entire Samples at
          <div class="text-bold text-red">
            {{
              selectedData?.frequency_nfft_r &&
              selectedData?.frequency_nfft_r !== 0
                ? (selectedData?.frequency_nfft_r).toFixed(2)
                : 'N/A'
            }}
            cycles
          </div>
          <div>per</div>
          <div class="text-bold text-red">
            {{ (selectedData?.range / 365).toFixed(2) }} years
          </div>
        </div>
        <div class="flex flex-row gap-1">
          <div>So, the cycle length is</div>
          <div class="text-bold text-red">
            {{
              selectedData?.frequency_nfft_r &&
              selectedData?.frequency_nfft_r !== 0
                ? (
                    selectedData?.range /
                    selectedData?.frequency_nfft_r /
                    365
                  ).toFixed(2)
                : 'N/A'
            }}
            years
          </div>
        </div>

        <div class="flex flex-row gap-1">
          - NFFT for Last 8 years at
          <div class="text-bold text-blue">
            {{
              selectedData?.frequency_nfft_b &&
              selectedData?.frequency_nfft_b !== 0
                ? (selectedData?.frequency_nfft_b).toFixed(2)
                : 'N/A'
            }}
            cycles
          </div>
          <div>per</div>
          <div class="text-bold text-blue">
            {{ (selectedData?.range_h / 365).toFixed(2) }} years
          </div>
        </div>
        <div class="flex flex-row gap-1">
          <div>So, the cycle length is</div>
          <div class="text-bold text-blue">
            {{
              selectedData?.frequency_nfft_b &&
              selectedData?.frequency_nfft_b !== 0
                ? (
                    selectedData?.range_h /
                    selectedData?.frequency_nfft_b /
                    365
                  ).toFixed(2)
                : 'N/A'
            }}
            years
          </div>
        </div>

        <div class="flex flex-row gap-1">
          - LSP for Entire samples at
          <div class="text-bold text-red">
            {{
              selectedData?.frequency_lsp_r &&
              selectedData?.frequency_lsp_r !== 0
                ? (selectedData?.frequency_lsp_r).toFixed(2)
                : 'N/A'
            }}
            cycles
          </div>
          <div>per</div>
          <div class="text-bold text-red">
            {{ (selectedData?.range / 365).toFixed(2) }} years
          </div>
        </div>
        <div class="flex flex-row gap-1">
          <div>So, the cycle length is</div>
          <div class="text-bold text-red">
            {{
              selectedData?.frequency_lsp_r &&
              selectedData?.frequency_lsp_r !== 0
                ? (
                    selectedData?.range /
                    selectedData?.frequency_lsp_r /
                    365
                  ).toFixed(2)
                : 'N/A'
            }}
            years
          </div>
        </div>

        <div class="flex flex-row gap-1">
          - LSP for Last 8 years at
          <div class="text-bold text-blue">
            {{
              selectedData?.frequency_lsp_b &&
              selectedData?.frequency_lsp_b !== 0
                ? (selectedData?.frequency_lsp_b).toFixed(2)
                : 'N/A'
            }}
            cycles
          </div>
          <div>per</div>
          <div class="text-bold text-blue">
            {{ (selectedData?.range_h / 365).toFixed(2) }} years
          </div>
        </div>
        <div class="flex flex-row gap-1">
          <div>So, the cycle length is</div>
          <div class="text-bold text-blue">
            {{
              selectedData?.frequency_lsp_b &&
              selectedData?.frequency_lsp_b !== 0
                ? (
                    selectedData?.range_h /
                    selectedData?.frequency_lsp_b /
                    365
                  ).toFixed(2)
                : 'N/A'
            }}
            years
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';
import dataset from './data';

const q = useQuasar();

const d = dataset;

const props = defineProps({
  selectedFault: {
    type: Object,
    required: true,
  },
});

console.log(props.selectedFault);

const timeSeriesImageSrc = ref('');
const nfftImageSrc = ref('');
const ltImageSrc = ref('');
const lsImageSrc = ref('');

const selectedData = d.find(
  (faultData) => faultData.fName === props.selectedFault.fName
);

const preloadedImages = {
  timeSeries: `time/${props.selectedFault.id}.png`,
  nfft: `nfft/${props.selectedFault.id}.png`,
  lt: `lt/${props.selectedFault.id}.png`,
  ls: `ls/${props.selectedFault.id}.png`,
};

onMounted(async () => {
  try {
    q.loading.show({
      delay: 3000, // ms
    });
    timeSeriesImageSrc.value = preloadedImages.timeSeries;
    nfftImageSrc.value = preloadedImages.nfft;
    ltImageSrc.value = preloadedImages.lt;
    lsImageSrc.value = preloadedImages.ls;
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
