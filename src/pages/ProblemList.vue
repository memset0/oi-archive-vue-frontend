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
import Breadcrumbs from "../components/Breadcrumbs";
import ProblemListViewer from "../components/ProblemListViewer";

export default {
  name: "ProblemList",
  data() {
    const { oj } = this.$route.params;
    return {
      oj,
      breadcrumbs: [
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
      ],
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
  },
  mounted: function () {
    const { oj } = this.$route.params;
    this.$emit("changePageName", config.oj[oj].name);
    axios.get(`${config.oj[oj].root}/index.json`).then((res) => {
      this.source_list = res.data.list.map((problem) => ({
        ...problem,
        path: `/problem/${oj}/${problem.id}`,
      }));
      this.updateList();
    });
  },
  watch: {
    page() {
      this.updateList();
    },
  },
};
</script>