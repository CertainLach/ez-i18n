# EZ-I18N

[![Greenkeeper badge](https://badges.greenkeeper.io/Creeplays/ez-i18n.svg)](https://greenkeeper.io/)

## Features:
- Requires only one external module
- Contains built-in formatter support (For strings and objects)
- Plural support for 30 languages!
- Very fast
- Translations stored in .yml files

## Basic example
- Create a folder for translations (E.g 'i18n')
- Create a file with all strings in it, E.g file en.yml
```yml
hello: Hello, {who}!
msgCount: You have {count} %message&{count}%

plurals:
    message:
        - message
        - messages
```
- Then init module in your app:
```js
const ez_i18n = require('ez-i18n');
const translator = new ez_i18n({
    langDir:__dirname+'/i18n/'
});
/**
 * Syntax for that command is 
 *   ez_i18n(<options>);
 * Options object contain these keys:
 * langDir <STRING> - directory, where translations are stored
 * encoding <STRING> - encoding for translation files (Optional, defaults to UTF-8)
 * warns <BOOL> - show a warnings for missing translations? (Optional, defaults to false)
 * debug <BOOL> - show a debug info. Dont use it. (Optional, defaults to false)
 * returns <FUNCTION>
 **/
```
- Create a translator for a specified language:
```js
const _ = translator('en');
/**
 * Syntax for that command is 
 * translator(<lang>)
 * lang <STRING> - language to use, e.g 'en'
 * returns <FUNCTION>
 **/
```
- And use it:
```js
console.log(_('hello', {who: 'world'}));
// Hello, world!
console.log(_('msgCount', {count: 1}));
// You have 1 message
console.log(_('msgCount', {count: 2}));
// You have 2 messages
```

##Format string
```
Syntax is %{string} or %{num}
If num used, then function uses params passed to function:
  E.g: _('str','test1','test2','test3')
    %{1} will be 'test1'
    %{2} will be 'test2'
    %{3} will be 'test3'

Othervise strings from object will be used:
  E.g: _('str',{test1:'test2',test3:'test4',test5:'test6'})
    %{test1} will be 'test2'
    %{test3} will be 'test4'
    %{test5} will be 'test6'
```

##Plurals
```
Syntax is #{string,count}
```
##Randoms
```
Syntax is ${string}
```

##Test results
```
  Basic
    #Init
      ✓ should start correctly
      ✓ should return translator function
    #Translate
      ✓ should return correct string for every language
    #Templating
      ✓ should return correct templated string for all arguments
      ✓ should return correct templated string for data object
    #Pluralizing
      ✓ should correctly pluralize a string for all languages
    #Misc
      ✓ can work for yml structures


  7 passing (8ms)
```