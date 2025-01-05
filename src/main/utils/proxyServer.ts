import { App } from '@tinyhttp/app'
import ky from 'ky'

export function startProxyServer(port = 5525) {
  const app = new App()

  app.get('/proxy/audio', async (req, res) => {
    const url = req.query.url

    try {
      if (!url || typeof url !== 'string') {
        res.status(400).send('Invalid URL')
        return
      }

      // 构造请求选项
      const options: any = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
          'Referer': 'https://www.bilibili.com',
        },
      }

      const response = await ky(url, options)

      // 获取原始响应头
      const headers = response.headers

      // 设置响应头
      res.setHeader('Content-Type', headers.get('content-type') ?? 'audio/mp4')
      res.setHeader('Content-Range', headers.get('content-range')!)
      res.setHeader('Accept-Ranges', 'bytes')
      res.setHeader('Content-Length', headers.get('content-length')!)

      if (!response.body) {
        res.status(500).send('Error fetching audio')
        return
      }

      // 获取可读流并直接pipe到响应
      const reader = response.body.getReader()
      const stream = new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read()
            if (done)
              break
            controller.enqueue(value)
          }
          controller.close()
        },
      })

      stream.pipeTo(new WritableStream({
        write(chunk) {
          res.write(chunk)
        },
        close() {
          res.end()
        },
      }))
        .catch(() => {
          console.error('Stream error')
          if (!res.headersSent) {
            res.status(500).send('Streaming error')
          }
        })
    }
    catch {
      console.error('Error (await header)')
      if (!res.headersSent) {
        res.status(500).send('Error fetching audio')
      }
    }
  })

  app.listen(port)
}
