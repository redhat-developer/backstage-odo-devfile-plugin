import React from "react";
export declare const DevfileSelectorExtensionWithOptionsSchema: import("@backstage/plugin-scaffolder-react").CustomFieldExtensionSchema;
export interface DevfileStack {
    name: string;
    icon: string;
    versions: DevfileStackVersion[];
}
export interface DevfileStackVersion {
    version: string;
    starterProjects: string[];
}
export declare const DevfileSelectorExtension: ({ onChange, rawErrors, required, formData, idSchema, schema: { description }, }: import("@backstage/plugin-scaffolder-react").FieldExtensionComponentProps<{
    devfile: string;
    version: string;
    starter_project?: string | undefined;
}, {}>) => React.JSX.Element;
