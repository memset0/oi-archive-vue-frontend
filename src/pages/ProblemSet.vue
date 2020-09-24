<template>
  <mu-container>
    <Breadcrumbs :items="breadcrumbs" />
    <ProblemListViewer :list="list" :showOJ="true" />
  </mu-container>
</template>

<script>
import db from "../utils/database";
import Breadcrumbs from "../components/Breadcrumbs";
import ProblemListViewer from "../components/ProblemListViewer";

const typeName = {
  accepted: "Accepted Problems",
  favorite: "Favorite Problems",
};

const typeAbbreviation = {
  accepted: "ac",
  favorite: "fav",
};

export default {
  name: "ProblemSet",
  components: { Breadcrumbs, ProblemListViewer },
  data: function () {
    return {
      breadcrumbs: [],
      list: [],
      type: null,
    };
  },
  methods: {
    loadProblemSet: function () {
      const list = db
        .get("problem")
        .filterProblem(typeAbbreviation[this.type])
        .value();
      this.list = list;
    },
    render: function () {
      const { type } = this.$route.params;
      this.type = type;
      this.$emit("changePageName", typeName[type]);
      this.breadcrumbs = [
        {
          text: "OI Archive",
          path: "/",
          disabled: false,
        },
        {
          text: typeName[type],
          disabled: true,
        },
      ];
      this.loadProblemSet();
    },
  },
  mounted: function () {
    this.render();
  },
  watch: {
    $route: function () {
      this.render();
    },
  },
};
</script>
