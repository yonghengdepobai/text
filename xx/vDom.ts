var t = `
1 解析html元素，构建dom树
2 解析CSS，生成页面css规则树（Style Rules）
3 将dom树和css规则树关联起来，生成render树
4 布局（layout/reflow），浏览器会为render树上的每一个节点确定屏幕上的尺寸、位置
5 绘制Render树，绘制页面像素信息到屏幕上，这个过程叫paint

当你用原生js或jquery等库去操作DOM时，浏览器会从构建DOM树开始讲整个流程执行一遍，所以频繁的操作DOM会引起不需要的计算，
导致页面卡顿，影响用户体验。而virtual DOM能很好的解决这个问题。
它用js对象表示virtual node(VNode), 根据VNode计算出真实DOM需要做的最小变动，然后再操作真实DOM节点，提高渲染效率


`;

type VNode = {
    vtype: 'VType', // Text, Node, Composite, Stateless, Portal等
    type: String,
    props: 'props',
    children: 'Virtual Children',
    key: string | number | undefined,
    ref: Function | string | null,
    dom: Element | null,
    _owner: 'Component',
    parentContext: 'Context',
}

const createEl = (tagName, props, children) => new CreateEl(tagName, props, children);

const vdom = createEl('div', {id: 'box'}, [
    createEl('h1', {style: 'color: pink'}, ['I am H1']),
    createEl('ul', {class: 'list'}, [createEl('li', {}, ['#list']), createEl('li', {}, ['#list2'])]),
    createEl('p', {}, ['I am p'])
])

const rootnode = vdom.render();
document.body.appendChild(rootnode);

function setAttr(el, key, val) {
    switch(key) {
        case 'value':
            if (el.tagName.toLowerCase() == 'input' || el.tagName.toLowerCase() == 'textarea') {
                el.value = val;
            } else {
                el.setAttribute(key, val);
            }
            break;
        case 'style':
            // 行为样式
            el.style.cssText = val;
            break;
        default:
            el.setAttribute(key, val);
            break;
    }
    // el.setAttribute(key, val);
}

class CreateEl {
    tagName; props; children: []; count; key;
    constructor(tagName, props, children: []) {
        this.tagName = tagName;
        this.props = props || {};
        this.children = children || [];
        this.key = props ? props.key : undefined;

        let count = 0;
        this.children.forEach((child: any) => {
            if (child instanceof CreateEl) {
                count += child.count;
            } else {
                child = '' + child;
            }
            count++;
        })
        this.count = count;
    }
    render(): Node {
        const el = document.createElement(this.tagName);
        const props = this.props
        for (let key in props) {
            let val = props[key];
            setAttr(el, key, val);
        }

        this.children.forEach((child: any) => {
            // 递归循环 构建tree
            let childEl = (child instanceof CreateEl) ? child.render() : document.createTextNode(child);
            el.appendChild(childEl);
        })

        return el;
    }
}

var vdomT1 = `
比较新老dom树，得到比较的差异对象
比较两棵DOM树的差异，是虚拟DOM的最核心部分， 这也是人们常说的虚拟DOM的diff算法 
完全比较时间复杂度为O(n3) 但web中很少用到跨层级DOM树的比较，所以一个层级跟一个层级对比，这样算法复杂度就可以达到O(n)

在代码中，我们会从根节点开始标志遍历，遍历的时候把每个节点的差导异（包括文本的不同，属性不同，节点不同）记录下来

两个节点之间的差异总结起来有下面4种
0 直接替换原有节点
1 调整子节点，包括移动、删除等
2 修改节点属性
3 修改节点文内容


`;

/**
 *  比较两个数组的差异
 * @param oldList 原列表
 * @param newList 操作后的列表
 * @param key 
 */
function listDiff(oldList: [], newList: [], key?) {
    var oldMap = makeKeyIndexAndFree(oldList, key);
    var newMap = makeKeyIndexAndFree(newList, key);

    var newFree = newMap.free;

    var oldKeyIndex = oldMap.keyIndex;
    var newKeyIndex = newMap.keyIndex;

    var moves = [];


    var children = [];
    var i = 0;
    var item;
    var itemKey;
    var freeIndex;

    // 检查旧项目 first pass to check item in old list: if it's removed or not
    while (i < oldList.length) {
        item = oldList[i];
        itemKey = getItemKey(item, key);
        if (itemKey) {
            if (!newKeyIndex.hasOwnProperty(item)) {
                children.push(null);
            } else {
                var newItemIndex = newKeyIndex[itemKey];
                children.push(newList[newItemIndex]);
            }
        } else {
            var freeItem = newFree[freeIndex++];
        }
    }



}

/**
 * 将数组转换为一个对象其中包含keyIndex对象和free数组
 * @param list 
 * @param key 
 */
function makeKeyIndexAndFree(list: [], key: string | Function) {
    var keyIndex = {};
    var free = [];
    for (let i = 0, len = list.length; i < len; i++) {
        var item = list[i];
        var itemKey = getItemKey(item, key);
        if (itemKey) {
            keyIndex[itemKey] = 1;
        } else {
            free.push(item)
        }
    }
    return {
        keyIndex: keyIndex,
        free: free
    }
}

function getItemKey(item, key) {
    if (!item || !key) { return void 666}
    return typeof key == 'string' ? item[key] : key(item);
}

/**
 * 比较两棵树
 * @param oldTree 
 * @param newTree 
 */
