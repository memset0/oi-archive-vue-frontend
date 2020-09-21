import MuseUI from 'muse-ui';

import config from '../config';

export default {
	props: {
		open: Boolean,
		docked: Boolean,
		home: Boolean
	},
	data() {
		return {
			version: MuseUI.version,
			navConfig: [{
				name: 'Online Judge',
				icon: 'explore',
				children:
					Object.keys(config.oj).map(oj => ({
						name: config.oj[oj].name,
						path: `/problem/${oj}`,
					})),
			}, {
				name: 'Tools',
				icon: '',
				children: [{
					name: 'Search',
					path: '/search'
				}]
			}, {
				name: 'Manage',
				icon: '',
				children: [{
					name: 'Cache Status',
					path: '/cache-status'
				}]
			}, {
				name: 'About Us',
				icon: '',
				children: [{
					name: 'Github (Project Page)',
					link: 'https://github.com/memset0/oi-archive-vue-frontend/',
				}, {
					name: 'Github (Organization Page)',
					link: 'https://github.com/oi-archive/',
				}, {
					name: 'memset0\' Notebook',
					link: 'https://memset0.cn'
				}]
			}],
		};
	},
	computed: {
		locale() {
			return this.$route && this.$route.meta && this.$route.meta.lang;
		},
		path() {
			return this.$route && this.$route.meta && this.$route.meta.path;
		}
	},
	methods: {
		createHeader() {
			return (
				<mu-appbar zDepth={0} color='transparent' class='mu-app-drawer-header'>
					<router-link tag='div' class='mu-appbar-title-text' to='/'>OI Archive<sup>β</sup></router-link>
				</mu-appbar>
			);
		},
		createMenuItem(h, menu, isNested) {
			return (
				<mu-list-item to={menu.path} href={menu.link} value={menu.path} slot={isNested ? 'nested' : 'default'} button nested={menu.children && menu.children.length > 0}>
					<mu-list-item-content>
						<mu-list-item-title style={{ 'font-size': isNested ? '14px' : '16px', 'font-weight': isNested ? '400' : '500' }}>{menu.name}</mu-list-item-title>
					</mu-list-item-content>
					{
						menu.children && menu.children.length > 0 ? <mu-list-item-action>
							<mu-icon class='toggle-icon' size='24' value='keyboard_arrow_down' />
						</mu-list-item-action> : null
					}
					{
						!menu.children && menu.badge ? <mu-list-item-action>
							<mu-badge color='primary' content={menu.badge} />
						</mu-list-item-action> : null
					}
					{
						menu.children && menu.children.map((m) => {
							return this.createMenuItem(h, m, true);
						})
					}
				</mu-list-item>
			);
		},
		createContent(h) {
			const menus = this.navConfig.map(menu => {
				return this.createMenuItem(h, menu);
			});
			return (
				<div class='mu-app-drawer-content'>
					<mu-divider />
					<mu-list dense value={this.path} toggleNested>
						{menus}
					</mu-list>
				</div>
			);
		}
	},
	render(h) {
		return h('mu-drawer', {
			staticClass: 'mu-app-drawer',
			props: {
				open: this.open,
				docked: this.docked,
				zDepth: this.docked ? 0 : 2
			},
			on: { 'update:open': (val) => this.$emit('update:open', val) }
		}, [
			this.createHeader(h),
			this.createContent(h),
		]);
	},
	watch: {
		path() {
			if (!this.docked) this.$emit('update:open', false);
		}
	}
};