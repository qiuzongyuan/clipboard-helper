import { ExtensionContext, window, commands, env } from 'vscode';
import HistoryProvider from './historyProvider';
import ContentProvider from './contentProvider';
import ClipboardHelper from './clipboardHelper';
import HistoryItem from './historyProvider/historyItem';


export function activate(context: ExtensionContext) {
  const clipboardHelper = new ClipboardHelper();
	
  const historyProvider = new HistoryProvider();
  const historyView = window.createTreeView('history', {
    treeDataProvider: historyProvider,
  });

  const contentProvider = new ContentProvider();
  window.registerWebviewViewProvider('content', contentProvider);
  clipboardHelper.on((records) => {
    const items = historyProvider.renderItems(records);
    historyProvider.refresh();
    historyView.visible && items[0] && historyView.reveal(items[0], { focus: true, select: true});
  	contentProvider.updateWebView(records.at(-1) || '');
  });

  let clickCount = 0;
  let clickTimer: ReturnType<typeof setTimeout>;
  const clickCommand = commands.registerCommand('clickHistoryItem', async ({ content }: HistoryItem) => {
    clickCount++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(async () => {
      if (clickCount === 1) {
        contentProvider.updateWebView(content);
      } else if(content) {
        await env.clipboard.writeText(content);
        await commands.executeCommand('workbench.action.focusActiveEditorGroup');
        await commands.executeCommand('editor.action.clipboardPasteAction');
      }
      clearTimeout(clickTimer);
      clickCount = 0;
    }, 150);
  });

	const deleteCommand = commands.registerCommand('deleteHistoryItem', ({ id }: HistoryItem) => {
		id && clipboardHelper.delete(id);
	});

	const copyCommand = commands.registerCommand('copyHistoryItem', ({ content }: HistoryItem) => {
		content && env.clipboard.writeText(content);
	});
  
  [clickCommand, deleteCommand, copyCommand].forEach(disposable => context.subscriptions.push(disposable));
}

export function deactivate() {}