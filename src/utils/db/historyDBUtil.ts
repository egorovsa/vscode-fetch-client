import * as vscode from "vscode";
import loki, { LokiFsAdapter } from "lokijs";
import { IHistory } from "../../fetch-client-ui/components/SideBar/redux/types";
import { responseTypes } from "../configuration";
import { getHistoryLimitConfiguration } from "../vscodeConfig";
import {
  DeleteExitingItem,
  DeleteExitingItems,
  RenameRequestItem,
} from "./mainDBUtil";
import { writeLog } from "../logger/logger";
import path from "path";
import { historyDBPath } from "./dbPaths";
import { checkDbFilesAndCreateIfNotExist } from "./checkDbFilesAndCreateIfNotExist";

function getDB(): loki {
  const idbAdapter = new LokiFsAdapter();
  checkDbFilesAndCreateIfNotExist();
  const db = new loki(historyDBPath(), {
    adapter: idbAdapter,
  });
  return db;
}

export function SaveHistory(item: IHistory, webviewView: vscode.WebviewView) {
  console.log({ item }, "DSV");

  try {
    const db = getDB();

    db.loadDatabase({}, function () {
      const userHistory = db.getCollection("userHistory");
      userHistory.insert(item);
      db.saveDatabase();
      webviewView.webview.postMessage({
        type: responseTypes.newHistoryResponse,
        history: item,
      });
    });
  } catch (err) {
    console.log("error::SaveHistory(): " + err);
    writeLog("error::SaveHistory(): " + err);
  }
}

export function UpdateHistory(item: IHistory) {
  console.log({ item });

  try {
    const db = getDB();

    db.loadDatabase({}, function () {
      const userHistory = db.getCollection("userHistory");
      var req = userHistory.findOne({ id: item.id });
      if (req) {
        req.name = item.name;
        req.method = item.method;
        req.url = item.url;
        req.createdTime = item.createdTime;
        userHistory.update(req);
        db.saveDatabase();
      }
    });
  } catch (err) {
    console.log("error::UpdateHistory(): " + err);
    writeLog("error::UpdateHistory(): " + err);
  }
}

export function GetHistoryById(id: string, webview: vscode.Webview) {
  try {
    const db = getDB();

    db.loadDatabase({}, function () {
      const userHistory = db.getCollection("userHistory").find({ id: id });
      webview.postMessage({
        type: responseTypes.getHistoryItemResponse,
        history: userHistory,
      });
    });
  } catch (err) {
    writeLog("error::GetHistoryById(): " + err);
  }
}

export function GetAllHistory(webviewView: vscode.WebviewView) {
  try {
    const db = getDB();

    let limit = getHistoryLimitConfiguration();

    db.loadDatabase({}, function () {
      let userHistory: any;
      let len = db.getCollection("userHistory").find().length;
      switch (limit) {
        case "All":
          userHistory = db.getCollection("userHistory").data.reverse();
          break;
        default:
          let intLimit = parseInt(limit);
          if (len > intLimit) {
            userHistory = db
              .getCollection("userHistory")
              .chain()
              .offset(len - intLimit)
              .limit(intLimit)
              .data()
              .reverse();
          } else {
            userHistory = db
              .getCollection("userHistory")
              .chain()
              .limit(intLimit)
              .data()
              .reverse();
          }
          break;
      }
      webviewView.webview.postMessage({
        type: responseTypes.getAllHistoryResponse,
        history: userHistory,
      });
    });
  } catch (err) {
    writeLog("error::GetAllHistory(): " + err);
  }
}

export function DeleteAllHistory(webviewView: vscode.WebviewView) {
  try {
    const db = getDB();

    db.loadDatabase({}, function () {
      const userHistory = db.getCollection("userHistory");
      let results = userHistory
        .chain()
        .data({ forceClones: true, removeMeta: true });

      const ids = results.map((item) => item.id);

      userHistory.removeDataOnly();
      db.saveDatabase();

      DeleteExitingItems(ids);

      webviewView.webview.postMessage({
        type: responseTypes.deleteAllHistoryResponse,
      });
    });
  } catch (err) {
    writeLog("error::DeleteAllHistory(): " + err);
  }
}

export function DeleteHistory(webviewView: vscode.WebviewView, id: string) {
  try {
    const db = getDB();

    db.loadDatabase({}, function () {
      db.getCollection("userHistory").findAndRemove({ id: id });
      db.saveDatabase();
      DeleteExitingItem(id);
      webviewView.webview.postMessage({
        type: responseTypes.deleteHistoryResponse,
        id: id,
      });
    });
  } catch (err) {
    writeLog("error::DeleteHistory(): " + err);
  }
}

export function RenameHistory(
  webviewView: vscode.WebviewView,
  id: string,
  name: string
) {
  try {
    const db = getDB();

    db.loadDatabase({}, function () {
      db.getCollection("userHistory").findAndUpdate({ id: id }, (item) => {
        item.name = name;
      });
      db.saveDatabase();
      RenameRequestItem(id, name);
      webviewView.webview.postMessage({
        type: responseTypes.renameHistoryResponse,
        params: { id: id, name: name },
      });
    });
  } catch (err) {
    writeLog("error::RenameHistory(): " + err);
  }
}
