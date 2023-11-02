import {
  createTemplateAction,
  executeShellCommand,
} from "@backstage/plugin-scaffolder-node";
import { Config } from '@backstage/config'

export const odoInitAction = (config: Config) => {
  return createTemplateAction<{
    devfile: string;
    version: string;
    starter_project: string;
    name: string;
  }>({
    id: "devfile:odo:component:init",
    schema: {
      input: {
        required: ["devfile", "version", "starter_project", "name"],
        type: "object",
        properties: {
          devfile: {
            type: "string",
            title: "Devfile",
            description: "The Devfile",
          },
          version: {
            type: "string",
            title: "Version",
            description: "The Devfile Stack version",
          },
          starter_project: {
            type: "string",
            title: "Starter Project",
            description: "The starter project",
          },
          name: {
            type: "string",
            title: "Component name",
            description: "The new component name",
          },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info(`Workspace: "${ctx.workspacePath}"`);
      ctx.logger.info(
        `Init "${ctx.input.name}" from: devfile=${ctx.input.devfile}, version=${ctx.input.version}, starterProject=${ctx.input.starter_project}...`
      );

      const args = [
        "init",
        "--name",
        ctx.input.name,
        "--devfile",
        ctx.input.devfile,
        "--devfile-version",
        ctx.input.version,
        "--starter",
        ctx.input.starter_project,
      ];

      const telemetryDisabled = config.getOptionalBoolean('odo.telemetry.disabled') ?? false;
      ctx.logger.info(`...telemetry disabled: ${telemetryDisabled}`);

      // TODO(rm3l): Find a way to pass the ODO_TRACKING_CONSENT env var instead. Could not get env vars to work with executeShellCommand..
      await Promise.all([
        executeShellCommand({
            command: "odo",
            args: ["preference", "set", "ConsentTelemetry", telemetryDisabled ? "false" : "true", "--force"],
            logStream: ctx.logStream,
            options: {
              cwd: ctx.workspacePath,
            },
          }),
        executeShellCommand({
            command: "odo",
            args: args,
            logStream: ctx.logStream,
            options: {
              cwd: ctx.workspacePath,
            },
          }),
      ]);

      ctx.logger.info(
        `...Finished creating "${ctx.input.name}" from: devfile=${ctx.input.devfile}, version=${ctx.input.version}, starterProject=${ctx.input.starter_project}`
      );
    },
  });
};
