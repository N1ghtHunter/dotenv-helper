import { loadEnv, saveEnv } from './utils';
import { Config, ConfigOptions } from './types';
import { validateConfig, handleMissingKeys, expandVariable } from './validators';

const config: Config = {};

export const loadConfig = (envFilePath: string = '.env', options: ConfigOptions = {}): void => {
  loadEnv(envFilePath);

  for (const key in process.env) {
    if (Object.prototype.hasOwnProperty.call(process.env, key)) {
      config[key] = process.env[key] as string;
    }
  }

  if (options.defaults) {
    setDefaults(options.defaults);
  }

  if (options.expand) {
    expandConfig();
  }

  const missingKeys = validateConfig(config, options.required || []);
  handleMissingKeys(missingKeys, options);

  if (options.validate) {
    const validatedConfig = options.validate(config);
    for (const key in validatedConfig) {
      if (Object.prototype.hasOwnProperty.call(validatedConfig, key)) {
        config[key] = validatedConfig[key];
      }
    }
  }
};

const expandConfig = (): void => {
  for (const key in config) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      config[key] = expandVariable(config[key], config);
    }
  }
};

export const setDefaults = (defaults: Config): void => {
  for (const key in defaults) {
    if (!config[key]) {
      config[key] = defaults[key];
    }
  }
};

export const getConfig = (key: string): string | undefined => {
  return config[key];
};

export const saveConfig = (filePath: string = '.env'): void => {
  saveEnv(filePath);
};
