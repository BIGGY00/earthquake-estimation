<template>
  <div :class="['absolute p-4', position]">
    <div class="grid grid-rows">
      <div class="text-bold">{{ label }}</div>
      <select
        class="w-fit p-3 pl-4 pr-10 rounded-lg border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
        :value="selected.fName"
        @change="handleChange"
      >
        <option disabled value="" class="text-sm text-gray-500">
          {{ placeholder }}
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
</template>

<script>
export default {
  props: {
    label: String,
    faultLines: Array,
    selected: Object,
    placeholder: String,
    position: String,
  },
  methods: {
    handleChange(event) {
      this.$emit('update:selected', {
        ...this.selected,
        fName: event.target.value,
      });
    },
  },
};
</script>
