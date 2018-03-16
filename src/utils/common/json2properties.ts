
export default function json2properties (langObj) {
  let properties = {}
  parseJson(langObj, properties, '')
  return properties
}

function parseJson (langObj, properties, key) {
  if (key === '' || key === undefined) {
    key = ''
  } 
  for (const lKey in langObj) {
    let k = key ? `${key}.${lKey}` : lKey
    if (!(langObj[lKey] instanceof Object)) {
      properties[k] = langObj[lKey]
    } else {
      parseJson(langObj[lKey], properties, k)
    }
  }
}