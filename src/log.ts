import moment from "moment";

export function logInfo(message: string) {
  console.log(withDate(message));
}

export function logError(message: string) {
  console.error(withDate(message));
}

function withDate(message: string) {
  return `${moment().format("YYYY-MM-DD hh:mm:ss")} | ${message}`;
}
