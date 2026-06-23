---
title: "Top 150 · 分治（4 题）"
categories: LeetCode
tags: ['Top150', '分治']
id: "top150-16-divide-and-conquer"
date: 2026-06-22 12:00:00
hide: false
recommend: false
top: false
---

:::note
分治合并、归并排序链表与四叉树。

本模块共 **4** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 108. 将有序数组转换为二叉搜索树

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/" type="info"}

### 思路
递归造树
### 代码

```java
class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        if (nums == null || nums.length == 0) {
            return null;
        }
        return build(nums, 0, nums.length - 1);
    }
    public TreeNode build(int[] nums, int left, int right) {
        if (left > right) {
            return null;
        }
        int mid = left + (right - left) / 2;
        TreeNode root = new TreeNode(nums[mid]);
        root.left = build(nums, left, mid - 1);
        root.right = build(nums, mid + 1, right);
        return root;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(\log n)$

### 备注
---

## 148. 排序链表

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/sort-list/" type="info"}

### 思路
快慢指针找中点，从中点像mergesort一样拼接就好了，因为每个点只会被快慢指针扫一遍，所以是线性找中点+log分治
### 代码

```java
class Solution {
    public ListNode sortList(ListNode head) {
        if(head == null || head.next == null){
            return head;
        }   
        ListNode pre = head;
        ListNode slow = head; //new head
        ListNode fast = head;
        while(fast != null && fast.next != null){
            pre =slow;
            slow = slow.next;
            fast = fast.next.next;
        }
        pre.next = null;
        head = sortList(head);
        slow = sortList(slow);
        return mergeLists(head,slow);
    }

    public ListNode mergeLists(ListNode list1, ListNode list2){
        ListNode fake = new ListNode();
        ListNode cur = fake;
        while(list1 != null && list2 != null){
            if(list1.val < list2.val){
                cur.next = list1;
                list1 = list1.next;
            }else{
                cur.next = list2;
                list2 = list2.next;
            }
            cur = cur.next;
        }
        while(list1 != null){
            cur.next = list1;
            cur = cur.next;
            list1 = list1.next;
        }
        while(list2 != null){
            cur.next = list2;
            cur = cur.next;
            list2 = list2.next;
        }
        return fake.next;
    }
}
```

### 复杂度

- 时间：$O(n\log n)$
- 空间：$O(\log n)$

### 备注
自底向上可以省去递归栈的logn空间开销
```java
class Solution {
    public ListNode sortList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }

        int len = 0;
        ListNode p = head;
        while (p != null) {
            len++;
            p = p.next;
        }

        ListNode dummy = new ListNode(0);
        dummy.next = head;

        for (int step = 1; step < len; step <<= 1) {
            ListNode cur = dummy.next;   // 当前待处理子链表的起点
            ListNode tail = dummy;       // 已合并部分的尾节点

            while (cur != null) {
                // 截取左半部分（长度 step）
                ListNode left = cur;
                ListNode right = cut(left, step);
                // 截取右半部分（长度 step），并更新 cur 为下一段的起点
                cur = cut(right, step);

                // 合并 left 和 right，接到 tail 后面
                tail.next = mergeLists(left, right);

                // 移动 tail 到合并后的链表末尾
                while (tail.next != null) {
                    tail = tail.next;
                }
            }
        }
        return dummy.next;
    }

    public ListNode cut(ListNode head, int n) {
        if (head == null) return null;
        ListNode p = head;
        while (--n > 0 && p != null) {
            p = p.next;
        }
        if (p == null) return null;
        ListNode next = p.next;
        p.next = null;
        return next;
    }

    public ListNode mergeLists(ListNode list1, ListNode list2) {
        ListNode fake = new ListNode();
        ListNode cur = fake;
        while (list1 != null && list2 != null) {
            if (list1.val < list2.val) {
                cur.next = list1;
                list1 = list1.next;
            } else {
                cur.next = list2;
                list2 = list2.next;
            }
            cur = cur.next;
        }
        while (list1 != null) {
            cur.next = list1;
            cur = cur.next;
            list1 = list1.next;
        }
        while (list2 != null) {
            cur.next = list2;
            cur = cur.next;
            list2 = list2.next;
        }
        return fake.next;
    }
}
```
---

## 427. 建立四叉树

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/construct-quad-tree/" type="info"}

### 思路
从大往小，如果四个子节点都是叶子，并且它们的值全部相同，那么当前区域就可以合并成一个叶子
### 代码

```java
class Solution {
    int[][] matrix;

    public Node construct(int[][] grid) {
        matrix = grid;
        return recurse(0, 0, grid.length);
    }

    Node recurse(int top, int left, int size) {
        if (size == 1) {
            return new Node(matrix[top][left] == 1, true);
        }

        int subSize = size / 2;  // 子区域的边长

        // 递归构建四个子区域（每个子区域边长减半）
        Node topLeft     = recurse(top,           left,            subSize);
        Node topRight    = recurse(top,           left + subSize, subSize);
        Node bottomLeft  = recurse(top + subSize, left,           subSize);
        Node bottomRight = recurse(top + subSize, left + subSize, subSize);

        // 如果四个子节点都是叶子，并且它们的值全部相同，那么当前区域就可以合并成一个叶子
        if (topLeft.isLeaf && topRight.isLeaf && bottomLeft.isLeaf && bottomRight.isLeaf
            && topLeft.val == topRight.val
            && topLeft.val == bottomLeft.val
            && topLeft.val == bottomRight.val) {
            return new Node(topLeft.val, true);
        } else {
            // 否则，当前节点不是叶子，它拥有四个子节点
            return new Node(false, false, topLeft, topRight, bottomLeft, bottomRight);
        }
    }
}
```

### 复杂度

- 时间：$O(n^2)$
- 空间：$O(\log n)$

### 备注

---

## 23. 合并 K 个升序链表

**难度：** 困难

::btn[力扣做题]{link="https://leetcode.cn/problems/merge-k-sorted-lists/" type="info"}

### 思路
用priorityqueue合并，循环弹出补后继
### 代码

```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;

        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
        // 只把每个链表的头节点放入堆
        for (ListNode head : lists) {
            if (head != null) pq.offer(head);
        }

        ListNode dummy = new ListNode();
        ListNode cur = dummy;

        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            cur.next = node;
            cur = cur.next;
            
            if (node.next != null) {
                pq.offer(node.next);
            }
        }

        return dummy.next;
    }
}
```

### 复杂度

- 时间：$O(n\log k)$
- 空间：$O(k)$

### 备注

---

