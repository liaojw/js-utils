## Usage

### In Browser

```html
<script src="base64.js"></script>
```

### npm

```javascript
$ npm install js-base64 --save
```

### node.js

```javascript
var Base64 = require('js-base64').Base64;
```

## SYNOPSIS

```javascript
Base64.encode('Andy');  // QW5keQ==
Base64.encode('安迪');    // 5a6J6L+q
Base64.encodeURI('安迪'); // 5a6J6L-q

Base64.decode('QW5keQ==');  // Andy
Base64.decode('5a6J6L+q');  // 安迪
Base64.decode('5a6J6L-q');  // 安迪
```

### String Extension for ES5

```javascript
if (Base64.extendString) {
    // you have to explicitly extend String.prototype
    Base64.extendString();
    // once extended, you can do the following
    'Andy'.toBase64();       // QW5keQ==
    '安迪'.toBase64();         // 5a6J6L+q
    '安迪'.toBase64(true);     // 5a6J6L-q
    '安迪'.toBase64URI();      // 5a6J6L-q
    'QW5keQ=='.fromBase64(); // Andy
    '5a6J6L+q'.fromBase64(); // 安迪
    '5a6J6L-q'.fromBase64(); // 安迪
}
```

