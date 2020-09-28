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
          <td>
            <div class="problem-list-operation-group">
              <div
                class="problem-list-operation mu-primary-text-color"
                v-on:click="toggleAccepted(scope.row)"
                :style="style.accepted(scope.row.status)"
              >
                <i class="mu-icon material-icons">{{ icon.accepted(scope.row.status) }}</i>
              </div>
              <div
                class="problem-list-operation mu-primary-text-color"
                v-on:click="toggleFavorite(scope.row)"
                :style="style.favorite(scope.row.status)"
              >
                <i class="mu-icon material-icons">{{ icon.favorite(scope.row.status) }}</i>
              </div>
            </div>
          </td>
        </template>
      </mu-data-table>
    </mu-card>
  </div>
</template>

<script>
import axios from "axios";
import * as colors from "muse-ui/lib/theme/colors";
import config from "../config";
import db from "../utils/database";
import storage from "../utils/LocalStorage";

export default {
  name: "Problem",
  props: {
    list: Array,
    showOJ: Boolean,
  },
  data() {
    const columns = this.showOJ
      ? [
          { title: "OJ", width: 100, name: "oj", align: "right" },
          { title: "ID", width: 120, name: "id", align: "right" },
          { title: "Title", name: "title", align: "left" },
          {
            title: "Operation",
            width: 104,
            name: "operation",
            align: "center",
          },
        ]
      : [
          { title: "ID", width: 120, name: "id", align: "right" },
          { title: "Title", name: "title", align: "left" },
          {
            title: "Operation",
            width: 104,
            name: "operation",
            align: "center",
          },
        ];
    return {
      columns,
      data: [],
      config: { oj: config.oj },
      style: {
        favorite: (status) => (status.favorite ? { color: colors.red } : {}),
        accepted: (status) => (status.accepted ? { color: colors.green } : {}),
      },
      icon: {
        favorite: (status) =>
          status.favorite ? "favorite" : "favorite_border",
        accepted: (status) =>
          status.accepted ? "check_circle" : "check_circle_outline",
      },
    };
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
          for (let problem of res.list) {
            if (problem.id == id) return problem;
          }
          return {};
        });
    },
    queryStatus(oj, id) {
      const status = db.get("problem").queryProblem({ oj, id }).value();
      return {
        accepted: status?.ac ? true : false,
        favorite: status?.fav ? true : false,
      };
    },
    toggleAccepted: function (problem) {
      db.get("problem")
        .updateProblem(problem, {
          ac: !problem.status.accepted,
        })
        .write();
      this.loadStatus();
    },
    toggleFavorite: function (problem) {
      db.get("problem")
        .updateProblem(problem, {
          fav: !problem.status.favorite,
        })
        .write();
      this.loadStatus();
    },
    loadStatus: function () {
      this.data = this.data.map((problem) => {
        problem.status = this.queryStatus(problem.oj, problem.id);
        return problem;
      });
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
      console.log(this.data);
    },
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
      padding: 8px 16px;
      a {
        color: inherit;
        text-decoration: none;
      }
    }
  }
}
.problem-list-operation-group {
  height: 24px;
  text-align: center;
  .problem-list-operation {
    display: inline-block;
    width: 36px;
    height: 24px;
  }
}
</style>