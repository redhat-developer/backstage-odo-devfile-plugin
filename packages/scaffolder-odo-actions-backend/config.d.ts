export interface Config {
  odo: {
    telemetry: {
      /**
       * odo telemetry status
       * @visibility backend
       */
      disabled: boolean | undefined;
    },
    devfileRegistry: {
      /**
       * devfile registry URL
       * @visibility backend
       */
      url: string | undefined;
    };
  };
}
