import {
  pushMetrics,
} from 'prometheus-remote-write'

export async function writeMetrics(
  username: string,
  password: string,
  url: string,
): Promise<void> {
  const response = await pushMetrics({
    'grot_check': 1,
  }, {
    auth: {
      password,
      username,
    },
    url,
  })

  if (response.errorMessage) {
    throw new Error(`${response.statusText} ${response.status} ${response.errorMessage}`)
  }
}

export async function writeLogs(
  username: string,
  password: string,
  url: string,
): Promise<void> {
  const basicAuth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
  const headers = {
    'Authorization': basicAuth,
    'Content-Type': 'application/json',
  }

  const body = JSON.stringify({
    streams: [{
      stream: {
        'grot_check': 'true',
      },
      values: [
        [`${Date.now() * 1000 * 1000}`, 'never wield such power, you forget to be polite'],
      ]
    }]
  })

  const response = await fetch(url, {
    body,
    headers,
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(`${response.statusText} ${response.status}`)
  }
}
