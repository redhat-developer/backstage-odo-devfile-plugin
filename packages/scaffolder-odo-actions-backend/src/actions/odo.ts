import {
  createTemplateAction,
  executeShellCommand,
} from "@backstage/plugin-scaffolder-node";

export const odoAction = () => {
  return createTemplateAction<{
    workingDirectory: string;
    command: string;
    args: string[];
    telemetry: boolean,
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
          },
          telemetry: {
            type: "boolean",
            title: "Enable Telemetry",
            default: false,
            description: "Whether to enable odo telemetry",
          },
        },
      },
    },
    async handler(ctx: any) {
      let args = [ctx.input.command];
      if (ctx.input.args?.length) {
        args = [...args, ...ctx.input.args];
      }

      // TODO(rm3l): Find a way to pass the ODO_TRACKING_CONSENT env var instead. Could not get env vars to work with executeShellCommand..
      await Promise.all([
        executeShellCommand({
            command: "odo",
            args: ["preference", "set", "ConsentTelemetry", ctx.input.telemetry ? "true" : "false", "--force"],
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
