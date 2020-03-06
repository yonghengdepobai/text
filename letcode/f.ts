
let addTwoNumbersText = `
给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。

如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。

您可以假设除了数字 0 之外，这两个数都不会以 0 开头。

`;

/**
 * 定义链表
 */
class ListNode_T {
    val;
    next;
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

function ListNode(val) {
    this.val = val;
    this.next = null;
}


/**
 * 
 * @param {ListNode} l1 第一个链表
 * @param {ListNode} l2 第二个链表
 * @return listNode
 * 注意点1. 链表的连接不要断了
 * 2. 链表最后相加进位时 判断存储一下
 * 3. 两个链表长度不一时 注意判断空值 不要出 null.val 或 null.next
 */

var addTwoNumbers = function(l1, l2) {
    let nextTemp = 0;
    let reList = new ListNode(0);
    let xx = reList;
        while(l1 || l2) {
        let temp = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + nextTemp;
        nextTemp = temp > 9 ? 1 : 0;
        l1 = l1 && l1.next; l2 = l2 && l2.next;
        reList.next = new ListNode(temp % 10);
        reList = reList.next;
        if ((l1 == null && l2 == null) && nextTemp > 0) {
            reList.next = new ListNode(nextTemp);
        }
    }
    return xx.next;
}

var convertZ = `
将一个给定字符串根据给定的行数，以从上往下、从左到右进行 Z 字形排列。

比如输入字符串为 "LEETCODEISHIRING" 行数为 3 时，排列如下：

L   C   I   R
E T O E S I I G
E   D   H   N
0 1 2 3 4 5 6 7
之后，你的输出需要从左往右逐行读取，产生出一个新的字符串，比如："LCIRETOESIIGEDHN"。

L0     D6       R12
E1  O5 E7   I11 I13
E2 C4  I8 H10   N14
T3     S9       G15 // 四行
0 1 2 3 4 5 6


`;

/**
 * 
 * @param s 
 * @param numRow 
 * 三行时两例循环 四行三例一循环
 */
var convertz = function(s, numRow) {
    let arr = [];
    for (let i = 0; i < numRow; i++) {
        arr[i] = [];
    }
    let temp = 1;
    let ss = true;
    let cell = 0;
    let row = 0;
    for (let k = 0; k < s.length; k++) {
        row = temp - 1;
       arr[row][cell] = s[k];
       if (ss) {
           temp++; // 2 1
        //    if (temp >= numRow) {ss = false;}
           if (temp > numRow) {ss = false; temp = numRow; cell ++;}
           if (temp == numRow) {ss = false;}
       } else {
            cell ++;
            temp --;
            if (temp < 1) {
                temp = 1;
            }
            if (temp == 1) {
                ss = true;
            }
       }
    }
    let str = '';
    for (let i = 0; i < numRow; i++) {
        str += arr[i].join('');
    }
    console.log(str);
    return arr;
}
var threeSumText = `
给定一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？找出所有满足条件且不重复的三元组。

注意：答案中不可以包含重复的三元组。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/3sum
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
`;
var threeSum1 = function(nums) { // 穷举 超出时间
    //
    let arr = [];
    nums.sort((a, b) => a - b); // 排序
    let duplicate = {};
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            for (let k = j + 1; k < nums.length; k++) {
                if ((nums[i] + nums[j] + nums[k]) == 0) {
                    // 对三个排序
                    let a = [nums[i], nums[j], nums[k]];
                    a.sort((a, b) => a - b);
                    let key = a[0] + '' + a[1];
                    if (duplicate[key] != true) {
                        duplicate[key] = true;
                        arr.push(a);
                    }
                    
                }
            }
        }
    }
    // 去重
    return arr;
};

var threeSum2 = function(nums) { // 对穷举 优化
    // -10 -8 -7 -5 1 2 4 7 8 9
    let arr = [];
    nums.sort((a, b) => a - b); // 排序 耗时多
    let duplicate = {};
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > 0) {break;}
        for (let j = i + 1; j < nums.length; j++) {
            for (let k = j + 1; k < nums.length; k++) {
                if ((nums[i] + nums[j] + nums[k]) > 0) {
                    break; // 大于0退出
                }
                if ((nums[i] + nums[j] + nums[k]) == 0) {
                    // 对三个排序
                    let a = [nums[i], nums[j], nums[k]];
                    // a.sort((a, b) => a - b);
                    let key = a[0] + '' + a[1];
                    if (duplicate[key] != true) {
                        duplicate[key] = true;
                        arr.push(a);
                    }
                    
                }
            }
        }
    }
    // 去重
    return
}
// [-1,0,1,2,-1, 1, -3, -4]
// var hash = {'-1': 2, 0: 1, 1: 2, 2: 1, '-3': 1, '-4': 1}
var threeSum3 = function(nums) { // 有一定的优化还是不足
    let hash = {};
    let arr = [];
    for (let i = 0; i < nums.length; i++) {
        if (hash[nums[i]]) {
            hash[nums[i]]++;
        } else {
            hash[nums[i]] = 1;
        }
    }
    var h2 ={};
    
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            let x = 0 - (nums[i] + nums[j]);
            if (hash[x] > 0) {
                hash[nums[i]]--; hash[nums[j]]--;
                if (hash[x] > 0) { // -1 0 2, 3, -2  -1
                    let m = Math.max(nums[i], nums[j], x);
                    let n = Math.min(nums[i], nums[j], x);
                    let key = m + '' + n;
                    if (!h2[key]) {
                        arr.push([nums[i], nums[j], x]);
                        h2[key] = true;
                    }
                }
                hash[nums[i]]++; hash[nums[j]]++;
            }
        }
    }
    return arr;
}

