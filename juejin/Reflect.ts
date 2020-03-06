/**
 * Reflect Metadata
 * 在定义类或者方法的时候，可以设置一些元数据，我们可能获取到在类与类方法上添加的元数据，用的方法就是Reflect Metadata
 * config是在ts使有 Refect Metadata的配置
 */

var config = {
    "compilerOptions": {
      "experimentalDecorators": true ,
      "emitDecoratorMetadata": true
    }
}

import 'reflect-metadata';

@Reflect.metadata('role', 'admin')
class Post {}

const metadata = Reflect.getMetadata('role', Post);
console.log(metadata); // admin


/**
 * Decorator 类修饰服
 * Role是自定义的一个装饰器，接收一个name参数，这是一个装饰器工厂，返回的是ClassDecorator。
 * 返回的东西应该是个适合在类上使用的装饰器，所以接收一个target 参数，这个东西就是类的构造方法。
 * 在方法里面用Reflect.defineMetadata方法设置了一个自定义的元数据role2, 对应的值为name,也就是使用这个装饰器的进候提
 * 供的值，第三个参数是target,就是要添加元数据的那个类
 * @param name
 */
function Role(name: string): ClassDecorator {
    return target => { // target就是要添加元素据的那个类
        Reflect.defineMetadata('role2', name, target);
    }
}

@Role('admin2')
class Post2 {}

const metadata2 = Reflect.getMetadata('role2', Post2);
console.log(metadata2); // admin2


/**
 * 装饰器
 * 装饰器是一种特殊类型的声明，它能够被附加到类声明，方法，访问符，属性或参数上。
 * 装饰器使用@expression这种形式，expression求值后必浙大须为一个函数，它会在运行期间被调用，
 * 被装饰的声信息做为参数传入
 */

//  例如，有一个@sealed装饰器，我们会这样定义sealed函数
function sealed(target) {
    // todo
}

/**
 * 装饰器工厂
 * 如果我们要定制一个修饰器如何应用到一个声明上，我们得写一个装饰器工厂函数。装饰器工厂函数就是一个简单的函数
 * 它返回一个表达式，以供装饰器在运行时调用
 */
// demo
function color (value: string): ClassDecorator {
    return function(target) { // 这个方法就是装饰器了
        // todo with value and target
    }
}

/**
 * 装饰器组合
 * 多个装饰器可以同时应用到一个声明上，
 * 当多个装饰器应用于一个声明上，它们的求值方式与复合函数相似。在下面这个模型下，当复合sealed和color时
 * 复合结果（sealed 。 color）（x）等同于 sealed(color(x));
 * 同样的，在typescript中，当多个装饰器应用在一个声明上时会进行如下步骤的操作：
 * 1.由上至下依次对装饰器表达式求值
 * 2.求值的结果会被当作函数，由下至上依次调用
 */
// demo
// @sealed @color('white') class A {}
// @sealed
// @color('black')
// class B {}
function f() {
    console.log('f():evaluated');
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log('f(): called');
    }
}
function g() {
    console.log('g():evaluated');
    return function(target, propertyKey: string, descriptor: PropertyDecorator) {
        console.log('g():called');
    }
}
class C {
    @f()
    @g()
    method() {}
}
// 结果：
// f():evaluated
// g():evaluated
// g():call
// f():call

/**
 * 装饰器求值
 * 类中不同声明上的装饰器将按以下顺序应用：
 * 1.参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个实例成员
 * 2.参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个静态成员
 * 3.参数装饰器应用到构造函数
 * 类装饰器应用到类
 */

 /**
  * 类装饰器
  * 类装饰器在类声明之前被声明（紧靠着类声明）。类装饰器应用于类构造函数，可以用来监视，修改或替换类定义。
  * 类装饰器不能在声明文件中（.d.ts），也不能用在任何外部上下文中（比如declare的类）
  * 类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数
  * 如果类装饰器返回一个值，它会使用提供的构造函数来替换类的声明
  * 注意  如果你要返回一个新的构造函数，你必须注意处理好原来的原型链。 在运行时的装饰器调用逻辑中 不会为你做这些。
  */
//  demo
@sealed_
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return 'hello,' + this.greeting;
    }
}
// 当@sealed被执行时，它将密封此类的构造函数和原型
function sealed_(constructor: Function) {
    // Object.seal()方法封闭一个对象，阻止添加新的属性并将所有现有属性标记为不可配置。当前属性的值只要原来是可写的就可以改变
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

// demo 重载构造函数
function classDecorator<T extends {new (...args: any[]): {}}>(constructor: T) {
    return class extends constructor {
        newProperty = 'new property';
        hello = 'override';
    }
}
type con = {new(): void};
type ccc = new (...args: any[]) => {}; // 构造函数的类型
type cc = {new (...args: any[]): {}}


@classDecorator
class Greeter_ {
    propetry = 'property';
    hello: string;
    con: con;
    ccc: ccc;
    cc: cc;
    greeting;
    
    constructor(m: string) {
        this.hello = m;
    }


    @enumerable(true)
    greet() {
        return 'hello' + this.greeting;
    }
}
console.log(new Greeter_('world'));

/**
 * 方法装饰器
 * 声明在一个方法和声明之前（紧靠着方法声明）。它会被应用到方法的属性描述符上，可以用来监视
 * 修改或者替换方法定义。
 * 方法装饰器表达式会在运行时当作函数被调用，传入下列3个参数
 * 1.对于静态成员来说是类的构造函数，对于实例成员来说是类的原型对象
 * 2.成员的名字
 * 3.成员的属性描述符
 * 注意  如果代码输出目标版本小于ES5，属性描述符将会是undefined。
 * 
 * 如果方法返回一个值，它会被用作方法的属性描述符
 */
function enumerable(value: boolean) {
    return function(target: any, propertyKey: string, descriptor: PropertyDecorator) {
        descriptor.enumerable = value;
    }
}