import {
  createTemplateAction,
  executeShellCommand,
} from "@backstage/plugin-scaffolder-node";
import { Config } from "@backstage/config";
import fs from "fs-extra";
import { join } from "node:path";
import { tmpdir } from "node:os";

export const odoInitAction = (odoConfig: Config | undefined) => {
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

      const telemetryDisabled =
        odoConfig?.getOptionalBoolean("telemetry.disabled") ?? false;
      ctx.logger.info(`...telemetry disabled: ${telemetryDisabled}`);

      // Create a temporary file to use as dedicated config for odo
      const tmpDir = await fs.mkdtemp(join(tmpdir(), "odo-init-"));
      const odoConfigFilePath = `${tmpDir}/config`;
      ctx.logger.info(`...temp dir for odo config: ${tmpDir}`);

      const envVars = {
        // Due to a limitation in Node's child_process, the command lookup will be performed using options.env.PATH if options.env is defined.
        // See https://nodejs.org/docs/latest-v18.x/api/child_process.html#child_process_child_process
        ...process.env,
        GLOBALODOCONFIG: odoConfigFilePath,
        ODO_TRACKING_CONSENT: telemetryDisabled ? "no" : "yes",
        TELEMETRY_CALLER: "backstage",
      };

      const randomRegistryName = "GeneratedRegistryName";
      const devfileRegistryUrl =
        odoConfig?.getOptionalString("devfileRegistry.url") ??
        "https://registry.devfile.io";

      ctx.logger.info(`...devfile registry URL: ${devfileRegistryUrl}`);

      await fs.createFile(odoConfigFilePath);

      // Add registry
      await executeShellCommand({
        command: "odo",
        args: [
          "preference",
          "add",
          "registry",
          randomRegistryName,
          devfileRegistryUrl,
        ],
        logStream: ctx.logStream,
        options: {
          cwd: ctx.workspacePath,
          env: envVars,
        },
      });

      // odo init
      await executeShellCommand({
        command: "odo",
        args: [
          "init",
          "--name",
          ctx.input.name,
          "--devfile-registry",
          randomRegistryName,
          "--devfile",
          ctx.input.devfile,
          "--devfile-version",
          ctx.input.version,
          "--starter",
          ctx.input.starter_project,
        ],
        logStream: ctx.logStream,
        options: {
          cwd: ctx.workspacePath,
          env: envVars,
        },
      });

      fs.rm(tmpDir, { recursive: true, maxRetries: 2, force: true }, () => {});

      ctx.logger.info(
        `...Finished creating "${ctx.input.name}" from: devfile=${ctx.input.devfile}, version=${ctx.input.version}, starterProject=${ctx.input.starter_project}`
      );
    },
  });
};
