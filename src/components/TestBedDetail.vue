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
          - Linear Regression Model
        </div>
        <UseImage
          v-if="LRImageSrc"
          :src="LRImageSrc"
          alt="Image"
          preview
          class="w-full h-auto rounded-lg mb-3"
        />
      </div>

      <!-- Laplace 3D Spectrum -->
      <div class="bg-white shadow-lg rounded-lg p-5">
        <div class="text-xl font-medium text-gray-800 mb-3">- KNN Model</div>
        <UseImage
          v-if="KNNImageSrc"
          :src="KNNImageSrc"
          alt="Image"
          preview
          class="w-full h-auto rounded-lg mb-3"
        />
      </div>

      <!-- NFFT Spectrum Image -->
      <div class="bg-white shadow-lg rounded-lg p-5">
        <div class="text-xl font-medium text-gray-800 mb-3">- SVM Model</div>
        <UseImage
          v-if="SVMImageSrc"
          :src="SVMImageSrc"
          alt="Image"
          preview
          class="w-full h-auto rounded-lg mb-3"
        />
      </div>

      <!-- Lomb-Scargle Periodograms Spectrum -->
      <div class="bg-white shadow-lg rounded-lg p-5">
        <div class="text-xl font-medium text-gray-800 mb-3">
          - Random Forest
        </div>
        <UseImage
          v-if="RFImageSrc"
          :src="RFImageSrc"
          alt="Image"
          preview
          class="w-full h-auto rounded-lg mb-3"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
// import dataset from './data';

const q = useQuasar();

// const d = dataset;

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

// const selectedData = d.find(
//   (faultData) => faultData.fName === props.selectedFault.fName
// );

const preloadedImages = {
  LR: `lr/${props.selectedFault.id}.png`,
  KNN: `knn/${props.selectedFault.id}.png`,
  SVM: `svm/${props.selectedFault.id}.png`,
  RF: `rf/${props.selectedFault.id}.png`,
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
