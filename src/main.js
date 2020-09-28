import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import MuseUI from 'muse-ui';
import Helpers from 'muse-ui/lib/Helpers';
import 'muse-ui/dist/muse-ui.css';

import theme from 'muse-ui/lib/theme';
theme.add('oi-archive', {
  primary: '#B481BB',
  secondary: '#B28FCE',
}, 'light');
theme.use('oi-archive');

import Loading from 'muse-ui-loading';
import Message from 'muse-ui-message';
import Progress from 'muse-ui-progress';
import 'muse-ui-loading/dist/muse-ui-loading.css';
import 'muse-ui-message/dist/muse-ui-message.css';
import 'muse-ui-progress/dist/muse-ui-progress.css';
Vue.use(MuseUI);
Vue.use(Helpers);
Vue.use(Loading);
Vue.use(Message);
Vue.use(Progress, {
  color: '#6F3381'
});
Vue.config.productionTip = false;

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