"use strict";

const yaml = require("js-yaml");
const fs = require("fs");

class translator {
    constructor(options) {
        this.languages = {};
        if (!options)
            throw 'No options passed!';
        if (options.debug) {
            console.log('debug output enabled');
            this.debug = true;
        }
        if (options.warns) {
            console.log('warn output enabled');
            this.warn = true;
        }
        if (!options.langDir)
            throw 'Translation directory is not set!';
        let langFiles = fs.readdirSync(options.langDir);
        if (this.debug)
            console.log('loading', langFiles);
        langFiles.forEach(langFile => {
            try {
                let file = fs.readFileSync(options.langDir + '/' + langFile, options.encoding || 'utf-8');
                let langName = langFile.split('.')[0];
                this.languages[langName] = yaml.load(file);
                if (this.debug)
                    console.log('loaded', langFile);
            }
            catch (e) {
                throw 'Can\'t load file ' + langFile + ': ' + e.message;
            }
        });
        const self = this;
        return function (lang) {
            if (!self.languages[lang])
                throw 'No such language: ' + lang + '!';
            let pluralize=getPluralType(lang);
            return function (string) {
                for (var _len = arguments.length, format = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    format[_key - 1] = arguments[_key];
                }
                let context = self.languages[lang];
                let retval = false;
                string.split('.').forEach(token => {
                    if (!context[token]){
                        if (self.warn)
                            console.warn('No translation for ' + string + '.');
                        retval = 'No translation for ' + string + '.';
                    }
                    context = context[token];
                });
                if (retval)
                    return retval;
                if (self.debug)
                    console.log('in context', context, format);
                retval = context;
                if (typeof format[0] == 'object') {
                    if (format[1])
                        if (self.warn)
                            console.warn('Wrong argument count!');
                    Object.keys(format[0]).forEach(key => {
                        retval = retval.replace(new RegExp('\\{' + key + '\\}', 'g'), format[0][key]);
                    });
                }
                else {
                    format.forEach((r, i) => {
                        retval = retval.replace(new RegExp('\\{' + (i+1) + '\\}', 'g'), r);
                    });
                }
                let plurals=retval.match(/(%[^%&]+&[0-9]+%)/g);
                if(!plurals)
                    return retval;
                if(self.debug)
                    console.log(plurals);
                plurals.forEach(plural=>{
                    let plinfo=plural.match(/%([^&%]+)&([0-9]+)%/);
                    let out=self.languages[lang].plurals[plinfo[1]];
                    if(self.debug)
                        console.log(out,self.languages[lang].plurals);
                    if(!out){
                        if (self.warn)
                            console.warn('No plural for '+plinfo[1]+'.');
                        out='No plural for '+plinfo[1]+'.';
                        retval=retval.replace(new RegExp(plural,'g'),out);
                        return;
                    }
                    let plnum=pluralize(parseInt(plinfo[2],10));
                    if(self.debug)
                        console.log(plnum,parseInt(plinfo[2],10));
                    out=out[plnum];
                    if(!out){
                        if (self.warn)
                            console.warn('No plural form for '+plinfo[1]+'.');
                        out='No plural form for '+plinfo[1]+'.';
                        if(self.debug)
                            console.log(out,plinfo);
                        retval=retval.replace(new RegExp(plural,'g'),out);
                        return;
                    }
                    retval=retval.replace(new RegExp(plural,'g'),out);
                });
                return retval;
            };
        };
    }
}


/**
 * Todo: use babel-js
 * export default translator;
 **/
module.exports = translator;

const getPluralType = lang => {
    //Chinese
    if (['fa', 'id', 'ja', 'ko', 'lo', 'ms', 'th', 'tr', 'zh'].indexOf(lang) + 1)
        return n => 0;
    //German
    if (['da', 'de', 'en', 'es', 'fi', 'el', 'he', 'hu', 'it', 'nl', 'no', 'pt', 'sv'].indexOf(lang) + 1)
        return n => n !== 1 ? 1 : 0;
    //French
    if (['fr', 'tl', 'pt-br'].indexOf(lang) + 1)
        return n => n > 1 ? 1 : 0;
    //Russian
    if (['hr', 'ru'].indexOf(lang) + 1)
        return n => n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
    //Czech
    if (['cs'].indexOf(lang) + 1)
        return n => (n === 1) ? 0 : (n >= 2 && n <= 4) ? 1 : 2;
    //Polish
    if (['pl'].indexOf(lang) + 1)
        return n => (n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
    //Iceland
    if (['is'].indexOf(lang) + 1)
        return n => (n % 10 !== 1 || n % 100 === 11) ? 1 : 0;
    return n => 0;
};