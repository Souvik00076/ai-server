export type ClientConfig = {
  model: string;
  configuration: {
    baseURL: string;
    apiKey: string;
  };
  streaming: boolean;
};
