function diff(oldTree, newTree) {
    // 声明变量patches用来存放补丁的对象
    let patches = {};
    // 第一次比较应该是树的0个索引
    let index = 0;
    // 递归树 比较后的结果放到补丁里
    walk(oldTree, newTree, index, patches);
    
    return patches;
}

function walk(oldNode, newNode, index, patches) {
    // 每一个元素都有一个补丁
    let current = [];

    if (!newNode) { // rule 1
        current.push({type: 'REMOVE', index});
    } else if (isString(oldNode) && isString(newNode)) {
        // 文本
        if (oldNode !== newNode) {
            current.push({type: 'TEXT', text: newNode})
        }
    } else if (oldNode.type === new newNode.type) {
        // 比较属性是否有更改
        let attr = diffAttr(oldNode.props, newNode.props);
        if (Object.keys(attr).length > 0) {
            current.push({type: 'ATTR', attr})
        }
        // 如果有子节点，遍历子节点
        diffChildren(oldNode.children, newNode.children, patches, index, current);
    } else { // 说明属性被替换了
        current.push({type: 'REPLACE', newNode});
    }

    if (current.length > 0) { // 当前元素确实存在补丁
        // 将元素和补丁对应起来，放到大补丁包中
        patches[index] = current;
    }
}

function isString(obj) {
    return typeof obj === 'string';
}

function diffAttr(oldAttrs, newAttrs) {
    let patch = {};
    // 判断老的属性中和新属性中的关系
    for (let key in oldAttrs) {
        if (oldAttrs[key] !== newAttrs[key]) {
            patch[key] = newAttrs[key];
        }
    }

    for (let key in newAttrs) {
        if (!oldAttrs.hasOwnProperty(key)) {
            patch[key] = newAttrs[key]
        }
    }

    return patch;
}

let num = 0;
function diffChildren(oldChildren, newChildren, patches, index, current) {
    var leftNode = null;
    var currentNodeIndex = index;
    // 如何处理 删除 新增 移动
    oldChildren.forEach((child, i) => {
        var newChild = newChildren[i]
        currentNodeIndex = (leftNode && leftNode.count) ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1;
        walk(child, newChildren, currentNodeIndex, patches);
        leftNode = child; // 从左子树开始
    })
}