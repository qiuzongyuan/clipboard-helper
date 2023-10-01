import { TreeItem, TreeItemCollapsibleState, Uri } from 'vscode';
import { resolve } from 'path';
export default class HistoryItem extends TreeItem {
  content?: string;
  constructor(id: string, label: string) {
    super(`${+id + 1}  ${label}`, TreeItemCollapsibleState.None);
    this.id = id;
    this.content = label;
    this.contextValue = 'historyItem';
    this.description = '';
    this.command = {
      title: 'click',
      command: 'clickHistoryItem',
      arguments: [this]
    };
    this.iconPath = resolve(__filename, '../../../assets/item.svg');
  }
}