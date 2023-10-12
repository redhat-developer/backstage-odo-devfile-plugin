import React, { useState } from "react";
import { FormControl, TextField } from "@material-ui/core";
import { z } from "zod";
import { makeFieldSchemaFromZod } from "@backstage/plugin-scaffolder";
import { useAsync } from "react-use";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useApi, configApiRef } from "@backstage/core-plugin-api";

const DevfileSelectorExtensionWithOptionsFieldSchema = makeFieldSchemaFromZod(
  z.object({
    devfile: z.string().describe("Devfile name"),
    version: z.string().describe("Devfile Stack version"),
    starter_project: z.string().describe("Devfile Stack starter project"),
  })
);

export const DevfileSelectorExtensionWithOptionsSchema =
  DevfileSelectorExtensionWithOptionsFieldSchema.schema;

type DevfileSelectorExtensionWithOptionsProps =
  typeof DevfileSelectorExtensionWithOptionsFieldSchema.type;

export interface DevfileStack {
  name: string;
  icon: string;
  versions: DevfileStackVersion[];
}

export interface DevfileStackVersion {
  version: string;
  starterProjects: string[];
}

export const DevfileSelectorExtension = ({
  onChange,
  rawErrors,
  required,
  formData,
  idSchema,
  schema: { description },
}: DevfileSelectorExtensionWithOptionsProps) => {
  const config = useApi(configApiRef);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DevfileStack[]>([]);
  const [stacks, setStacks] = useState<string[]>([]);
  const [selectedStack, setSelectedStack] = useState("");
  const [versions, setVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [starterprojects, setStarterprojects] = useState<string[]>([]);

  const backendUrl = config.getString("backend.baseUrl");
  // This requires a proxy endpoint to be added for /devfile-registry
  const registryApiEndpoint = `${backendUrl}/api/proxy/devfile-registry/v2index`;

  useAsync(async () => {
    const req = await fetch(registryApiEndpoint, {
      headers: {
        Accept: "application/json",
      },
    });
    const resp = (await req.json()) as DevfileStack[];
    setData(resp);

    const stackNames = resp.map((stack: DevfileStack) => stack.name);
    stackNames.sort();
    setStacks(stackNames);

    setVersions([]);
    setStarterprojects([]);

    setLoading(false);
  });

  const handleDevfileStack = (value: any) => {
    const filteredStacks = data.filter((stack) => stack.name === value);
    const versionList = filteredStacks.flatMap((stack) => stack.versions);
    const filteredVersions = versionList.map((v) => v.version);
    filteredVersions.sort();

    let filteredStarterProjects: string[] = [];
    if (versionList.length > 0) {
      filteredStarterProjects = versionList[0].starterProjects;
    }

    setSelectedStack(value as string);
    setVersions(filteredVersions);
    setStarterprojects(filteredStarterProjects);

    onChange({
      devfile: value as string,
      version: (versionList.length > 0) ? versionList[0].version : '',
      starter_project: (filteredStarterProjects.length > 0) ? filteredStarterProjects[0] : '',
    });
  };

  const handleDevfileStackVersion = (value: any) => {
    const filteredResult = data
      .filter((stack) => stack.name === selectedStack)
      .flatMap((stack) => stack.versions)
      .filter((v) => v.version === value)
      .flatMap((v) => v.starterProjects);
    filteredResult.sort();

    setSelectedVersion(value as string);
    setStarterprojects(filteredResult);

    onChange({
      devfile: selectedStack,
      version: value as string,
      starter_project: (filteredResult.length > 0) ? filteredResult[0] : '',
    });
  };

  const handleDevfileStarterProject = (value: any) => {
    onChange({
      devfile: selectedStack,
      version: selectedVersion,
      starter_project: value as string,
    });
  };

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0}
    >
      <Autocomplete
        id={`devfile-selector-${idSchema?.$id}`}
        loading={loading}
        noOptionsText="No Devfile Stacks available from registry"
        value={formData?.devfile ?? null}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Stack"
            variant="standard"
            required={required}
            error={rawErrors?.length > 0 && !formData}
            helperText={description}
          />
        )}
        options={stacks}
        onChange={(_, value) => handleDevfileStack(value)}
        getOptionSelected={(option, value) => option === value}
        disableClearable
      />
      <Autocomplete
        id={`devfile-version-selector-${idSchema?.$id}`}
        loading={loading}
        value={formData?.version ?? (versions.length > 0 ? versions[0] : null)}
        noOptionsText="No version available in Devfile Stack"
        renderInput={(params) => (
          <TextField
            {...params}
            label="Version"
            variant="standard"
            required={required}
            error={rawErrors?.length > 0 && !formData}
            helperText={description}
          />
        )}
        options={versions}
        onChange={(_, value) => handleDevfileStackVersion(value)}
        getOptionSelected={(option, value) => option === value}
        disableClearable
      />
      <Autocomplete
        id={`devfile-starter-project-selector-${idSchema?.$id}`}
        loading={loading}
        value={
          formData?.starter_project ??
          (starterprojects.length > 0 ? starterprojects[0] : null)
        }
        noOptionsText="No starter project available in Devfile Stack"
        renderInput={(params) => (
          <TextField
            {...params}
            label="Starter Project"
            variant="standard"
            required={required}
            error={rawErrors?.length > 0 && !formData}
            helperText={description}
          />
        )}
        options={starterprojects}
        onChange={(_, value) => handleDevfileStarterProject(value)}
        getOptionSelected={(option, value) => option === value}
        disableClearable
      />
    </FormControl>
  );
};
