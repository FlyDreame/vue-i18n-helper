'use strict'

import { TextDocumentContentProvider, Uri, workspace } from 'vscode'
import * as fs from 'fs'
import {transText} from './translate'
import * as fse from 'fs-extra'

export default class i18nDiffViewProvider implements TextDocumentContentProvider {
  static scheme = 'i18nDiff'
  private i18nLangPath = ''

  constructor(i18nLangPath) {
    this.i18nLangPath = i18nLangPath
  }

  provideTextDocumentContent(uri: Uri): string {
    try {
      const filePath = uri.fsPath
      const langData = fse.readJsonSync(this.i18nLangPath)
      const sourceText = fs.readFileSync(filePath, "utf-8")
      return transText(langData, sourceText)
    } catch (error) {
      console.error(error)
      return '翻译对比出现错误'
    }
  }
}