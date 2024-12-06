<template>
  <div>
    <!-- Map Div -->
    <div
      id="mapDiv"
      :class="[
        'absolute p-0 m-0 touch-none', // Ensure touch gestures are captured properly
        isMobile
          ? tabOpen || tabOpenTestbed
            ? tabOpen
              ? 'w-full top-0' // Mobile: tabOpen comes from bottom
              : 'w-full bottom-0' // Mobile: tabOpenTestbed comes from top
            : 'h-full w-full' // Mobile: Full height and width when no tab is open
          : tabOpen
          ? 'h-full w-1/2 right-0' // Desktop: tabOpen is open, position map on the right
          : tabOpenTestbed
          ? 'h-full w-1/2 left-0' // Desktop: tabOpenTestbed is open, position map on the left
          : 'h-full w-full', // Desktop: Full height and width when no tab is open
      ]"
      :style="{
        height:
          isMobile && (tabOpen || tabOpenTestbed) ? 'calc(100% - 50%)' : '100%',
      }"
    ></div>

    <!-- Normal Select Box -->
    <div
      :class="[
        'absolute p-4',
        isMobile ? 'top-4 left-4 w-fit' : 'top-4 left-4 w-fit',
      ]"
    >
      <div class="grid grid-rows">
        <div class="text-bold">Select Fault Line</div>
        <select
          class="w-fit p-3 pl-4 pr-10 rounded-lg border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
          v-model="selectedFaultLine.fName"
          @change="selectFaultLine"
          placeholder="Select Fault Lines"
        >
          <option disabled value="NOT SELECTED" class="text-sm text-gray-500">
            Select Fault Line
          </option>
          <option
            v-for="faultLine in faultLines"
            :value="faultLine.fName"
            :key="faultLine.fName"
          >
            {{ faultLine.fName }}
          </option>
        </select>
      </div>
    </div>

    <!-- Testbed Select Box -->
    <div
      :class="[
        'absolute p-4',
        isMobile ? 'top-4 right-4 w-fit' : 'top-4 right-4 w-fit',
      ]"
    >
      <div class="grid grid-rows">
        <div class="text-bold">Testbed for ML</div>
        <select
          class="w-fit p-3 pl-4 pr-10 rounded-lg border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
          v-model="selectedFaultLineTestbed.fName"
          @change="selectFaultLineTestbed"
          placeholder="Select Fault Lines"
        >
          <option disabled value="NOT SELECTED" class="text-sm text-gray-500">
            Select Fault Line
          </option>
          <option
            v-for="faultLine in faultLinesTestbed"
            :value="faultLine.fName"
            :key="faultLine.fName"
          >
            {{ faultLine.fName }}
          </option>
        </select>
      </div>
    </div>

    <!-- Tab Panel -->
    <div
      :class="[
        'fixed bg-white shadow-lg rounded-2xl transition-transform duration-300 overflow-y-auto',
        isMobile ? 'w-full left-0 bottom-0 h-1/2' : 'w-1/2 left-0 top-0 h-full',
        tabOpen
          ? 'translate-y-0 translate-x-0'
          : isMobile
          ? 'translate-y-full'
          : '-translate-x-full',
      ]"
    >
      <button
        @click="toggleTab()"
        class="absolute right-4 top-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
      <div class="p-4">
        <div v-if="!isMobile">
          <select
            class="w-fit p-3 pl-4 pr-10 rounded-lg border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
            v-model="selectedFaultLine.fName"
            @change="selectFaultLine"
            placeholder="Select Fault Lines"
          >
            <option disabled value="" class="text-sm text-gray-500">
              Select Fault Line
            </option>
            <option
              v-for="faultLine in faultLines"
              :value="faultLine.fName"
              :key="faultLine.fName"
            >
              {{ faultLine.fName }}
            </option>
          </select>
        </div>
        <MainDetail
          v-if="selectedFaultLine.id !== 0"
          :key="selectedFaultLine.id"
          :selectedFault="selectedFaultLine"
        />
      </div>
    </div>

    <!-- Tab Panel Testbed -->
    <div
      :class="[
        'fixed bg-white shadow-lg rounded-2xl transition-transform duration-300 overflow-y-auto',
        isMobile ? 'w-full left-0 top-0 h-1/2' : 'w-1/2 right-0 top-0 h-full',
        tabOpenTestbed
          ? 'translate-x-0 translate-y-0'
          : isMobile
          ? '-translate-y-full'
          : 'translate-x-full',
      ]"
    >
      <button
        @click="toggleTabTestbed()"
        class="absolute right-4 top-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
      <div class="p-4">
        <div v-if="!isMobile">
          <select
            class="w-fit p-3 pl-4 pr-10 rounded-lg border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
            v-model="selectedFaultLineTestbed.fName"
            @change="selectFaultLineTestbed"
            placeholder="Select Fault Lines"
          >
            <option disabled value="" class="text-sm text-gray-500">
              Select Fault Line
            </option>
            <option
              v-for="faultLine in faultLinesTestbed"
              :value="faultLine.fName"
              :key="faultLine.fName"
            >
              {{ faultLine.fName }}
            </option>
          </select>
        </div>
        <TestBedDetail
          v-if="selectedFaultLineTestbed.id !== 0"
          :key="selectedFaultLineTestbed.id"
          :selectedFault="selectedFaultLineTestbed"
        />
      </div>
    </div>

    <!-- Tab Toggle Button -->
    <button
      v-if="!tabOpen && selectedFaultLine.fName !== 'NOT SELECTED'"
      @click="toggleTab"
      :class="[
        'fixed bg-white text-black py-2 px-4 rounded-lg border border-gray-300 shadow-lg ',
        isMobile
          ? 'bottom-10 left-1/2 transform -translate-x-1/2'
          : 'top-28 left-8',
      ]"
    >
      Open Tab
    </button>

    <button
      v-if="
        !tabOpenTestbed && selectedFaultLineTestbed.fName !== 'NOT SELECTED'
      "
      @click="toggleTabTestbed"
      :class="[
        'fixed bg-white text-black py-2 px-4 rounded-lg border border-gray-300 shadow-lg ',
        isMobile
          ? 'bottom-10 left-1/2 transform -translate-x-1/2'
          : 'top-28 right-8',
      ]"
    >
      Open Tab
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { loadModules } from 'esri-loader';
import polygonData from 'src/utils/polygon-normal.json';
import MainDetail from 'src/components/MainDetail.vue';
import TestBedDetail from 'src/components/TestBedDetail.vue';

