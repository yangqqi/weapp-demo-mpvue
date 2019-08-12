# mp_weapp_demo

基于 mpvue 的微信小程序项目 demo

## 引入扩展组件库 [weui][weui]

1. 引入样式表 `@/plugins/style/weui.wxss`
2. 引入组件到 `/static/weiui`
3. 使用方法参考 [腾讯小程序开放文档](https://developers.weixin.qq.com/miniprogram/dev/extended/weui/quickstart.html)

## 状态与缓存

1. 引入全局 vuex

        import store from './store.js'
        Vue.prototype.$store = store

2. 配置全局缓存 storage

        import storage from './plugins/storage.js'
        Vue.prototype.$storage = storage

## 网络请求

1. npm 引入 fly.js，/build/webpack.base.conf.js 配置别名，具体使用方法参考 [fly.js]

        alias: {
            'vue': 'mpvue',
            '@': resolve('src'),
            flyio: 'flyio/dist/npm/wx',
        },

2. 封装请求方法，配置全局请求拦截与加载动画

## 项目配置

1. 设定项目根据模式变量变化相关配置，参见 `/desc-config`

## 时间格式化

1. npm 引入 dayjs，使用方法参考 [dayjs]


[weui]:https://github.com/wechat-miniprogram/weui-miniprogram
[fly.js]:https://github.com/wendux/fly
[dayjs]:https://github.com/iamkun/dayjs