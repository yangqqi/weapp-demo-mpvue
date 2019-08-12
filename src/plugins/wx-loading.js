let needLoadingRequestCount = 0

function startLoading() {
  wx.showNavigationBarLoading() // 标题栏加载动画
}

function endLoading() {
  wx.hideNavigationBarLoading() // 标题栏加载动画
  wx.stopPullDownRefresh() // 下拉加载动画
  wx.hideLoading() // 提示框加载动画
}

const tryCloseLoading = () => {
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    _debounce(tryCloseLoading, 300)()
  }
}

// 防抖
function _debounce(fn, interval = 300) {
  let timeout = null
  return function() {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(this, arguments)
    }, interval)
  }
}
