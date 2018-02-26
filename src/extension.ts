'use strict';
import { workspace, languages, window, commands, ExtensionContext, Disposable, Uri } from 'vscode'
import * as path from 'path'
import * as fse from 'fs-extra'
import * as fs from 'fs'
import I18nDiffViewProvider from './i18nDiffViewProvider'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  const rootPath = workspace.rootPath											// 项目根路径
  const config = workspace.getConfiguration('viHelper')		// 获取配置信息
  const i18nFilePath = config.i18nFilePath								// 资源文件路径
  const language = config.language												// 翻译语言

	// 提供vue文件的翻译内容
	const i18nDiffViewProvider = new I18nDiffViewProvider(path.join(rootPath, i18nFilePath))
	const providerRegistrations = Disposable.from(
		workspace.registerTextDocumentContentProvider(I18nDiffViewProvider.scheme, i18nDiffViewProvider)
	)

	// 显示翻译内容diff命令
	const disposable = commands.registerCommand('viHelper.showi18nPanel', async () => {
		const document = window.activeTextEditor.document
    const activeUri = document.uri
    const sourceText = document.getText()
		const filePath = activeUri.fsPath.toString()


		if (activeUri.scheme !== I18nDiffViewProvider.scheme) {
			try {
				// i18n模块路径
				const i18nPath = path.join(rootPath, '/node_modules/vue-i18n/dist/vue-i18n.common.js')
				// vue-i18n的翻译文件路径
				const i18nLangPath = path.join(rootPath, i18nFilePath)
				// 检测翻译文件路径是否存在
				await fse.ensureFile(i18nLangPath)
				// 打开diff
				commands.executeCommand(
					'vscode.diff', 
					activeUri, 
					activeUri.with({
						scheme: I18nDiffViewProvider.scheme,
						path: activeUri.path,
						query: JSON.stringify({
							path: activeUri.fsPath
						})
					}),
					'vue-i18n-helper', 
					{
						preview: true
					}
				)
	
			} catch (error) {
				window.showErrorMessage('未找到翻译文件：' + path.join(rootPath, i18nFilePath))
			}
		} else {
			commands.executeCommand('workbench.action.closeActiveEditor')
		}
		
	})

	// 注册命令
	context.subscriptions.push(
		disposable,
		providerRegistrations
	)
}

// this method is called when your extension is deactivated
export function deactivate() {
}