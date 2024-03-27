<template>
  <div>
    <div id="mapDiv" class="absolute p-0 m-0 h-screen w-full m-auto"></div>
    <div class="relative z-1 p-5">
      <!-- <label for="faultLine">Select Fault Line:</label> -->
      <div disabled class="text-bold text-[14px] text-black">
        Select Fault Lines
      </div>
      <select
        class="rounded-lg h-auto w-auto p-2 border border-2 cursor-pointer"
        v-model="selectedFaultLine.fName"
        @change="selectFaultLine"
        placeholder="Select Fault Lines"
      >
        <option disabled class="text-bold text-[14px] text-black">
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
    <div class="relative z-1 pl-5">
      <button
        v-if="selectedFaultLine.id !== 0"
        @click="toggleDialog"
        class="h-auto w-auto bg-white p-2 rounded-lg hover:bg-black text-black hover:text-white transition-colors duration-300"
      >
        {{ isDialogOpen ? 'Close Dialog' : 'Open Dialog' }}
      </button>
    </div>
    <div
      class="absolute bottom-7 right-4 z-10 text-white bg-black p-1 rounded-md"
    >
      <p>
        {{
          'LON ' +
          selectedCoordinates.longitude +
          ' LAT ' +
          selectedCoordinates.latitude
        }}
      </p>
    </div>
  </div>

  <!-- <q-dialog v-model="isDialogOpen">
    <dialogDetail :selectedFault="selectedFaultLine" />
  </q-dialog> -->

  <div class="flex justify-center items-center h-screen">
    <q-dialog
      v-model="isDialogOpen"
      class="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4"
    >
      <dialogDetail :selectedFault="selectedFaultLine" />
    </q-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { loadModules } from 'esri-loader';
import polygonData from 'src/utils/polygon-normal.json';
import dialogDetail from 'src/components/DialogDetail.vue';

let map = null;
let mapView = null;
const selectedCoordinates = ref({ longitude: 0, latitude: 0 });
const selectedFaultLine = ref({ id: 0, fName: 'NOT SELECTED' });
const isDialogOpen = ref(false);
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

const selectFaultLine = async () => {
  const [Graphic] = await loadModules(['esri/Graphic']);
  const selectedFault = faultLines.find(
    (faultLine) => faultLine.fName === selectedFaultLine.value.fName
  );

  selectedFaultLine.value.id = selectedFault.id;
  selectedFaultLine.value.fName = selectedFault.fName;

  // console.log(selectedFaultLine.value);

  if (selectedFault && selectedFault.fName !== 'NOT SELECTED') {
    selectedFaultLine.value.id = selectedFault.id;
    selectedFaultLine.value.fName = selectedFault.fName;
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

    isDialogOpen.value = true;
  } else {
    map.findLayerById('polygonLayer').removeAll();
    map.findLayerById('pointLayer').removeAll();

    mapView.center = [100.9925, 13.7563];
    mapView.zoom = 6;

    isDialogOpen.value = false;
  }
};

const toggleDialog = () => {
  isDialogOpen.value = !isDialogOpen.value;
};
</script>
