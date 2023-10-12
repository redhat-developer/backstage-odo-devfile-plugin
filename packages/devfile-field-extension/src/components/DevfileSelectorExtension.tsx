import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import { z } from "zod";
import { makeFieldSchemaFromZod } from "@backstage/plugin-scaffolder";
import { useAsync } from "react-use";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useApi, configApiRef } from "@backstage/core-plugin-api";

const DevfileSelectorExtensionWithOptionsFieldSchema = makeFieldSchemaFromZod(
  z.string(),
  z.object({
    registry_url: z
      .string()
      .default("/default-devfile-registry")
      .describe("Registry URL (as proxied in the Backstage config)."),
  })
);

export const DevfileSelectorExtensionWithOptionsSchema =
  DevfileSelectorExtensionWithOptionsFieldSchema.schema;

type DevfileSelectorExtensionWithOptionsProps =
  typeof DevfileSelectorExtensionWithOptionsFieldSchema.type;

export const DevfileSelectorExtension = ({
  onChange,
  rawErrors,
  required,
  formData,
  idSchema,
  schema: { title, description },
  uiSchema: { "ui:options": options },
}: DevfileSelectorExtensionWithOptionsProps) => {
  const config = useApi(configApiRef);
  const [loading, setLoading] = useState(true);
  const [formDataOptions, setFormDataOptions] = useState([]);

  const backendUrl = config.getString("backend.baseUrl");
  const registryBaseUrl = options?.registry_url ?? "/default-devfile-registry";
  const registryApiEndpoint = `${backendUrl}/api/proxy${registryBaseUrl}/v2index`;

  useAsync(async () => {
    const req = await fetch(registryApiEndpoint, {
      headers: {
        Accept: "application/json",
      },
    });
    const response = await req.json();
    const stackNames = response.map((stack: any) => stack.name);
    stackNames.sort();

    setFormDataOptions(stackNames);
    setLoading(false);
  });

  return (
    <Autocomplete
      id={idSchema?.$id}
      loading={loading}
      value={formData ?? null}
      renderInput={(params) => (
        <TextField
          {...params}
          label={title}
          variant="standard"
          required={required}
          error={rawErrors?.length > 0 && !formData}
          helperText={description}
        />
      )}
      options={formDataOptions}
      onChange={(_, value) => onChange(value)}
      getOptionSelected={(option, value) => option === value}
      disableClearable
    />
  );
};