const selectedCoordinates = ref({ longitude: 0, latitude: 0 });
let map = null;
let mapView = null;

const tabOpen = ref(false);
const tabOpenTestbed = ref(false);

const isMobile = computed(() => window.innerWidth <= 768);

const toggleTab = () => {
  tabOpen.value = !tabOpen.value;
};

const toggleTabTestbed = () => {
  tabOpenTestbed.value = !tabOpenTestbed.value;
};

window.addEventListener('resize', () => {
  if (tabOpen.value && !isMobile.value) {
    tabOpen.value = false;
  }
  if (tabOpenTestbed.value && !isMobile.value) {
    tabOpenTestbed.value = false;
  }
});

// Initialize the map
onMounted(async () => {
  const [esriConfig, Map, MapView, FeatureLayer, GraphicsLayer] =
    await loadModules([
      'esri/config',
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/FeatureLayer',
      'esri/layers/GraphicsLayer',
    ]);

  esriConfig.request.maxUrlLength = 2000;

  esriConfig.apiKey =
    'AAPK271827ddb21f45dabb09474524128651cM5NQDQmkAxMGWdNQswNqk6sY_EiH-QKkpcfV4PR4sHf_g1By15TQHbegx0jWEiG';

  map = new Map({ basemap: 'arcgis/topographic' });

  mapView = new MapView({
    container: 'mapDiv',
    map: map,
    zoom: 6,
    center: [100.9925, 13.7563],
  });

  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  const polygonLayer = new GraphicsLayer({ id: 'polygonLayer' });
  map.add(polygonLayer);

  const pointLayer = new GraphicsLayer({ id: 'pointLayer' });
  map.add(pointLayer);

  const ThaifaultLines = new FeatureLayer({
    url: 'https://gisportal.dmr.go.th/arcgis/rest/services/HAZARD/ZONE_ACTIVEFAULT/MapServer',
  });

  const bordeLines = new FeatureLayer({
    url: 'https://services9.arcgis.com/CGSTChWyOjfHFaYa/arcgis/rest/services/Fault_Map__Everyone__WFL1/FeatureServer/3',
  });

  // const FaultLines = new FeatureLayer({
  //   url: 'https://services.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/Active_Faults/FeatureServer',
  // });

  map.addMany([ThaifaultLines, bordeLines]);

  const navigationDiv = document.querySelector('.esri-ui-top-left');
  if (navigationDiv) {
    navigationDiv.classList.remove('esri-ui-top-left');
    navigationDiv.classList.add('esri-ui-bottom-left');
  }

  mapView.container.addEventListener('mousemove', (event) => {
    const screenPoint = {
      x: event.clientX,
      y: event.clientY,
    };
    const mapPoint = mapView.toMap(screenPoint);
    selectedCoordinates.value = {
      longitude: mapPoint.longitude.toFixed(4),
      latitude: mapPoint.latitude.toFixed(4),
    };
  });
});

