import * as loadedDotenv from '!val-loader!./dotenv-loader';

export interface IDotenv {
  port: number;
  host: string | null;
}

export const dotenv = loadedDotenv as IDotenv;
