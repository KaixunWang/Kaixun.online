---
title: "Top 150 · 链表（11 题）"
categories: LeetCode
tags: ['Top150', '链表']
id: "top150-08-linked-list"
date: 2026-06-27 16:53:09
cover: "/assets/images/covers/top150/08-linked-list.svg"
hide: false
updated: 2026-06-27 03:30:49
recommend: false
top: false
---

:::note
虚拟头节点、快慢指针、反转与 LRU 设计。

本模块共 **11** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 141. 环形链表

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/linked-list-cycle/" type="info"}

### 思路

快慢指针有环一定相遇

### 代码

```java
public class Solution {
    public boolean hasCycle(ListNode head) {
        if(head == null || head.next==null){
            return false;
        }
        ListNode i = head;
        ListNode j = head;
        while(i.next !=null &&j.next !=null&& j.next.next != null){
            i = i.next;
            j=j.next.next;
            if(i ==j){
                return true;
            }
        }
        return false;
    }
}
```

### 复杂度

- 时间：$O(N)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 2. 两数相加

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/add-two-numbers/" type="info"}

### 思路

维护一个进位，每次累加

### 代码

```java
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode();
        ListNode cur = dummy;
        int carry = 0;
        
        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;
            if (l1 != null) { sum += l1.val; l1 = l1.next; }
            if (l2 != null) { sum += l2.val; l2 = l2.next; }
            carry = sum / 10;
            cur.next = new ListNode(sum % 10);
            cur = cur.next;
        }
        return dummy.next;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---

## 21. 合并两个有序链表

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/merge-two-sorted-lists/" type="info"}

### 思路

mergesort的merge部分

### 代码

```java
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode head = new ListNode();
        ListNode cur = head;
        while(list1 != null || list2 != null){
            if(list1 == null){
                ListNode newNode = new ListNode(list2.val);
                cur.next = newNode;
                cur = cur.next;
                list2 = list2.next;
            }else if(list2 == null){
                ListNode newNode = new ListNode(list1.val);
                cur.next = newNode;
                cur = cur.next;
                list1 = list1.next;
            }else if(list1.val < list2.val){
                ListNode newNode = new ListNode(list1.val);
                cur.next = newNode;
                cur = cur.next;
                list1 = list1.next;
            }else{
                ListNode newNode = new ListNode(list2.val);
                cur.next = newNode;
                cur = cur.next;
                list2 = list2.next;
            }
        }
        return head.next;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---

## 138. 随机链表的复制

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/copy-list-with-random-pointer/" type="info"}

### 思路

Hashmap存Node，存n次，取3n次设置就好了

### 代码

```java
class Solution {
    public Node copyRandomList(Node head) {
        if(head == null){
            return null;
        }
        Map<Node, Node> map = new HashMap<>();
        Node cur = head;
        while(cur != null){
            map.put(cur, new Node(cur.val));
            cur = cur.next;
        }
        cur = head;
        while(cur != null){
            Node newNode = map.get(cur);
            newNode.next = map.get(cur.next);
            newNode.random = map.get(cur.random);
            cur = cur.next;
        }
        return map.get(head);
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---

## 92. 反转链表 II

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/reverse-linked-list-ii/" type="info"}

### 思路

从pre开始做right-left次头插法

### 代码

```java
class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode fake = new ListNode();
        fake.next = head;
        ListNode pre = fake;
        for (int i = 0; i < left - 1; i++) {
            pre = pre.next;
        }
        ListNode cur = pre.next;
        ListNode next = new ListNode();
        for (int i = 0; i < right-left; i++) {
            next = cur.next;
            cur.next = next.next;
            next.next = pre.next;
            pre.next = next;
        }
        return fake.next;
    }
}
```

### 复杂度

- 时间：$O(N)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 25. K 个一组翻转链表

**难度：** 困难

::btn[力扣做题]{link="https://leetcode.cn/problems/reverse-nodes-in-k-group/" type="info"}

### 思路

和上一题本质一样，都是做cnt/k次头插法

### 代码

```java
class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode fake = new ListNode();
        fake.next = head;
        ListNode ci = head;
        int cnt= 0;
        while(ci != null){
            cnt++;
            ci = ci.next;
        }
        cnt = cnt/k;
        ListNode pre = fake;
        for (int i = 0; i < cnt; i++) {
            ListNode cur = pre.next;
            ListNode next = new ListNode();
            for (int j = 0; j < k-1; j++) {
                next = cur.next;
                cur.next = next.next;
                next.next = pre.next;
                pre.next = next;
            }
            for (int j = 0; j < k; j++) {
                pre = pre.next;
            }
        }
        return fake.next;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 19. 删除链表的倒数第 N 个结点

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/remove-nth-node-from-end-of-list/" type="info"}

