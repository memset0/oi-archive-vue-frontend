<template>
  <mu-container>
    <Breadcrumbs :items="breadcrumbs" />
    <LoadingCard :show="!load" />
    <ProblemListViewer :list="list" v-if="load" :showOJ="true" />
  </mu-container>
</template>

<script>
import axios from "axios";
import config from "../config";
import storage from "../utils/LocalStorage";
import Breadcrumbs from "../components/Breadcrumbs";
import LoadingCard from "../components/LoadingCard";
import ProblemListViewer from "../components/ProblemListViewer";

export default {
  name: "Collection",
  data: function () {
    return {
      breadcrumbs: [
        {
          text: "OI Archive",
          path: "/",
          disabled: false,
        },
      ],
      dir: this.getDir(),
      url: this.getUrl(),
      load: false,
      list: [],
    };
  },
  components: {
    Breadcrumbs,
    LoadingCard,
    ProblemListViewer,
  },
  methods: {
    getDir: function () {
      let dir = this.$route.params[0];
      if (!dir.startsWith("/")) dir = "/" + dir;
      if (dir.endsWith("/")) dir = dir.slice(0, -1);
      return dir;
    },
    getUrl: function (dir = null) {
      if (!dir) {
        dir = this.getDir();
      }
      return config.collection.root + dir + ".json";
    },
    fetchData: async function () {
      let data = (await axios.get(this.url)).data;
      return data;
    },
    render: function () {
      this.load = false;
      this.dir = this.getDir();
      this.url = this.getUrl();
      storage
        .cache(`Data::Collection::${this.dir}`, this.fetchData)
        .then((data) => {
          this.data = data;
          this.breadcrumbs = [
            {
              text: "OI Archive",
              path: "/",
              disabled: false,
            },
            {
              text: this.data.title,
              disabled: true,
            },
          ];
          this.list = this.data.problem;
          this.$emit("changePageName", this.data.title);
          console.log(data);
          this.load = true;
        });
    },
  },
  mounted: function () {
    this.render();
  },
  watch: {
    $route() {
      this.render();
    },
  },
};
</script>