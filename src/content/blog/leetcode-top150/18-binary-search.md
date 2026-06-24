---
title: "Top 150 · 二分查找（7 题）"
categories: LeetCode
tags: ['Top150', '二分查找']
id: "top150-18-binary-search"
date: 2026-06-22 12:00:00
cover: "/assets/images/covers/top150/18-binary-search.svg"
hide: false
recommend: false
top: false
---

:::note
有序数组二分、旋转数组与双数组中位数。

本模块共 **7** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 35. 搜索插入位置

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/search-insert-position/" type="info"}

### 思路

二分模板

### 代码

```java
class Solution {
    public int searchInsert(int[] nums, int target) {
        int n = nums.length;
        int left = 0, right = n - 1, ans = n;
        while (left <= right) {
            int mid = ((right - left) >> 1) + left;
            if (target <= nums[mid]) {
                ans = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return ans;
    }
}

```

### 复杂度

- 时间：$O(\logn)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 74. 搜索二维矩阵

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/search-a-2d-matrix/" type="info"}

### 思路

二维转一维，其余是一样的

### 代码

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
    int m = matrix.length, n = matrix[0].length;
    int left = 0, right = m * n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        int val = matrix[mid / n][mid % n];
        if (val == target) return true;
        else if (val < target) left = mid + 1;
        else right = mid - 1;
    }
    return false;
    }
}
```

### 复杂度

- 时间：$O(\log m +\log n)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 162. 寻找峰值

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/find-peak-element/" type="info"}

### 思路

如果nums[i]<nums[i+1]那么i右边一定有一个peak，如果nums[i]>=nums[i+1]那么i左边（包含）一定有一个peak

### 代码

```java
class Solution {
    public int findPeakElement(int[] nums) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < nums[mid + 1]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }
}

```

### 复杂度

- 时间：$O()$
- 空间：$O()$

### 备注

<!-- 待填 -->

---

## 33. 搜索旋转排序数组

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/search-in-rotated-sorted-array/" type="info"}

### 思路

通过mid判断左（右）侧是不是有序，旋转点只有一个，mid要么在旋转点左边要么在右边，所以永远有一半是完整有序的。只看有序的那边，然后做二分

### 代码

```java
class Solution {
    public int search(int[] nums, int target) {
        int left =0;
        int right = nums.length - 1;
        while(left <= right){
            int mid = (right-left)/2+left;
            if (nums[mid] == target) return mid;
            if (nums[left] <= nums[mid]) { //左边有序
                if(target >= nums[left] && target < nums[mid]){//target在左边
                    right = mid - 1;
                }else{
                    left = mid + 1;
                }
            }else{ //右边有序
                if(target>nums[mid] && target <= nums[right]){ //target在右边
                    left = mid +1;
                }else{
                    right = mid -1;
                }
            }
        }
        return -1;
    }
}
```

### 复杂度

- 时间：$O(\log n)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 34. 在排序数组中查找元素的第一个和最后一个位置

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/" type="info"}

### 思路

两次二分

### 代码

```java
class Solution {
    public int[] searchRange(int[] nums, int target) {
        if(nums.length ==0){
            int[] ans = {-1,-1};
            return ans;
        }
        if(nums.length == 1){
            if(nums[0] == target){
                int[] ans = {0,0};
                return ans;
            }else{
                int[] ans = {-1,-1};
                return ans;
            }
        }
        int[] ans = {0,0};
        //找第一个
        int left =0;
        int right = nums.length - 1;
        while(left<right){
            int mid = (right - left)/2 +left;
            if(nums[mid]< target){
                left = mid +1;
            }else{
                right = mid;
            }
        }
        if(nums[left] == target){
            ans[0] = left;
        }else{
            ans[0] = -1;
            ans[1] = -1;
            return ans;
        }
        //找第二个
        left =0;
        right = nums.length - 1;
        while(left<=right){
            int mid = (right - left)/2 +left;
            if(nums[mid]<= target){
                left = mid + 1;
            }else{
                right = mid -1;
            }
        }
        ans[1] = right;
        return ans;
    }
}
```

### 复杂度

- 时间：$O(\logn)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 153. 寻找旋转排序数组中的最小值

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/" type="info"}

### 思路

每次跟最右边的比，因为最右边的一定是一段递增的最大的元素。

### 代码

```java
class Solution {
    public int findMin(int[] nums) {
        int l = 0;
        int r = nums.length - 1;
        while(l < r){
            int m = (r - l)/2 +l;
            if(nums[m] > nums[r]){
                l = m +1;
            }else{
                r = m;
            }
        }
        return nums[l];
    }
}
```

### 复杂度

- 时间：$O(\log n)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 4. 寻找两个正序数组的中位数

**难度：** 困难

::btn[力扣做题]{link="https://leetcode.cn/problems/median-of-two-sorted-arrays/" type="info"}

### 思路

上面二分，其实下面的中点也就确定了，只需要比较四个元素

### 代码

```java
class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int m = nums1.length, n = nums2.length;
        if (m > n)
            return findMedianSortedArrays(nums2, nums1);
        
        int left = 0, right = m;
        while (left <= right) {
            int i = left + (right - left) / 2;
            int j = (m + n + 1) / 2 - i;
            
            int maxLeft1 = (i == 0) ? Integer.MIN_VALUE : nums1[i-1];
            int minRight1 = (i == m) ? Integer.MAX_VALUE : nums1[i];
            int maxLeft2 = (j == 0) ? Integer.MIN_VALUE : nums2[j-1];
            int minRight2 = (j == n) ? Integer.MAX_VALUE : nums2[j];
            
            if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
                if((m+n)%2 ==0){//偶数
                    return (Math.max(maxLeft1,maxLeft2)+Math.min(minRight1,minRight2))/2.0;
                }else{//奇数
                    return Math.max(maxLeft1,maxLeft2);
                }
            } else if (maxLeft1 > minRight2) {
                right = i - 1;
            } else {
                left = i + 1;
            }
        }
    return 0;
}
}
```

### 复杂度

- 时间：$O(\log(\min(m,n)))$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---
