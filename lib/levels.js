const fs = require('fs')
const path = require('path')
const glob = require('glob')
const yaml = require('js-yaml')

function getLevels(files, log = console) {
    const contentLevels = []

    for (const filename of files) {
        let stat
        try {
            stat = fs.statSync(filename)
        } catch(error) {
            log.error(error.message)
            continue
        }

        if (stat.isDirectory()) {
            log.error(`Can’t to open file ${filename} because it's a directory.`)
            continue
        }

        log.info(`Open ${filename}`)
        contentLevels.push(openBySuffix(filename))
    }

    return contentLevels
}

function openBySuffix(filename) {
    const baseName = filename.split(path.sep).slice(-1)[0]
    const baseNameParts = baseName.split('.')
    const suffix = baseNameParts.slice(-1)[0].toLowerCase()

    if (suffix === 'yaml' || suffix === 'yml') {
        return yaml.load(fs.readFileSync(filename, {encoding:'utf8', flag:'r'}))
    }
    if (suffix === 'json') {
        return require(filename)
    }

    return fs.readFileSync(filename, {encoding:'utf8', flag:'r'})
}

function getFiles(patternsYaml) {
    let result = []
    if (!patternsYaml) {
        return result
    }

    let patterns = yaml.load(patternsYaml)
    if (typeof patterns === 'string') {
        patterns = [patterns]
    }

    for (const pattern of patterns) {
        const filenames = glob.sync(pattern)
        if (filenames.length) {
            result = result.concat(sortPaths(filenames))
        }
    }

    return result.filter((item, pos, self) => self.indexOf(item) == pos)
}

function sortPaths(paths) {
    return paths
        .map((item) => item.split(path.sep))
        .sort(tokensComparator)
        .map((item) => item.join(path.sep))
}

function tokensComparator(a, b) {
    const al = a.length
    const bl = b.length
    const l = Math.max(al, bl)

    for (let i = 0; i < l; i += 1) {
        if (al !== bl) {
            if (!(i + 1 in a)) return -1
            if (!(i + 1 in b)) return 1
        }
        if (a[i].toLowerCase() < b[i].toLowerCase()) return -1
        if (a[i].toLowerCase() > b[i].toLowerCase()) return 1
        if (a.length < b.length) return -1
        if (a.length > b.length) return 1
    }

    return 0
}

module.exports = {
    getLevels,
    getFiles,
    sortPaths,
    tokensComparator
}
