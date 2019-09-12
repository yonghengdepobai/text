// 接口提供了一种说明一个对象应该具有哪些方法的手段
// 可以按对象提供的特性对它们进行分组

// 既定的一批接口具有自我描述性，并能促进代码的重。接口可以告诉定义了哪些方法，从而实现这个类
// 有助于稳定不同的类之间的通信方式

// 接口在运用设计模式实现复杂系统的时候最能体现其价值。它看似降低了js的灵活性，而实际上，因为使用接口可以降低对象间的耦合程度，
// 所以它提高了代码的灵活性。接口的使用可以让函数变得灵活，因为你既能向函数传递任何类型的参数，
// 又能保证它只会使用那些具有必要方法的对象

const Interface = function(name, methods) {
    if (arguments.length !== 2) {
        throw new Error('.....');
    }

    this.name = name;
    this.methods = [];

    for (let i = 0, len = methods.length; i < len; i++) {
        if (typeof methods[i] !== 'string') {
            throw new Error('.....typeError');
        }
        this.methods.push(methods[i]);
    }

}

Interface.ensureImplements = function(object) {
    if (arguments.length < 2) {
        throw Error('....xx');
    }

    for (let i = 1, len = arguments.length; i < len; i++) {
        let interface = arguments[i];
        if (interface.constructor != Interface) {
            throw Error('xxxx');
        }

        for (let j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
            var method = interface.methods[i];
            if (!object[method] || typeof object[method] !== 'function') {
                throw new Error('zzzzzzz');
            }
        }
    }

}

interface A{
    aaa(): string;
}

class B implements A {
    private static aaas = 0;
    static bbs = 1;
    aaa() {
        console.log(B.aaas);
        return '';
    }
}
console.log(B.bbs);
class C extends B {

}
console.log(C.bbs);




// 继承破坏封装(inheritance breaks encapuslation)
const Book = function(newIsbn, newTitle, newAuthor) {
    var isbn, title, author;
    function checkIsbn(isbn): boolean {
        return !!'';
    }

    // privileged moethod 特权方法
    this.getIsbn = function() {
        return isbn;
    }
    this.setIsbn = function(newIsbn) {
        if (!checkIsbn(newIsbn)) { throw new Error('//////')}
        isbn = newIsbn;
    }
    this.getTitle = function() {
        return title;
    }
    this.setTitle = function (newTitle) {
        title = newTitle || 'No title';
    }

    this.setIsbn(newIsbn);
    this.setTitle(newTitle);
}

Book.prototype = {
    display() {
        // todo
    }
}

const StaticBook = (function() {
    var numOfBooks = 0; // private static attributes;

    function checkIsbn(isbn) { // private static method

    } 

    // Return the constructon
    return function(newIsbn, newTitle, newAuthor) {
        var isbn, title, author;
        function checkIsbn(isbn): boolean {
            return !!'';
        }
    
        // privileged moethod 特权方法
        this.getIsbn = function() {
            return isbn;
        }
        this.setIsbn = function(newIsbn) {
            if (!checkIsbn(newIsbn)) { throw new Error('//////')}
            isbn = newIsbn;
        }
        this.getTitle = function() {
            return title;
        }
        this.setTitle = function (newTitle) {
            title = newTitle || 'No title';
        }
    
        this.setIsbn(newIsbn);
        this.setTitle(newTitle);
    }

})();

StaticBook.coverToTleCase = function(inputString) { // public static method

}
StaticBook.prototype = {
    display() {
        // todo
    }
}

class Book2 {

}

const book = new Book('1', '2', '3');

// 常量
var oneClass = (function() {
    var UPPER_BOUND = 100; // Constants(不变) (created as private static attributes)

    // Constructor
    var ctor = function (constructorArgument) {

    }

    ctor.getUPPER_BOUND = function() {
        return UPPER_BOUND;
    }

    // Return this constructor
    return ctor; // oneClass -> ctor

})();

console.log(oneClass.getUPPER_BOUND());
