var RXTEXT = `
什么是RXJS
    RXJS是使用observable的响应式编程库，它使编写异步或基于回调的代码更容易。采用订阅者模式。

    响应式编程是一种面向数据流和变更传播的异步编程范工（Wikipedia）
    RxJS(响应式扩展的javaScript版) 是一个使用可观察对像进行响应式编程的库，它让组合异步代码和基于回调的代码变得更简单
    
    RXJS提供了一种对Observable 类型的实现，还提供了一些工具函数，用于创建和使用可观察对象
    这些工具函数可用于：
    把现有的异步代码转换成可观察对象
    迭代流中的各个值
    把这些值映射成其他类型
    对流进行过滤
    组合多个流

    RXJS是一套藉由Obserevale sequences来组合非同步行为和事件基础程序的Libary

    可以看想成处理非同步行为的Lodash
    这也被称为 Function Reactive Programming, 更确切的说是Function Programming 和 Reactive Programming
    两个编程思想的结合 但不能称为 Function Reactive Programming(FRP)

    FRP是操作随着时间连续改变的数值而RX则比较像是操作随着时间发出的离散数值

    Function Programming 是一种编程范式
    简单的说它核心思想就是做运算处理，并用function来思考问题
    如下面demo1 把每一个运算包成一个个不同的function，并用这些function组合出我们要的结果，
    这就是最简单的 Function Programming

    条件至少需要符合函数为一等公民的特性（fisrt Class）
    函数能赋值给变量
    函数能被当做参数传入
    函数也能被当做返回值

    重要特性
    Function Programming 都是表达式（Expression）不会是陈述式（Statement）
    表达式是一个运算过程，一定会有返回值，例如执行一个Function : add(1, 3);
    陈述式则是表现某个行说罢，例如一个赋值给一个变量 a = 1;
    有时候表达式也可能同时是一个陈述式

    Pure Function 纯函数
    是指一个function 给予相同的参数，永远会返回相同的返回值，并且没有任何显著的副作用（Side Effect）
    例如 dmeo2；

    Side Effect
    是指一个function做了跟本身运算返回没有关系的事，比如说修改某个全域变量或修改传入参数，甚至是执行console.log()

    Function Programming 优势
    可文读性高
    可维护性高
    易于并行/平行处理

    Observer Pattern 观察者模式
    Iterator Pattern 迭代器模式
    Iterator 是一个对象，它就像是一个指针，指向一个数据结构并产生一个序列（sequence）,这个结构会有数据结构中的
    所有元素（element）

    Iterator虽然很简单，但有两优势，第一它渐进式取得资料的特性可以拿来做延迟运算（Lazy evluation）,让我们能用
    它来处理大数据结构。第二因为iterator 本身是序列，所以可以实现所有阵列的运算方法像map,filter...等

    延迟运算（Lazy evluation）
    或说call-by-need,是一种运算策略（evluation strategy）,简单来说我们延迟一个表达式的运算时机直到真正需要它的值在运算

    observable
    Observer跟Iterator有个共通性，就是他们都是渐进式（progressive）的取得资料，差别只在于Observer是生产者（Prouducer）
    推送数据（push），而Iterator是消费者（consumer）要求资料（pull）

    observable具备生产者推送数据的特性，同时能像序列，拥有序列处理数据的方法（map,filter...）
    更简单的说Observable就像是一个序列，里面的元素会随着时间推送

    创建Observable
    var observable = RX.Observable.create(function(observer) {
        observer.next('1');
        observer.next('2');
    })
    observable.subscribe(function(value) {
        console.log(value);
    })

    观察者Observer
    Observable可以被订阅（subscribe）,或者说可以被观察，而订阅Observable的对象又称为观察者（Observer);
    观察者是一个具有三个方法（method）的对象，每当Observable发生事件时，便会呼叫观察者相对应的方法
    next: 每当Observable发送出新的值，next方法就会被呼叫（通过next方法传递Observable的值）
    complete: 在Observable没有其他资料可以取得时，complete就会被呼叫，在complete被呼叫后，next方法就不会起作用
    error: 每当Observable内发生错误，error方法就会被呼叫
    观察者可以是不完整的可以只有一个next方法
    也可以直接把三个方法直接按序传入订阅函数（observable.subscribe)

    订阅一个Observable就像是执行一个function

    Creation Operation 创建操作符
    create 
    of of('Jerry', 'Anna')
    from 参数是一个数组 字符串也可以 也可以放入promise对象
    fromEvent fromEvent(dom, 'eventType(如click)')
    fromPromise 
    never never() 会给我们一个无穷的observable, 如果我们订阅它又会发生什么事呢，什么也不会发生，它就是一直存在但什么都
    不做的observable
    empty empty() 会给我们一个空的observable
    throw throw(str) 抛出错误
    interval interval(1000) 订阅后，会每隔一秒送出一个从零开始递增的整数
    timer timer(1000, 5000) 第一个参数表示发出第一个值要用的时间，第二个参数代表第一次之后发送值的间隔时间，所以上面
    这个订阅后 会先等一秒送出0之后每五秒送出1，2，3，4...
    timer(1000) 表示等一秒送出，同时结束通知

    subscription    
    在订阅observable之后，会回传一个subscription对象，这个对象具有释放资源的unsubscript方法
    var subscription = observable.subscribe(function(value) {        console.log(value);    })
    subscription.unsubscribe(); // 取消订阅
    Events observable 尽量不要用unsubscribe, 通常我们会使用takeUntil 在某个事件发生后来完Event observable

    Operator 操作符
    每个operator都会回传一个新的observable
    map 传入callback function 这个callback会带入每次发送出来的元素，然后回传新的元素
    mapTo 可以把传进来的值改成一个固定值
    filter 传入callback callback的值为true就会保存，为false就会过滤
    take 顾名思义就是取前几个元素就结束
    first 会取observable送出的第一个元素之后结束，行为跟take(1)一致
    takeUntil 它可以在某件事情发生时，让一个observable 直送出完成（complete)讯息
    concatAll 有时observable送出的元素又是一个observable，就像二维数组，这时可以用concatAll 把它摊平
    skip 跳过前面几个
    takeLast 从最后面倒数开始取元素
    last 取最后一个元素
    concat 把多个observable实例合并成一个
    starWith 可以在observable的一开始塞要发关的元素，有点像concat但参数不是observable而是要发送的元素
    merge 把多个observable同时处理
    scan 就是Observable版的reduce
    buffer
    delay 可以延迟observable一开始发送元素的时间点
    delayWhen 可以影响每一个元素 要传一个callback
    debounce 防抖 每次收到元素，它会先把元素cache住并等待一段时间，如果这一段时间内已经没有收到任何元素，则把元素送出，
    如果这一段时间内又收到新的元素，则会把原本cache的元素释放掉并重新计时
    throttle 节流 会先送出元素，等到有元素被送出就会沉默一段时间，等到时间过了又会开放发送元素
    distinct 过滤相同的值
    catch 处理错误，并返回一个observable的值
    retry 重试
    repeat 重复订阅 不给参数无限循环

    Subject
    Subject 具备observer所有的方法（next, error, complete), 并且还能subscripte(订阅)把observer加到内部清单
    ，每当有值送出就会遍历清单中的所有observer并把值再次送出，这样一来不管多久之后加进来observer,都会从当前处理到的元素
    接继往下走。
    首先Subject可以拿去订阅Observable，代表它是一个observer,同时Subject又可以被Observer订阅
    代表它是一个Observable
    Subject 同时是Observable又是Observer
    Subject 会对内部的observers清单进行组播（multicast）
    (Subject 就是观察者模式的一个实例 并且继承自Observable
    它会在内部管理一分observer的清单，并在接收到值的时候遍历这份清单)

    可以直接用subject 的next方法传值，所有订阅的observer就会接收到，又因为Subject本身是Observable，
    所以这样的使用方法很适合用在某些无法直接使用Observable的前端框架中。

    BehaviorSubject
    BehaviorSubject会记住最后一次发送的值(next()),在observer订阅它后会立即收到值（最
    后一次发送值）
    所在  new对象时要传入一个初始的值  new BehaviorSubject(val);

    ReplaySubject
    当我们希望observer在订阅的时候拿到以前发送的最后几个元素的值 用这个
    new ReplaySubject(number); // number表示想要前几次的值

    AsyncSubject
    它会结束发送(complete())后把最后一个值保存起来，当后面来有observer订阅的时候，observer会马上收到这个值
    asyncSubject.complet(); 用得少

`;

