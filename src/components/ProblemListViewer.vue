<template>
  <div>
    <mu-card>
      <mu-data-table stripe :columns="columns" :data="data" class="problem-list" rowKey>
        <template slot-scope="scope">
          <td v-if="showOJ" class="is-right">{{ scope.row.ojName }}</td>
          <td class="is-right">
            <a :href="scope.row.link" target="_blank">{{ scope.row.id }}</a>
          </td>
          <td class="is-left">
            <router-link :to="scope.row.path">{{ scope.row.title }}</router-link>
          </td>
        </template>
      </mu-data-table>
    </mu-card>
  </div>
</template>

<script>
import axios from "axios";
import config from "../config";
import db from "../utils/database";
import storage from "../utils/LocalStorage";

export default {
  name: "Problem",
  props: {
    list: Array,
    showOJ: Boolean,
  },
  methods: {
    async queryProblem(oj, id) {
      return await storage
        .cache(
          `Data::ProblemList::/problem/${oj}`,
          async () => {
            return (await axios.get(`${config.oj[oj].root}/index.json`)).data;
          },
          false
        )
        .then((res) => {
          console.log(res);
          for (let problem of res.list) {
            if (problem.id == id) return problem;
          }
          return {};
        });
    },
    queryStatus(oj, id) {
      return db.get("problem").queryProblem({ oj, id }).value();
    },
    loadData: async function () {
      const data = [];
      for (let problem of this.list) {
        if (problem.oj) {
          if (!problem.ojName) {
            problem.ojName = config.oj[problem.oj].name;
          }
        }
        if (problem.oj && problem.id) {
          if (!problem.path) {
            problem.path = `/problem/${problem.oj}/${problem.id}`;
          }
          if (!problem.status) {
            problem.status = this.queryStatus(problem.oj, problem.id);
          }
          if (!problem.title || !problem.link) {
            problem = {
              ...problem,
              ...(await this.queryProblem(problem.oj, problem.id)),
            };
          }
        }
        data.push(problem);
      }
      this.data = data;
    },
  },
  data() {
    const columns = this.showOJ
      ? [
          { title: "OJ", width: 100, name: "oj", align: "right" },
          { title: "ID", width: 120, name: "id", align: "right" },
          { title: "Title", name: "title", align: "left" },
        ]
      : [
          { title: "ID", width: 120, name: "id", align: "right" },
          { title: "Title", name: "title", align: "left" },
        ];
    return {
      columns,
      data: [],
      config: { oj: config.oj },
    };
  },
  mounted: function () {
    this.loadData();
  },
  watch: {
    list: function () {
      this.loadData();
    },
  },
};
</script>

<style lang="less">
.problem-list.mu-table {
  tr {
    height: 36px;
    min-height: 36px;
    td {
      padding: 8px 24px;
      a {
        color: inherit;
        text-decoration: none;
      }
    }
  }
}
</style>