import { exec } from "child_process";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { createGzip } from "zlib";
import { getConfig } from "./config";
import { logInfo } from "./log";

const pipe = promisify(pipeline);

export async function dbDumpToFile(filepath: string): Promise<void> {
  const sqlFile = "/tmp/dump.sql";
  await dumpToFile(sqlFile);
  await zip(sqlFile, filepath);
}

async function dumpToFile(filepath: string) {
  logInfo("dumping db...");
  await new Promise((resolve, reject) => {
    exec(
      `pg_dump ${getConfig("S3BACKUP_DB_CONNECTION_STRING")} -f ${filepath}`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error: JSON.stringify(error), stderr });
          return;
        }
        resolve(undefined);
      }
    );
  });
  logInfo("db dumped");
}

async function zip(fromFile: string, toFile: string): Promise<void> {
  logInfo("zipping db dump...");
  const gzip = createGzip();
  const source = createReadStream(fromFile);
  const destination = createWriteStream(toFile);
  await pipe(source, gzip, destination);
  logInfo("db dump zipped");
}
