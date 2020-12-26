const vscode = require("vscode");
let timerId;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let dateTime;
  let idle = 0;

  const onInit = vscode.commands.registerCommand("last-type.init", function () {
    const statusBarItem = vscode.window.createStatusBarItem(1, 10);
    statusBarItem.command = "last-type.click";

    const start = () => {
      timerId = setInterval(() => {
        idle++;

        statusBarItem.text = `Last activity ${idle} ${
          idle === 1 ? "minute" : "minutes"
        } ago`;
      }, 60000);
    };

    vscode.workspace.onDidChangeTextDocument(() => {
      clearInterval(timerId);

      dateTime = new Date().toString();
      idle = 0;
      statusBarItem.text = `just now`;

      start();
    });

    statusBarItem.text = `just now`;
    dateTime = new Date().toString();

    start();

    statusBarItem.show();
  });

  vscode.commands.registerCommand("last-type.click", function () {
    vscode.window.showInformationMessage(
      `Last typed ${idle} ${
        idle === 1 ? "minute" : "minutes"
      } ago, at ${dateTime}`
    );
  });

  context.subscriptions.push(onInit);
  vscode.commands.executeCommand("last-type.init");
}

// this method is called when your extension is deactivated
function deactivate() {
  clearInterval(timerId);
}

module.exports = {
  activate,
  deactivate,
};
