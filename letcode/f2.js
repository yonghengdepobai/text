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
    if (s.length == 0) {return p.length == 0}
    let isM = false;
    if (s[0] != '' && (s[0] == p[0] || p[0] == '.')) {
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