import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from './pages/Home';
import Search from './pages/Search';
import Problem from './pages/Problem';
import ProblemSet from './pages/ProblemSet';
import CacheStatus from './pages/CacheStatus';
import ProblemList from './pages/ProblemList';

const routes = [
	{
		path: '/',
		component: Home,
		name: 'Home',
	},
	{
		path: '/search',
		component: Search,
		name: 'Search',
	},
	{
		path: '/search/:keyword',
		component: Search,
		name: 'Search',
	},
	{
		path: '/problem/:oj',
		component: ProblemList,
		name: 'ProblemList',
	},
	{
		path: '/problem/:oj/:id',
		component: Problem,
		name: 'Problem',
	},
	{
		path: '/cache-status',
		component: CacheStatus,
		name: 'CacheStatus',
	},
	{
		path: '/set/:type',
		component: ProblemSet,
		name: 'ProblemSet',
	},
];

export default new VueRouter({
	routes
});