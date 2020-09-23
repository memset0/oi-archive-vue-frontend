<template>
  <mu-card>
    <mu-data-table stripe :columns="columns" :data="list" class="problem-list" rowKey>
      <template slot-scope="scope">
        <td v-if="showOJ" class="is-right">
          <a :href="scope.row.link" target="_blank">{{ config.oj[scope.row.oj].name }}</a>
        </td>
        <td class="is-right">
          <a :href="scope.row.link" target="_blank">{{ scope.row.id }}</a>
        </td>
        <td class="is-left">
          <router-link :to="scope.row.path">{{ scope.row.title }}</router-link>
        </td>
      </template>
    </mu-data-table>
  </mu-card>
</template>

<script>
import config from "../config";

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
        ]
      : [
          { title: "ID", width: 120, name: "id", align: "right" },
          { title: "Title", name: "title", align: "left" },
        ];
    return {
      columns,
      config: { oj: config.oj },
    };
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