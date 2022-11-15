
function getByPath(source, target) {
    return target.trim()
        .split('.')
        .reduce((obj, i) => obj[i], source)
}

function modifyPattern(patterns, item) {
    const reItem = /\{\{(.*?)\}\}/
    const patternContent = patterns.split('\n')
    const options = {item: item}

    for (let i = 0; i < patternContent.length; i++) {
        for (let match = patternContent[i].match(reItem), result; match;) {
            result = getByPath(options, match[1])
            patternContent[i] = patternContent[i].replace(match[0], result ? result : '')
            match = patternContent[i].match(reItem)
        }
    }

    return patternContent.join('\n')
}

module.exports = {
    getByPath,
    modifyPattern
}
