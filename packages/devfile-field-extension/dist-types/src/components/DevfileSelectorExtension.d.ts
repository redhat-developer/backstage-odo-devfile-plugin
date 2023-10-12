import React from "react";
export declare const DevfileSelectorExtensionWithOptionsSchema: import("@backstage/plugin-scaffolder-react").CustomFieldExtensionSchema;
export declare const DevfileSelectorExtension: ({ onChange, rawErrors, required, formData, idSchema, schema: { title, description }, uiSchema: { "ui:options": options }, }: import("@backstage/plugin-scaffolder-react").FieldExtensionComponentProps<string, {
    registry_url?: string | undefined;
}>) => React.JSX.Element;
