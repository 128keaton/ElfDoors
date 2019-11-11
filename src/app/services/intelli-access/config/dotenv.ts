import * as loadedDotenv from '!val-loader!./dotenv-loader';

export interface IDotenv {
  port: number;
  host: string | null;
  title: string;
}

export const dotenv = loadedDotenv as IDotenv;
