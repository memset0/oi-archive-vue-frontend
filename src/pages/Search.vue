<template>
  <div>
    <mu-container>
      <Breadcrumbs :items="breadcrumbs" />
      <mu-card class="search-form">
        <mu-form ref="form" :model="form" label-position="top" label-width="100%">
          <mu-form-item prop="input" label="Search">
            <mu-text-field v-model="form.input"></mu-text-field>
          </mu-form-item>
        </mu-form>
      </mu-card>
      <mu-alert color="error" v-if="missedOJ.length">
        OI Archive
        <sup>β</sup>
        的搜索功能基于前端的
        <router-link to="/cache-status">本地缓存</router-link>。以下 Online Judge 的数据没有被缓存，他们将不会出现在搜索结果中：
        <br />
        {{ missedOJ.map(oj => config.oj[oj].name).join('，') }}。
      </mu-alert>
      <ProblemListViewer :list="list" :showOJ="true" />
      <mu-flex justify-content="center" style="margin: 32px 0;">
        <mu-pagination raised :total="source_list.length" :current.sync="page" :page-size="perpage"></mu-pagination>
      </mu-flex>
    </mu-container>
  </div>
</template>

<script>
import config from "../config";
import storage from "../utils/LocalStorage";
import Breadcrumbs from "../components/Breadcrumbs";
import ProblemListViewer from "../components/ProblemListViewer";

export default {
  name: "ProblemList",
  data() {
    const keyword = decodeURIComponent(this.$route.params.keyword || "");
    return {
      config,
      keyword,
      breadcrumbs: [],
      missedOJ: [],
      source_list: [],
      list: [],
      page: 1,
      perpage: 50,
      lastKeyword: null,
      form: { input: keyword },
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
    render: async function () {
      const keyword = decodeURIComponent(this.$route.params.keyword || "");
      if (keyword == this.lastKeyword) {
        return false;
      }
      if (keyword) {
        const keywordTemp = keyword.toUpperCase();
        let result = [];
        let missedOJ = [];
        for (let oj of Object.keys(config.oj)) {
          let data = storage.getCacheItem(`Data::ProblemList::/problem/${oj}`);
          if (data) {
            for (let problem of data.list) {
              if (problem.title.toUpperCase().indexOf(keywordTemp) != -1) {
                result.push({
                  ...problem,
                  oj,
                  path: `/problem/${oj}/${problem.id}`,
                });
              }
            }
          } else {
            missedOJ.push(oj);
          }
        }
        this.source_list = result;
        this.missedOJ = missedOJ;
        this.updateList();
      } else {
        this.source_list = [];
        this.missedOJ = [];
        this.updateList();
      }
      this.lastKeyword = keyword;
      this.$emit("changePageName", keyword ? `Search: ${keyword}` : "Search");
      this.breadcrumbs = [
        {
          text: "OI Archive",
          path: "/",
          disabled: false,
        },
        {
          text: keyword ? `Search: ${keyword}` : "Search",
          path: keyword ? `/search/${keyword}` : "/search",
          disabled: true,
        },
      ];
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
      const keyword = decodeURIComponent(this.$route.params.keyword || "");
      console.log("[router changed]", keyword);
      this.form.input = keyword;
      this.render();
    },
    "form.input": function () {
      const keyword = this.form.input || "";
      console.log("[form changed]", keyword);
      this.$router.push({ path: `/search/${encodeURIComponent(keyword)}` });
      this.render();
    },
  },
};
</script>

<style lang="less" scoped>
.search-form {
  padding: 20px;
  margin-bottom: 20px;
  .mu-form-item {
    margin-bottom: 0px;
    padding-bottom: 0px;
  }
}
.mu-alert {
  margin-bottom: 20px;
  display: block;
  a {
    color: inherit;
    font-weight: bold;
    text-decoration: underline;
  }
}
</style>