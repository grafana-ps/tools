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
@grafana-ps/tools/0.2.0 linux-x64 node-v23.11.1
$ grot --help [COMMAND]
USAGE
  $ grot COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`grot check k8s-monitoring values FILE`](#grot-check-k8s-monitoring-values-file)
* [`grot check k8s-monitoring values cluster FILE`](#grot-check-k8s-monitoring-values-cluster-file)
* [`grot check k8s-monitoring values destinations FILE`](#grot-check-k8s-monitoring-values-destinations-file)
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

_See code: [src/commands/check/k8s-monitoring/values.ts](https://github.com/grafana-ps/tools/blob/v0.2.0/src/commands/check/k8s-monitoring/values.ts)_

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

_See code: [src/commands/check/k8s-monitoring/values/cluster.ts](https://github.com/grafana-ps/tools/blob/v0.2.0/src/commands/check/k8s-monitoring/values/cluster.ts)_

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

_See code: [src/commands/check/k8s-monitoring/values/destinations.ts](https://github.com/grafana-ps/tools/blob/v0.2.0/src/commands/check/k8s-monitoring/values/destinations.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.29/src/commands/help.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.43/src/commands/plugins/index.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.43/src/commands/plugins/inspect.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.43/src/commands/plugins/install.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.43/src/commands/plugins/link.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.43/src/commands/plugins/reset.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.43/src/commands/plugins/uninstall.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.43/src/commands/plugins/update.ts)_
<!-- commandsstop -->
