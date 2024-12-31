import ky from 'ky'

export const request = ky.create({
  prefixUrl: 'https://api.bilibili.com',
})
