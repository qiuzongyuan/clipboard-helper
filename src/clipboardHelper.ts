import { window, env} from 'vscode';
type Event = (records: string []) => void;
export default class ClipboardHelper {
  constructor () {
    this.monitor();
  }
  // curRecord: string = '';
  private records: string [] = [];
  private events: Event [] = [];
  private monitor () {
    const handle = async () => {
      const text = await env.clipboard.readText();
      const record = text.trim();
      const lastRecord = this.records.at(-1);
      if (lastRecord !== record && record !=='') {
        const set = new Set(this.records);
        set.delete(record);
        set.add(record);
        this.records = [...set];
        this.emit();
      }
    };
    window.onDidChangeWindowState(handle);
    window.onDidChangeTextEditorSelection(handle);
  }

  delete (index: string | number) {
    const cloneRecords = this.records.slice();
    cloneRecords.splice(+index - 1, 1);
    this.records = cloneRecords;
    this.emit();
    
  }

  on (event: Event) {
    this.events.push(event);
  }

  private emit () {
    this.events.forEach(event => {
      event(this.records);
    });
  }
}