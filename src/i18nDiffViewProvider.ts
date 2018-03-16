'use strict'

import { TextDocumentContentProvider, Uri, workspace, ExtensionContext } from 'vscode'
import * as fs from 'fs'
import {transText} from './translate'
import * as fse from 'fs-extra'

export default class i18nDiffViewProvider implements TextDocumentContentProvider {
  static scheme = 'i18nDiff'
  private context:ExtensionContext

  constructor(context) {
    this.context = context
  }

  provideTextDocumentContent(uri: Uri): string {
    try {
      const filePath = uri.fsPath
      const sourceText = fs.readFileSync(filePath, "utf-8")
      return transText(this.context.globalState.get('langObj'), sourceText)
    } catch (error) {
      console.error(error)
      return '翻译对比出现错误'
    }
  }
}