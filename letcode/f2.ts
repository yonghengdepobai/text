var findMedianSortedArraysText = `
给定两个大小为 m 和 n 的有序数组 nums1 和 nums2。

请你找出这两个有序数组的中位数，并且要求算法的时间复杂度为 O(log(m + n))。

你可以假设 nums1 和 nums2 不会同时为空。

示例 1:

nums1 = [1, 3]
nums2 = [2]

则中位数是 2.0
示例 2:

nums1 = [1, 2] 1 2 8 9
nums2 = [3, 4]  2345678

则中位数是 (2 + 3)/2 = 2.5
中位数是 是按顺序排列的一组数据中居于中间位置的数
如果观察值有偶数个，通常取最中间的两个数值的平均数作为中位数
`;
var findMedianSortedArrays = function(nums1, nums2) {
    let maxArr, minArr;
    if (nums1.length > nums2.length) { maxArr = nums1; minArr = nums2;} else {
        maxArr = nums2; minArr = nums1;
    }
    let L = 0, R = 0;
    while(minArr[R] != null) {
        if (maxArr[L] != null) {
            if (maxArr[L] > minArr[R]) {
                maxArr.splice(L, 0, minArr[R]);
                L++; R++;
            } else {
                L++;
            }
        } else {
            maxArr.push(...minArr.slice(R)); break;
        }
        
    }
    if (maxArr.length % 2 == 0) {
        return (maxArr[Math.floor(maxArr.length / 2) - 1] + maxArr[Math.floor(maxArr.length / 2)]) / 2;
    } else {
        return maxArr[Math.floor(maxArr.length / 2)];
    }

    // 1 3 5 7
    // 2 4 6 8  k = 3; k / 2 = 1 k = 4 k /2 = 2
};

// 两个有序数组求第k小的数
function getKth(nums1, nums2, k) {
    // 采用二分法
    // 我找第10小的数 将上面数组的前5个去掉或下面数组的前五个去掉就排除了一半 同理递归
    if (nums1.length < 1) {
        return nums2[k - 1];
    }
    if (nums2.length < 1) {
        return nums1[k - 1];
    }
    if (k == 1) {
        console.log(nums1[k - 1], nums2[k - 1], '?????');
        return Math.min(nums1[k - 1], nums2[k - 1]);
    }
    let ek = Math.floor(k / 2);
    let t1 = Math.min(ek, nums1.length - 1);
    let t2 = Math.min(ek, nums2.length - 1);
    let min1 = nums1[t1];
    let min2 = nums2[t2];
    let sarr1 = nums1, sarr2 = nums2;

    if (min1 < min2) {
        // 上面小就减去上面的
        sarr1 = nums1.slice(t1);
        k -= t1;
    } else {
        sarr2 = nums2.slice(t2);
        k -= t2;
    }
    console.log(k, sarr1, sarr2);
    // if (k == 1) {
    //     return Math.min(nums1[k - 1], nums2[k - 1]);
    // } else {
        return getKth(sarr1, sarr2, k);
    // }
}

var s = getKth([1, 3, 4, 9], [1, 2, 3, 4, 5, 6, 7, 8, 9], 7);
console.log(s);


