---
title: "Top 150 · 区间（4 题）"
categories: LeetCode
tags: ['Top150', '区间']
id: "top150-06-intervals"
date: 2026-09-04 16:43:11
cover: "/assets/images/covers/top150/06-intervals.svg"
hide: false
recommend: false
top: false
---

:::note
区间合并、插入与贪心选点。

本模块共 **4** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 228. 汇总区间

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/summary-ranges/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public List<String> summaryRanges(int[] nums) {
        int i = 0;
        int j = 0;
        List<String> ans = new ArrayList<>();

        while (j < nums.length) {
            while (j + 1 < nums.length && nums[j + 1] == nums[j] + 1) {
                j++;
            }

            String temp;
            if (i == j) {
                temp = Integer.toString(nums[i]);
            } else {
                temp = Integer.toString(nums[i]) 
                     + "->" 
                     + Integer.toString(nums[j]);
            }

            ans.add(temp);

            j++;
            i = j;
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

## 56. 合并区间

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/merge-intervals/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public int[][] merge(int[][] intervals) {
        ArrayList<int[]> ans = new ArrayList();
        int n = intervals.length;
        Arrays.sort(intervals, new Comparator<int[]>() {
            @Override
            public int compare(int[] o1, int[] o2) {
                return Integer.compare(o1[0],o2[0]);
            }
        });

        int[] cur = new int[2];
        cur[0] = intervals[0][0];
        cur[1] = intervals[0][1];

        for (int i = 1; i < n; i++) {
            if(cur[1] >= intervals[i][0]){
                //merge
                cur[1] = Math.max(intervals[i][1],cur[1]);
            }else{
                ans.add(cur);
                cur = new int[2];
                cur[0] = intervals[i][0];
                cur[1] = intervals[i][1];
            }
        }
        ans.add(cur);
        return ans.toArray(new int[ans.size()][]);
    }
}
```

### 复杂度

- 时间：$O(n \log n)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---

## 57. 插入区间

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/insert-interval/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        ArrayList<int[]> ans = new ArrayList();
        int a = newInterval[0];
        int b = newInterval[1];
        int i =0;
        int n = intervals.length;
        boolean flag = true;
        while(i<n){
            if(intervals[i][1]<a){
                ans.add(intervals[i]);
                i++;
            }else if(intervals[i][0]>b){
                if(flag){
                    ans.add(new int[]{a,b});
                    flag = false;
                }
                ans.add(intervals[i]);
                i++;
            }else{
                a = Math.min(a, intervals[i][0]);
                b = Math.max(b, intervals[i][1]);
                i++;
            }
        }
        if(flag){
            ans.add(new int[]{a,b});
        }
        return ans.toArray(new int[ans.size()][]);
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---

## 452. 用最少数量的箭引爆气球

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public int findMinArrowShots(int[][] points) {
        if(points.length == 1)return 1;
        Arrays.sort(points, new Comparator<int[]>() {
            @Override
            public int compare(int[] o1, int[] o2) {
                return Integer.compare(o1[0],o2[0]);
            }
        });
        int ans =1;
        int right = points[0][1];
        for (int i = 1; i < points.length; i++) {
            if(points[i][0] > right){
                ans++;
                right = points[i][1];
            }else{
                right = Math.min(right,points[i][1]);
            }
        }
        return ans;
    }
}
```

### 复杂度

- 时间：$O(n \log n)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---
