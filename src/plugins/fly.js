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

// 防抖
let reqTimer = null
function _debounce(fn, delay = 300, param) {
  // 取消之前的延时调用
  clearTimeout(reqTimer)
  reqTimer = setTimeout(() => {
    fn(param)
  }, delay)
}

// 打印错误
function showErrTip(tip) {
  console.log(1)
  wx.showModal({
    title: '提示',
    content: tip,
    showCancel: false,
    complete(res) {}
  })
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
    console.error(error)
    let tip = error.message ? error.message : '网络请求失败'
    _debounce(showErrTip, 300, tip)
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
      let res = response.data
      console.error(res)

      if (res.errorCode && ERROR_CODE.indexOf(res.errorCode) >= 0) {
        // 请求成功，授权失效
        // token 失效；清空 token，返回登录页
        storage.removeAuthData()
        _debounce(showErrTip, 300, res.msg)
      } else {
        // 请求成功，响应失败
        _debounce(showErrTip, 300, res.toString())
      }
    }

    return response.data
  },
  error => {
    tryHideFullScreenLoading()

    // 请求失败
    console.error(error)
    if (error.status === 401) {
      // token 失效；清空 token，返回登录页
      storage.removeAuthData()
      _debounce(showErrTip, 300, '登录失效')
    } else {
      let tip = error.response.data.message ? error.response.data.message : '网络请求错误'
      _debounce(showErrTip, 300, tip)
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
