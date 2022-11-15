const action = require('../lib/action')

describe('test configLevels()', () => {
    const log = {info() {}, error() {}}

    test('expect object config', () => {
        expect(action.configLevels('- test/assets/**/conf1.yml', {}, log)).toStrictEqual({test: 'c1'})
    })
    test('expect array config', () => {
        expect(action.configLevels('- test/assets/**/conf2.yml', {}, log)).toEqual(['root2', 'a2', 'b2', 'c2'])
    })
    test('expect plain config', () => {
        expect(action.configLevels('- test/assets/**/file.txt', {}, log)).toEqual('root\ntestA\ntestB\n')
    })
})

describe('test getLoopItems()', () => {
    test('expect object config', () => {
        expect(action.getLoopItems('- boo\n- foo', 'yaml')).toEqual(['boo', 'foo'])
    })
    test('expect array config', () => {
        expect(action.getLoopItems('["boo","foo"]', 'json')).toEqual(['boo', 'foo'])
    })
    test('expect plain config', () => {
        expect(action.getLoopItems('boo\r\nfoo\n\n', 'text')).toEqual(['boo', 'foo'])
    })
})
