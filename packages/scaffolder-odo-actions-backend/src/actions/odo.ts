import {
  createTemplateAction,
  executeShellCommand,
} from "@backstage/plugin-scaffolder-node";
import { Config } from '@backstage/config'

export const odoAction = (config: Config) => {
  return createTemplateAction<{
    workingDirectory: string;
    command: string;
    args: string[];
  }>({
    id: "devfile:odo:command",
    schema: {
      input: {
        required: ["command"],
        type: "object",
        properties: {
          command: {
            type: "string",
            title: "Command",
            description: "The odo command to run from the scaffolder workspace",
          },
          args: {
            type: "array",
            items: {
              type: "string",
            },
            title: "Arguments",
            description: "Arguments to pass to the command",
          }
        },
      },
    },
    async handler(ctx: any) {
      let args = [ctx.input.command];
      if (ctx.input.args?.length) {
        args = [...args, ...ctx.input.args];
      }

      ctx.logger.info(`Workspace: "${ctx.workspacePath}"`);
      ctx.logger.info(
        `Running ${args}...`
      );

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

      ctx.logger.info(`Finished executing odo ${ctx.input.command}`);
    },
  });
};
