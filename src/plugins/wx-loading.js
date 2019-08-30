let needLoadingRequestCount = 0

function startLoading () {
  mpvue.showNavigationBarLoading() // 标题栏加载动画
}

function endLoading () {
  mpvue.hideNavigationBarLoading() // 标题栏加载动画
  mpvue.stopPullDownRefresh() // 下拉加载动画
  mpvue.hideLoading() // 提示框加载动画
}

const tryCloseLoading = () => {
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

export function showFullScreenLoading () {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    _debounce(tryCloseLoading, 300)()
  }
}

// 防抖
let timeout = null
function _debounce (fn, interval = 300) {
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(this, arguments)
    }, interval)
  }
}
