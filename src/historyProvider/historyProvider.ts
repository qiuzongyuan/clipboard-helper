import { TreeDataProvider, TreeItem, ProviderResult, EventEmitter, Event } from 'vscode';
import HistoryItem from './historyItem';

export default class HistoryProvider implements TreeDataProvider<HistoryItem> {
  private _onDidChangeTreeData: EventEmitter<TreeItem | undefined | void> = new EventEmitter<TreeItem | undefined | void>();
  readonly onDidChangeTreeData: Event<TreeItem | undefined | void> = this._onDidChangeTreeData.event;
  private items: HistoryItem [] = [];

  getTreeItem(element: HistoryItem): TreeItem {
   return element;
  }

  getChildren(): ProviderResult<HistoryItem[]> {
    return this.items;
  }

  getParent(element: HistoryItem): ProviderResult<HistoryItem> {
    return element;
  }

  renderItems (records: string []): HistoryItem [] {
    const items:  HistoryItem [] =  [];
    const len = records.length;
    let index = 0;
    for (let i = len - 1; i >= 0; i--) {
      const record = records[i];
      const item = new HistoryItem(`${index}` ,`${record}`);
      items.push(item);
      index++;
    }
    this.items = items;
    return items;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

}