var threeSum4 = function(nums) { // 学习解法
    // let res = [];
    // let hash = {};
    // for (let i = 0; i < nums.length; i++) { //-1 0 2, 3, -2  -1
    //     for (let j = i + 1; j < nums.length; j++) {
    //         if (hash[nums[j]] !== undefined) {
    //             res.push([nums[j], ...hash[nums[j]]]);
    //             hash[nums[j]] = undefined;
    //         } else {
    //             let mark = 0 - nums[i] - nums[j];
    //             hash[mark] = [nums[i], nums[j]];
    //         }
    //     }
    // }
}

var threeSumClosestText = `
给定一个包括 n 个整数的数组 nums 和 一个目标值 target。找出 nums 中的三个整数，使得它们的和与 target 最接近。返回这三个数的和。假定每组输入只存在唯一答案。

例如，给定数组 nums = [-1，2，1，-4], 和 target = 1.

与 target 最接近的三个数的和为 2. (-1 + 2 + 1 = 2).

`;
var fx = `
[4,0,5,-5,3,3,0,-4,-5] -5 -5 -4 0 0 3 3 4  -2
=> 0 1 1 s=2  mt = 98 old=max old=98 min = 98
=> 0 1 1 s=2 mt=98 old = 98 break;
[13,2,0,-14,-20,19,8,-5,-13,-3,20,15,20,5,13,14,-17,-7,12,-6,0,20,-19,-1,-15,-2,8,-2,-9,13,0,-3,-18,-9,-9,-19,17,-14,-19,-4,-16,2,0,9,5,-7,-4,20,18,9,0,12,-1,10,-17,-11,16,-13,-14,-3,0,2,-18,2,8,20,-15,3,-13,-12,-2,-19,11,11,-10,1,1,-10,-2,12,0,17,-19,-7,8,-19,-17,5,-5,-10,8,0,-12,4,19,2,0,12,14,-9,15,7,0,-16,-5,16,-12,0,2,-16,14,18,12,13,5,0,5,6]
`;
var threeSumClosest = function(nums, target) { // 失败的尝试
    // 试一下 双链
    // 排序 -1 -2 -3 -4 -5 -6 -7 1 2 3 4 5 6 7  t = 2 4 3 2
    nums.sort((a, b) => {return a - b});
    let sum;
    let min = Number.MAX_VALUE, arr = [], oldT;
    let upNum;
    
    for (let L = 0, R = nums.length - 1; L < R; ) {
        oldT = Number.MAX_VALUE; // 是什么 用来判断是否还要向右继移动 初值为最大值
        upNum = 0;
        for (let i = L + 1; i < R; i++) {
            let s = nums[L] + nums[R] + nums[i];
            let mt = target - s; // mt是用来判断当前相加值与目标的差距
            console.log(s, target, mt, oldT);
            if (mt < 0 && upNum == 0) {
                if (Math.abs(mt) < Math.abs(min)) {
                    console.log()
                    min = mt;
                    sum = s;
                }
                upNum = -1;
                break;
            }
            if (Math.abs(mt) >= Math.abs(oldT)) {
                // 循环后 oldT为 第一次循环得出 与目标相差值 往后循环依次更新
                // 后面mt的值会先小写oldT的值（更新oldT）后面又会大于或等于oldT 表明 后面的值相加会与目标越来越远
                // 则跳出循环
                if (Math.abs(nums[L]) < Math.abs(nums[R])) {
                    upNum = 1
                } else {
                    upNum = -1
                }
                // upNum = mt; // mt ? oldT 谁能反应
                // 当upNum小于0时 说明三个数相加的和比target大 则右指针左移 R--
                break;
            }
            oldT = mt;
            if (Math.abs(mt) < Math.abs(min)) {
                console.log()
                min = mt;
                sum = s;
            }
            if (min == 0) {return sum}

        }
        // 如何移动指针 何时移右指针
        if (upNum < 0) {
            R--;
        } else {
           L++;
        }

        
    }
    return sum; // 0 1 1 1 
}

var threeSumClosest2 = function(nums, target) { //AC
    let min = Number.MAX_VALUE, sum;
    nums.sort((a, b) => {return a - b});
    for (let i = 0; i < nums.length; i++) {
        for (let L = i + 1, R = nums.length - 1; L < R;) {
            let s = nums[L] + nums[R] + nums[i];
            let mt = target - s;
            if (mt == 0) {
                return s;
            }
            if (mt > 0) {
                L++;
            } else {
                R--;
            }
            if (Math.abs(mt) < Math.abs(min)) {
                console.log()
                min = mt;
                sum = s;
            }
        }
    }
    return sum;
}


