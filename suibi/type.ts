class A_ {

}
// 实现
var A = (function() {
    function A() {

    }
    return A;
})()

var _extends = (this && this._extends) || (function () {
    var extendStatics = function(d, b) {
        // setPrototypeOf(d, b) 为现在有对象设置原型 第一个为现在有对象 第二个原型对象
        extendStatics = Object.setPrototypeOf || 
        ({__proto__: []} instanceof Array && function(d, b) {d.__proto__ = b;}) ||
        function(d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p];}}};
        return extendStatics(d, b);
        // 将 d的原型挂到父类上 b;
    }

    return function(d, b) {
        extendStatics(d, b);
        function _() { this.constructor = d;} // 将constructor 指向子对象 后面的操作会更改contructor的指向}
        d.prototype = b === null ? Object.create(b) : (_.prototype = b.prototype, new _());
        // 当父类不是null时 将父类的prototype 指向 方法_ 在用new调用方法生成一个对复制的父类对像
        // 把复制的对象 在给子对象
        // 得d的prototype是一个新复制的父对象，且constructor指向d
    }
})();

class B_ extends A_ {

}
var B = (function(_super) {
    _extends(B, _super);
    function B() {
        // return _super.call(this) || this;
        // return _super !== null && _super.apply(this, arguments) || this;
    }
    return B
})(A);

// function getVal(val: string): string
//  {
//     return val;
// }
type aa = string | number;
function getVal<T extends aa, K, U, Z>(val: T): T {
    return ;
}
getVal<number, string, string, string>(1);
// function getVal(val: string) {}

interface Person {
    name: string;
    age: number;
}
let personProps: keyof Person;