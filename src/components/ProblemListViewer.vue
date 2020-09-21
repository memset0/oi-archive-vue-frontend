<template>
  <mu-card>
    <mu-data-table :columns="columns" :data="list" class="problem-list">
      <template slot-scope="scope">
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
export default {
  name: "Problem",
  props: {
    list: Array,
  },
  data() {
    return {
      columns: [
        { title: "ID", width: 120, name: "id", align: "right" },
        { title: "Title", name: "title", align: "left" },
      ],
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