@grafana-ps/tools
=================

Grafana Cloud tools provided by the Grafana PS team.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@grafana-ps/tools.svg)](https://npmjs.org/package/@grafana-ps/tools)
[![Downloads/week](https://img.shields.io/npm/dw/@grafana-ps/tools.svg)](https://npmjs.org/package/@grafana-ps/tools)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @grafana-ps/tools
$ grot COMMAND
running command...
$ grot (--version)
@grafana-ps/tools/0.9.0 linux-x64 node-v23.11.1
$ grot --help [COMMAND]
USAGE
  $ grot COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`grot check cloud promql SLUG FILETOKEN FILEQUERY`](#grot-check-cloud-promql-slug-filetoken-filequery)
* [`grot check cloud token read SLUG FILE`](#grot-check-cloud-token-read-slug-file)
* [`grot check k8s-monitoring values FILE`](#grot-check-k8s-monitoring-values-file)
* [`grot check k8s-monitoring values alloy-logs FILE`](#grot-check-k8s-monitoring-values-alloy-logs-file)
* [`grot check k8s-monitoring values alloy-metrics FILE`](#grot-check-k8s-monitoring-values-alloy-metrics-file)
* [`grot check k8s-monitoring values alloy-receiver FILE`](#grot-check-k8s-monitoring-values-alloy-receiver-file)
* [`grot check k8s-monitoring values alloy-singleton FILE`](#grot-check-k8s-monitoring-values-alloy-singleton-file)
* [`grot check k8s-monitoring values annotationAutodiscovery FILE`](#grot-check-k8s-monitoring-values-annotationautodiscovery-file)
* [`grot check k8s-monitoring values cluster FILE`](#grot-check-k8s-monitoring-values-cluster-file)
* [`grot check k8s-monitoring values clusterEvents FILE`](#grot-check-k8s-monitoring-values-clusterevents-file)
* [`grot check k8s-monitoring values clusterMetrics FILE`](#grot-check-k8s-monitoring-values-clustermetrics-file)
* [`grot check k8s-monitoring values destinations FILE`](#grot-check-k8s-monitoring-values-destinations-file)
* [`grot check k8s-monitoring values nodeLogs FILE`](#grot-check-k8s-monitoring-values-nodelogs-file)
* [`grot check k8s-monitoring values podLogs FILE`](#grot-check-k8s-monitoring-values-podlogs-file)
* [`grot check lgtm values FILE`](#grot-check-lgtm-values-file)
* [`grot check lgtm values api FILE`](#grot-check-lgtm-values-api-file)
* [`grot check lgtm values authenticator FILE`](#grot-check-lgtm-values-authenticator-file)
* [`grot check lgtm values loadGenerator FILE`](#grot-check-lgtm-values-loadgenerator-file)
* [`grot check lgtm values opentelemetry FILE`](#grot-check-lgtm-values-opentelemetry-file)
* [`grot help [COMMAND]`](#grot-help-command)
* [`grot plugins`](#grot-plugins)
* [`grot plugins add PLUGIN`](#grot-plugins-add-plugin)
* [`grot plugins:inspect PLUGIN...`](#grot-pluginsinspect-plugin)
* [`grot plugins install PLUGIN`](#grot-plugins-install-plugin)
* [`grot plugins link PATH`](#grot-plugins-link-path)
* [`grot plugins remove [PLUGIN]`](#grot-plugins-remove-plugin)
* [`grot plugins reset`](#grot-plugins-reset)
* [`grot plugins uninstall [PLUGIN]`](#grot-plugins-uninstall-plugin)
* [`grot plugins unlink [PLUGIN]`](#grot-plugins-unlink-plugin)
* [`grot plugins update`](#grot-plugins-update)

## `grot check cloud promql SLUG FILETOKEN FILEQUERY`

validate token read access

```
USAGE
  $ grot check cloud promql SLUG FILETOKEN FILEQUERY --names <value>... [--labels <value>...] [--stackToken <value>]

ARGUMENTS
  SLUG       stack slug to use
  FILETOKEN  token file to read
  FILEQUERY  query file to check

FLAGS
  --labels=<value>...   [default: ] labels to check
  --names=<value>...    (required) [default: ] metric names to check
  --stackToken=<value>  token with stack access

DESCRIPTION
  validate token read access
```

_See code: [src/commands/check/cloud/promql.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/cloud/promql.ts)_

## `grot check cloud token read SLUG FILE`

validate token read access

```
USAGE
  $ grot check cloud token read SLUG FILE [--stackToken <value>]

ARGUMENTS
  SLUG  stack slug to use
  FILE  file to read

FLAGS
  --stackToken=<value>  token with stack access

DESCRIPTION
  validate token read access
```

_See code: [src/commands/check/cloud/token/read.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/cloud/token/read.ts)_

## `grot check k8s-monitoring values FILE`

full validation of values.yaml

```
USAGE
  $ grot check k8s-monitoring values FILE [-t prometheus|loki|otlp...]

ARGUMENTS
  FILE  values file to validate

FLAGS
  -t, --types=<option>...  [default: prometheus,loki,otlp] types of destinations to validate
                           <options: prometheus|loki|otlp>

DESCRIPTION
  full validation of values.yaml
```

_See code: [src/commands/check/k8s-monitoring/values.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/k8s-monitoring/values.ts)_

## `grot check k8s-monitoring values alloy-logs FILE`

validate .alloy-logs

```
USAGE
  $ grot check k8s-monitoring values alloy-logs FILE

ARGUMENTS
  FILE  file to read

DESCRIPTION
  validate .alloy-logs
```

_See code: [src/commands/check/k8s-monitoring/values/alloy-logs.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/k8s-monitoring/values/alloy-logs.ts)_

## `grot check k8s-monitoring values alloy-metrics FILE`

validate .alloy-metrics

```
USAGE
  $ grot check k8s-monitoring values alloy-metrics FILE

ARGUMENTS
  FILE  file to read

DESCRIPTION
  validate .alloy-metrics
```

_See code: [src/commands/check/k8s-monitoring/values/alloy-metrics.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/k8s-monitoring/values/alloy-metrics.ts)_

## `grot check k8s-monitoring values alloy-receiver FILE`

validate .alloy-receiver

```
USAGE
  $ grot check k8s-monitoring values alloy-receiver FILE

ARGUMENTS
  FILE  file to read

DESCRIPTION
  validate .alloy-receiver
```

_See code: [src/commands/check/k8s-monitoring/values/alloy-receiver.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/k8s-monitoring/values/alloy-receiver.ts)_

## `grot check k8s-monitoring values alloy-singleton FILE`

validate .alloy-singleton

```
USAGE
  $ grot check k8s-monitoring values alloy-singleton FILE

ARGUMENTS
  FILE  file to read

DESCRIPTION
  validate .alloy-singleton
```

_See code: [src/commands/check/k8s-monitoring/values/alloy-singleton.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/k8s-monitoring/values/alloy-singleton.ts)_

## `grot check k8s-monitoring values annotationAutodiscovery FILE`

validate .annotationAutodiscovery

```
USAGE
  $ grot check k8s-monitoring values annotationAutodiscovery FILE

ARGUMENTS
  FILE  file to read

DESCRIPTION
  validate .annotationAutodiscovery
```

_See code: [src/commands/check/k8s-monitoring/values/annotationAutodiscovery.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/k8s-monitoring/values/annotationAutodiscovery.ts)_

## `grot check k8s-monitoring values cluster FILE`

validate .cluster

```
USAGE
  $ grot check k8s-monitoring values cluster FILE

ARGUMENTS
  FILE  values file to validate

DESCRIPTION
  validate .cluster
```

_See code: [src/commands/check/k8s-monitoring/values/cluster.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/k8s-monitoring/values/cluster.ts)_

## `grot check k8s-monitoring values clusterEvents FILE`

validate .clusterEvents

```
USAGE
  $ grot check k8s-monitoring values clusterEvents FILE

ARGUMENTS
  FILE  file to read

DESCRIPTION
  validate .clusterEvents
```

_See code: [src/commands/check/k8s-monitoring/values/clusterEvents.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/k8s-monitoring/values/clusterEvents.ts)_

## `grot check k8s-monitoring values clusterMetrics FILE`

validate .clusterMetrics

```
USAGE
  $ grot check k8s-monitoring values clusterMetrics FILE

ARGUMENTS
  FILE  file to read

DESCRIPTION
  validate .clusterMetrics
```

_See code: [src/commands/check/k8s-monitoring/values/clusterMetrics.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/k8s-monitoring/values/clusterMetrics.ts)_

## `grot check k8s-monitoring values destinations FILE`

validate .destinations

```
USAGE
  $ grot check k8s-monitoring values destinations FILE [-t prometheus|loki|otlp...]

ARGUMENTS
  FILE  values file to validate

FLAGS
  -t, --types=<option>...  [default: prometheus,loki,otlp] types of destinations to validate
                           <options: prometheus|loki|otlp>

DESCRIPTION
  validate .destinations
```

_See code: [src/commands/check/k8s-monitoring/values/destinations.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/k8s-monitoring/values/destinations.ts)_

## `grot check k8s-monitoring values nodeLogs FILE`

validate .nodeLogs

```
USAGE
  $ grot check k8s-monitoring values nodeLogs FILE

ARGUMENTS
  FILE  file to read

DESCRIPTION
  validate .nodeLogs
```

_See code: [src/commands/check/k8s-monitoring/values/nodeLogs.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/k8s-monitoring/values/nodeLogs.ts)_

## `grot check k8s-monitoring values podLogs FILE`

validate .podLogs

```
USAGE
  $ grot check k8s-monitoring values podLogs FILE

ARGUMENTS
  FILE  file to read

DESCRIPTION
  validate .podLogs
```

_See code: [src/commands/check/k8s-monitoring/values/podLogs.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/k8s-monitoring/values/podLogs.ts)_

## `grot check lgtm values FILE`

full validation of values.yaml

```
USAGE
  $ grot check lgtm values FILE [-t prometheus|otlp...]

ARGUMENTS
  FILE  values file to validate

FLAGS
  -t, --telemetry=<option>...  [default: prometheus,otlp] types of telmetry to validate
                               <options: prometheus|otlp>

DESCRIPTION
  full validation of values.yaml
```

_See code: [src/commands/check/lgtm/values.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/lgtm/values.ts)_

## `grot check lgtm values api FILE`

validate .api

```
USAGE
  $ grot check lgtm values api FILE [-t prometheus|otlp...]

ARGUMENTS
  FILE  file to read

FLAGS
  -t, --telemetry=<option>...  [default: prometheus,otlp] types of telmetry to validate
                               <options: prometheus|otlp>

DESCRIPTION
  validate .api
```

_See code: [src/commands/check/lgtm/values/api.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/lgtm/values/api.ts)_

## `grot check lgtm values authenticator FILE`

validate .authenticator

```
USAGE
  $ grot check lgtm values authenticator FILE [-t prometheus|otlp...]

ARGUMENTS
  FILE  file to read

FLAGS
  -t, --telemetry=<option>...  [default: prometheus,otlp] types of telmetry to validate
                               <options: prometheus|otlp>

DESCRIPTION
  validate .authenticator
```

_See code: [src/commands/check/lgtm/values/authenticator.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/lgtm/values/authenticator.ts)_

## `grot check lgtm values loadGenerator FILE`

validate .loadGenerator

```
USAGE
  $ grot check lgtm values loadGenerator FILE [-t prometheus|otlp...]

ARGUMENTS
  FILE  file to read

FLAGS
  -t, --telemetry=<option>...  [default: prometheus,otlp] types of telmetry to validate
                               <options: prometheus|otlp>

DESCRIPTION
  validate .loadGenerator
```

_See code: [src/commands/check/lgtm/values/loadGenerator.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/lgtm/values/loadGenerator.ts)_

## `grot check lgtm values opentelemetry FILE`

validate .opentelemetry

```
USAGE
  $ grot check lgtm values opentelemetry FILE

ARGUMENTS
  FILE  file to read

DESCRIPTION
  validate .opentelemetry
```

_See code: [src/commands/check/lgtm/values/opentelemetry.ts](https://github.com/grafana-ps/tools/blob/v0.9.0/src/commands/check/lgtm/values/opentelemetry.ts)_

## `grot help [COMMAND]`

Display help for grot.

```
USAGE
  $ grot help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for grot.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.32/src/commands/help.ts)_

## `grot plugins`

List installed plugins.

```
USAGE
  $ grot plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ grot plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/index.ts)_

## `grot plugins add PLUGIN`

Installs a plugin into grot.

```
USAGE
  $ grot plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into grot.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the GROT_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the GROT_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ grot plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ grot plugins add myplugin

  Install a plugin from a github url.

    $ grot plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ grot plugins add someuser/someplugin
```

## `grot plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ grot plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ grot plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/inspect.ts)_

## `grot plugins install PLUGIN`

Installs a plugin into grot.

```
USAGE
  $ grot plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into grot.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the GROT_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the GROT_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ grot plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ grot plugins install myplugin

  Install a plugin from a github url.

    $ grot plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ grot plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/install.ts)_

## `grot plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ grot plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ grot plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/link.ts)_

## `grot plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ grot plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ grot plugins unlink
  $ grot plugins remove

EXAMPLES
  $ grot plugins remove myplugin
```

## `grot plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ grot plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/reset.ts)_

## `grot plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ grot plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ grot plugins unlink
  $ grot plugins remove

EXAMPLES
  $ grot plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/uninstall.ts)_

## `grot plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ grot plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ grot plugins unlink
  $ grot plugins remove

EXAMPLES
  $ grot plugins unlink myplugin
```

## `grot plugins update`

Update installed plugins.

```
USAGE
  $ grot plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/update.ts)_
<!-- commandsstop -->
