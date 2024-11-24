import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('charts---diagrams.startPreview', () => {
		vscode.window.showInformationMessage('Charts preview started.');
        const editor = vscode.window.activeTextEditor; 
        if(!editor){
            vscode.window.showErrorMessage('No active editor found. Open a file to preview Mermaid diagrams.');
        }

		const panelWebView = vscode.window.createWebviewPanel(
			'chartPreview',
			`${new Date().getTime()}`,
			vscode.ViewColumn.One,
			{
				enableScripts: true
		});
        const initialContent = editor?.document.getText();
		panelWebView.webview.html = getWebviewContent(initialContent);

        const changeListener = vscode.workspace.onDidChangeTextDocument(event => {
            if(event.document == editor?.document){
                panelWebView.webview.html = getWebviewContent(event.document.getText())
            }
        })

        panelWebView.onDidDispose(() => {
            changeListener.dispose();
        })
	});

	context.subscriptions.push(disposable);
}

function getWebviewContent(content: string | undefined): string {
	return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mermaid Preview</title>
            <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
            <script>
                mermaid.initialize({ startOnLoad: true });
            </script>
        </head>
        <body>
            <div class="mermaid">
                ${content}
            </div>
        </body>
        </html>
    `;
}

export function deactivate() { }
