<template>
  <mu-container>
    <Breadcrumbs :items="breadcrumbs" />
    <div class="problem-set-panel" v-if="type == 'accepted'">
      <mu-button color="primary" v-on:click="importFromOIAH">从 OI Archive Helper 中导入</mu-button>
    </div>
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
    importFromOIAH: function () {
      if (!window.oiah) {
        this.$alert(
          "请安装 OI Archive Helper 后使用此功能。\n如果已经安装，请检查是否启用并刷新本页面。",
          "提示"
        );
        return;
      } else {
        const loading = this.$loading({});
        window.oiah.load().forEach((problem) => {
          db.get("problem")
            .updateProblem(problem, {
              ac: true,
            })
            .write();
        });
        loading.close();
      }
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

<style lang="less">
.problem-set-panel {
  margin-bottom: 20px;
}
</style>