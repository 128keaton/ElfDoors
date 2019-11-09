import * as loadedDotenv from '!val-loader!./dotenv-loader';

export interface IDotenv {
  port: number;
}

export const dotenv = loadedDotenv as IDotenv;
