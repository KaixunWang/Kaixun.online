---
title: "Top 150 · Kadane 算法（2 题）"
categories: LeetCode
tags: ['Top150', 'Kadane', '动态规划']
id: "top150-17-kadane"
date: 2026-06-22 12:00:00
hide: false
recommend: false
top: false
---

:::note
最大子数组和及其环形变体。

本模块共 **2** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 53. 最大子数组和

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/maximum-subarray/" type="info"}

### 思路
动态规划nums[i]变成位置i前最大的数组和

### 代码

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int len = nums.length;
        if(len == 1){return nums[0];}
        int pre = nums[0];
        for(int i =1;i<len;i++){
            if(pre >0){
                nums[i]+=pre;
            }
            pre = nums[i];
        }
        int ans = nums[0];
        for(int i =0;i<len;i++){
            ans = Math.max(ans,nums[i]);
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

## 918. 环形子数组的最大和

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/maximum-sum-circular-subarray/" type="info"}

### 思路

![918 环形子数组最大和：Case 1 不跨环 / Case 2 跨环等于总和减最小子数组和](/assets/images/blog/918.png)

Case 1：直接最大子数组和。
Case 2：跨环时，最大子数组 = 总和 − 最小子数组和。
Special Case: 全部为负数时，Case1正常，输出负数；Case2恒输出0，最大和应该是Case1的输出

### 代码

```java
class Solution {
    public int maxSubarraySumCircular(int[] nums) {
        int total =0;
        int maxSum =nums[0];
        int minSum =nums[0];
        int curMax = 0;
        int curMin = 0;
        for (int a : nums) {
            curMax = Math.max(curMax + a, a);
            maxSum = Math.max(maxSum, curMax);
            curMin = Math.min(curMin + a, a);
            minSum = Math.min(minSum, curMin);
            total += a;
        }
        return maxSum >0? Math.max(maxSum,total-minSum):maxSum;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(1)$

### 备注

本质是上一题的贪心做法，证明思路比较重要

---
