import { boot } from 'quasar/wrappers';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css';
import Image from 'primevue/image';
import Select from 'primevue/select';
import { definePreset } from '@primevue/themes';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
  },
});

export default boot(({ app }) => {
  app.use(PrimeVue, {
    theme: {
      preset: MyPreset,
      options: {
        prefix: 'p',
        darkModeSelector: '.my-app-dark',
        cssLayer: false,
      },
    },
  });

  app.component('UseImage', Image);
  app.component('UseSelect', Select);
});
