// mvvm是一种程序架构设计。把它拆开来看应该是Model-View-viewModel

// Model 指的是数据层，是纯净的数据。 对于前端来说，它往往是一个简单的对象例如
var model_x ={
    name: 'mirone',
    age: 20,
    friends: [],
    details: {
        type: 'notSingleDog',
        tag: ['fff', 'sox']
    }
}

// 数据层是我们需要渲染后呈现给用户的数据，数据层本身是可变的。数据层不应该承担逻辑操作和计算的功能

// View 指视图层，是直接显现给用户的部分，简单来说，对于前端就是HTML,例如上面的数据对应的视图层可能是
/**
 * <div>
 *      <p><b>name: </b>
 *      <span>mirone</span>
 * </div>
 */

//  当然视图层是可变的，你完全可以在其中随意添加元素。这不会改变数据层，只会改变视图层呈现数据的方式。
//  视图层和数据层应该完全分离

// ViewModel 既然视图应该和数据层分离，那么我们就需要设计一种结构，让它们建立起某种联系。当我们对Model进行修改的时候，
// ViewModel就会修改自动同步到View层去。同样当我们修改View，Model层同样被viewModel自动修改

// 可以看出，如何设计能够高效自动同步View与Model的viewModel是整个MvvM框架的核心和难点

// MVVM的原理 不同的框架对于MVVM的实现是不同的

// Vue的实现方式，对数据（Model)进行劫持，当数据发生变动时，数据会触发劫持时绑定的方法，对视图进行更新

// Angular的实现方式，当发生了某种事件（例如输入）,Angular 会检查新的数据结构和之前的数据结构是否发生了变动，来决定是否更新视图

// 相同点 
// 解析模版
// 它们都定义了自已的模版关键字，这一模板的作用就是根据这些关键字解析模版，将模版对应期望的数据结构

// 解析数据
// Model中的数据经过劫持或绑定发布器来解析。数据解析器的编写要考虑VM的实现方式，但是无论如何解析数据只要做好一件事：
// 定义数据变动时要通知的对象。解析数据时应保证数据解析后的一致性，对于每种数据解析后显露的接口应该保持一致

// 绑定模版与数据
// 这一部分定义了数据结构以何种方式和模板进行绑定，就是传说中的双向绑定。绑定之后我们直接对数据进行操作时，应用就能自动更新
// 视图了。数据和模版往往是多对多的关系，而且不同的模版更新数据的方式往往不同。

// 数据
let data = {
    title: 'todo list',
    user: 'mirone',
    todos: [
        {
            creator: 'mirone',
            content: 'write mvvm',
            done: 'undone',
            date: '2020-2-2',
            members: [
                {name: 'kaito'},
            ]
        }
    ]
}

let template = `
    <div id='root'>
        <h1 data-model='title'></h1>
        <div>
        <div data-model='user'></div>
        <ul data-list='todos'>
            <li data-list-item='todos'>
                <p data-class='todos:done' data-model='todos:creator'></p>
                <p data-model="todos:date"></p>
                <p data-model="todos:content"></p>
                <ul data-list="todos:members">
                    <li data-list-item="todos:members">
                        <span data-model="todos:members:name"></span>
                    </li>
                </ul>
            </li>
        <ul>
        </div>
    </div>
`;

// 然后通过调用
new Parser('#root', data);

// 模板的解析其实是一个树的遍历过程 递归 深度优先遍历
function scan(node) { // 遍历了一个DOM节点，依次打印遍历得到的节点
    console.log(node);
    for (let i = 0; i < node.children.length; i++) {
        const _thisNode = node.children[i];
        console.log(this.node);
        if (_thisNode.children.length) {
            scan(_thisNode);
        }
    }
}

// 遍历不同结构
// 根据上面的模板 我们需要这么几种标识：data-model --将文本节点替换为制定内容
// data-class 用于将DOM的className替找为制定内容 data-list 用于标识接下来将出现一个列表，列表为制定结构
// data-list-item --用于标识列表内部结构 data-event 用于为DOM结节点绑定指定事件

// 简单归类一下：data-model data-class data-event 应该是一类，它们都是影响当前节点：
// 而data-list 和data-item作为列表应该要单独考虑

function scan(node) {
    if (!node.getAttribute('data-list')) {
        for (let i = 0; i < node.children.length; i++) {
            const _thisNode = node.children[i];
            parseModel(node);
            parseClass(node);
            parseEvent(node);
            if (_thisNode.children.length) {
                scan(_thisNode);
            }
        }
    } else {
        parseList(node);
    }
}

