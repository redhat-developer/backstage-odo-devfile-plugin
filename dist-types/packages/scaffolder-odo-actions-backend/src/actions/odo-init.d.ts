import { Config } from "@backstage/config";
export declare const odoInitAction: (odoConfig: Config | undefined) => import("@backstage/plugin-scaffolder-node").TemplateAction<{
    devfile: string;
    version: string;
    starter_project: string | undefined;
    name: string;
}, import("@backstage/types").JsonObject>;
