import * as vscode from "vscode";

import { AddToColUI } from "./utils/ui/addToCollectionUIProvider";
import { MainUIProvider } from "./utils/ui/mainUIProvider";
import { SideBarProvider } from "./utils/ui/sideBarUIProvider";
import { VariableUI } from "./utils/ui/variableUIProvider";
import { LocalStorageService } from "./utils/LocalStorageService";
import { CookieUI } from "./utils/ui/cookieUIProvider";
import { ErrorLogUI } from "./utils/ui/errorLogUIProvider";
import { CurlProviderUI } from "./utils/ui/curlUIProvider";
import { getExtDbPath, setGlobalStorageUri } from "./utils/db/getExtDbPath";
import { transferDbConfig } from "./utils/db/transferDBConfig";
import { checkDbFilesAndCreateIfNotExist } from "./utils/db/checkDbFilesAndCreateIfNotExist";

export var sideBarProvider: SideBarProvider;
var storageManager: LocalStorageService;
var extPath = "";

export function activate(context: vscode.ExtensionContext) {
  setGlobalStorageUri(context.globalStorageUri.fsPath);
  extPath = getExtDbPath();
  checkDbFilesAndCreateIfNotExist();

  storageManager = new LocalStorageService(context.workspaceState);
  sideBarProvider = new SideBarProvider(context.extensionUri);

  context.subscriptions.push(AddToColUI(context.extensionUri));
  context.subscriptions.push(VariableUI(context.extensionUri));
  context.subscriptions.push(CookieUI(context.extensionUri));
  context.subscriptions.push(ErrorLogUI(context.extensionUri));
  context.subscriptions.push(CurlProviderUI(context.extensionUri));

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SideBarProvider.viewType,
      sideBarProvider
    )
  );

  context.subscriptions.push(
    MainUIProvider(context.extensionUri, sideBarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("fetch-client.openSettings", () => {
      vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "Fetch Client"
      );
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("fetch-client.keepInLocalPath")) {
        transferDbConfig();
      }
    })
  );
}

export function getStorageManager(): LocalStorageService {
  return storageManager;
}

export function deactivate() {}
