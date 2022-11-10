
function modifyPattern(patterns, item) {
    const reItem = /\{\{(.*?)\}\}/
    const patternContent = patterns.split('\n')
    const options = {item: item}

    for (let i = 0; i < patternContent.length; i++) {
        for (let match = patternContent[i].match(reItem), result; match;) {
            result = options[match[1].trim()]
            patternContent[i] = patternContent[i].replace(match[0], result ? result : '')
            match = patternContent[i].match(reItem)
        }
    }

    return patternContent.join('\n')
}

module.exports = {
    modifyPattern
}
