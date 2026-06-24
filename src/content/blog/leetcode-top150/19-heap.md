---
title: "Top 150 · 堆（4 题）"
categories: LeetCode
tags: ['Top150', '堆']
id: "top150-19-heap"
date: 2026-06-22 12:00:00
updated: 2026-06-25 03:30:49
cover: "/assets/images/covers/top150/19-heap.svg"
hide: false
recommend: false
top: false
---

:::note
优先队列、TopK 与数据流中位数。

本模块共 **4** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 215. 数组中的第K个最大元素

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/kth-largest-element-in-an-array/" type="info"}

### 思路

要求用O(n)，是一道经典的快排应用题，本质思路是快排+3路partition防止重复元素过多退化到O(n^2)，然后快排每次只处理一半

### 代码

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        return quickSelect(nums, 0, nums.length - 1, nums.length - k);
    }

    int quickSelect(int[] nums, int left, int right, int target) {
        if (left == right) return nums[left];
        
        Random r = new Random();
        int pivot = nums[r.nextInt(right - left + 1) + left];
        
        // 三路partition
        int lo = left, hi = right, i = left;
        while (i <= hi) {
            if (nums[i] < pivot) {
                swap(nums, i++, lo++);
            } else if (nums[i] > pivot) {
                swap(nums, i, hi--);
            } else {
                i++;
            }
        }
        
        if (target < lo) {
            return quickSelect(nums, left, lo - 1, target);
        } else if (target > hi) {
            return quickSelect(nums, hi + 1, right, target);
        } else {
            return nums[lo]; // target在==pivot区间里
        }
    }

    void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(1)$

### 备注

堆写法的话直接时间O(nlogk)，空间O(k)
```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int n : nums) {
            pq.offer(n);
            if (pq.size() > k) pq.poll();
        }
        return pq.peek();
    }
}
```

---

## 502. IPO

**难度：** 困难

::btn[力扣做题]{link="https://leetcode.cn/problems/ipo/" type="info"}

### 思路

小顶堆存capital，能选的列表；每次根据现在的w把能启动的项目放进大顶堆选profits最大的

### 代码

```java
class Solution {
    public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
        int n = profits.length;
        // 小顶堆，按capital排
        PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        // 大顶堆，按profit排
        PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a, b) -> b[1] - a[1]);

        for (int i = 0; i < n; i++) {
            minHeap.offer(new int[]{capital[i], profits[i]});
        }

        for (int i = 0; i < k; i++) {
            // 把当前能启动的项目移到大顶堆
            while (!minHeap.isEmpty() && minHeap.peek()[0] <= w) {
                maxHeap.offer(minHeap.poll());
            }
            // 没有能启动的项目了
            if (maxHeap.isEmpty()) break;
            // 选利润最大的
            w += maxHeap.poll()[1];
        }
        return w;
    }
}
```

### 复杂度

- 时间：$O((n+k)\log n)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---

## 373. 查找和最小的 K 对数字

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/find-k-pairs-with-smallest-sums/" type="info"}

### 思路

初始加入所有的(nums1[i],nums2[0])，然后取谁就加谁的后继nums[i],nums2[j++]

### 代码

```java
class Solution {
    public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        for (int i = 0; i < nums1.length; i++) {
            pq.offer(new int[]{nums1[i] + nums2[0], i, 0});
        }
        List<List<Integer>> ans = new ArrayList<>();

        for (int i = 0; i < k; i++) {
            int[] cur = pq.poll();
            int ni = cur[1], j = cur[2];
            ans.add(Arrays.asList(nums1[ni], nums2[j]));
            if (j + 1 < nums2.length) {
                pq.offer(new int[]{nums1[ni] + nums2[j + 1], ni, j + 1});
            }
        }
        return ans;
    }
}
```

### 复杂度

- 时间：$O((n+k) \log n)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---

## 295. 数据流的中位数

**难度：** 困难

::btn[力扣做题]{link="https://leetcode.cn/problems/find-median-from-data-stream/" type="info"}

### 思路

小根堆存大的一半数字，大根堆存小的一半数字，中位数就是大根堆的堆顶或者大+小/2

### 代码

```java
class MedianFinder {
    PriorityQueue<Integer> small;
    PriorityQueue<Integer> big;
    public MedianFinder() {
        this.small = new PriorityQueue<>();
        this.big = new PriorityQueue<>(Collections.reverseOrder());
    }
    
    public void addNum(int num) {
        big.offer(num);
        small.offer(big.poll());
        if(small.size() > big.size()){
            big.offer(small.poll());
        }
    }
    
    public double findMedian() {
        if(big.size() == small.size()){
            return ((big.peek()+small.peek())/2.0d);
        }else{
            return big.peek();
        }
    }
}

/**
 * Your MedianFinder object will be instantiated and called as such:
 * MedianFinder obj = new MedianFinder();
 * obj.addNum(num);
 * double param_2 = obj.findMedian();
 */
```

### 复杂度

- 时间：$O(\log n)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---
