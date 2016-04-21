# EZ-I18N

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
const translator = ez_i18n({
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