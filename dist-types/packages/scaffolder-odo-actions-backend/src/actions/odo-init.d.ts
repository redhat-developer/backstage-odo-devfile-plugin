import { Config } from '@backstage/config';
export declare const odoInitAction: (config: Config) => import("@backstage/plugin-scaffolder-node").TemplateAction<{
    devfile: string;
    version: string;
    starter_project: string;
    name: string;
}, import("@backstage/types").JsonObject>;
