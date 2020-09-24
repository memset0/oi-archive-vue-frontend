<template>
  <mu-container>
    <Breadcrumbs :items="breadcrumbs" />
    <mu-card class="cache-status-progress">
      <mu-card-text>
        <mu-flex class="demo-linear-progress">
          <mu-linear-progress mode="determinate" :value="cachePercent"></mu-linear-progress>
        </mu-flex>
      </mu-card-text>
      <mu-card-actions>
        <mu-button color="primary" v-on:click="fetchAll" flat>Fetch All</mu-button>
        <mu-button color="red" v-on:click="cleanCache" flat>Clean Cache</mu-button>
      </mu-card-actions>
    </mu-card>
    <mu-row gutter>
      <mu-col span="12" lg="4" md="6" v-for="(_, oj) in ojList" :key="oj" class="home-item-oj">
        <mu-card>
          <mu-card-header :title="ojList[oj].name" :sub-title="ojList[oj].domain">
            <mu-avatar slot="avatar">
              <img :src="ojList[oj].favicon" style="background: #fff" />
            </mu-avatar>
          </mu-card-header>
          <mu-card-text>
            <div v-if="cacheStatus[oj]">Cache Status: Last fetched at {{ cacheStatus[oj].date }}</div>
            <div v-else>Cache Status: null.</div>
          </mu-card-text>
          <mu-card-actions>
            <mu-button :href="'https://' + ojList[oj].domain" target="_blank" flat>原网站</mu-button>
            <mu-button :href="ojList[oj].root + '/index.json'" target="_blank" flat>数据文件</mu-button>
          </mu-card-actions>
        </mu-card>
      </mu-col>
    </mu-row>
  </mu-container>
</template>

<script>
import axios from "axios";
import config from "../config";
import storage from "../utils/LocalStorage";
import Breadcrumbs from "../components/Breadcrumbs";

export default {
  name: "CacheStatus",
  data() {
    return {
      ojList: config.oj,
      breadcrumbs: [
        {
          text: "OI Archive",
          path: "/",
          disabled: false,
        },
        {
          text: "Cache Status",
          disabled: true,
        },
      ],
      cacheStatus: {},
      cachePercent: 0,
    };
  },
  components: {
    Breadcrumbs,
  },
  methods: {
    getCacheStatus() {
      let res = {};
      for (let oj of Object.keys(config.oj)) {
        let data = storage.getItem(`Cache::Data::ProblemList::/problem/${oj}`);
        if (data) {
          res[oj] = data;
          if (res[oj].date) {
            res[oj].date = new Date(res[oj].date);
          }
        }
      }
      return res;
    },
    async fetchAll() {
      await Promise.all(
        Object.keys(config.oj).map((oj) => {
          return storage.cache(
            `Data::ProblemList::/problem/${oj}`,
            async () => {
              return (await axios.get(`${config.oj[oj].root}/index.json`)).data;
            }
          );
        })
      );
      this.render();
    },
    cleanCache() {
      for (let oj of Object.keys(config.oj)) {
        storage.removeCacheItem(`Data::ProblemList::/problem/${oj}`);
      }
      this.render();
    },
    render: function () {
      this.cacheStatus = this.getCacheStatus();
      let cachedOJ = Object.keys(this.cacheStatus).length;
      let allOJ = Object.keys(this.ojList).length;
      this.cachePercent = Math.ceil((cachedOJ * 100) / allOJ);
    },
  },
  mounted: function () {
    this.$emit("changePageName", "Cache Status");
    this.render();
  },
};
</script>

<style lang="less" scoped>
.mu-card {
  margin-bottom: 20px;
}
</style>