// demo1 计算 (5 + 6) - 1 * 3
const add = (a, b) => a + b;
const mul = (a, b) => a * b;
const sub = (a, b) => a - b;

sub(add(5,6), mul(1, 3));

// demo2 slice是一个Pure函数 不管理执行几次返回值都相同 而使用splice
var arrDemo2 = [1, 2, 3, 4, 5];
arrDemo2.slice(0, 3); // [1, 2, 3];
arrDemo2.slice(0, 3); // [1, 2, 3];
arrDemo2.slice(0, 3); // [1, 2, 3];

// demo3 iterator
var arr = [1, 2, 3];
var iterator = arr[Symbol.iterator]();
iterator.next(); // {value: 1, done: false}
iterator.next(); // {value: 2, done: false}
iterator.next(); // {value: 3, done: false}
iterator.next(); // {value: undefind, done: true}

function IteratorFromArray(arr) {
    if (!(this instanceof IteratorFromArray)) {
        throw new Error('请使用 new IteratorFromArray');
    }
    this._array = arr;
    this._cursor = 0;
}
IteratorFromArray.prototype.next = function() {
    return this._cursor < this._array.length ?
        {value: this._array[this._cursor], done: false} : {done: true}
}

IteratorFromArray.prototype.map = function(callback) {
    const iterator = new IteratorFromArray(this._array);
    return {next: () => {
        const {done, value} = iterator.next();
        return {done, value: done ? undefined : callback(value)}
    }}
}

