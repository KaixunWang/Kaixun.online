---
title: "Top 150 · 二叉树层次遍历（4 题）"
categories: LeetCode
tags: ['Top150', '二叉树', 'BFS']
id: "top150-10-binary-tree-bfs"
date: 2026-06-22 12:00:00
cover: "/assets/images/covers/top150/10-binary-tree-bfs.svg"
hide: false
updated: 2026-06-30 03:30:49
recommend: false
top: false
---

:::note
层序遍历、锯齿层序与按层统计。

本模块共 **4** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 199. 二叉树的右视图

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/binary-tree-right-side-view/" type="info"}

### 思路

层序遍历模板题

### 代码

```java
class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> ans = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        if (root == null) return ans;
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();

            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();

                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
                if(i == size - 1){
                    ans.add(node.val);
                }
            }
        }
        return ans;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---

## 637. 二叉树的层平均值

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/average-of-levels-in-binary-tree/" type="info"}

### 思路

同上

### 代码

```java
class Solution {
    public List<Double> averageOfLevels(TreeNode root) {
        List<Double> ans = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        if (root == null) return ans;
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            Double temp = 0.0;
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                temp += node.val;
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
                if(i == size - 1){
                    ans.add(temp/size);
                }
            }
        }
        return ans;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---

## 102. 二叉树的层序遍历

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/binary-tree-level-order-traversal/" type="info"}

### 思路

同上

### 代码

```java
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> ans = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        if (root == null) return ans;
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> temp = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                temp.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
                if(i == size - 1){
                    ans.add(temp);
                }
            }
        }
        return ans;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---

## 103. 二叉树的锯齿形层序遍历

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/" type="info"}

### 思路

加一个flag用linkedlist实现正向反向插入

### 代码

```java
class Solution {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> ans = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        if (root == null) return ans;
        q.offer(root);
        boolean zigzag = false;
        while (!q.isEmpty()) {
            int size = q.size();
            LinkedList<Integer> temp = new LinkedList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                if(zigzag){
                    temp.addFirst(node.val);
                }else{
                    temp.addLast(node.val);
                }

                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
                if(i == size - 1){
                    ans.add(temp);
                }
            }
            zigzag = !zigzag;
        }
        return ans;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---