const selectedFaultLine = ref({ id: 0, fName: 'NOT SELECTED' });
const selectedFaultLineTestbed = ref({ id: 0, fName: 'NOT SELECTED' });
const faultLines = [
  {
    id: 0,
    fName: 'NOT SELECTED',
    coordinates: { longitude: 100.9925, latitude: 13.7563 },
    zoom: 6,
  },
  {
    id: 1,
    fName: 'KHLONG MARUI',
    coordinates: { longitude: 98.6462, latitude: 8.5078 },
    zoom: 8,
  },
  {
    id: 2,
    fName: 'MAE CHAN',
    coordinates: { longitude: 99.7994, latitude: 20.1583 },
    zoom: 11,
  },
  {
    id: 3,
    fName: 'MAE HONG SON',
    coordinates: { longitude: 97.9933, latitude: 18.3699 },
    zoom: 9,
  },
  {
    id: 4,
    fName: 'MAE ING',
    coordinates: { longitude: 100.4294, latitude: 19.9856 },
    zoom: 10,
  },
  {
    id: 5,
    fName: 'MOEI',
    coordinates: { longitude: 98.5865, latitude: 16.961 },
    zoom: 9,
  },
  {
    id: 6,
    fName: 'MAE THA',
    coordinates: { longitude: 99.0587, latitude: 18.8892 },
    zoom: 9,
  },
  {
    id: 7,
    fName: 'THOEN',
    coordinates: { longitude: 99.6708, latitude: 17.9496 },
    zoom: 9,
  },
  {
    id: 8,
    fName: 'PHETCHABUN',
    coordinates: { longitude: 101.162, latitude: 16.3967 },
    zoom: 9,
  },
  {
    id: 9,
    fName: 'PUA',
    coordinates: { longitude: 100.9118, latitude: 19.102 },
    zoom: 10,
  },
  {
    id: 10,
    fName: 'PHA YAO',
    coordinates: { longitude: 99.6481, latitude: 19.0255 },
    zoom: 9,
  },
  {
    id: 11,
    fName: 'RANONG',
    coordinates: { longitude: 98.7926, latitude: 10.0907 },
    zoom: 8,
  },
  {
    id: 12,
    fName: 'SI SAWAT',
    coordinates: { longitude: 98.9748, latitude: 15.2919 },
    zoom: 9,
  },
  {
    id: 13,
    fName: 'THREE PAGODA',
    coordinates: { longitude: 98.8309, latitude: 14.6418 },
    zoom: 9,
  },
  {
    id: 14,
    fName: 'UTTARADIT',
    coordinates: { longitude: 100.579, latitude: 17.7144 },
    zoom: 10,
  },
  {
    id: 15,
    fName: 'WIANG HAENG',
    coordinates: { longitude: 98.671, latitude: 19.3502 },
    zoom: 9,
  },
  {
    id: 16,
    fName: 'MAE LAO',
    coordinates: { longitude: 99.8094, latitude: 19.8639 },
    zoom: 10,
  },
];
const faultLinesTestbed = [
  {
    id: 0,
    fName: 'NOT SELECTED',
    coordinates: { longitude: 100.9925, latitude: 13.7563 },
    zoom: 6,
  },
  {
    id: 2,
    fName: 'MAE CHAN',
    coordinates: { longitude: 99.7994, latitude: 20.1583 },
    zoom: 11,
  },
  {
    id: 5,
    fName: 'MOEI',
    coordinates: { longitude: 98.5865, latitude: 16.961 },
    zoom: 9,
  },
  {
    id: 6,
    fName: 'MAE THA',
    coordinates: { longitude: 99.0587, latitude: 18.8892 },
    zoom: 9,
  },
  {
    id: 10,
    fName: 'PHA YAO',
    coordinates: { longitude: 99.6481, latitude: 19.0255 },
    zoom: 9,
  },
  {
    id: 16,
    fName: 'MAE LAO',
    coordinates: { longitude: 99.8094, latitude: 19.8639 },
    zoom: 10,
  },
];

