const obj = new Object();
Object.getPrototypeOf(obj);


// 类型继承
function Person(name?) {
    this.name = name;
}

Person.prototype.getName = function() {
    return this.name;
}
function Author (name, books) {
    Person.call(this, name); // Call the superclass's constructor in the scope of this
    this.books = books;
}
Author.prototype = new Person(); // Set up the prototype chain
Author.prototype.constructor = Author; // Set the constructor  attribute to Author
Author.prototype.getBooks = function() {
    return this.books
}

function extend_ (subClass, superClass) {
    var F = function() {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;

    subClass.superclass = superClass.prototype;
    if (superClass.prototype.constructor === Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }

}

// 原型式继承

var Person_  = {
    naem: 'default name',
    getName: function() { return this.name},
}

