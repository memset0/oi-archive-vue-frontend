<template>
  <mu-container>
    <Breadcrumbs :items="breadcrumbs" />
    <LoadingCard :show="!load" />
    <ProblemListViewer :list="list" v-if="load" />
    <mu-flex justify-content="center" style="margin: 32px 0;" v-if="load">
      <mu-pagination raised :total="source_list.length" :current.sync="page" :page-size="perpage"></mu-pagination>
    </mu-flex>
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
  name: "ProblemList",
  data() {
    const { oj } = this.$route.params;
    return {
      oj,
      load: false,
      lastOJ: null,
      breadcrumbs: [],
      list: [],
      source_list: [],
      page: this.$route.query.page || 1,
      perpage: 50,
    };
  },
  components: {
    Breadcrumbs,
    LoadingCard,
    ProblemListViewer,
  },
  methods: {
    updateList() {
      this.list = this.source_list.slice(
        (this.page - 1) * this.perpage,
        this.page * this.perpage
      );
    },
    async fetchData() {
      return (await axios.get(`${config.oj[this.oj].root}/index.json`)).data;
    },
    render: function () {
      const { oj } = this.$route.params;
      if (oj != this.lastOJ) {
        this.load = false;
        this.page = this.$route.query.page || 1;
        this.breadcrumbs = [
          {
            text: "OI Archive",
            path: "/",
            disabled: false,
          },
          {
            text: config.oj[oj].name,
            path: `/problem/${oj}`,
            disabled: true,
          },
        ];
        this.$emit("changePageName", config.oj[oj].name);
        storage
          .cache(`Data::ProblemList::/problem/${oj}`, this.fetchData)
          .then((res) => {
            this.source_list = res.list.map((problem) => ({
              ...problem,
              oj: oj,
            }));
            this.updateList();
            this.load = true;
          });
        this.lastOJ = oj;
      }
    },
  },
  mounted: function () {
    this.render();
  },
  watch: {
    page() {
      if (this.page > 1) {
        this.$router.push({ query: { page: this.page } });
      } else {
        this.$router.push({ query: {} });
      }
      this.updateList();
    },
    $route() {
      this.oj = this.$route.params.oj;
      this.render();
    },
  },
};
</script>