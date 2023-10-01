import { WebviewViewProvider, WebviewView, Webview } from 'vscode';

export default class ContentProvider implements WebviewViewProvider {

  private webview?: Webview;

  private getContentHtml (content: string = '') {
    content = content.replace(/&/g, '&amp;');
    content = content.replace(/</g, '&lt;');
    content = content.replace(/>/g, '&gt;');
    const html = `
        <html>
          <head>
          <style>
              pre {
                white-space: pre;
                font-family: monospace;
              }
            </style>
          </head>
          <body>
              <p>
                <pre>${content}</pre>
              </p>
          </body>
        </html>
    `;
    return html;
  }

  resolveWebviewView({ webview }: WebviewView) {
    webview.html = this.getContentHtml();
    this.webview = webview;
  }

    updateWebView(content?: string) {
    if (this.webview) {
      this.webview.html = this.getContentHtml(content);
    }
  }
}