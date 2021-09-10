import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createReadStream } from "fs";
import { basename } from "path";
import { getConfig } from "./config";
import { logInfo } from "./log";

export async function uploadToS3(filePath: string) {
  const filename = basename(filePath);
  const bucket = getConfig("S3BACKUP_S3_BUCKET");
  logInfo(`uploading file ${filename} to S3 bucket ${bucket}...`);
  const s3Client = new S3Client({ region: getConfig("S3BACKUP_S3_REGION") });
  await s3Client.send(
    new PutObjectCommand({
      Bucket: getConfig("S3BACKUP_S3_BUCKET"),
      Key: filename,
      Body: createReadStream(filePath),
    })
  );
  logInfo(`file ${filename} uploaded to S3 bucket ${bucket}`);
}
