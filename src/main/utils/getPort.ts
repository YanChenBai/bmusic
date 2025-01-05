import get from 'get-port'

let ip: number
export async function getPort() {
  if (ip !== undefined)
    return ip

  ip = ip = await get({ port: 5530 })

  return ip
}
