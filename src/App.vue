<template>
  <div id="app">
    <app-nav-drawer :open.sync="open" :docked="docked" :home="home" />
    <mu-appbar
      :color="home ? 'transparent' : 'primary'"
      class="mu-appbar-header"
      style="z-index: 101;"
      :class="{'is-open': open && docked, 'is-only-title': docked, 'home-bg': home}"
      :z-depth="home ? 0 : 4"
    >
      <mu-button v-if="!docked" icon slot="left" @click="toggleMenu">
        <mu-icon size="24" value="menu" />
      </mu-button>
      {{ pageName }}
    </mu-appbar>
    <div class="app-content" :class="{'is-open': open && docked }">
      <router-view @changePageName="changePageName" />
      <mu-backtop />
    </div>
  </div>
</template>

<script>
import config from "./config";
import AppNavDrawer from "./components/AppNavDrawer";
import BackToTop from "./components/BackToTop";

function isDesktop() {
  return window.innerWidth > 993;
}
function isMobile() {
  return window.innerWidth < 660;
}

export default {
  name: "App",
  data() {
    return {
      open: isDesktop(),
      docked: isDesktop(),
      isMobile: isMobile(),
      isDesktop: isDesktop(),
      activeMenu: false,
      pageName: "",
      openTheme: false,
      home: false,
      website_title: config.title,
      position: "left",
      collapsed: false,
    };
  },
  components: {
    "app-nav-drawer": AppNavDrawer,
    "mu-backtop": BackToTop,
  },
  methods: {
    changePageName(name) {
      this.pageName = name;
      document.title = `${name} - ${config.title}`;
    },
    toggleMenu() {
      this.open = !this.open;
    },
    updateNavStatus() {
      this.open = isDesktop();
      this.docked = isDesktop();
    },
  },
  mounted() {
    window.addEventListener(
      "hashchange",
      () => {
        const currentPath = window.location.hash.slice(1);
        if (this.$router.path !== currentPath) this.$router.push(currentPath);
      },
      false
    );

    this.updateNavStatus();
    this.handleResize = () => {
      this.updateNavStatus();
      this.isMobile = isMobile();
      this.isDesktop = isDesktop();
    };
    window.addEventListener("resize", this.handleResize);
  },
};
</script>

<style lang="less">
@import "~muse-ui/lib/styles/vars.less";
@import "./utils/markdown.less";
.mu-app-drawer {
  border-right: 1px solid @borderColor;
}
.mu-app-drawer-header {
  .mu-appbar-title {
    line-height: 24px;
    display: flex;
    align-items: flex-start;
    font-size: 24px;
    overflow: visible;
    flex-direction: column;
    color: @secondaryTextColor;
    font-weight: 500;
  }
  .mu-appbar-title-text {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
      color: @primaryColor;
    }
  }
  .mu-app-version {
    line-height: 1;
    font-size: 12px;
    margin-top: 4px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
      color: @primaryColor;
    }
  }
}
.mu-appbar-header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 101;
  overflow: hidden;
  &.is-open {
    left: 256px;
  }
  &.is-only-title {
    .mu-appbar-title {
      margin-left: 16px;
    }
  }
  &.home-bg {
    background-image: linear-gradient(270deg, #8146b4, #6990f6);
  }
}

.app-content {
  margin-top: 64px;
  padding: 20px;
  &.is-open {
    margin-left: 256px;
  }
}

.mu-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 2px !important;
}
</style>