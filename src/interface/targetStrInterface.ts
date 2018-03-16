import { Range } from 'vscode'

interface TargetStr {
  text: any,
  range: Range,
  isString: Boolean
}

export default TargetStr