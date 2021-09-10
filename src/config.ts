const envNames = [
  "S3BACKUP_CRON_SCHEDULE",
  "S3BACKUP_DB_CONNECTION_STRING",
  "S3BACKUP_S3_REGION",
  "S3BACKUP_S3_BUCKET",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
] as const;

export type EnvName = typeof envNames[number];

const defaultEnvValues = [
  {
    env: "DB_CONNECTION_STRING",
    default: "postgresql://postgres:admin@localhost:5432/postgres",
  },
];

export function checkEnvVariablesAreProvided() {
  let missingEnvVariables = getMissingEnvVariables();
  if (missingEnvVariables.length > 0) {
    throw new Error(
      "the following env variables are missing: " +
        missingEnvVariables.join(", ")
    );
  }
}

export function getConfig(name: EnvName) {
  return process.env[name] !== undefined
    ? process.env[name]!
    : defaultEnvValues.find((def) => def.env === name)!.default!;
}

function getMissingEnvVariables() {
  let missingEnvVariables = [];
  for (let envName of envNames) {
    if (
      process.env[envName] === undefined &&
      !defaultEnvValues.find((def) => def.env === envName)
    ) {
      missingEnvVariables.push(envName);
    }
  }
  return missingEnvVariables;
}