const resetSelectBoxes = (activeSelect) => {
  if (activeSelect === 'normal') {
    selectedFaultLineTestbed.value = { fName: 'NOT SELECTED' };
    tabOpenTestbed.value = false;
  } else if (activeSelect === 'testbed') {
    selectedFaultLine.value = { fName: 'NOT SELECTED' };
    tabOpen.value = false;
  }
};

const selectFaultLine = async () => {
  resetSelectBoxes('normal');

  const [Graphic] = await loadModules(['esri/Graphic']);
  const selectedFault = faultLines.find(
    (faultLine) => faultLine.fName === selectedFaultLine.value.fName
  );

  const updatedSelectedFaultLine = {
    id: selectedFault.id,
    fName: selectedFault.fName,
    coordinates: selectedFault.coordinates,
  };

  selectedFaultLine.value = updatedSelectedFaultLine;

  console.log('normal');

  if (selectedFault && selectedFault.fName !== 'NOT SELECTED') {
    map.findLayerById('polygonLayer').removeAll();
    map.findLayerById('pointLayer').removeAll();

    mapView.center = [
      selectedFault.coordinates.longitude,
      selectedFault.coordinates.latitude,
    ];

    const pointGraphic = new Graphic({
      geometry: {
        type: 'point',
        longitude: selectedFault.coordinates.longitude,
        latitude: selectedFault.coordinates.latitude,
      },
      symbol: {
        type: 'simple-marker',
        color: [226, 119, 40], // Orange
        outline: {
          color: [255, 255, 255], // White
          width: 1,
        },
      },
    });

    const textSymbol = {
      type: 'text',
      color: [0, 0, 0], // Black
      haloColor: [255, 255, 255], // White
      haloSize: 1,
      text: selectedFault.fName,
      xoffset: 0,
      yoffset: 10, // Offset the label slightly above the point
      font: {
        size: 12,
        weight: 'bold',
      },
    };

    const labelGraphic = new Graphic({
      geometry: {
        type: 'point',
        longitude: selectedFault.coordinates.longitude,
        latitude: selectedFault.coordinates.latitude,
      },
      symbol: textSymbol,
    });

    map.findLayerById('pointLayer').add(pointGraphic);
    map.findLayerById('pointLayer').add(labelGraphic);

    mapView.zoom = selectedFault.zoom;

    const polygonCoords = polygonData.find(
      (item) => item.fName === selectedFault.fName
    )?.area;

    if (polygonCoords) {
      const polygon = {
        type: 'polygon',
        rings: polygonCoords,
      };
      const simpleFillSymbol = {
        type: 'simple-fill',
        color: [200, 200, 200, 0.5],
        outline: {
          color: [255, 0, 0],
          width: 0.5,
        },
      };
      const polygonGraphic = new Graphic({
        geometry: polygon,
        symbol: simpleFillSymbol,
      });
      map.findLayerById('polygonLayer').add(polygonGraphic);
    }

    tabOpen.value = true;
  } else {
    map.findLayerById('polygonLayer').removeAll();
    map.findLayerById('pointLayer').removeAll();

    mapView.center = [100.9925, 13.7563];
    mapView.zoom = 6;

    tabOpen.value = false;
  }
};