// dem04
function* getNumbers(wrod) {
    for (let word of words) {
        if (/^[0-9]+$/.test(word)) {
            yield parseInt(word, 10);
        }
    }
}
var xiterator = getNumbers('skdfk432k424l2k3423l4');
xiterator.next(); // {value: 4, done: false}

// 自已实现 map
Array.prototype.map_ = function(callback) { // 返回一个新的数组
    let arr = [];
    for (let i = 0; i < this.length; i++) {
        var x = callback(this[i], i, this); // 如果callback是一个异步方法呢
        arr.push(x); // ?
    }
    return arr;
}
// forEach 没有返回值 不可链式调用
var mapArr_ = [1, 2, 3, 4]
Array.prototype.filter_ = function(callback) {
    let arr = [];
    this.forEach((item, index, arr) => {
        let x = callback(item, index, arr)
        if (x) {
            arr.push(item);
        }
    })
}

// 插播 数组拍平
var pArr = [1,2,[3,4,5,[6,7,8],9],10,[11,12]];
// 递归
function pA1(arr) {
    let reArr = [];
    for (let i = 0; i < arr.length; i++) {
        if (!isArr(arr[i])) { // 不是数组
            reArr.push(arr[i]);
        } else  {
            reArr.push(...pA1(arr[i]));
        }
    }
    return reArr;
}

// reduce实现
function pA2(arr) {
    // return arr.reduce((p, currentItem, index) => {
    //     if (!isArr(currentItem)) {p.push(currentItem)} else {
    //         p.push(...pA2(currentItem))
    //         // p.push(...currentItem.reduce((p, c, i) => {

    //         // }, []))
    //     }
    //     return p
    // }, [])
    return arr.reduce((prev, cur) => {
        return prev.concat(isArr(cur) ? pA2(cur): cur);
    }, [])
}

// 判断是不是数组
function isArr(value) {
    if (typeof value === 'object') {
        if (value instanceof Array) {
            if (Object.prototype.toString.call(value) === '[object Array]') {
                return true;
            }
            
        }
    }
    return false;
}



