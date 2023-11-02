import { Config } from '@backstage/config';
export declare const odoAction: (config: Config) => import("@backstage/plugin-scaffolder-node").TemplateAction<{
    workingDirectory: string;
    command: string;
    args: string[];
}, import("@backstage/types").JsonObject>;
