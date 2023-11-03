import { Config } from "@backstage/config";
export declare const odoAction: (odoConfig: Config | undefined) => import("@backstage/plugin-scaffolder-node").TemplateAction<{
    workingDirectory: string;
    command: string;
    args: string[];
}, import("@backstage/types").JsonObject>;
