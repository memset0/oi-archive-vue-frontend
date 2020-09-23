<template>
  <mu-container>
    <div class="problem-viewer">
      <div class="problem-loading" v-if="!problem.load">
        <mu-card data-mu-loading-color="#B28FCE" v-loading="true"></mu-card>
      </div>
      <div class="problem-title" v-if="problem.load">{{ problem.title }}</div>
      <div class="problem-tags" v-if="problem.load && (problem.time_limit || problem.memory_limit)">
        <mu-badge v-if="problem.time_limit" :content="problem.time_limit + ' ms'"></mu-badge>
        <mu-badge v-if="problem.memory_limit" :content="problem.memory_limit + ' MB'"></mu-badge>
      </div>
      <div class="problem-operation" v-if="problem.load && problem.operation">
        <mu-button
          target="_blank"
          v-if="problem.operation.submit"
          :href="problem.operation.submit"
          color="primary"
        >submit</mu-button>
        <mu-button
          target="_blank"
          v-if="problem.operation.submissions"
          :href="problem.operation.submissions"
        >submissions</mu-button>
        <mu-button
          target="_blank"
          v-if="problem.operation.statistics"
          :href="problem.operation.statistics"
        >statistics</mu-button>
        <mu-button
          target="_blank"
          v-if="problem.operation.discussion"
          :href="problem.operation.discussion"
        >discussion</mu-button>
        <mu-button
          target="_blank"
          v-if="problem.operation.testdata"
          :href="problem.operation.testdata"
        >testdata</mu-button>
      </div>
      <div class="divider" style="height: 12px;"></div>
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
    <mu-expansion-panel :zDepth="1" v-if="problem.load">
      <div slot="header">导出题面</div>导出题面以在其他场合使用。（正在开发中...）
      <br />紧急上线了，因为小懒虫 jerome_wei 急着用。
      <mu-button slot="action" color="primary" v-on:click="copyStatement" flat>export</mu-button>
      <mu-snackbar color="success" :open.sync="exportStatement.snackbar.open">
        <mu-icon left value="check_circle"></mu-icon>
        {{ exportStatement.snackbar.message }}
        <mu-button
          flat
          slot="action"
          color="#fff"
          @click="exportStatement.snackbar.open = false"
        >Close</mu-button>
      </mu-snackbar>
    </mu-expansion-panel>
  </mu-container>
</template>

<script>
import axios from "axios";
import lodash from "lodash";
import copyToClipboard from "copy-to-clipboard";
import markdown from "../utils/markdown";
import katex from "../utils/katex";

import config from "../config";

export default {
  name: "ProblemViewer",
  data: function () {
    const { oj, id } = this.$route.params;
    return {
      problem: {
        load: false, // debug: disable loading components
        oj,
        id,
        statement: [],
      },
      exportStatement: {
        titleWeight: 2,
        snackbar: {
          open: false,
          message: "",
          timeout: 3000,
        },
      },
    };
  },
  methods: {
    copyStatement: function () {
      let content = "";
      let prefix = "";
      for (let i = 0; i < this.exportStatement.titleWeight; i++) {
        prefix += "#";
      }
      for (let section of this.problem.source_statement) {
        content += prefix + " " + section.title + "\n\n";
        content += section.content + "\n\n";
      }
      this.exportStatement.snackbar.message = "成功复制到剪贴板！";
      if (this.exportStatement.snackbar.timer) {
        clearTimeout(this.exportStatement.snackbar.timer);
      }
      this.exportStatement.snackbar.open = true;
      this.exportStatement.snackbar.timer = setTimeout(() => {
        this.exportStatement.snackbar.open = false;
      }, this.exportStatement.snackbar.timeout);
      copyToClipboard(content);
    },
  },
  mounted: function () {
    const { oj, id } = this.$route.params;
    axios.get(`${config.oj[oj].root}/problem/${id}.json`).then((res) => {
      this.problem = {
        ...this.problem,
        ...res.data,
      };
      this.$emit("updateProblemData", this.problem);
      this.problem.source_statement = lodash.cloneDeep(this.problem.statement);
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
      this.problem.load = true;
    });
  },
};
</script>

<style lang="less">
.problem-loading {
  width: 100%;
  height: 400px;
  .mu-card {
    width: 100%;
    height: 100%;
  }
}

.problem-title {
  font-size: 28px;
  line-height: 28px;
  width: 100%;
  text-align: center;
  padding: 0 32px;
  margin-top: 24px;
  margin-bottom: 16px;
}

.problem-tags {
  margin: auto;
  padding: 0 32px;
  text-align: center;
  margin-bottom: 16px;
  .mu-badge {
    margin: 0 4px;
  }
}

.problem-operation {
  margin-bottom: 24px;
  text-align: center;
  .mu-button {
    margin: 0 4px;
  }
}

.problem-section {
  margin-bottom: 24px;
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