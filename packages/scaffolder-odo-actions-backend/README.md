# scaffolder-odo-actions

This is a [Backend Plugin](https://backstage.io/docs/plugins/backend-plugin/) containing a set of [Custom Actions](https://backstage.io/docs/features/software-templates/writing-custom-actions) using the [`odo`](https://odo.dev/) CLI.
It contains the following actions:
- `devfile:odo:command`: a generic action that can execute any `odo` command from the scaffolder workspace.
- `devfile:odo:component:init`: allows to execute the [`odo init`](https://odo.dev/docs/command-reference/init) command from the scaffolder workspace. The goal of this action is to generate a starter project for a given Devfile that can be customized later on.

## Prerequisites

- `odo` must be installed in the environment your Backstage instance is running in. See https://odo.dev/docs/overview/installation for more details.

## Preview

![Screenshot from 2023-10-13 14-44-52](https://github.com/rm3l/backstage-odo-devfile-plugin/assets/593208/713abb47-5875-45ce-a591-1f0d0b30859e)

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

2. Then pass the imported actions along with the built-in ones to the `createRouter` function. You should end up with something like this in the end:

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

![Screenshot from 2023-10-13 14-55-08](https://github.com/rm3l/backstage-odo-devfile-plugin/assets/593208/91c12cb1-261e-44b9-9311-3dbe84ce3b47)


## Usage

You can use the action in any of the steps of your Software Template.

### Example with the `odo init` action

This action can be used in conjunction with the [devfile-field-extension](../devfile-field-extension) Custom Field Extension to get the Devfile input data from the end-user, e.g.:

```yaml
spec:
  parameters:

    - title: Provide details about the Devfile
      required:
        - devfile_data
      properties:
        devfile_data:
          type: object
          required:
            - devfile
            - version
            - starter_project
          properties:
            devfile:
              type: string
            version:
              type: string
            starter_project:
              type: string
          ui:field: DevfileSelectorExtension

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
spec:
  # [...]

  steps:
    - id: generic-odo-command
      name: Execute odo command
      action: devfile:odo:command
      input:
        command: ${{ parameters.command }} # e.g.: 'analyze'
        args: ${{ parameters.args }} # e.g.: ['-o', 'json']
        telemetry: ${{ parameters.telemetry }}
```

