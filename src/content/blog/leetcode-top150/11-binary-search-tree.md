---
title: "Top 150 · 二叉搜索树（3 题）"
categories: LeetCode
tags: ['Top150', '二叉搜索树']
id: "top150-11-binary-search-tree"
date: 2026-06-22 12:00:00
cover: "/assets/images/covers/top150/11-binary-search-tree.svg"
hide: false
updated: 2026-06-30 07:30:49
recommend: false
top: false
---

:::note
BST 中序性质、验证与第 K 小元素。

本模块共 **3** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 530. 二叉搜索树的最小绝对差

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/minimum-absolute-difference-in-bst/" type="info"}

### 思路

利用中序遍历有序的特点，比较每一次和上一次的元素的差即可

### 代码

```java
class Solution {
    int min = Integer.MAX_VALUE;
    TreeNode prev = null;

    public int getMinimumDifference(TreeNode root) {
        inorder(root);
        return min;
    }

    public void inorder(TreeNode node) {
        if (node == null) return;
        inorder(node.left);
        if (prev != null) min = Math.min(min, node.val - prev.val);
        prev = node;
        inorder(node.right);
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(h)$

### 备注

<!-- 待填 -->

---

## 230. 二叉搜索树中第 K 小的元素

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/kth-smallest-element-in-a-bst/" type="info"}

### 思路

中序遍历做计数

### 代码

```java
class Solution {
    int cnt = 0;
    int ans = 0;
    int k = 0;
    boolean found = false;

    public int kthSmallest(TreeNode root, int k) {
        this.k = k;
        inorder(root);
        return ans;
    }

    public void inorder(TreeNode node) {
        if (node == null || found) return;
        inorder(node.left);
        cnt++;
        if (cnt == k) {
            ans = node.val;
            found = true;
            return;
        }
        inorder(node.right);
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---

## 98. 验证二叉搜索树

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/validate-binary-search-tree/" type="info"}

### 思路

中序遍历维护上一个访问的元素，判断是否递增即可

### 代码

```java
class Solution {
    TreeNode prev = null;

    public boolean isValidBST(TreeNode root) {
        return inorder(root);
    }

    public boolean inorder(TreeNode node) {
        if (node == null) return true;
        if (!inorder(node.left)) return false;
        if (prev != null && node.val <= prev.val) return false;
        prev = node;
        return inorder(node.right);
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---
