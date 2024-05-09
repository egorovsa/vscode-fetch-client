import * as vscode from "vscode";

export function OpenExistingItem(
  id?: string,
  name?: string,
  colId?: string,
  folderId?: string,
  varId?: string,
  type?: string
) {
  vscode.commands.executeCommand(
    "fetch-client.newRequest",
    id,
    name && name.length > 15 ? name.substring(0, 15) + "..." : name,
    colId,
    varId,
    type,
    folderId
  );
}

export function OpenAddToColUI(id: string) {
  vscode.commands.executeCommand(
    "fetch-client.addToCol",
    id,
    "",
    "",
    "addtocol"
  );
}

export function OpenVariableUI(id?: string, type?: string) {
  vscode.commands.executeCommand("fetch-client.newVar", id, type);
}

export function OpenCopyToColUI(id: string, name: string) {
  vscode.commands.executeCommand(
    "fetch-client.addToCol",
    id,
    "",
    name,
    "copytocol"
  );
}

export function OpenAttachVariableUI(id: string, name: string) {
  vscode.commands.executeCommand(
    "fetch-client.addToCol",
    id,
    "",
    name,
    "attachcol"
  );
}

export function OpenRunAllUI(
  colId: string,
  folderId: string,
  name: string,
  varId: string
) {
  vscode.commands.executeCommand(
    "fetch-client.addToCol",
    colId,
    folderId,
    name,
    "runall",
    varId
  );
}

export function OpenCookieUI(id?: string) {
  vscode.commands.executeCommand("fetch-client.manageCookies", id);
}

export function OpenCurlUI() {
  vscode.commands.executeCommand("fetch-client.curlRequest");
}

export function OpenColSettings(
  colId: string,
  folderId: string,
  name: string,
  type: string,
  varId: string
) {
  vscode.commands.executeCommand(
    "fetch-client.addToCol",
    colId,
    folderId,
    name,
    "colsettings:" + type,
    varId
  );
}
