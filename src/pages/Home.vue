<template>
  <mu-container>
    <Breadcrumbs :items="breadcrumbs" />
    <mu-row gutter>
      <mu-col span="12" lg="4" md="6" v-for="(_, oj) in oj_list" :key="oj" class="home-item-oj">
        <router-link :to="`/problem/${oj}`">
          <mu-card>
            <mu-ripple>
              <mu-card-header :title="oj_list[oj].name" :sub-title="oj_list[oj].domain">
                <mu-avatar slot="avatar">
                  <img :src="oj_list[oj].favicon" style="background: #fff" />
                </mu-avatar>
              </mu-card-header>
            </mu-ripple>
          </mu-card>
        </router-link>
      </mu-col>
    </mu-row>
  </mu-container>
</template>

<script>
import config from "../config";
import Breadcrumbs from "../components/Breadcrumbs";

export default {
  name: "Home",
  data() {
    return {
      oj_list: config.oj,
      breadcrumbs: [
        {
          text: "OI Archive",
          disabled: true,
        },
      ],
    };
  },
  components: {
    Breadcrumbs,
  },
  mounted: function () {
    this.$emit("changePageName", "Hello, World!");
  },
};
</script>

<style lang="less" scoped>
.mu-card {
  .mu-card-header {
    height: 72px;
    .mu-card-header-title {
      .mu-card-title {
        height: 20px;
        line-height: 20px;
      }
      .mu-card-sub-title {
        height: 20px;
        line-height: 20px;
      }
    }
  }
  margin-bottom: 20px;
}
</style>