<template>
  <mu-container>
    <Breadcrumbs :items="breadcrumbs" />
    <ProblemViewer @updateProblemData="updateProblemData" />
  </mu-container>
</template>

<script>
import config from "../config";
import ProblemViewer from "../components/ProblemViewer.vue";
import Breadcrumbs from "../components/Breadcrumbs";

export default {
  name: "Problem",
  data() {
    const { oj, id } = this.$route.params;
    return {
      problem: {},
      breadcrumbs: [
        {
          text: "OI Archive",
          path: "/",
          disabled: false,
        },
        {
          text: config.oj[oj].name,
          path: `/problem/${oj}`,
          disabled: false,
        },
        {
          text: id,
          disabled: true,
        },
      ],
    };
  },
  components: {
    ProblemViewer,
    Breadcrumbs,
  },
  methods: {
    updateProblemData(data) {
      if (data) {
        this.problem = data;
      }
    },
  },
  mounted() {
    const { oj, id } = this.$route.params;
    this.$emit(
      "changePageName",
      config.oj[oj].name + (isNaN(id) ? " " : "") + id
    );
  },
  watch: {
    problem() {
      const { oj, id, title } = this.problem;
      if (oj && id && title) {
        this.$emit(
          "changePageName",
          config.oj[oj].name + (isNaN(id) ? " " : "") + id + " " + title
        );
      }
    },
  },
};
</script>