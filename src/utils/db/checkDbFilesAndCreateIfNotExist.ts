import fs from "fs";
import { getExtDbPath } from "./getExtDbPath";
import {
  collectionDBPath,
  cookieDBPath,
  historyDBPath,
  mainDBPath,
  variableDBPath,
} from "./dbPaths";
import {
  CreateCollectionDB,
  CreateCookieDB,
  CreateHistoryDB,
  CreateMainDB,
  CreateVariableDB,
} from "./dbUtil";
import path from "path";
import { logPath } from "../logger/constants";
import { createLogFile } from "../logger/logger";

export const checkDbFilesAndCreateIfNotExist = () => {
  const extPath = getExtDbPath();

  if (!fs.existsSync(extPath)) {
    fs.mkdirSync(extPath, { recursive: true });
  }

  if (!fs.existsSync(historyDBPath())) {
    CreateHistoryDB();
  }

  if (!fs.existsSync(mainDBPath())) {
    CreateMainDB();
  }

  if (!fs.existsSync(collectionDBPath())) {
    CreateCollectionDB();
  }

  if (!fs.existsSync(variableDBPath())) {
    CreateVariableDB();
  }

  if (!fs.existsSync(cookieDBPath())) {
    CreateCookieDB();
  }

  if (!fs.existsSync(path.resolve(extPath, logPath))) {
    createLogFile();
  }
};
