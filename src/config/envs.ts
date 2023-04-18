import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

export function loadEnv(): void {
  const nodeEnv = process.env.NODE_ENV;
  const path = `.env${nodeEnv && "." + nodeEnv}`;

  const currentEnvs = dotenv.config({ path });
  dotenvExpand.expand(currentEnvs);
}
