const parser = require('../lib/parser')

describe('test modifyPattern()', () => {
    test('expect modifed pattern in several rows', () => {
        expect(parser.modifyPattern('- test/{{ item }}/**/foo.yml\n- test/{{ item }}/**/boo.yml', 'a'))
            .toEqual('- test/a/**/foo.yml\n- test/a/**/boo.yml')
    })
    test('expect several modification in one row', () => {
        expect(parser.modifyPattern('- test/{{item}}/**/{{item}}/foo.yml', 'a')).toEqual('- test/a/**/a/foo.yml')
    })
    test('expect brackets to be removed if the variable does not exist', () => {
        expect(parser.modifyPattern('- test/{{ boo }}/**/foo.yml', 'a')).toEqual('- test//**/foo.yml')
    })
})
