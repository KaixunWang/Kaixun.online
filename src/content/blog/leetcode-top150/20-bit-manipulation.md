---
title: "Top 150 · 位运算（6 题）"
categories: LeetCode
tags: ['Top150', '位运算']
id: "top150-20-bit-manipulation"
date: 2026-07-15 02:56:32
cover: "/assets/images/covers/top150/20-bit-manipulation.svg"
hide: false
updated: 2026-07-15 02:53:00
recommend: false
top: false
---

:::note
异或、位计数与区间按位与。

本模块共 **6** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 67. 二进制求和

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/add-binary/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public String addBinary(String a, String b) {
        StringBuilder sb = new StringBuilder();
        if(a.length() < b.length()){
            String temp = b;
            b = a;
            a = temp;
        }
        
        int i = a.length() - 1;
        int j = b.length() - 1;
        
        boolean carry =false;
        while(j >=0){
            if(a.charAt(i) =='0' && b.charAt(j) == '0'){
                if(carry){
                    sb.append("1");
                    carry = false;
                }else{
                    sb.append("0");
                }
            }else if(a.charAt(i) =='1' && b.charAt(j) == '1'){
                if(carry){
                    sb.append("1");
                }else{
                    sb.append("0");
                    carry = true;
                }
            }else{
                if(carry){
                    sb.append("0");
                    carry = true;
                }else{
                    sb.append("1");
                }
            }
            j--;
            i--;
        }
        
        while (i >=0) {
            if(a.charAt(i) =='0'){
                if(carry){
                    sb.append("1");
                    carry = false;
                }else{
                    sb.append("0");
                }
            }else{
                if(carry){
                    sb.append("0");
                }else{
                    sb.append("1");
                }
            }
            i--;
            j--;
        }
        if(carry){
            sb.append("1");
        }
        return sb.reverse().toString();
    }
}
```

### 复杂度

- 时间：$O(\max(m, n))$
- 空间：$O(\max(m, n))$

### 备注

<!-- 待填 -->

---

## 190. 颠倒二进制位

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/reverse-bits/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    private static final int m0 = 0x55555555; // 01010101 ...
    private static final int m1 = 0x33333333; // 00110011 ...
    private static final int m2 = 0x0f0f0f0f; // 00001111 ...
    private static final int m3 = 0x00ff00ff; // 00000000111111110000000011111111

    public int reverseBits(int n) {
        n = n>>>1&m0 | (n&m0)<<1; // 交换相邻位
        n = n>>>2&m1 | (n&m1)<<2; // 两个两个交换
        n = n>>>4&m2 | (n&m2)<<4; // 四个四个交换
        n = n>>>8&m3 | (n&m3)<<8; // 八个八个交换
        return n>>>16 | n<<16;    // 交换高低 16 位
    }
}
```

### 复杂度

- 时间：$O(1)$
- 空间：$O(1)$

### 备注

或者
```java
class Solution {
    public int reverseBits(int n) {
        return Integer.reverse(n);
    }
}
```

---

## 191. 位1的个数

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/number-of-1-bits/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public int hammingWeight(int n) {
        int count =0;
        
        while(n>0){
            if(n%2==1){
                 count +=1;
            }
            n >>= 1;
        }
        return count;
    }
}
```

### 复杂度

- 时间：$O(1)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 136. 只出现一次的数字

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/single-number/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public int singleNumber(int[] nums) {
        int ans =nums[0];
        for (int i = 1; i < nums.length; i++) {
            ans = ans ^ nums[i];
        }
        return ans;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 137. 只出现一次的数字 II

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/single-number-ii/" type="info"}

### 思路

因为其他数字都出现3次，所以该位上的1的个数模3后就是目标数字在该位的值

### 代码

```java
class Solution {
    public int singleNumber(int[] nums) {
        int ans = 0;
        for (int i = 0; i < 32; i++) {
            int count = 0;
            for (int num : nums) {
                count += (num >> i) & 1;
            }
            count %= 3;
            ans |= (count << i);
        }
        return ans;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 201. 数字范围按位与

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/bitwise-and-of-numbers-range/" type="info"}

### 思路

找共同前缀，后面都有不同

### 代码

```java
class Solution {
    public int rangeBitwiseAnd(int left, int right) {
        int cnt = 0;
        while(left != right){
            cnt++;
            left >>= 1;
            right >>= 1;
        }
        return left <<cnt;
    }
}
```

### 复杂度

- 时间：$O(\log n)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---
