<template>
  <div>
    <div id="mapDiv" class="absolute p-0 m-0 h-screen w-full"></div>
    <div class="relative z-1">
      <label for="faultLine">Select Fault Line:</label>
      <select v-model="selectedFaultLine" @change="selectFaultLine">
        <option
          v-for="faultLine in faultLines"
          :value="faultLine.fName"
          :key="faultLine.fName"
        >
          {{ faultLine.fName }}
        </option>
      </select>
    </div>
    <div
      class="absolute bottom-7 right-20 z-10 text-white bg-black p-1 rounded-md"
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
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { loadModules } from 'esri-loader';

let map = null;
let mapView = null;
const selectedCoordinates = ref({ longitude: 0, latitude: 0 });
const selectedFaultLine = ref(null);
const faultLines = [
  {
    fName: 'KHLONG MARUI',
    coordinates: { longitude: 100.0, latitude: 20.1 },
    zoom: 8,
  },
  {
    fName: 'MAE CHAN',
  },
];

onMounted(async () => {
  const [esriConfig, Map, MapView, FeatureLayer] = await loadModules([
    'esri/config',
    'esri/Map',
    'esri/views/MapView',
    'esri/layers/FeatureLayer',
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

  const faultLines = new FeatureLayer({
    url: 'https://gisportal.dmr.go.th/arcgis/rest/services/HAZARD/ZONE_ACTIVEFAULT/MapServer',
  });

  const bordeLines = new FeatureLayer({
    url: 'https://services9.arcgis.com/CGSTChWyOjfHFaYa/arcgis/rest/services/Fault_Map__Everyone__WFL1/FeatureServer/3',
  });

  map.addMany([faultLines, bordeLines]);

  const navigationDiv = document.querySelector('.esri-ui-top-left');
  if (navigationDiv) {
    navigationDiv.classList.remove('esri-ui-top-left');
    navigationDiv.classList.add('esri-ui-bottom-right');
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

const selectFaultLine = () => {
  const selectedFault = faultLines.find(
    (faultLine) => faultLine.fName === selectedFaultLine.value
  );
  if (selectedFault && selectedFault.coordinates) {
    mapView.center = [
      selectedFault.coordinates.longitude,
      selectedFault.coordinates.latitude,
    ];
    mapView.zoom = selectedFault.zoom;
  }
};
</script>