var isMatchText = `
给你一个字符串 s 和一个字符规律 p，请你来实现一个支持 '.' 和 '*' 的正则表达式匹配。

'.' 匹配任意单个字符
'*' 匹配零个或多个前面的那一个元素
所谓匹配，是要涵盖 整个 字符串 s的，而不是部分字符串。

说明:

s 可能为空，且只包含从 a-z 的小写字母。
p 可能为空，且只包含从 a-z 的小写字母，以及字符 . 和 *。
`;
var isMatch2 = function(s, p) {
    // ssssss si sss i sssss s p
    // ssssss ss*i s* i .* s
    let temp = '';
    let parr = [], count = 0; ptemp = '';
    // 处理 p 使其成为 string + 'char*'
    for (let i = 0; i < p.length; i++) {
        if (p[i + 1] && p[i + 1] == '*') {
            let str = p[i] + p[i + 1];
            parr[++count] = str;
            i++;
        } else {
            if (! parr[count]) {
                parr[count] = p[i];
            } else {
                parr[count] = parr[count] + p[i];
            }
        }
    }
    // 回溯 带有*的
    let matchIndex = 0, cArr = [];
    for (let i = 0; i < parr.length; i++) {
        let item = parr[i];
        if (item.indexOf('*') > -1) {
            // 带有*号 sssi s*i
            let char = parr[0];
            if (char != '.') {
                let m = char;
                while(true) {
                    if (!s[matchIndex] && parr[i + 1]) { // 循环完匹配串 后面还有结束
                        return false;
                    }
                    if (char != s[matchIndex]) {
                        m = m.slice(0, m.length - 1);
                        if (parr[i + 1] && parr[i + 1][0] != s[matchIndex]) {
                            return false;
                        }
                        break;
                    } else {
                        matchIndex++;
                    }
                }
            } else {
                let nextC; // ssssdsfiii .*i*
                // 是 .* 去找他后面要匹配的元素
                if (!parr[i + 1]) { // 后面没有要匹配的了
                    return true; // 直接返回true
                } else {
                    nextC = parr[i + 1];
                }

                // let nextC = 
            }
        } else { // ssssssi  sss*i
            for (let k = 0; k < item.length; k++) {
                if (!s[matchIndex]) { // 循环完匹配串
                    return false;
                }
                if (item[k] != s[matchIndex++]) {
                    // 回溯
                    if (item[k] != '.') {
                        return false;
                    }
                }
            }
        }
    }
    if (matchIndex < s.length) { // 正则串循环完 没有完美匹配
        return false;
    }
    return true;
};

var fxm = `
s = "aa"
p = "a"

s = "aa"
p = "aaa*" // index s[++index]

s = "ab"
p = ".*"

s = "aab"
p = "c*a*b"

s = "mississippi"
p = "mis*is*p*."

`;

var isMatch = function(s, p) {
    // 回溯    为什么回 如何回 什么时候回
    if (p.length == 0) {return s.length == 0}
    let isM = false;
    if (s[0] != undefined && (s[0] == p[0] || p[0] == '.')) {
        isM = true;
    }
    // aabb a*b
    if (p[1] && p[1] == '*') {
        return isMatch(s, p.substring(2)) || (isM && isMatch(s.substring(1), p));
    } else if (isM) {
        return isMatch(s.substring(1), p.substring(1));
    } else {
        return false;
    }

}
var isMatchThink = `
    因为题目拥有最优子结构（？），一个自然的想法就是将中间结果保存起来。我们通过
    dp(i, j)表示text[i:]和pattern[j:]是否能匹配。用更短的字符串匹配问题来表示问题

    算法
    我们用上面同样的回溯法，除此之外，因为函数match(text[i:], pattern[j:]) 只会被调用一次，
    我们用dp(i, j)来应对剩余相同参数的函数调用，这些帮助我们节省了字符串建立操作所需要的时间，
    也让我们可以将中间结果进行保存

    之前一直疑惑为什么要加memo备忘录做缓存，因为在实验案例的时候没发现有重复的操作。试了很久，总算找到了有重复项的案例： str: "abc" pattern: "a*a*d"
    str=abc     pattern=a*a*d    i    j    result        
    |           |                              
    └-abc       └-a*d            0    2    false              
    | └-abc     | └-d            0    4    false 
    | └-bc      | └-a*d          1    2    false  // 重复1
    |   └-bc    |   └-d          1    4    false  // 重复2
    |           |                           
    └-bc        └-a*a*d          1    0    false 
    └-bc        └-a*d          1    2    false  // 重复1
        └-bc        └-d          1    4    false  // 重复2

`;

// 自顶向下的方法
enum Result {
    TRUE, FALSE
}
var isMatchDp = function(text, pattern) {
    let memo: Result[][] = new Array(text.length + 1);
    for(let m = 0, len = memo.length; m < len; m++) {
        memo[m] = new Array(pattern.length + 1);
    }
    // function isMatch(String )
    function dp (i, j, text, pattern) {
        if (memo[i][j] != null) {
            return memo[i][j] == Result.TRUE;
        }

        var ans;
        if (j == pattern.length) {
            ans = i == text.length;
        } else {
            var first_match = (i < text.length && (pattern[j] === text[i] || pattern[j] == '.'));

            if (j + 1 < pattern.length && pattern[j + 1] == '*') {
                ans = (dp(i, j + 2, text, pattern)) ||
                        first_match && dp(i + 1, j, text, pattern);
            } else {
                ans = first_match && dp(i + 1, j + 1, text, pattern);
            }
        }

        memo[i][j] = ans ? Result.TRUE : Result.FALSE;
        return ans;

    }

    return dp(0, 0, text, pattern);
    // mississippi
}

