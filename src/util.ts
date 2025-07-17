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
import {
  URL,
} from 'node:url'
import {
  pushMetrics,
} from 'prometheus-remote-write'

export function createHeaders(username, password) {
  const basicAuth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`

  return {
    'Authorization': basicAuth,
    'Content-Type': 'application/json',
  }
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
    headers: createHeaders(username, password),
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
      headers: createHeaders(username, password),
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
