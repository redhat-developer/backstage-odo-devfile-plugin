import {
  createTemplateAction,
  executeShellCommand,
} from "@backstage/plugin-scaffolder-node";
import { Config } from "@backstage/config";
import fs from "fs-extra";
import { join } from "node:path";
import { tmpdir } from "node:os";

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
          },
        },
      },
    },
    async handler(ctx: any) {
      let args = [ctx.input.command];
      if (ctx.input.args?.length) {
        args = [...args, ...ctx.input.args];
      }

      ctx.logger.info(`Workspace: "${ctx.workspacePath}"`);
      ctx.logger.info(`Running ${args}...`);

      const telemetryDisabled =
        config.getOptionalBoolean("odo.telemetry.disabled") ?? false;
      ctx.logger.info(`...telemetry disabled: ${telemetryDisabled}`);

      // Create a temporary file to use as dedicated config for odo
      const tmpDir = await fs.mkdtemp(join(tmpdir(), "odo-"));
      const odoConfigFilePath = `${tmpDir}/config`;

      const envVars = {
        // Due to a limitation in Node's child_process, the command lookup will be performed using options.env.PATH if options.env is defined.
        // See https://nodejs.org/docs/latest-v18.x/api/child_process.html#child_process_child_process
        ...process.env,
        GLOBALODOCONFIG: odoConfigFilePath,
        ODO_TRACKING_CONSENT: telemetryDisabled ? "no" : "yes",
        TELEMETRY_CALLER: "backstage",
      };

      await fs.createFile(odoConfigFilePath);
      await executeShellCommand({
        command: "odo",
        args: args,
        logStream: ctx.logStream,
        options: {
          cwd: ctx.workspacePath,
          env: envVars,
        },
      });
      fs.rm(tmpDir, { recursive: true, maxRetries: 2, force: true }, () => {});

      ctx.logger.info(`Finished executing odo ${ctx.input.command}`);
    },
  });
};
