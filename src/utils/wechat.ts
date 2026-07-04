import request from '@/utils/request'

const OPENID_STORAGE_KEY = 'wx_openid'

export const getCachedOpenId = (): string => {
  return uni.getStorageSync(OPENID_STORAGE_KEY) || ''
}

export const getWxLoginCode = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof __UNI_PLATFORM__ !== 'undefined' && __UNI_PLATFORM__ !== 'mp-weixin') {
      reject(new Error('Only supported in mp-weixin'))
      return
    }
    if (typeof wx === 'undefined' || typeof wx.login !== 'function') {
      reject(new Error('wx.login is not available'))
      return
    }

    wx.login({
      success(res: { code?: string }) {
        if (!res?.code) {
          reject(new Error('wx.login: empty code'))
          return
        }
        resolve(res.code)
      },
      fail(err: any) {
        reject(err)
      }
    })
  })
}

export const fetchOpenIdByCode = async (code: string): Promise<string> => {
  const res: any = await request({
    url: '/wx/openid',
    method: 'POST',
    data: { code }
  })

  const openid = res?.data?.openid || res?.openid
  if (!openid) throw new Error('Backend did not return openid')
  return openid
}

export const loginAndGetOpenId = async (): Promise<string> => {
  const cached = getCachedOpenId()
  if (cached) return cached

  const code = await getWxLoginCode()
  const openid = await fetchOpenIdByCode(code)
  uni.setStorageSync(OPENID_STORAGE_KEY, openid)
  return openid
}

export const getWxUserProfile = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof __UNI_PLATFORM__ !== 'undefined' && __UNI_PLATFORM__ !== 'mp-weixin') {
      reject(new Error('Only supported in mp-weixin'))
      return
    }
    if (typeof wx === 'undefined' || typeof wx.getUserProfile !== 'function') {
      reject(new Error('wx.getUserProfile is not available'))
      return
    }

    wx.getUserProfile({
      desc: '用于完善会员资料',
      success(res: any) {
        resolve(res)
      },
      fail(err: any) {
        reject(err)
      }
    })
  })
}
