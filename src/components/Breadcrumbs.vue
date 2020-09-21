<template>
  <mu-breadcrumbs>
    <mu-breadcrumbs-item v-for="item in items" :key="item.text" :disabled="item.disabled">
      <router-link v-if="!item.disabled" :to="item.path">{{ item.text }}</router-link>
      <span v-if="item.disabled">{{ item.text }}</span>
    </mu-breadcrumbs-item>
  </mu-breadcrumbs>
</template>

<script>
export default {
  name: "Breadcrumbs",
  props: {
    items: Array,
  },
};
</script>