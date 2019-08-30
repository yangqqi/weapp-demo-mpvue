// @storage

// key
export function getPublicKey() {
  return '公钥'
}

const TokenKey = 'Authorization' // 用户 token

// 登录保存授权 token
const keepAuthData = function(token) {
  try {
    wx.setStorageSync(TokenKey, token)
  } catch (e) {
    // Do something when catch error
  }
}

// 退出登录，清除缓存
const removeAuthData = function() {
  try {
    wx.removeStorageSync(TokenKey)
  } catch (e) {
    // Do something when catch error
  }
  //   try {
  //     wx.clearStorageSync()
  //   } catch (e) {
  //     // Do something when catch error
  //   }
}

// 读取授权 token
const getToken = function() {
  try {
    var value = wx.getStorageSync(TokenKey)
    if (value) {
      // Do something with return value
      return value
    }
  } catch (e) {
    // Do something when catch error
  }
}

export default {
  publicKey: () => getPublicKey(),
  token: () => getToken(),
  keepAuthData: token => keepAuthData(token),
  removeAuthData: () => removeAuthData()
}