var generateParenthesisText = `
给出 n 代表生成括号的对数，请你写出一个函数，使其能够生成所有可能的并且有效的括号组合。

例如，给出 n = 3，生成结果为：

[
  "((()))",
  "(()())",
  "(())()",
  "()(())",
  "()()()"
]
`

/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
    let Result = {};
    Result[Result[")"] = 1] = ")";
    Result[Result["("] = -1] = "(";
    let len = n * 2, arr = [];
    // 第一个只能左括 最后一个不能左括号
    setTemp('(');
    function setTemp(temp) {
        if (temp.length >= len) {arr.push(temp) ;return;}
        let count = 0, lcount = 0;
        for (let i = 0; i < temp.length; i++) {
            count += Result[temp[i]];
            lcount = lcount + Result[temp[i]] == -1 ? 1 : 0;
        }
        if (count < 0) { // 可以加右括
            setTemp(temp + ')');
            if (lcount < n) { // 还可以加左括号
                setTemp(temp +'(');
            }
        } else {
            if (lcount < n) { // 还可以加左括号
                setTemp(temp + '(');
            }
        }
    }
    return arr;
    
};

var generateParenthesisH = function(n) {
    // 回溯法
    let arr = [], len = n * 2;
    function setKH(temp, l, r, n) {
        if (temp.length >= len) {arr.push(temp) ;return;}

        if (l < n) {
            setKH(temp + '(', l + 1, r, n);
        }
        if (r < l) {
            setKH(temp + ')', l, r + 1, n);
        }
    }
    setKH('', 0, 0, n);
    return arr;
}


var mergeKListsText = `
合并 k 个排序链表，返回合并后的排序链表。请分析和描述算法的复杂度。

示例:

输入:
[
  1->4->5,
  1->3->4,
  2->6
]
输出: 1->1->2->3->4->4->5->6
`
function ListNode(val) {
         this.val = val;
         this.next = null;
     }
var mergeKLists = function(lists) {
   
    var arr = [];
    for (let i = 0; i < lists.length; i++) { // 暴力法
        var item = lists[i];
        while(item) {
            arr.push(item.val);
            item = item.next;
        }
        // 取出所有数据
    }
    arr.sort((a, b) => a - b); // 排序
    var node = new ListNode(arr[0]);
    for (let i = 1; i < arr.length; i++) {
        node.next = new ListNode(arr[i]);
    }
    return node;
};

var swapPairsText = `
给定一个链表，两两交换其中相邻的节点，并返回交换后的链表。

你不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换。

 

示例:

给定 1->2->3->4, 你应该返回 2->1->4->3.

`;

var swapPairs = function(head) {
    // [] -> [] -> [] -> [];
    // ^
    // |
    var res = head;
    var t = true;
    var uphead;
    while(head) {
        let temp = head;
        if (head.next == null) {
            return res;
        }
        head = head.next;
        if (t) {
            t = false;
            res = head;
            // console.log(res);
        }
        if (uphead) {
            uphead.next = head;
        }
        // 头没接上
        let nn = head.next;
        head.next = temp;
        uphead = temp;

        head.next.next = nn;
        head = nn;
        // console.log('????', head);
    }
    return res;
};

var reverseKGroupText = `
给你一个链表，每 k 个节点一组进行翻转，请你返回翻转后的链表。

k 是一个正整数，它的值小于或等于链表的长度。

如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序。

`;

var reverseKGroup = function(head, k) {
    var res = null, t = head, uphead = null;
    while(head) {
        // console.log(res, head);
        var kh = head, kArr = [], count = 0, ih = head;
        // 判断是否有k的长度 并把 链表装入数组
        while(count < k && kh) {
            // console.log(kh, count);
            kArr[count++] = kh;
            kh = kh.next;
        }
        // console.log('///////');
        if (!kArr[count - 1] || count < k) {
            if (res == null) {res = t}
            // console.log('???');
            break;
        }
        // 把数里的链表返转
        if (res == null) {res = kArr[k - 1]}
        // head = kArr[0]; // 保持向
        if (uphead) {uphead.next = kArr[k - 1];}
        for (let i = k - 1; i > 0 ; i--) {
            kArr[i].next = kArr[i - 1];
        }
        kArr[0].next = kh;
        uphead = kArr[0];
        head = kh;
    }
    // console.log('////22222');
    // console.log(res);
    return res;
};