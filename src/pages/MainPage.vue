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
        v-model="selectedFaultLine"
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
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { loadModules } from 'esri-loader';
import polygonData from 'src/utils/polygon-normal.json';

let map = null;
let mapView = null;
const selectedCoordinates = ref({ longitude: 0, latitude: 0 });
const selectedFaultLine = ref('NOT SELECTED');
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
    coordinates: { longitude: 98.5817, latitude: 8.668 },
    zoom: 8,
  },
  {
    id: 2,
    fName: 'MAE CHAN',
    coordinates: { longitude: 99.8605, latitude: 20.1283 },
    zoom: 11,
  },
  {
    id: 3,
    fName: 'MAE HONG SON',
    coordinates: { longitude: 97.9054, latitude: 18.3842 },
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
    coordinates: { longitude: 98.5975, latitude: 17.0936 },
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
    coordinates: { longitude: 99.9125, latitude: 18.2172 },
    zoom: 9,
  },
  {
    id: 8,
    fName: 'PHETCHABUN',
    coordinates: { longitude: 101.2197, latitude: 16.5139 },
    zoom: 9,
  },
  {
    id: 9,
    fName: 'PUA',
    coordinates: { longitude: 100.8926, latitude: 19.222 },
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
    coordinates: { longitude: 98.8036, latitude: 10.261 },
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
    coordinates: { longitude: 98.765, latitude: 14.5288 },
    zoom: 9,
  },
  {
    id: 14,
    fName: 'UTTARADIT',
    coordinates: { longitude: 100.6312, latitude: 17.7281 },
    zoom: 10,
  },
  {
    id: 15,
    fName: 'WIANG HAENG',
    coordinates: { longitude: 98.7149, latitude: 19.3645 },
    zoom: 9,
  },
  {
    id: 16,
    fName: 'MAE LAO',
    coordinates: { longitude: 99.6268, latitude: 19.7392 },
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

  const ThaifaultLines = new FeatureLayer({
    url: 'https://gisportal.dmr.go.th/arcgis/rest/services/HAZARD/ZONE_ACTIVEFAULT/MapServer',
  });

  const bordeLines = new FeatureLayer({
    url: 'https://services9.arcgis.com/CGSTChWyOjfHFaYa/arcgis/rest/services/Fault_Map__Everyone__WFL1/FeatureServer/3',
  });

  const FaultLines = new FeatureLayer({
    url: 'https://services.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/Active_Faults/FeatureServer',
  });

  map.addMany([ThaifaultLines, bordeLines, FaultLines]);

  const navigationDiv = document.querySelector('.esri-ui-top-left');
  if (navigationDiv) {
    navigationDiv.classList.remove('esri-ui-top-left');
    navigationDiv.classList.add('esri-ui-top-right');
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
    (faultLine) => faultLine.fName === selectedFaultLine.value
  );

  if (selectedFault && selectedFault.fName !== 'NOT SELECTED') {
    map.findLayerById('polygonLayer').removeAll();

    mapView.center = [
      selectedFault.coordinates.longitude,
      selectedFault.coordinates.latitude,
    ];

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
  } else {
    map.findLayerById('polygonLayer').removeAll();

    mapView.center = [100.9925, 13.7563];
    mapView.zoom = 6;
  }
};
</script>