function diff(oldTree, newTree) {
    // 节点的遍历顺序
    let index = 0;
    // 在遍历过程中记录节点的差异
    let patches = {};
    // 深度优先遍历两棵树
    deepTraversal(oldTree, newTree, index, patches);

}
const REPLACE = 0; // 替换原有节点
const REORDER = 1; // 调整子节点，包括移动、删除等
const PROPS = 2; // 修改节点属性
const TEXT = 3; // 修改节点文本
function deepTraversal(oldNode, newNode, index, patches) {
    let currentPath = [];
    if (newNode == null) { // 如果新节点没有的话不用比较了
        return;
    }
    if (typeof oldNode == 'string' && typeof newNode == 'string') {
        // 比较文本节点
        if (oldNode !== newNode) {
            currentPath.push({
                type: TEXT,
                Context: newNode,
            })
        }
    } else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
        // 节点类型相同
        // 比较节点的属性是否相同
        let propsPatches = diffProps(oldNode, newNode);
        if (propsPatches) {
            currentPath.push({
                type: PROPS,
                props: propsPatches,
            })
        }
        // 递归比较子节点是否相同
        diffChildren(oldNode.children, newNode.children, index, patches, currentPath);
    } else {
        // 节点不一样，直接替换
        currentPath.push({type: REPLACE, node: newNode})
    }

    if (currentPath.length) {
        // index节点差异记录下来
        patches[index] = currentPath;
    }
}

function diffChildren(oldChildren, newChildren, index, patches, currentPath) {
    var diffs = listDiff(oldChildren, newChildren);
    newChildren = diffs.children;

    // 如果调整子节点，包括移动、删除等的话
    if (diffs.moves.length) {
        var reorderPath = {
            type: REORDER,
            moves: diffs.moves,
        }
        currentPath.push(reorderPath);
    }

    var leftNode = null;
    var currentNodeIndex = index;
    oldChildren.forEach((child, i) => {
        var newChild = newChildren[i];
        currentNodeIndex = (leftNode && leftNode.count) ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1;
        // 深度遍历，从左树开始
        deepTraversal(child, newChild, currentNodeIndex, patches);
        // 从左树开始
        leftNode = child;
    })
    
}

function diffProps(oldNode, newNode) { // 记录属性差异
    let count = 0; // 声明一个有没有属性变更的标志
    const oldProps = oldNode.props;
    const newProps = oldNode.props;
    const propsPatches = {};

    // 找出不同的属性
    for (let key in oldProps) {
        let val = oldProps[key];
        if (newProps[key] != val) {
            count++;
            propsPatches[key] = newProps[key]
        }
    }
    // 找出新增属性
    for (let key in newProps) {
        let val = newProps[key];
        if (!oldProps.hasOwnProperty(key)) {
            count++;
            propsPatches[key] = val;
        }
    }

    if (count === 0) { return null}

    return propsPatches;
}

// 把差异对象应用到渲染的dom树
function patch(node, patches) {
    const step = {
        index: 0,
    }
    deepTraversal_(node, step, patches);
}

// 深度优先遍历
function deepTraversal_(node, step, patches) {
    // 拿到当前差异对象
    const currentPatches = patches[step.index];
    const len = node.childNodes ? node.childNodes.length : 0;
    for (let i = 0; i < len; i++) {
        const child = node.childNodes[i];
        step.index++;
        deepTraversal_(child, step, patches);
    }
    // 如果当前节hkok存在差异
    if (currentPatches) {
        applyPatches(node, currentPatches);
    }
}

function applyPatches(node, currentPatches) {
    currentPatches.forEach(currentPatch => {
        switch(currentPatch.type) {
            case REPLACE: // 0
                var newNode = (typeof currentPatch.node === 'string') ? document.createTextNode(currentPatch.Context) : currentPatch.node.render();
                node.parentNode.replaceChild(newNode, node);
                break;
            case REORDER:
                moveChildren(node, currentPatch.moves);
                break;
            case PROPS: 
                for (let key in currentPatch.props) {
                    let val = currentPatch.props[key];
                    if (val === undefined) {
                        node.removeAttribute(key);
                    } else {
                        setAttr(node, key, val);
                    }
                }
                break;
            case TEXT:
                if (node.textContent) {
                    node.textContent = currentPatch.content;
                } else {
                    node.nodeValue = currentPatch.content;
                }
                break;
            default:
                throw new Error('Unknow patch type' + currentPatch.type);
        }
    })
}

function moveChildren(node, moves) { // 调整子节点，包括移动，删除
    let staticNodeList = Array.from(node.childNodes);
    const maps = {};
    staticNodeList.forEach((node: any) => {
        if (node.nodeType === 1) {
            const key = node.getAttribute('key');
            if (key) {
                maps[key] = node;
            }
        }
    })
    moves.forEach(move => {
        const index = move.index;
        if (move.type === 0) { // 变动类型为删除节点
            if (staticNodeList[index] === node.childNodes[index]) {
                node.removeChild(node.childNodes[index]);
            }
            staticNodeList.splice(index, 1);
        } else {
            let insertNode = maps[move.item.key]
            ? maps[move.item.key] : (typeof move.item === 'object')
            ? move.item.render() : document.createTextNode(move.item);
            staticNodeList.splice(index, 0, insertNode);
            node.insertBefore(insertNode, node.childNodes[index], null);
        }
    })
}
