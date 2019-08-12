import { showFullScreenLoading, tryHideFullScreenLoading } from './wx-loading.js'
import storage from './storage.js'
import Fly from 'flyio'
const Service = new Fly()

const dvscConfig = require('../../desc-config/index.js')

// token 失效
const ERROR_CODE = ['50001', '50002', '50003', '50004', '50009']

// 配置
Service.config.baseURL = dvscConfig.apiUrl ? dvscConfig.apiUrl : 'requestUrl'
Service.config.headers = {
  'Content-Type': 'application/json;charset=UTF-8'
}

// 添加请求拦截器
Service.interceptors.request.use(
  request => {
    // 给所有请求添加自定义header
    if (storage.token()) {
      request.headers['Authorization'] = storage.token()
    }

    if (request.showLoading) {
      showFullScreenLoading()
    }
    return request
  },
  error => {
    wx.showToast({
      title: error.message ? error.message : '网络请求失败',
      icon: 'none',
      duration: 2000
    })
    return Promise.reject(error)
  }
)

// 添加返回拦截器
Service.interceptors.response.use(
  response => {
    if (response.request.showLoading) {
      tryHideFullScreenLoading()
    }

    if (response.status === 200 && response.data.code !== 0) {
      // 请求成功，授权失效
      let res = response.data
      if (res.errorCode && ERROR_CODE.indexOf(res.errorCode) >= 0) {
        // token 失效；清空 token，返回登录页
        storage.removeAuthData()
        wx.navigateTo({ url: '/pages/index/main' })
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }

    return response.data
  },
  error => {
    tryHideFullScreenLoading()

    if (error.status === 401) {
      // 请求失败
      // token 失效；清空 token，返回登录页
      storage.removeAuthData()
      wx.navigateTo({ url: '/pages/index/main' })
      wx.showToast({
        title: '登录失效',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showToast({
        title: error.message ? error.message : '网络请求错误',
        icon: 'none',
        duration: 2000
      })
    }
    return error
  }
)

const defaultConfig = { showLoading: true }

export default {
  // 封装基础请求 loading
  get: (url, data, config) =>
    Service.request(url, data, {
      ...defaultConfig,
      ...{ method: 'get' },
      ...config
    }),
  post: (url, data, config) =>
    Service.request(url, data, {
      ...defaultConfig,
      ...{ method: 'post' },
      ...config
    }),
  request: (url, data, config) => Service.request(url, data, { ...defaultConfig, ...config }),
  put: (url, data, config) => Service.put(url, data, { ...defaultConfig, ...config }),
  patch: (url, data, config) => Service.patch(url, data, { ...defaultConfig, ...config }),
  delete: (url, config) => Service.delete(url, { ...defaultConfig, ...config }),

  // 二次封装
  Service: Service
}
