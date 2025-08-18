/* eslint-disable perfectionist/sort-objects */
/* eslint-disable perfectionist/sort-switch-case */

import {
  convert
} from '@catalystic/json-to-yaml'

export function generate(
  instance,
  writeToken,
) {
  const values = structuredClone(template)

  for (const destination of values.destinations) {
    const {
      type,
    } = destination

    const info = instance[destination.type]

    let {
      url
    } = info

    switch (type) {
      case 'prometheus': {
        url = `${url}/api/prom/push`
        break
      }

      case 'loki': {
        url = `${url}/loki/api/v1/push`
        break
      }

      case 'otlp': {
        url = `${url}/otlp`
        break
      }
    }

    destination.url = url
    destination.auth.username = info.id
    destination.auth.password = writeToken
  }

  return convert(values)
}

export const template = {
  cluster: {
    name: 'grot-academy'
  },
  'alloy-metrics': {
    enabled: true
  },
  'alloy-logs': {
    enabled: true
  },
  'alloy-singleton': {
    'enabled': true
  },
  'alloy-receiver': {
    'enabled': true
  },
  'clusterMetrics': {
    'enabled': true
  },
  'clusterEvents': {
    'enabled': true
  },
  'annotationAutodiscovery': {
    'enabled': true
  },
  'podLogs': {
    'enabled': true
  },
  'nodeLogs': {
    'enabled': true
  },
  'applicationObservability': {
    'enabled': true,
    'receivers': {
      'otlp': {
        'http': {
          'enabled': true
        },
        'grpc': {
          'enabled': true
        }
      }
    },
    'traces': {
      'enabled': true
    }
  },
  'destinations': [
    {
      'name': 'grafana-hosted-metrics',
      'type': 'prometheus',
      'url': 'GRAFANA_HOSTED_METRICS_URL',
      'auth': {
        'type': 'basic',
        'username': 'GRAFANA_HOSTED_METRICS_USERNAME',
        'password': 'GRAFANA_HOSTED_TOKEN'
      }
    },
    {
      'name': 'grafana-hosted-logs',
      'type': 'loki',
      'url': 'GRAFANA_HOSTED_LOGS_URL',
      'auth': {
        'type': 'basic',
        'username': 'GRAFANA_HOSTED_LOGS_USERNAME',
        'password': 'GRAFANA_HOSTED_TOKEN'
      }
    },
    {
      'name': 'grafana-hosted-otlp',
      'type': 'otlp',
      'url': 'GRAFANA_HOSTED_OTLP_URL',
      'protocol': 'http',
      'traces': {
        'enabled': true
      },
      'auth': {
        'type': 'basic',
        'username': 'GRAFANA_HOSTED_OTLP_USERNAME',
        'password': 'GRAFANA_HOSTED_TOKEN'
      }
    }
  ]
}
