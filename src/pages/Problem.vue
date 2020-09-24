<template>
  <mu-container>
    <Breadcrumbs :items="breadcrumbs" />
    <ProblemViewer :problem="problem" />
  </mu-container>
</template>

<script>
import axios from "axios";
import lodash from "lodash";
import markdown from "../utils/markdown";
import katex from "../utils/katex";
import config from "../config";
import ProblemViewer from "../components/ProblemViewer.vue";
import Breadcrumbs from "../components/Breadcrumbs";

export default {
  name: "Problem",
  data() {
    const { oj, id } = this.$route.params;
    return {
      problem: {
        load: false,
        oj,
        id,
        statement: [],
      },
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
    render() {
      const { oj, id } = this.$route.params;
      this.$emit(
        "changePageName",
        `${config.oj[oj].name}${isNaN(id) ? " " : ""}${id}`
      );
      axios.get(`${config.oj[oj].root}/problem/${id}.json`).then((res) => {
        this.problem = {
          ...this.problem,
          ...res.data,
        };
        this.$emit("updateProblemData", this.problem);
        this.problem.source_statement = lodash.cloneDeep(
          this.problem.statement
        );
        this.problem.statement = this.problem.statement.map((section) => {
          if (section.format == "markdown") {
            section.content = markdown(section.content);
          }
          if (section.require?.includes("katex")) {
            section.content = katex(section.content);
          }
          return section;
        });
        console.log(this.problem);
        const { title } = this.problem;
        this.$emit(
          "changePageName",
          `${config.oj[oj].name}${isNaN(id) ? " " : ""}${id} ${title}`
        );
        this.problem.load = true;
      });
    },
  },
  mounted() {
    this.render();
  },
  watch: {
    $route() {
      this.oj = this.$route.params.oj;
      this.id = this.$route.params.id;
      this.render();
    },
  },
};
</script>