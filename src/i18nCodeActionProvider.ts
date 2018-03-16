'use strict'
import {ExtensionContext} from 'vscode'
import TargetStr from './interface/targetStrInterface'

export default class I18nCodeActionProvider {
  private context:ExtensionContext

  constructor (context) {
    this.context = context
  }

  provideCodeActions (document, range, context, token) {
    const langProper = this.context.globalState.get('langProper')
    const targetStrs: Array<TargetStr> = this.context.globalState.get('targetStrs')
    const targetStr = targetStrs.find(t => {
      return range.intersection(t.range) !== undefined
    })

    if (targetStr) {
      const sameTextStrs = targetStrs.filter(t => t.text === targetStr.text);
      const text = targetStr.text;

      const actions = [];
      for (const key in langProper) {
        if (langProper[key] === text) {
          actions.push({
            title: `抽取为 ${key}`,
            command: "viHelper.extractI18N",
            arguments: [{
              targets: sameTextStrs,
              varName: `I18N.${key}`,
            }]
          });
        }
      }

      return actions.concat({
        title: `抽取为自定义 I18N 变量（共${sameTextStrs.length}处）`,
        command: "viHelper.extractI18N",
        arguments: [{
          targets: sameTextStrs,
        }],
      });
    }
  } 
}