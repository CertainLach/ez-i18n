var assert = require('chai').assert;

var success=true;
var translator;
try{
    translator=new (require(__dirname+'/../index.js'))({
        langDir:__dirname+'/data/'
    });
}catch(e){
    success=false;
}

describe('Basic', function () {
    describe('#Init', function () {
        it('should start correctly', function () {
            assert.equal(true, success);
        });
        it('should return translator function', function () {
            assert.equal('function', typeof translator);
        });
    });
    describe('#Translate', function () {
        it('should return correct string for every language', function () {
            assert.equal('ru', translator('ru')('test'));
            assert.equal('en', translator('en')('test'));
        });
    });
    describe('#Templating', function () {
        it('should return correct templated string for all arguments', function () {
            assert.equal('1 ru 3', translator('ru')('test2',1,2,3,4));
            assert.equal('3 en 2', translator('en')('test2',1,2,3,4));
            assert.equal('1 ru 1', translator('ru')('test3',1,2,3,4));
            assert.equal('2 en 2', translator('en')('test3',2,2,3,4));
        });
        it('should return correct templated string for data object', function () {
            assert.equal('123 ru string', translator('ru')('test4',{data1:123,data2:'string'}));
            assert.equal('123 ru 123', translator('ru')('test5',{data1:123,data2:'string'}));   
            assert.equal('123 en string', translator('en')('test4',{data1:123,data2:'string'}));
            assert.equal('123 en 123', translator('en')('test5',{data1:123,data2:'string'}));   
        });
    });
    describe('#Pluralizing', function () {
        it('should correctly pluralize a string for all languages', function () {
            assert.equal('1 gift', translator('en')('test6'));
            assert.equal('2 gifts', translator('en')('test7'));
            
            assert.equal('1 подарок', translator('ru')('test6'));
            assert.equal('2 подарка', translator('ru')('test7'));
            assert.equal('12 подарков', translator('ru')('test8'));
        });
    });
    describe('#Misc', function () {
        it('can work for yml structures', function () {
            assert.equal('Success', translator('en')('test9.test.test'));
            assert.equal('Успешен', translator('ru')('test9.test.test'));
        });
    });
});