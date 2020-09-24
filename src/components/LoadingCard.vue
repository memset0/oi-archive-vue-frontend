<template>
  <div class="problem-loading" v-if="show">
    <mu-card data-mu-loading-color="#B28FCE" v-loading="true"></mu-card>
  </div>
</template>

<script>
export default {
  name: "LoadingCard",
  props: {
    show: Boolean,
  },
};
</script>