import { CronJob } from "cron";
import { checkEnvVariablesAreProvided, getConfig } from "./config";
import { doBackup } from "./doBackup";
import { logError, logInfo } from "./log";
import { hasOwnProperty } from "./util";

checkEnvVariablesAreProvided();

const job = new CronJob(getConfig("S3BACKUP_CRON_SCHEDULE"), async () => {
  try {
    await doBackup();
  } catch (error) {
    logError(String(error));
    if (error instanceof Object && hasOwnProperty(error, "stack")) {
      logError(`stack: ${error.stack}`);
    }
  }
});

job.start();
logInfo("cron job scheduled");
