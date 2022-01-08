# Chess Helper Extension

[![Build Status](https://github.com/everyonesdesign/Chess-Helper/actions/workflows/test.yml/badge.svg)
](https://github.com/everyonesdesign/Chess-Helper/actions)

## Download extension

[Chrome Web Store](https://chrome.google.com/webstore/detail/bghaancnengidpcefpkbbppinjmfnlhh/)
|
[Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/chess-com-keyboard/)
|
[Opera addons](https://addons.opera.com/en/extensions/details/chesscom-keyboard/)
|
[Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/illcfglagdbmhknamgjfcpkkpdfddnno)

## Other links

[Website](http://everyonesdesign.ru/apps/chesscom-keyboard/)
|
[Demo Video](https://www.youtube.com/watch?v=C99DwXs6JNU)
|
[Trello Board](https://trello.com/b/xaiPLyB0)
|
[☕ Buy me a coffee](https://buymeacoff.ee/everyonesdesign)

## About

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

Run unit tests

```
npm run test
```

Run e2e tests (Cypress)

```
npm run e2e
```

Pack the extension (before release to extension stores)

```
npm run pack
```

## Memo for the extension publishing

- [Chrome Web Store](https://chrome.google.com/webstore/developer/dashboard)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/developers/)
- [Opera addons](https://addons.opera.com/developer/)
- [Edge Add-ons](https://partner.microsoft.com/en-us/dashboard/microsoftedge/overview)

Support of manifest v3: Chrome, Edge

## Disclaimers

The extension code may contain bugs and errors.
By using the extension user agress that extension author DOESN'T take
any responsibility for the mistakes in the game, caused by the extension usage,
or the problems with game process, caused the by the software usage.

The application is NOT designed to violate chess.com terms of usage in any way.
In case if chess.com contacts extension author about the viloations
the software may be modified or removed from the extensions stores.


## License

The extension is MIT-licensed
