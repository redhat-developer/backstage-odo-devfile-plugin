# scaffolder-odo-actions

This is a [Backend Plugin](https://backstage.io/docs/plugins/backend-plugin/) containing a set of [Custom Actions](https://backstage.io/docs/features/software-templates/writing-custom-actions) using the [`odo`](https://odo.dev/) CLI.
It contains the following actions:
- `devfile:odo:command`: a generic action that can execute any `odo` command from the scaffolder workspace.
- `devfile:odo:component:init`: allows to execute the [`odo init`](https://odo.dev/docs/command-reference/init) from the scaffolder workspace. The goal of this action is to generate a starter project for a given Devfile that can be customized later on.

## Prerequisites

- `odo` must be installed in the environment your Backstage is running in. See https://odo.dev/docs/overview/installation for more details.

## Preview

![image](https://github.com/rm3l/backstage-odo-devfile-plugin/assets/593208/ef342f15-ed2b-448c-9024-52ddf1f2453c)

## Installation

From your Backstage instance root folder:
```shell
yarn add --cwd packages/backend @rm3l/plugin-scaffolder-odo-actions
```

## Configuration

1. Import the actions into your `packages/backend/src/plugins/scaffolder.ts` on the Scaffolder Backend Plugin of your Backstage instance:

```js
// packages/backend/src/plugins/scaffolder.ts

import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { ScmIntegrations } from '@backstage/integration';
import { odoInitAction, odoAction } from '@rm3l/plugin-scaffolder-odo-actions';
```

2. Then add the imported actions to the built-in actions and pass them to the `createRouter` function. You should end up with something like this in the end:

```js
// packages/backend/src/plugins/scaffolder.ts

const integrations = ScmIntegrations.fromConfig(env.config);

const builtInActions = createBuiltinActions({
  integrations,
  catalogClient,
  config: env.config,
  reader: env.reader,
});

const actions = [...builtInActions, odoInitAction(), odoAction()];

return await createRouter({
  logger: env.logger,
  config: env.config,
  database: env.database,
  reader: env.reader,
  catalogClient,
  actions,
});
```

You should now see the custom `devfile:odo:*` actions if you navigate to the Actions page at http://localhost:3000/create/actions.

![image](https://github.com/rm3l/backstage-odo-devfile-plugin/assets/593208/5c1a5871-9944-4d92-aeb1-4e8682c7aa4e)

## Usage

You can use the action in any of the steps of your Software Template. It can be used in conjunction with the [devfile-field-extension](../devfile-field-extension) Custom Field Extension to get the Devfile input data from the end-user.

### Example with the `odo init` action

```yaml
  steps:
    - id: odo-init
      name: Generate
      action: devfile:odo:component:init
      input:
        name: ${{ parameters.name }}
        devfile: ${{ parameters.devfile_data.devfile }}
        version: ${{ parameters.devfile_data.version }}
        starter_project: ${{ parameters.devfile_data.starter_project }}
        telemetry: ${{ parameters.telemetry }}
```

### Example with the generic `odo` action

```yaml
  steps:
    - id: odo-analyze
      name: Execute odo
      action: devfile:odo:command
      input:
        command: ${{ parameters.command }} # e.g.: 'analyze'
        name: ${{ parameters.args }} # e.g.: ['-o', 'json']
        telemetry: ${{ parameters.telemetry }}
```