function parseModel(node) {
    // TODO:解析Model节点
}
function parseClass(node) {
    // TODO: 解析className
}
function parseEvent(node) {
    // TODO: 解析事件
}
function parseList(node) {
    // TODO: 解析列表
}

// event 要有一个eventList, 大概结概为：
const eventList = {
    typeWrite: {
        type: 'input', // 事件的种类
        fn: function() {
            // 事件的处理函数，函数的this代表函数绑定的DOM节点
        }

    }
}
function parseEvent(node) {
    if (node.getAttribute('data-event')) {
        const eventName = node.getAttribute('data-event');
        node.addEventListener(eventList[eventName].type, eventList[eventName].fn.bind(node));
    }
}

// 根据在模板中的位置解析模板，这里的Path是一个数组，代表了当前数据在Model中的位置
function parseData(str, node) {
    const _list = str.split(':');
    let _data,
        _path;
    let p = [];
    _list.forEach((key, index) => {
        if (index === 0) {
            _data = data[key];
            p.push(key);
        } else {
            _path = node.path[index - 1];
            p.push(_path);
            _data = _data[_path][key];

        }
    });

    return {
        path: p,
        data: _data,
    }
}

function parseModel(node) {
    if (node.getAttribute('data-model')) {
        const modelName = node.getAttribute('data-model');
        const _data = parseData(modelName, node);
        if (node.tagName === 'INPUT') {
            node.value = _data.data;
        } else {
            node.innerText = _data.data;
        }
    }
}
function parseClass(node) {
    if (node.getAttribute('data-class')) {
        const className = node.getAttribute('data-class');
        const _data = parseData(className, node);
        if (!node.classList.contains(_data.data)) {
            node.classList.add(_data.data);
        }
    }
}

// 解析列表，遇到列表时，应该先递归找出列表项的结构
function parseListItem(node) {
    let target;
    ;function getItem(node) {
        for (let i = 0; i < node.children.length; i++) {
            const _thisNode = node.children[i];
            if (node.path) {
                _thisNode.path = node.path.slice();
            }
            parseEvent(_thisNode);
            parseClass(_thisNode);
            parseModel(_thisNode);
            if (_thisNode.getAttribute('data-list-item')) {
                target = _thisNode
            } else {
                getItem(_thisNode);
            }
        }
    }(node)
    return target;
}

// 用这个列表项来按需拷贝出一定数量的列表项，并填数据
function parseList(node) {
    const _item = parseListItem(node);
    const _list = node.getAttribute('data-list');
    const _listData = parseData(_list, node);
    _listData.data.forEach((_dataItem, index) => {
        const copyItem = _item.cloneNode(true);
        if (node.path) {
            _copyItem.path = node.path.slice();
        }
        if (!copyItem.path) {
            _copyItem.path = [];
        }
        _copyItem.path.push(index);
        scan(_copyItem);
        node.insertBefore(_copyItem, _item);

    });
    node.removeChild(_item);
}
// 这样就完成了模版渲染，scan函数会对模版进行渲染

// 普通对象无能劫持 demo
var obj = {
    name: 'mi',
}

function observe(obj, key) {
    let old = obj[key];
    Object.defineProperty(obj, key, {
        enumerable: true, // 可枚举
        configurable: true, // 当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false
        get: function() {
            return old;
        },
        set: function(now) {
            if (now !== old) {
                console.log(`${old}--->${now}`);
                old = noew;
            }
        }
    });
}
observe(obj, 'name');
obj.name = 'mirone';

// 这样我们就可以通过objcet.defineProperty进行数据劫持，只要添加一个回调就好了
function observe(obj, k, callback) {
    let old = obj[key];
    Object.defineProperty(obj, key, {
        enumerable: true, // 可枚举
        configurable: true,
        get: function() {
            return old;
        },
        set: function(now) {
            if (now !== old) {
                console.log(`${old}--->${now}`);
                callback(old, now); // 数据改变回调
            }
            old = noew;
        }
    });
}

// 嵌套对象的劫持
function observeAllkey(obj, callback) { // 劫持该对象的所有属性
    Object.keys(obj).forEach((key) => {
        observe(obj, key, callback);
    })
}

