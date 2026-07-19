// 跨端流式请求：小程序用 uni.request(enableChunked) + onChunkReceived，
// H5 用 fetch + ReadableStream。逐行解析 `data:` 行并回调。
// 后端下发格式：每条事件为 `data: {json}\n\n`

export interface StreamHandlers<T = any> {
  onData: (event: T) => void
  onError?: (err: any) => void
  onEnd?: () => void
}

// 解析累积文本中完整的 data: 行，返回剩余未完成的尾部
function parseBuffer<T>(buffer: string, onData: (e: T) => void): string {
  const parts = buffer.split('\n')
  const tail = parts.pop() ?? ''
  for (const raw of parts) {
    const line = raw.trim()
    if (!line.startsWith('data:')) continue
    const payload = line.slice(5).trim()
    if (!payload || payload === '[DONE]') continue
    try { onData(JSON.parse(payload) as T) } catch { /* 忽略半包/心跳 */ }
  }
  return tail
}

export function streamRequest<T = any>(
  path: string,
  handlers: StreamHandlers<T>,
  body?: Record<string, any>,
): { abort: () => void } {
  const baseUrl = __VITE_SERVER_BASEURL__
  const url = baseUrl + path
  const token = uni.getStorageSync('token') || ''
  const header = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json;charset=utf-8',
  }

  // #ifdef H5
  const controller = new AbortController()
  fetch(url, { method: 'POST', headers: header, body: JSON.stringify(body || {}), signal: controller.signal })
    .then(async (res) => {
      if (!res.ok || !res.body) throw new Error(`请求失败 (${res.status})`)
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        buffer = parseBuffer<T>(buffer, handlers.onData)
      }
      handlers.onEnd?.()
    })
    .catch((err) => handlers.onError?.(err))
  return { abort: () => controller.abort() }
  // #endif

  // #ifdef MP-WEIXIN
  let buffer = ''
  const task: any = uni.request({
    url,
    method: 'POST',
    header,
    data: body || {},
    enableChunked: true,
    responseType: 'text',
    success() { handlers.onEnd?.() },
    fail(err: any) { handlers.onError?.(err) },
  } as any)
  const decoder = new TextDecoder()
  task.onChunkReceived((res: any) => {
    const bytes = new Uint8Array(res.data)
    buffer += decoder.decode(bytes, { stream: true })
    buffer = parseBuffer<T>(buffer, handlers.onData)
  })
  return { abort: () => task.abort?.() }
  // #endif
}
