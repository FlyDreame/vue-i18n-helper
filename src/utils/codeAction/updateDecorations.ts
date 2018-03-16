'use strict'
import * as vscode from 'vscode'
import { ExtensionContext } from 'vscode'
import TargetStr from '../../interface/targetStrInterface'

const chineseCharDecoration = vscode.window.createTextEditorDecorationType({
  borderWidth: '1px',
  borderStyle: 'dotted',
  overviewRulerColor: '#7499c7',
  overviewRulerLane: vscode.OverviewRulerLane.Right,
  light: {
    borderColor: '#7499c7'
  },
  dark: {
    borderColor: '#7499c7'
  }
})

export default function updateDecorations(context: ExtensionContext) {
  let targetStrs = []
  let activeEditor = vscode.window.activeTextEditor

  if (!activeEditor) {
    return
  }

  const possibleOccurenceEx = /(["'`])\s*(.+?)\s*\1|>\s*([^<{\)]+?)\s*[<{]/g
  const hasCJKEx = /[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uff1a\uff0c\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]|[\uff01-\uff5e\u3000-\u3009\u2026]/
  const containsCommentEx = /\/\*\*/
  const text = activeEditor.document.getText()
  const chineseChars: vscode.DecorationOptions[] = []

  let match
  while (match = possibleOccurenceEx.exec(text)) {
    let isString = true
    if (match[3]) {
      isString = false
    }

    const m = match[3] || match[2]
    if (!m.match(hasCJKEx) || m.match(containsCommentEx)) {
      continue
    }

    const leftTrim = match[0].replace(/^[>\s]*/m, '')
    const rightTrim = match[0].replace(/[<\{\s]*$/m, '')
    const leftOffset = match[0].length - leftTrim.length
    const rightOffset = match[0].length - rightTrim.length
    const finalMatch = m

    const startPos = activeEditor.document.positionAt(match.index + leftOffset + (isString ? 1 : 0))
    const endPos = activeEditor.document.positionAt(match.index + leftOffset + finalMatch.length + (isString ? 1 : 0))
    const range = new vscode.Range(startPos, endPos)
    const decoration = { range, hoverMessage: '检测到中文文案： **' + finalMatch + '**' }

    const targetStr:TargetStr = {
      text: finalMatch,
      range,
      isString,
    }
    targetStrs.push(targetStr)

    chineseChars.push(decoration)
  }
  context.globalState.update('targetStrs', targetStrs)
  activeEditor.setDecorations(chineseCharDecoration, chineseChars)

}