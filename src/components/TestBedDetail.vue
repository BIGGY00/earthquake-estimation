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
    <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
      <!-- Time-series data image 1 -->
      <div class="bg-white shadow-lg rounded-lg p-5 h-auto">
        <div class="text-xl font-medium text-gray-800 mb-3">
          - Linear Regression Model
        </div>
        <!-- <UseImage
          v-if="LRImageSrc"
          :src="LRImageSrc"
          alt="LR Model"
          preview
          class="w-full h-auto rounded-lg mb-3"
        /> -->
        <UseImageCompare class="w-full h-fulll">
          <template #left>
            <img :src="LRImageSrc" />
          </template>
          <template #right>
            <img :src="LRImageSrcSecond" />
          </template>
        </UseImageCompare>
      </div>

      <!-- Laplace 3D Spectrum -->
      <div class="bg-white shadow-lg rounded-lg p-5">
        <div class="text-xl font-medium text-gray-800 mb-3">- KNN Model</div>
        <!-- <UseImage
          v-if="KNNImageSrc"
          :src="KNNImageSrc"
          alt="KNN Model"
          preview
          class="w-full h-auto rounded-lg mb-3"
        /> -->
        <UseImageCompare class="w-full h-fulll">
          <template #left>
            <img :src="KNNImageSrc" />
          </template>
          <template #right>
            <img :src="KNNImageSrcSecond" />
          </template>
        </UseImageCompare>
      </div>

      <!-- NFFT Spectrum Image -->
      <div class="bg-white shadow-lg rounded-lg p-5">
        <div class="text-xl font-medium text-gray-800 mb-3">- SVM Model</div>
        <!-- <UseImage
          v-if="SVMImageSrc"
          :src="SVMImageSrc"
          alt="SVM Model"
          preview
          class="w-full h-auto rounded-lg mb-3"
        /> -->
        <UseImageCompare class="w-full h-fulll">
          <template #left>
            <img :src="SVMImageSrc" />
          </template>
          <template #right>
            <img :src="SVMImageSrcSecond" />
          </template>
        </UseImageCompare>
      </div>

      <!-- Lomb-Scargle Periodograms Spectrum -->
      <div class="bg-white shadow-lg rounded-lg p-5">
        <div class="text-xl font-medium text-gray-800 mb-3">
          - Random Forest
        </div>
        <!-- <UseImage
          v-if="RFImageSrc"
          :src="RFImageSrc"
          alt="RF Model"
          preview
          class="w-full h-auto rounded-lg mb-3"
        /> -->
        <UseImageCompare class="w-full h-fulll">
          <template #left>
            <img :src="RFImageSrc" />
          </template>
          <template #right>
            <img :src="RFImageSrcSecond" />
          </template>
        </UseImageCompare>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';

const q = useQuasar();

const props = defineProps({
  selectedFault: {
    type: Object,
    required: true,
  },
});

const LRImageSrc = ref('');
const KNNImageSrc = ref('');
const SVMImageSrc = ref('');
const RFImageSrc = ref('');

const LRImageSrcSecond = ref('');
const KNNImageSrcSecond = ref('');
const SVMImageSrcSecond = ref('');
const RFImageSrcSecond = ref('');

// Set the initial image sources based on the selected fault line
const preloadedImages = {
  LR: `lr/${props.selectedFault.id}.png`,
  KNN: `knn/${props.selectedFault.id}.png`,
  SVM: `svm/${props.selectedFault.id}.png`,
  RF: `rf/${props.selectedFault.id}.png`,

  LRSecond: `lr_second/${props.selectedFault.id}.png`,
  KNNSecond: `knn_second/${props.selectedFault.id}.png`,
  SVMSecond: `svm_second/${props.selectedFault.id}.png`,
  RFSecond: `rf_second/${props.selectedFault.id}.png`,
};

onMounted(async () => {
  try {
    q.loading.show({
      delay: 300, // ms
    });
    LRImageSrc.value = preloadedImages.LR;
    KNNImageSrc.value = preloadedImages.KNN;
    SVMImageSrc.value = preloadedImages.SVM;
    RFImageSrc.value = preloadedImages.RF;

    LRImageSrcSecond.value = preloadedImages.LRSecond;
    KNNImageSrcSecond.value = preloadedImages.KNNSecond;
    SVMImageSrcSecond.value = preloadedImages.SVMSecond;
    RFImageSrcSecond.value = preloadedImages.RFSecond;
  } catch (error) {
    console.log(error);
  } finally {
    q.loading.hide();
  }
});
</script>

<style scoped>
img {
  max-width: 100%;
}
</style>
