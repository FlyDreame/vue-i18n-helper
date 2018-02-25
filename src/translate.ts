'use strict'

/** 
 * @Author: FlyDreame 
 * @Date: 2018-02-25 15:27:24 
 * @Desc: 获取key值  
 * @Params:  
 */
const getKey = function (text) {
  const temp = text.match(/\([^(\(\))]*\)/)
  const keyStr = temp[0].match(/(\"[^\"]*\")|(\'[^\']*\')/)
  if (keyStr && keyStr.length > 0) {
    return keyStr[0].slice(1,-1)
  } else {
    return ''
  }
}

/** 
 * @Author: FlyDreame 
 * @Date: 2018-02-25 15:27:24 
 * @Desc: 获取key对应的value值  
 * @Params:  
 */
const getValue = function (langData, keyString) {

  if (!keyString) return false

  const keys = keyString.split('.')
  let val = null
  for (let key of keys) {
    val = val ? val[key] : langData[key]
    if (val === undefined ) {
      val = false
      break
    }
  }
  return val
}

export function transText (langData, sourceText) {
  const transThisText = sourceText.replace(/this.\$t\([^(\(\))]*\)/g, (word) => {
                
    const result = getValue(langData, getKey(word))
    
    return result ? `'${result}'` : word
  })
  const transText = transThisText.replace(/\$t\([^(\(\))]*\)/g, (word) => {
    
    const result = getValue(langData, getKey(word))
    
    return result ? `'${result}'` : word
  })
  return transText
}