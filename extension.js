const vscode = require("vscode");
const moment = require("moment");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "last-type.helloWorld",
    function () {
      const statusBar = vscode.window.createStatusBarItem(1, 10);
      let dateTime;
      const DATE_TIME_FORMAT = "MMMM Do YYYY, h:mm:ss a";

      let idle = 0;
      let timerId;

      const start = () => {
        timerId = setInterval(() => {
          if (idle >= 4) {
            statusBar.color = "white";
          }

          idle++;

          statusBar.text = `Last activity ${idle} ${
            idle === 1 ? "minute" : "minutes"
          } ago, ${dateTime}`;
        }, 60000);
      };

      vscode.workspace.onDidChangeTextDocument(() => {
        clearInterval(timerId);
        statusBar.color = undefined;

        idle = 0;

        statusBar.text = `just now`;

        dateTime = moment(new Date(), DATE_TIME_FORMAT);
        start();
      });

      statusBar.text = `just now`;

      dateTime = moment(new Date(), DATE_TIME_FORMAT);
      start();
      statusBar.show();
    }
  );

  context.subscriptions.push(disposable);
  vscode.commands.executeCommand("last-type.helloWorld");
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
