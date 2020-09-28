import marked from 'marked';

export default marked(`

小伙伴你好呀，欢迎来到 [OI Archive<sup>β</sup>](/)，这是一个给 OI 题目存档并提供辅助功能的网站。

该项目是由 Vue 构建的单页面应用，所有数据存储在 Github 等公共存储服务，通过异步请求加载。

### 功能

* 通过 **题目列表** 功能访问题目存档。
* 通过 **搜索** 功能搜索题目标题。
* 通过 **题目集合** 功能管理通过的题目和喜欢的题目。
* 通过 **题单** 功能访问优质题目合集。

### 导航

* 前往 Github 访问我们的组织 [@oi-archive](https://github.com/oi-archive/)。
* 前往 Github 访问当前网站的源代码 [@memset0/oi-archive-vue-frontend](https://github.com/memset0/oi-archive-vue-frontend/)。
* 前往 Github 并通过 Pull Request 或 Issue 的方式贡献题单 [@oi-archive/collection](https://github.com/oi-archive/collection)。
* 前往 Greasy Fork 安装 [OI Archive Helper](https://greasyfork.org/zh-CN/scripts/412143-oi-archive-helper)。

### 版权

如无特殊声明，所有题面版权属于原 Online Judge。  
如果侵犯到您的合法权益，请联系我们，我们将第一时间删除。

`);