import {
  trace,
} from '@opentelemetry/api'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {
  NodeSDK
} from '@opentelemetry/sdk-node'
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions'
import jaeger from 'jaeger-client'
import _ from 'lodash'
import {
  URL,
} from 'node:url'
import {
  pushMetrics,
} from 'prometheus-remote-write'

export function now() {
  return Math.floor(Date.now() / 1000).toString()
}

export function formatMetrics(metrics) {
  return metrics.map((i) => {
    const {
      metric,
      value,
    } = i

    const labels = _.toPairs(_.omit(metric, '__name__'))
    const fl = labels.map((l) => {
      const key = l[0]
      const value = _.truncate(l[1], {length: 40})
      return `    ${key}="${value}"`
    }).join(',\n')

    return `  ${_.get(metric, '__name__')}{\n${fl}\n  } ${value[1]}`
  }).join('\n')
}

export function collectMetrics(metrics) {
  return metrics.map((i) => {
    const {
      metric,
      value,
    } = i

    const labels = _.omit(metric, '__name__')

    return {
      ...labels,
      name: _.get(metric, '__name__'),
      timestamp: value[0],
      value: value[1],
    }
  })
}

export function createBearerHeaders(
  token: string,
) {
  const bearerAuth = `Bearer ${token}`

  return {
    'Authorization': bearerAuth,
    'Content-Type': 'application/json',
  }
}

export function createBasicHeaders(
  username: string,
  password: string,
) {
  const basicAuth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`

  return {
    'Authorization': basicAuth,
    'Content-Type': 'application/json',
  }
}

export async function getInstance(
  slug: string,
  token: string,
) {
  const url = `https://grafana.com/api/instances/${slug}`

  const response = await fetch(url, {
    headers: createBearerHeaders(token),
    method: 'GET',
  })

  const data = await response.json()

  const instance = {
    loki: {
      id: _.toString(_.get(data, 'hlInstanceId')),
      url: _.get(data, 'hlInstanceUrl'),
    },
    prometheus: {
      id: _.toString(_.get(data, 'hmInstancePromId')),
      url: _.get(data, 'hmInstancePromUrl'),
    },
    tempo: {
      id: _.toString(_.get(data, 'htInstanceId')),
      url: _.get(data, 'htInstanceUrl'),
    },
  }

  return {
    code: _.get(data, 'code'),
    instance,
    message: _.get(data, 'message'),
  }
}

export async function readMetrics(
  username: string,
  password: string,
  url: string,
  query: string = 'up',
) {
  const u = new URL(url)
  u.pathname = `${u.pathname}/query`
  u.searchParams.set('query', query)

  const response = await fetch(u.toString(), {
    headers: createBasicHeaders(username, password),
    method: 'GET',
  })

  const json = await response.json()

  const {
    data,
    error,
    errorType,
    status,
  } = json

  if (status !== 'success') {
    throw new Error(`${errorType}: ${error}`)
  }

  const {
    result,
  } = data

  return result
}

export async function writeMetric(
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

export async function writeLog(
  username: string,
  password: string,
  url: string,
): Promise<void> {
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
    headers: createBasicHeaders(username, password),
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(`${response.statusText} ${response.status}`)
  }
}

export async function writeTrace(
  username: string,
  password: string,
  url: string,
  format = 'otlp',
): Promise<void> {
  if (format === 'otlp') {
    const u = new URL(url)

    if (u.pathname.endsWith('otlp')) {
      u.pathname = `${u.pathname}/v1/traces`
    }

    const traceExporter = new OTLPTraceExporter({
      headers: createBasicHeaders(username, password),
      url: u.toString(),
    })

    const sdk = new NodeSDK({
      resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: 'grot-check',
        [ATTR_SERVICE_VERSION]: '12.13.1989',
      }),
      traceExporter,
    })

    await sdk.start()

    const tracer = trace.getTracer('grot-check', '12.13.1989')
    const span = tracer.startSpan('grot-check')
    span.end()

    return sdk.shutdown()
  }

  if (format === 'jaeger') {
    const jaegerTracer = jaeger.initTracer({
      reporter: {
        collectorEndpoint: url,
      },
      sampler: {
        param: 1,
        type: jaeger.ConstSampler,
      },
      serviceName: 'grot-check',
    }, {
      tags: {
        'service.version': '12.13.1989',
      }
    })

    jaegerTracer.startSpan('grot-check').finish()

    return jaegerTracer.close()
  }

  throw new Error('Unknown format')
}
