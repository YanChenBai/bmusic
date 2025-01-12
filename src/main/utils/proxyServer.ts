import { App } from '@tinyhttp/app'
import httpProxy from 'http-proxy'

const UserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'
const Referer = 'https://www.bilibili.com/'

const proxy = httpProxy.createProxyServer({})
export function startProxyServer(port = 5525) {
  const app = new App()

  app.get('/proxy/audio', (req, res) => {
    const url = req.query.url

    if (!url || typeof url !== 'string') {
      res.status(400).send('Invalid URL')
      return
    }

    req.headers.referer = Referer
    req.headers['user-agent'] = UserAgent

    delete req.headers.host

    proxy.web(req, res, {
      target: url,
      changeOrigin: true,
      selfHandleResponse: false,
    }, (error) => {
      console.error('代理过程中出现错误:', error.message)
    })
  })

  app.listen(port)
}
