<template>
  <div>
    <div class="problem-viewer">
      <LoadingCard :show="!problem.load" />
      <div class="problem-title" v-if="problem.load">{{ problem.title }}</div>
      <div class="problem-tags" v-if="problem.load && (problem.time_limit || problem.memory_limit)">
        <mu-badge v-if="problem.time_limit" :content="problem.time_limit + ' ms'"></mu-badge>
        <mu-badge v-if="problem.memory_limit" :content="problem.memory_limit + ' MB'"></mu-badge>
      </div>
      <div class="problem-operation" v-if="problem.load ">
        <mu-button
          target="_blank"
          v-if="problem.operation && problem.operation.submit"
          :href="problem.operation.submit"
          color="primary"
        >submit</mu-button>
        <mu-button
          target="_blank"
          v-if="problem.operation && problem.operation.submissions"
          :href="problem.operation.submissions"
        >submissions</mu-button>
        <mu-button
          target="_blank"
          v-if="problem.operation && problem.operation.statistics"
          :href="problem.operation.statistics"
        >statistics</mu-button>
        <mu-button
          target="_blank"
          v-if="problem.operation && problem.operation.discussion"
          :href="problem.operation.discussion"
        >discussion</mu-button>
        <mu-button
          target="_blank"
          v-if="problem.operation && problem.operation.testdata"
          :href="problem.operation.testdata"
        >testdata</mu-button>
        <a type="button" class="mu-button mu-raised-button status-favorite-button">
          <div
            class="mu-button-wrapper mu-primary-text-color"
            v-on:click="toggleAccepted"
            :style="status.accepted.style"
          >
            <i class="mu-icon material-icons">{{ status.accepted.icon }}</i>
          </div>
          <div
            class="mu-button-wrapper mu-primary-text-color"
            v-on:click="toggleFavorite"
            :style="status.favorite.style"
          >
            <i class="mu-icon material-icons">{{ status.favorite.icon }}</i>
          </div>
        </a>
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
  </div>
</template>

<script>
import copyToClipboard from "copy-to-clipboard";
import * as colors from "muse-ui/lib/theme/colors";
import turndown from "../utils/turndown";
import LoadingCard from "../components/LoadingCard";
import db from "../utils/database";

export default {
  name: "ProblemViewer",
  components: {
    LoadingCard,
  },
  props: {
    problem: Object,
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
        if (section.format == "markdown") {
          content += section.content + "\n\n\n";
        } else if (section.format == "html") {
          console.log(section.content);
          content += turndown(section.content) + "\n\n\n";
        }
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
    getStatus: function () {
      const status = db.get("problem").queryProblem(this.problem).value();
      this.status = {
        accepted: {
          value: status?.ac ? true : false,
          icon: status?.ac ? "check_circle" : "check_circle_outline",
          style: status?.ac ? { color: colors.green } : {},
        },
        favorite: {
          value: status?.fav ? true : false,
          icon: status?.fav ? "favorite" : "favorite_border",
          style: status?.fav ? { color: colors.red } : {},
        },
      };
    },
    toggleAccepted: function () {
      db.get("problem")
        .updateProblem(this.problem, {
          ac: this.status.accepted.value ^ 1,
        })
        .write();
      this.getStatus();
    },
    toggleFavorite: function () {
      db.get("problem")
        .updateProblem(this.problem, {
          fav: this.status.favorite.value ^ 1,
        })
        .write();
      this.getStatus();
    },
  },
  data: function () {
    return {
      exportStatement: {
        titleWeight: 2,
        snackbar: {
          open: false,
          message: "",
          timeout: 3000,
        },
      },
      status: {
        accepted: {
          value: false,
          icon: "check_circle_outline",
          status: {},
        },
        favorite: {
          value: false,
          icon: "favorite_border",
          status: {},
        },
      },
    };
  },
  mounted: function () {
    this.getStatus();
  },
  watch: {
    problem: function () {
      this.getStatus();
    },
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

<style lang="less">
.status-favorite-button {
  width: 72px;
  min-width: 72px;
  .mu-button-wrapper {
    width: 36px;
    display: inline-flex;
  }
}
</style>