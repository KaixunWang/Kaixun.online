---
title: "Top 150 · 数学（6 题）"
categories: LeetCode
tags: ['Top150', '数学']
id: "top150-21-math"
date: 2026-06-22 12:00:00
updated: 2026-06-25 03:30:49
cover: "/assets/images/covers/top150/21-math.svg"
hide: false
recommend: false
top: false
---

:::note
数论、快速幂与几何计数。

本模块共 **6** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 9. 回文数

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/palindrome-number/" type="info"}

### 思路

反转数字要么和原本的一样（偶数），要么差了*10（奇数）

### 代码

```java
class Solution {
    public boolean isPalindrome(int x) {
        if(x< 0 || x % 10 == 0 && x!=0){
            return false;
        }
        int reverse =0;
        while(x > reverse){
            reverse = reverse*10 + x%10;
            x = x/10;
        }
        return x == reverse || x==reverse/10;
    }
}
```

### 复杂度

- 时间：$O(\log n)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 66. 加一

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/plus-one/" type="info"}

### 思路

从右往左找第一个不是9的数，找到了就+1返回

找不到就新建一个1000....000的返回

### 代码

```java
class Solution {
    public int[] plusOne(int[] digits) {
        int n = digits.length;
        for (int i = n - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;
                return digits;
            }
            digits[i] = 0;
        }

        int[] ans = new int[n + 1];
        ans[0] = 1;
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

## 172. 阶乘后的零

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/factorial-trailing-zeroes/" type="info"}

### 思路

末尾的0从哪来？10 = 2 × 5，所以每有一对(2,5)就多一个0

2比5多得多，所以只需要数5的个数

25会多贡献1，125会多贡献2....依此类推

### 代码

```java
class Solution {
    public int trailingZeroes(int n) {
        int ans = 0;
        for(int i = 5; i <= n; i *= 5) {
            ans += n / i;
        }
        return ans;
    }
}
```

### 复杂度

- 时间：$O(\log n)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 69. x 的平方根

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/sqrtx/" type="info"}

### 思路

从2二分查找到$\frac{x}{2}$

### 代码

```java
class Solution {
    public int mySqrt(int x) {
        if (x < 2) return x;
        int left = 2, right = x / 2;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            long square = (long) mid * mid;
            if (square == x) {
                return mid;
            } else if (square < x) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return right;
    }
}
```

### 复杂度

- 时间：$O(\log x)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 50. Pow(x, n)

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/powx-n/" type="info"}

### 思路

二分递归快速幂

### 代码

```java
class Solution {
    public double myPow(double x, int n) {
        long N = n;
        if (N < 0) {
            return 1.0 / quickPow(x, -N);
        } else {
            return quickPow(x, N);
        }
    }
    double quickPow(double x, long n) {
        if (n == 0) return 1;
        double half = quickPow(x, n/2);
        if (n % 2 == 0) {
            return half * half;
        } else {
            return half * half * x;
        }
    }
}
```

### 复杂度

- 时间：$O(\log n)$
- 空间：$O(\log n)$

### 备注

<!-- 待填 -->

---

## 149. 直线上最多的点数

**难度：** 困难

::btn[力扣做题]{link="https://leetcode.cn/problems/max-points-on-a-line/" type="info"}

### 思路

每个点一个哈希表存斜率，最大斜率count是最大共线点数

### 代码

```java
class Solution {
    public int maxPoints(int[][] points) {
        int n = points.length;
        if (n <= 2) return n;
        int ans = 0;
        
        for (int i = 0; i < n; i++) {
            Map<String, Integer> map = new HashMap<>();
            for (int j = i + 1; j < n; j++) {
                int dy = points[j][1] - points[i][1];
                int dx = points[j][0] - points[i][0];
                int g = gcd(Math.abs(dy), Math.abs(dx));
                dy /= g;
                dx /= g;
                if (dx < 0) { dy = -dy; dx = -dx; }
                if (dx == 0) {
                    dy = 1;
                } else {
                    if (dx < 0) { dy = -dy; dx = -dx; }
                }
                String key = dy + "," + dx;
                map.put(key, map.getOrDefault(key, 0) + 1);
                
            }
            for (int cnt : map.values()) {
                ans = Math.max(ans, cnt + 1);
            }
        }
        return ans;
    }
    
    int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
}
```

### 复杂度

- 时间：$O(n^2\log (maxVal))$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---