// 对象中数组的劫持 使用重写数组的prototype的方法来劫持它
function observeArray(arr, callback) {
    const oam = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
    const arrProto = Array.prototype;
    const hackProto = Object.create(Array.prototype);

    oam.forEach(function(method) {
        Object.defineProperty(hackProto, method, {
            writable: true,
            enumerable: true,
            configurable: true,
            value: function(...arg) {
                let old = arr.slice();
                let now = arrayProto[method].call(this, ...arg);
                callback(old, this, ...arg);
                return now
            },
        })
    })

    arr.__proto__ = hackProto;
}

// 改写observeAllkey
function observe(obj, k, callback) {
    let old = obj[k]
    if (Object.prototype.toString.call(old) === '[object Array]') {
        observeArray(old, callback)
    } else {
        observeAllkey(old, callback);
    }
}

// 处理路径参数 之前我们所有的方法都是面对单个key值的，回想一下我们的模版，有很多例如todos:todo:member这样的路径，
// 我们应该允许传入一个路径数组，根据路径数组来监听指定的对象数据
function observePath(obj, path, callback) {
    let _path = obj;
    let _key;
    path.forEach((p, index) => {
        if (parseInt(p) === p) {
            p = parseInt(p);
        }
        if (index < path.length - 1) {
            _path = _path[p]
        } else {
            _key = p;
        }
    })
}
// 在次更新 observe
function observe(obj, k, callback) {
    if(Object.prototype.toString.call(k) === '[object Array]') {
        observePath(obj, k, callback)
    } else {
        let old = obj[k]
    if(Object.prototype.toString.call(old) === '[object Array]') {
        observeArray(old, callback)
    } else if (old.toString() === '[object Object]') {
        observeAllKey(old, callback)
    } else {
        //...
    }
    }
}

// 多对一监视
class Register {
    constructor() {
        // 存放所有回调对象，回调对象由三个key组成：obj,key, fn，
        // fn 应该是一个数组放着所有发生变化时要执行的回调函数
        this.routes = [];
    }
    // 添加一个回调
    regist(obj, k, fn) {
        const _i = this.routes.find(function(el) {
            if (el.key === k || el.key.toString() === k.toString() && Object.is(el.obj, obj)) {
                return el
            }
        }) // 返回第一个满足function的值
        if (_i) {
            // 如果存在该obj和key对象
            _i.fn.push(fn);
        } else {
            // 如果尚不存在
            this.routes.push({
                obj: obj,
                key: k,
                fn: [fn]
            })
        }
    }
    // 解析结束时调用，绑定所有回调
    build() {
        this.routes.forEach(route => {
            observe(route.obj, route.key, route.fn)
        })
    }

}

// 更新observe
function observer(obj, k, callback) {
    //...与前文相同
    if(now !== old) {
      callback.forEach((fn) => {
        fn(old, now)
      })
    }
  }
  function observerArray(arr, callback) {
    //...与前文相同
    //将原来的callback(old, this, ...arg)替换为
    callback.forEach((fn) => {
      fn(old, this, ...arg)
    })
  }

//   绑定模版数据
const register = new Register();
function parseModel(node) {
    if (node.getAttribute('data-model')) {
        // ...之前逻辑不变
        register.regist(data, _data.path, function(old, now) {
            if (node.tagName === 'INPUT') {
                node.value = now
            } else {
                node.innerText = now;
            }
            console.log(`${old} ---> ${now}`);

        })
    }
}

function parseClass(node) {
    if (node.getAttribute('data-class')) {
        // ...
        register.regist(data, _data.path, function(old, now) {
            node.classList.remove(old);
            node.classList.add(now);
            console.log(`${old} ---> ${now}`);
        }) 
    }
}

// 当列表发生变化时， 重新渲染当前列表
function parseList(node) {
    // ...
    register.regist(data, _listData.path, () => {
        while(node.firstChild) {
            node.removeChild(node.firstChild);
        }
        const _listData =  parseData(_list, node);
        node.appendChild(_item);
        _listData.data.forEach((_dataItem, index) => {
            const _copyItem = _item.cloneNode(true);
            if (node.path) {
                _copyItem.path = node.path.slice();
            }
            if (!_copyItem.path) {
                _copyItem.path = [];
            }

            _copyItem.path.push(index);
            scan(_copyItem);
            node.insertBefore(_copyItem, _item)
        })
        node.removeChild(_item);
    })

}
// 当模板解析结束后绑定事件
register.bind();












