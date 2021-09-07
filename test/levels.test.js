const levels = require('../lib/levels')

describe('test tokensComparator()', () => {
    test('expect zero on empty arrays', () => {
        expect(levels.tokensComparator([], [])).toEqual(0)
    })
    test('expect zero on empty strings', () => {
        expect(levels.tokensComparator([''], [''])).toEqual(0)
    })
    test('expect zero if items is equal', () => {
        expect(levels.tokensComparator(['a'], ['a'])).toEqual(0)
    })
    test('expect zero if items is deep equal', () => {
        expect(levels.tokensComparator(['a', 'b', 'c'], ['a', 'b', 'c'])).toEqual(0)
    })
    test('expect heavier string is more than easier string', () => {
        expect(levels.tokensComparator(['ab'], ['ac'])).toEqual(-1)
    })
    test('expect easier string is less than heavier string', () => {
        expect(levels.tokensComparator(['ac'], ['ab'])).toEqual(1)
    })
    test('expect heavier array is more than easier array', () => {
        expect(levels.tokensComparator(['a', 'b', 'd'], ['a', 'c', 'd'])).toEqual(-1)
    })
    test('expect easier array is less than heavier array', () => {
        expect(levels.tokensComparator(['a', 'c', 'd'], ['a', 'b', 'd'])).toEqual(1)
    })
    test('expect leaf is more than node', () => {
        expect(levels.tokensComparator(['c'], ['b', 'a'])).toEqual(-1)
    })
    test('expect node is less than leaf', () => {
        expect(levels.tokensComparator(['b', 'a'], ['c'])).toEqual(1)
    })
    test('expect short array is more than long array', () => {
        expect(levels.tokensComparator(['a', 'b'], ['a', 'b', 'a'])).toEqual(-1)
    })
    test('expect long array is less than short array', () => {
        expect(levels.tokensComparator(['a', 'b', 'a'], ['a', 'b'])).toEqual(1)
    })
})

describe('test sortPaths()', () => {
    test('expect ordered paths', () => {
        expect(levels.sortPaths([
            'a/b',
            'a/a/a',
            'b/a',
            '.a',
            'c'
        ])).toEqual([
            '.a',
            'c',
            'a/b',
            'a/a/a',
            'b/a'
        ])
    })
})

describe('test getFiles()', () => {
    test('expect empty result if pattern isn\'t match', () => {
        expect(levels.getFiles('test/assets/missing.yml')).toEqual([])
    })
    test('expect processing of the pattern as a string', () => {
        expect(levels.getFiles('test/assets/conf1.yml')).toEqual([
            'test/assets/conf1.yml'
        ])
    })
    test('expect selection of all files in gradual order', () => {
        expect(levels.getFiles('- test/assets/**/*.yml')).toEqual([
            'test/assets/conf1.yml',
            'test/assets/conf2.yml',
            'test/assets/a/conf1.yml',
            'test/assets/a/conf2.yml',
            'test/assets/b/conf1.yml',
            'test/assets/b/conf2.yml',
            'test/assets/a/c/conf1.yml',
            'test/assets/a/c/conf2.yml',
            'test/assets/a/c/dir.yml'
        ])
    })
    test('expect selection of all files in level by level order', () => {
        expect(levels.getFiles('- test/assets/**/*1.yml\n- test/assets/**/*2.yml')).toEqual([
            'test/assets/conf1.yml',
            'test/assets/a/conf1.yml',
            'test/assets/b/conf1.yml',
            'test/assets/a/c/conf1.yml',
            'test/assets/conf2.yml',
            'test/assets/a/conf2.yml',
            'test/assets/b/conf2.yml',
            'test/assets/a/c/conf2.yml'
        ])
    })
    test('expect no duplication', () => {
        expect(levels.getFiles('- test/assets/**/*1.yml\n- test/assets/**/*1.yml')).toEqual([
            'test/assets/conf1.yml',
            'test/assets/a/conf1.yml',
            'test/assets/b/conf1.yml',
            'test/assets/a/c/conf1.yml'
        ])
    })
})

describe('test getLevels()', () => {
    const log = {info() {}, error() {}}

    test('expect empty result on empty input', () => {
        expect(levels.getLevels([], log)).toEqual([])
    })
    test('expect content object if files exists', () => {
        expect(levels.getLevels([
            'test/assets/conf1.yml',
            'test/assets/a/c/dir.yml',
            'test/assets/a/c/conf2.yml',
            'test/assets/a/file.txt',
            'test/assets/missing.yml'
        ], log)).toStrictEqual([
            {'test': 'root1'},
            ['c2'],
            'testA\n',
        ])
    })
})
