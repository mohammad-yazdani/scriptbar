// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "scriptbar" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('scriptbar.selectScript', () => {
		// The code you place here will be executed every time your command is executed
		let items: vscode.QuickPickItem[] = [];

		const testFolders = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path);
		if (testFolders === undefined) {
			console.log("huh");
		} else {
			const testFolder = testFolders[0];
			const fs = require('fs');

			const scriptConfig = testFolder + "/.vscode/scripts.json";
			let rawdata = fs.readFileSync(scriptConfig);
			let scripts = JSON.parse(rawdata)["scripts"];

			scripts.forEach((script: any, index: any) => {
				// let message = JSON.stringify(script);
				let title = script.title;
				let command = script.command;
				items.push({
					label: title,
					description: command
				});
			});

			vscode.window.showQuickPick(items).then(selection => {
				// the user canceled the selection
				if (!selection) {
					return;
				}
				let command = selection.description ? selection.description : "echo Nothing to do :/";
				const cp = require('child_process');
				cp.exec(command, (err: string, stdout: string, stderr: string) => {
					vscode.window.showInformationMessage('stdout: ' + stdout);
					vscode.window.showInformationMessage('stderr: ' + stderr);
					if (err) {
						vscode.window.showInformationMessage('error: ' + err);
					}
				});
			});
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
