# Chess Helper Extension

[Demo Video](https://www.youtube.com/watch?v=C99DwXs6JNU)
|
[Trello Board](https://trello.com/b/xaiPLyB0)
|
[Chrome Web Store](https://chrome.google.com/webstore/detail/bghaancnengidpcefpkbbppinjmfnlhh/)
|
[Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/chess-com-keyboard/)

[![Build Status](https://travis-ci.com/everyonesdesign/Chess-Helper.svg?branch=master)](https://travis-ci.com/everyonesdesign/Chess-Helper)

A small Google Chrome extension adding keyboard navigation to [chess.com](https://www.chess.com/) website.

It supports moves input in:

- algebraic notation: 'Nf3', '0-0';
- coordinates notation: 'e2e4' ('e2 e4' and 'e2-e4' can be also used).

Other move formats may be implemented in future.

<img src="https://i.imgur.com/ehN2pfT.png" alt="Chess Helper Extension" width=428 height=474>

This way of moving pieces may enhance your board vision skills; it can also be used to improve chess.com interface accessibility.


## Command line instructions

Install dependencies

```
npm i
```

Build the project

```
npm run build
```

Build the and watch file changes

```
npm run watch
```

Run tests

```
npm run test
```

Pack the extension (before release to extension stores)

```
npm run pack
```


## Disclaimers

The extension code may contain bugs and errors.
By using the extension user agress that extension author DOESN'T take
any responsibility for the mistakes in the game, caused by the extension usage,
or the problems with game process, caused the by the software usage.

The application is NOT designed to violate chess.com terms of usage in any way.
In case if chess.com contacts extension author about the viloations
the software may be modified or removed from Chrome Web Store.


## License

The extension is MIT-licensed
