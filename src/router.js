import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from './pages/Home';
import Problem from './pages/Problem';
import ProblemList from './pages/ProblemList';

const routes = [
	{
		path: '/',
		component: Home,
		name: 'Home',
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
	}
];

export default new VueRouter({
	routes
});