// Promise, 简单的说就是一个容器，里面保存着未来才会结束的事件 两个特性
// 对象状态不受外界影响 2、一旦状态改变就不会再变
// promise无法取消，一旦新建它就会立即执行 无法得到内部状态
const promise = new Promise(function(resolve, reject) { // 接收一个构造函数做为参数
// 该函数接收两个参数分别是resolve,reject 它们是函数由js引擎提供 它们改变Promise对象的状态
    // todo
    if (iss /** 异步操作成功 */) {
        resolve(value);
    } else {
        reject(value);
    }
});

// promise实例生成以后，可以用then方法分别指定resolve,reject状态的回调函数
promise.then(function(value) {}, function (error) {});

// 例子
function timeout(ms) {
    return new promise((resolve, reject) => {
        setTimeout(resolve, ms, 'done');
    });
}

timeout(ms).then((value) => {
    console.log(value);
});

// promise新建后会立即执行
let promise1 = new Promise((resolve, reject) => {
    console.log('Promise');
    resolve();
});
promise1.then((value) => {
    console.log('resolve');
});
console.log('Hi');
// Promise
// Hi
// resolve

function loadImageAsync(url) {
    return new Promise(function(resolve, reject) {
        const image = new Image();
        image.load = function() {
            resolve(image);
        }

        image.onerror = function() {
            reject(new Error('colud not load image at' + url));
        }
        image.src = url;
    });
}

const getJSON = function(url) {
    const promise = new Promise(function(resolve, reject) {
        const handler = function() {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        }
        const client = new XMLHttpRequest();
        client.open('GET', url);
        client.onreadystatechange = handler;
        client.responseText = 'json';
        client.setRequestHeader('Accept', 'application/json');
        client.send();
    });
    return promise;
}

getJSON('/posts.json').then(function(json) {
    console.log('Contents:' + json);
}, function(error) {
    console.log('出错了' + error)
});

// 连环 Promise
const p1 = new Promise(function (resolve, reject) {
    // todo
    setTimeout(() => reject(new Error('fail')), 3000);
});
const p2 = new Promise(function (resolve, reject) {
    // todo
    setTimeout( () => resolve(p1), 1000);
    // resolve(p1);
});
p2.then(result => {console.log(result)})
.catch(error => console.log(error));
// Error: fail
// p1的状态决了p2的状态