var letterCombinationsText = `
给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。

给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。

示例:

输入："23"
输出：["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].
`;

var letterCombinations = function(digits) {
    let keyObj = {2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqrs',
     8: 'tuv', 9: 'wxyz'};
     let t = /[^2-8]+/g;
     if (t.test(digits)) { return []};
     let arr = [];

     for (let i = 0; i < digits.length; i++) {
         arr.push([...keyObj[digits[i]]]);
     }
    //  [[a, b, c], [d, e, f]]
    // 将两个数组融合为一个

    arr = arr.reduce((c, a, index) => {
        let rearr = [];
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < c.length; j++) {
                rearr.push(a[i] + c[j]);
            }
        }
        c = rearr;
        return c
    });

     return arr;
}

var fourSumText = `
给定一个包含 n 个整数的数组 nums 和一个目标值 target，判断 nums 中是否存在四个元素 a，b，c 和 d ，
使得 a + b + c + d 的值与 target 相等？找出所有满足条件且不重复的四元组。
注意：
答案中不可以包含重复的四元组。 // 穷举
[1, 0, -1, 0, -2, 2] -2 -1 0 0 1 2

// [-3,-2,-1,0,0,1,2,3] -3 -2 -1 0 0 1 2 3
`;

var fourSum = function(nums, target) {
    nums.sort((a, b) => {return a -b});
    let arr = [];
    let hash = {};
    for (let i = 0; i < nums.length; i++) {

        for (let k = i + 1; k < nums.length; k++) {
            for (let L = k + 1, R = nums.length - 1; L < R; ) {
                let x = nums[i] + nums[k] + nums[L] + nums[R];
                if (x < target) {
                    L++;
                }
                if (x === target) {
                    let key = [nums[i], nums[k], nums[L], nums[R]].sort((a, b) => {return a - b}).join();
                    if (!hash[key]) {
                        arr.push([nums[i], nums[k], nums[L], nums[R]]);
                    }
                    // 去重
                    L++;
                    // break;
                }
                if (x > target) {
                    R--;
                }
            }
        }

    }

    return arr;
};

var removeNthFromEndText = `
给定一个链表，删除链表的倒数第 n 个节点，并且返回链表的头结点。

示例：

给定一个链表: 1->2->3->4->5, 和 n = 2.

当删除了倒数第二个节点后，链表变为 1->2->3->5.

`;

var removeNthFromEnd = function(head, n) {
    let t = head, temp = head, count = 0;
    while(temp.next != null) {
        temp.index = count++;
        temp = temp.next;
    }
    temp = head;
    // 找到要删除的节点 temp就是最后一个节点
    while(temp.next != null) {
        if (temp.index == count - 1 - n) {
            temp.next = temp.next.next;
        }
        temp = temp.next;
    }
    return t;
};

var removeNthFromEnd2 = function(head, n) { // 思路二 使用两个指针 一次遍历
    let t = head, temp = head, end = head;
    while(n > 0) {
        end = end.next;
        n--;
    }
    if (end == null) {
        t = head.next;
    } else {
        while(end && end.next != null) {
            end = end.next;
            temp = temp.next;
        }
        temp.next = temp.next.next;
    }
    
    return t;
    
};

var myAtoiText = `
请你来实现一个 atoi 函数，使其能将字符串转换成整数。

首先，该函数会根据需要丢弃无用的开头空格字符，直到寻找到第一个非空格的字符为止。

当我们寻找到的第一个非空字符为正或者负号时，则将该符号与之后面尽可能多的连续数字组合起来，作为该整数的正负号；假如第一个非空字符是数字，则直接将其与之后连续的数字字符组合起来，形成整数。

该字符串除了有效的整数部分之后也可能会存在多余的字符，这些字符可以被忽略，它们对于函数不应该造成影响。

注意：假如该字符串中的第一个非空格字符不是一个有效整数字符、字符串为空或字符串仅包含空白字符时，则你的函数不需要进行转换。

在任何情况下，若函数不能进行有效的转换时，请返回 0。

`;
var myAtoi = function(str) {
    let temp = '0', f;
    // 第一个非空字符
    for(let i = 0; i < str.length; i++) {
        if (str[i] != ' ') {
            if ('-+123456789'.indexOf(str[i]) > -1) {
                    temp = str[i];
                f = i;
                break;
            } else {
                return 0;
            }
            
        }
    }
    for (let i = f + 1; i < str.length; i++) {
        if ('123456789'.indexOf(str[i]) > -1) {
            temp += str[i];
        } else {
            break;
        }
    }
    // 得到第一个连联的数
    if (temp.length == 1 && '-+'.indexOf(temp)) {return 0}
    let t = parseInt(temp)
    if (t > Math.pow(2, 31)  - 1) {
        return Math.pow(2, 31)  - 1
    }
    if (t < Math.pow(-2, 31)) {
        return Math.pow(-2, 31);
    }
    return t;
};