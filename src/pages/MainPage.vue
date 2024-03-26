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
    coordinates: { longitude: 98.5817, latitude: 8.668 },
    zoom: 10,
  },
  {
    fName: 'MAE CHAN',
    coordinates: { longitude: 99.8605, latitude: 20.1283 },
    zoom: 12,
  },
  {
    fName: 'MAE HONG SON',
    coordinates: { longitude: 97.9054, latitude: 18.3842 },
    zoom: 10,
  },
  {
    fName: 'MAE ING',
    coordinates: { longitude: 100.4294, latitude: 19.9856 },
    zoom: 11,
  },
  {
    fName: 'MOEI',
    coordinates: { longitude: 98.5975, latitude: 17.0936 },
    zoom: 10,
  },
  {
    fName: 'MAE THA',
    coordinates: { longitude: 99.0587, latitude: 18.8892 },
    zoom: 10,
  },
  {
    fName: 'THOEN',
    coordinates: { longitude: 99.9125, latitude: 18.2172 },
    zoom: 10,
  },
  {
    fName: 'PHETCHABUN',
    coordinates: { longitude: 101.2197, latitude: 16.5139 },
    zoom: 10,
  },
  {
    fName: 'PUA',
    coordinates: { longitude: 100.8926, latitude: 19.222 },
    zoom: 11,
  },
  {
    fName: 'PHA YAO',
    coordinates: { longitude: 99.6481, latitude: 19.0255 },
    zoom: 10,
  },
  {
    fName: 'RANONG',
    coordinates: { longitude: 98.8036, latitude: 10.261 },
    zoom: 9,
  },
  {
    fName: 'SI SAWAT',
    coordinates: { longitude: 98.9748, latitude: 15.2919 },
    zoom: 10,
  },
  {
    fName: 'THREE PAGODA',
    coordinates: { longitude: 98.765, latitude: 14.5288 },
    zoom: 10,
  },
  {
    fName: 'UTTARADIT',
    coordinates: { longitude: 100.6312, latitude: 17.7281 },
    zoom: 11,
  },
  {
    fName: 'WIANG HAENG',
    coordinates: { longitude: 98.7149, latitude: 19.3645 },
    zoom: 10,
  },
  {
    fName: 'MAE LAO',
    coordinates: { longitude: 99.6268, latitude: 19.7392 },
    zoom: 11,
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
