<template>
  <div class="py-6 max-w-7xl mx-auto px-4">
    <!-- Fault Line Name -->
    <div class="flex flex-row gap-2 text-lg font-semibold text-gray-800 mb-6">
      <span>Selected Fault Line Name:</span>
      <div class="text-lg font-semibold text-green-600">
        {{ props.selectedFault.fName }}
      </div>
    </div>

    <!-- Flex direction switches based on screen size and grid for larger screens -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      <!-- Time-series data image 1 -->
      <div class="bg-white shadow-lg rounded-lg p-5">
        <div class="text-xl font-medium text-gray-800 mb-3">
          - Time-series data
        </div>
        <UseImage
          v-if="timeSeriesImageSrc"
          :src="timeSeriesImageSrc"
          alt="Image"
          preview
          class="w-full h-auto rounded-lg mb-3"
        />
        <div class="text-gray-700">
          <div class="text-sm font-medium">
            - This fault line has a range of
            <span class="font-bold text-green-600">{{
              selectedData?.range || 'N/A'
            }}</span>
            days
          </div>
        </div>
      </div>

      <!-- Laplace 3D Spectrum -->
      <div class="bg-white shadow-lg rounded-lg p-5">
        <div class="text-xl font-medium text-gray-800 mb-3">
          - Laplace 3D spectrum
        </div>
        <UseImage
          v-if="ltImageSrc"
          :src="ltImageSrc"
          alt="Image"
          preview
          class="w-full h-auto rounded-lg mb-3"
        />
        <div class="text-gray-700 text-sm font-medium">
          - Visualization of NFFT spectrum in a 3D plot
        </div>
      </div>

      <!-- NFFT Spectrum Image -->
      <div class="bg-white shadow-lg rounded-lg p-5">
        <div class="text-xl font-medium text-gray-800 mb-3">
          - NFFT Spectrum
        </div>
        <UseImage
          v-if="nfftImageSrc"
          :src="nfftImageSrc"
          alt="Image"
          preview
          class="w-full h-auto rounded-lg mb-3"
        />
        <div class="text-gray-700">
          <div class="text-sm font-medium">
            - A prominent peak frequency in the NFFT spectrum is
            <span class="font-bold text-red-600">{{
              selectedData?.frequency_nfft_r || 'N/A'
            }}</span>
            Hz
            <span>and </span>
            <span class="font-bold text-blue-600">{{
              selectedData?.frequency_nfft_b || 'N/A'
            }}</span>
            Hz
          </div>
        </div>
      </div>

      <!-- Lomb-Scargle Periodograms Spectrum -->
      <div class="bg-white shadow-lg rounded-lg p-5">
        <div class="text-xl font-medium text-gray-800 mb-3">
          - Lomb-Scargle Periodograms Spectrum
        </div>
        <UseImage
          v-if="lsImageSrc"
          :src="lsImageSrc"
          alt="Image"
          preview
          class="w-full h-auto rounded-lg mb-3"
        />
        <div class="text-gray-700">
          <div class="text-sm font-medium">
            - A prominent peak frequency in the LSP spectrum is
            <span class="font-bold text-red-600">{{
              selectedData?.frequency_lsp_r || 'N/A'
            }}</span>
            Hz
            <span>and </span>
            <span class="font-bold text-blue-600">{{
              selectedData?.frequency_lsp_b || 'N/A'
            }}</span>
            Hz
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Frequency Calculations -->
    <div
      class="mt-8 p-6 border-2 border-gray-300 rounded-lg shadow-lg"
      :class="{
        'bg-gray-100': isAnalysisDisabled,
        'opacity-50 cursor-not-allowed': isAnalysisDisabled,
      }"
    >
      <div class="text-lg font-medium text-gray-800 mb-4">Analysis Part</div>

      <div
        v-if="
          !selectedData ||
          !selectedData.range ||
          !selectedData.frequency_nfft_r ||
          !selectedData.frequency_nfft_b ||
          !selectedData.frequency_lsp_r ||
          !selectedData.frequency_lsp_b
        "
        class="text-gray-500 text-lg"
      >
        This fault line cannot make analysis.
      </div>

      <div v-else>
        <!-- NFFT Entire Samples -->
        <div class="flex flex-row gap-2 text-sm text-gray-700 mb-4">
          <span>- NFFT for Entire Samples at</span>
          <div class="font-semibold text-red-600">
            {{ formatFrequency(selectedData?.frequency_nfft_r) }} cycles
          </div>
          <span>per</span>
          <div class="font-semibold text-red-600">
            {{ (selectedData?.range / 365).toFixed(2) }} years
          </div>
        </div>
        <div class="flex flex-row gap-2 text-sm text-gray-700 mb-4">
          <span>So, the cycle length is</span>
          <div class="font-semibold text-red-600">
            {{
              calculateCycleLength(
                selectedData?.range,
                selectedData?.frequency_nfft_r
              ).toFixed(2)
            }}
            years
          </div>
        </div>

        <!-- NFFT Last 8 Years -->
        <div class="flex flex-row gap-2 text-sm text-gray-700 mb-4">
          <span>- NFFT for Last 8 years at</span>
          <div class="font-semibold text-blue-600">
            {{ formatFrequency(selectedData?.frequency_nfft_b) }} cycles
          </div>
          <span>per</span>
          <div class="font-semibold text-blue-600">
            {{ (selectedData?.range_h / 365).toFixed(2) }} years
          </div>
        </div>
        <div class="flex flex-row gap-2 text-sm text-gray-700 mb-4">
          <span>So, the cycle length is</span>
          <div class="font-semibold text-blue-600">
            {{
              calculateCycleLength(
                selectedData?.range_h,
                selectedData?.frequency_nfft_b
              ).toFixed(2)
            }}
            years
          </div>
        </div>

        <!-- LSP Entire Samples -->
        <div class="flex flex-row gap-2 text-sm text-gray-700 mb-4">
          <span>- LSP for Entire Samples at</span>
          <div class="font-semibold text-red-600">
            {{ formatFrequency(selectedData?.frequency_lsp_r) }} cycles
          </div>
          <span>per</span>
          <div class="font-semibold text-red-600">
            {{ (selectedData?.range / 365).toFixed(2) }} years
          </div>
        </div>
        <div class="flex flex-row gap-2 text-sm text-gray-700 mb-4">
          <span>So, the cycle length is</span>
          <div class="font-semibold text-red-600">
            {{
              calculateCycleLength(
                selectedData?.range,
                selectedData?.frequency_lsp_r
              ).toFixed(2)
            }}
            years
          </div>
        </div>

        <!-- LSP Last 8 Years -->
        <div class="flex flex-row gap-2 text-sm text-gray-700 mb-4">
          <span>- LSP for Last 8 years at</span>
          <div class="font-semibold text-blue-600">
            {{ formatFrequency(selectedData?.frequency_lsp_b) }} cycles
          </div>
          <span>per</span>
          <div class="font-semibold text-blue-600">
            {{ (selectedData?.range_h / 365).toFixed(2) }} years
          </div>
        </div>
        <div class="flex flex-row gap-2 text-sm text-gray-700">
          <span>So, the cycle length is</span>
          <div class="font-semibold text-blue-600">
            {{
              calculateCycleLength(
                selectedData?.range_h,
                selectedData?.frequency_lsp_b
              ).toFixed(2)
            }}
            years
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
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
      delay: 300, // ms
    });
    timeSeriesImageSrc.value = preloadedImages.timeSeries;
    nfftImageSrc.value = preloadedImages.nfft;
    ltImageSrc.value = preloadedImages.lt;
    lsImageSrc.value = preloadedImages.ls;
  } catch (error) {
    console.log(error);
  } finally {
    q.loading.hide();
  }
});

const formatFrequency = (frequency) => {
  return frequency ? frequency.toFixed(2) : 'N/A';
};

const calculateCycleLength = (range, frequency) => {
  if (range && frequency) {
    return range / 365 / frequency;
  }
  return 'N/A';
};
</script>

<style scoped>
img {
  max-width: 100%;
}
</style>