const selectFaultLineTestbed = async () => {
  resetSelectBoxes('testbed');

  const [Graphic] = await loadModules(['esri/Graphic']);

  const selectedFaultTestbed = faultLinesTestbed.find(
    (faultLineTestbed) =>
      faultLineTestbed.fName === selectedFaultLineTestbed.value.fName
  );

  const updatedSelectedFaultLineTestbed = {
    id: selectedFaultTestbed.id,
    fName: selectedFaultTestbed.fName,
    coordinates: selectedFaultTestbed.coordinates,
  };

  selectedFaultLineTestbed.value = updatedSelectedFaultLineTestbed;

  console.log('testbed');

  // For Testbed
  if (selectedFaultTestbed && selectedFaultTestbed.fName !== 'NOT SELECTED') {
    map.findLayerById('polygonLayer').removeAll();
    map.findLayerById('pointLayer').removeAll();

    mapView.center = [
      selectedFaultTestbed.coordinates.longitude,
      selectedFaultTestbed.coordinates.latitude,
    ];

    const pointGraphic = new Graphic({
      geometry: {
        type: 'point',
        longitude: selectedFaultTestbed.coordinates.longitude,
        latitude: selectedFaultTestbed.coordinates.latitude,
      },
      symbol: {
        type: 'simple-marker',
        color: [226, 119, 40], // Orange
        outline: {
          color: [255, 255, 255], // White
          width: 1,
        },
      },
    });

    const textSymbol = {
      type: 'text',
      color: [0, 0, 0], // Black
      haloColor: [255, 255, 255], // White
      haloSize: 1,
      text: selectedFaultTestbed.fName,
      xoffset: 0,
      yoffset: 10, // Offset the label slightly above the point
      font: {
        size: 12,
        weight: 'bold',
      },
    };

    const labelGraphic = new Graphic({
      geometry: {
        type: 'point',
        longitude: selectedFaultTestbed.coordinates.longitude,
        latitude: selectedFaultTestbed.coordinates.latitude,
      },
      symbol: textSymbol,
    });

    map.findLayerById('pointLayer').add(pointGraphic);
    map.findLayerById('pointLayer').add(labelGraphic);

    mapView.zoom = selectedFaultTestbed.zoom;

    const polygonCoords = polygonData.find(
      (item) => item.fName === selectedFaultTestbed.fName
    )?.area;

    if (polygonCoords) {
      const polygon = {
        type: 'polygon',
        rings: polygonCoords,
      };
      const simpleFillSymbol = {
        type: 'simple-fill',
        color: [200, 200, 200, 0.5],
        outline: {
          color: [255, 0, 0],
          width: 0.5,
        },
      };
      const polygonGraphic = new Graphic({
        geometry: polygon,
        symbol: simpleFillSymbol,
      });
      map.findLayerById('polygonLayer').add(polygonGraphic);
    }

    tabOpenTestbed.value = true;
  } else {
    map.findLayerById('polygonLayer').removeAll();
    map.findLayerById('pointLayer').removeAll();

    mapView.center = [100.9925, 13.7563];
    mapView.zoom = 6;

    tabOpenTestbed.value = false;
  }
};
</script>