### 思路

让快指针先走n+1步，这样慢指针会停在目标节点前，直接删除

### 代码

```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode fake = new ListNode(0);
        fake.next = head;
        ListNode fast = fake;
        ListNode slow = fake;
        
        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        return fake.next;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 82. 删除排序链表中的重复元素 II

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/" type="info"}

### 思路

每次检查两个，不相等就next；相等记录这个值，并删除所有等于这个值的node

### 代码

```java
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        if(head == null){
            return null;
        }
        ListNode fake = new ListNode(-1);
        fake.next = head;
        ListNode cur = fake;
        while(cur.next != null && cur.next.next != null){
            if (cur.next.val == cur.next.next.val) {
                int x = cur.next.val;
                while (cur.next != null && cur.next.val == x) {
                    cur.next = cur.next.next;
                }
            } else {
                cur = cur.next;
            }
        }
        return fake.next;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 61. 旋转链表

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/rotate-list/" type="info"}

### 思路

和旋转数组一样，先求移动的位数，然后找分割点，然后断尾+接头

### 代码

```java
class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        if(head == null || head.next ==null){
            return head;
        }
        ListNode cur = head;
        int len =1;
        while(cur.next != null){
            len++;
            cur=cur.next;
        }
        int moveBit = k % len;
        int cut = len-moveBit;
        if(moveBit ==0){
            return head;
        }else{
            ListNode now = head;
            for(int i=0;i<cut-1;i++){
                now=now.next;
            }
            ListNode newHead = now.next;
            cur.next = head;
            now.next = null;
            return newHead;
        }

    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 86. 分隔链表

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/partition-list/" type="info"}

### 思路

构造子链不影响空间复杂度，所以大小构造拼起来即可

### 代码

```java
class Solution {
    public ListNode partition(ListNode head, int x) {
        ListNode cur = head;
        ListNode smallHead = new ListNode(-1);
        ListNode smallCur = smallHead;
        ListNode bigHead = new ListNode(-1);
        ListNode bigCur = bigHead;
        while(cur != null){
            if (cur.val < x) {
                smallCur.next = cur;
                smallCur = smallCur.next;
            } else {
                bigCur.next = cur;
                bigCur = bigCur.next;
            }
            cur = cur.next;
        }
        bigCur.next = null;
        smallCur.next = bigHead.next;
        return smallHead.next;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 146. LRU 缓存

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/lru-cache/" type="info"}

### 思路

双向链表+hashmap

### 代码

```java
class LRUCache {

    static class Node{
        int key;
        int val;
        Node next;
        Node pre;
    }

    Node head;
    Map<Integer, Node> map;
    int capacity;
    int cnt;

    public LRUCache(int capacity) {
        this.head = new Node();
        this.head.key = -1;
        this.head.val = -1;
        this.head.next = head;
        this.head.pre = head;
        this.map = new HashMap<Integer, Node>(); //(key,Node)
        this.capacity = capacity;
        this.cnt = 0;
    }
    
    public int get(int key) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            moveToHead(node);
            return node.val;
        }
        return -1;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            node.val = value;
            moveToHead(node);
        } else {
            if (cnt + 1 > capacity) {
                map.remove(head.pre.key);
                head.pre.pre.next = head;
                head.pre = head.pre.pre;
            } else {
                cnt++;
            }
            Node node = new Node();
            node.key = key;
            node.val = value;
            addToHead(node);
            map.put(key, node);
        }
    }
    // 把节点移到头部
    private void moveToHead(Node node) {
        node.pre.next = node.next;
        node.next.pre = node.pre;
        node.next = head.next;
        head.next.pre = node;
        head.next = node;
        node.pre = head;
    }

    // 在头部插入新节点
    private void addToHead(Node node) {
        node.next = head.next;
        head.next.pre = node;
        head.next = node;
        node.pre = head;
    }
}
```

### 复杂度

- 时间：$O(1)$的get和put
- 空间：$O(n)$

### 备注

java标准库的linkedhashmap自然实现
```java
class LRUCache{
private final int capacity;
    private final Map<Integer, Integer> cache = new LinkedHashMap<>();

    public LRUCache(int capacity) {
        this.capacity = capacity;
    }

    public int get(int key) {
        Integer value = cache.remove(key);
        if (value != null) {
            cache.put(key, value);
            return value;
        }
        return -1;
    }

    public void put(int key, int value) {
        if (cache.remove(key) != null) {
            cache.put(key, value);
            return;
        }

        if (cache.size() == capacity) {
            Integer eldestKey = cache.keySet().iterator().next();
            cache.remove(eldestKey);
        }
        cache.put(key, value);
    }
}
```

---
