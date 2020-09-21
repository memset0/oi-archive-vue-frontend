import Vue from 'vue';
import VueRouter from 'vue-router';

import MuseUI from 'muse-ui';
import Loading from 'muse-ui-loading';
import Progress from 'muse-ui-progress';
import theme from 'muse-ui/lib/theme';
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui-loading/dist/muse-ui-loading.css';
import 'muse-ui-progress/dist/muse-ui-progress.css';

Vue.use(VueRouter);
Vue.use(MuseUI);
Vue.use(Loading);
Vue.use(Progress, {
  color: '#6F3381'
});
Vue.config.productionTip = false;

theme.add('oi-archive', {
  primary: '#B481BB',
  secondary: '#B28FCE',
}, 'light');
theme.use('oi-archive');

import FastClick from 'fastclick';
if (navigator && navigator.userAgent.toLowerCase().indexOf('mobile') !== -1) FastClick.attach(document.body);

// === main ===

import App from './App';
import router from './router';

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  Progress.start();
  next();
});

router.afterEach(() => {
  Progress.done();
});

new Vue({
  el: '#app',
  router,
  render: h => h(App),
});