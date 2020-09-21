<template>
  <mu-container>
    <Breadcrumbs :items="breadcrumbs" />
    <ProblemListViewer :list="list" />
    <mu-flex justify-content="center" style="margin: 32px 0;">
      <mu-pagination raised :total="source_list.length" :current.sync="page" :page-size="perpage"></mu-pagination>
    </mu-flex>
  </mu-container>
</template>

<script>
import axios from "axios";

import config from "../config";
import storage from "../utils/LocalStorage";
import Breadcrumbs from "../components/Breadcrumbs";
import ProblemListViewer from "../components/ProblemListViewer";

export default {
  name: "ProblemList",
  data() {
    const { oj } = this.$route.params;
    return {
      oj,
      breadcrumbs: [],
      list: [],
      source_list: [],
      page: 1,
      perpage: 50,
    };
  },
  components: {
    Breadcrumbs,
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
        .cache(`Data::ProblemList::/problem/${oj}`, this.fetchData())
        .then((res) => {
          this.source_list = res.list.map((problem) => ({
            ...problem,
            path: `/problem/${oj}/${problem.id}`,
          }));
          this.updateList();
        });
    },
  },
  mounted: function () {
    this.render();
  },
  watch: {
    page() {
      this.updateList();
    },
    $route() {
      this.oj = this.$route.params.oj;
      this.render();
    },
  },
};
</script>