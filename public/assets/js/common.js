webpackJsonp([0],[
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = One;
/* unused harmony export Two */
function One() {
  console.log('One');
}

function Two() {
  console.log('Two');
}

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_example_js__ = __webpack_require__(0);


__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__modules_example_js__["a" /* One */])();

var arr = ['foo', 'bar', 'bar', 'test', 'test'];

console.log(Array.from(new Set(arr)));

/***/ })
],[2]);