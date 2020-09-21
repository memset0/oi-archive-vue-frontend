<template>
  <mu-container
    data-mu-loading-color="secondary"
    data-mu-loading-overlay-color="rgba(0, 0, 0, .7)"
    v-loading="problem.loading"
  >
    <div class="problem-viewer">
      <div class="problem-title">{{ problem.title }}</div>
      <!-- <div class="problem-tags">
      <mu-chip class="problem-tag" v-if="problem.time_limit">{{ problem.time_limit }} ms</mu-chip>
      <mu-chip class="problem-tag" v-if="problem.memory_limit">{{ problem.memory_limit }} ms</mu-chip>
      </div>-->
      <div class="problem-section" v-for="(_, i) in problem.statement" :key="i">
        <mu-card>
          <mu-card-title class="problem-section-title" :title="problem.statement[i].title"></mu-card-title>
          <mu-card-text
            class="problem-section-content markdown"
            v-html="problem.statement[i].content"
          ></mu-card-text>
        </mu-card>
      </div>
    </div>
  </mu-container>
</template>

<script>
import axios from "axios";
import markdown from "../utils/markdown";
import katex from "../utils/katex";

import config from "../config";

export default {
  name: "ProblemViewer",
  data: function () {
    const { oj, id } = this.$route.params;
    return {
      problem: {
        loading: false, // debug: disable loading components
        oj,
        id,
        statement: [],
      },
    };
  },
  mounted: function () {
    const { oj, id } = this.$route.params;
    axios.get(`${config.oj[oj].root}/problem/${id}.json`).then((res) => {
      this.problem = {
        ...this.problem,
        ...res.data,
      };
      this.$emit("updateProblemData", this.problem);
      this.problem.statement = this.problem.statement.map((section) => {
        if (section.format == "markdown") {
          section.content = markdown(section.content);
        }
        if (section.require?.includes("katex")) {
          section.content = katex(section.content);
        }
        return section;
      });
      this.problem.loading = false;
    });
  },
};
</script>

<style lang="less">
.problem-title {
  font-size: 28px;
  line-height: 28px;
  width: 100%;
  text-align: center;
  padding: 24px 32px;
  margin-bottom: 24px;
}

.problem-tags {
  margin: auto;
}

.problem-section {
  margin-bottom: 32px;
  .mu-card {
    padding: 4px 0;
  }
  .problem-section-title {
    padding: 0;
    margin: 16px;
    .mu-card-title {
      font-size: 20px;
    }
  }
  .problem-section-content {
    padding: 0;
    margin: 16px;
    font-size: 15px;
  }
}
</style>