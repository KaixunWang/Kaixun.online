---
title: "Top 150 · 二叉树（14 题）"
categories: LeetCode
tags: ['Top150', '二叉树']
id: "top150-09-binary-tree"
date: 2026-06-30 06:31:31
cover: "/assets/images/covers/top150/09-binary-tree.svg"
hide: false
updated: 2026-06-30 03:30:49
recommend: false
top: false
---

:::note
递归 DFS、路径问题、建树与树形 DP 基础。

本模块共 **14** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 104. 二叉树的最大深度

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/maximum-depth-of-binary-tree/" type="info"}

### 思路

递归

### 代码

```java
class Solution {
    public int maxDepth(TreeNode root) {
        return path(root);
    }
    public int path(TreeNode node){
        if(node == null){
            return 0;
        }else if(node.left == null && node.right == null){
            return 1;
        }else if(node.left != null && node.right != null){
            return Math.max(path(node.left),path(node.right)) + 1;
        }else if(node.left == null){
            return path(node.right) + 1;
        }else{
            return path(node.left) + 1;
        }
    }
}
```

### 复杂度

- 时间：$O(V)$
- 空间：$O(V)$

### 备注

<!-- 待填 -->

---

## 100. 相同的树

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/same-tree/" type="info"}

### 思路

同时递归两棵树即可

### 代码

```java
class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if(p == null && q == null) return true;
        if(p==null^q==null) return false;
        if(p.val != q.val) return false;
        if(!isSameTree(p.left,q.left)) return false;
        if(!isSameTree(p.right,q.right)) return false;
        return true;
    }
}
```

### 复杂度

- 时间：$O(V)$
- 空间：$O(V)$

### 备注

<!-- 待填 -->

---

## 226. 翻转二叉树

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/invert-binary-tree/" type="info"}

### 思路

从上往下递归

### 代码

```java
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode temp = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(temp);
        return root;
    }
}
```

### 复杂度

- 时间：$O(V)$
- 空间：$O(V)$

### 备注

<!-- 待填 -->

---

## 101. 对称二叉树

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/symmetric-tree/" type="info"}

### 思路

对称条件为：

根节点相同

每个树的右子树都与另一个树的左子树镜像对称

### 代码

```java
class Solution {
    public boolean isSymmetric(TreeNode root) {
        return check(root.left,root.right);
    }
    public boolean check(TreeNode p, TreeNode q){
        if(p == null && q == null){
            return true;
        }
        if(p == null ^ q ==null){
            return false;
        }
        return p.val == q.val && check(p.left,q.right) && check(p.right, q.left);
    }
}
```

### 复杂度

- 时间：$O(V)$
- 空间：$O(V)$

### 备注

<!-- 待填 -->

---

## 105. 从前序与中序遍历序列构造二叉树

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" type="info"}

### 思路

递归子树向下，划分inorder和preorder的数组

### 代码

```java
class Solution {
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        int n = preorder.length;
        if (n == 0) {
            return null;
        }
        int leftSize = indexOf(inorder, preorder[0]);//左子树的大小

        int[] prel = Arrays.copyOfRange(preorder, 1, 1 + leftSize);
        int[] prer = Arrays.copyOfRange(preorder, 1 + leftSize, n);
        int[] inl = Arrays.copyOfRange(inorder, 0, leftSize);
        int[] inr = Arrays.copyOfRange(inorder, 1 + leftSize, n);

        TreeNode l = buildTree(prel,inl);
        TreeNode r = buildTree(prer,inr);
        
        return new TreeNode(preorder[0],l,r);
    }
    private int indexOf(int[] a, int x) {
        for (int i = 0; ; i++) {
            if (a[i] == x) {
                return i;
            }
        }
    }
}
```

### 复杂度

- 时间：$O(V^2)$
- 空间：$O(V)$

### 备注

<!-- 待填 -->

---

## 106. 从中序与后序遍历序列构造二叉树

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/" type="info"}

### 思路

同上递归

### 代码

```java
class Solution {
    public TreeNode buildTree(int[] inorder, int[] postorder) {
        int n = postorder.length;
        if (n == 0) {
            return null;
        }
        int leftSize = indexOf(inorder, postorder[n-1]);

        int[] postl = Arrays.copyOfRange(postorder, 0, leftSize);
        int[] postr = Arrays.copyOfRange(postorder, leftSize, n - 1);
        int[] inl = Arrays.copyOfRange(inorder, 0, leftSize);
        int[] inr = Arrays.copyOfRange(inorder, 1 + leftSize, n);

        TreeNode l = buildTree(inl,postl);
        TreeNode r = buildTree(inr,postr);
        
        return new TreeNode(postorder[n-1],l,r);
    }
    private int indexOf(int[] a, int x) {
    for (int i = 0; i < a.length; i++) {
        if (a[i] == x) {
            return i;
        }
    }
    return -1;
}
}
```

### 复杂度

- 时间：$O(V^2)$
- 空间：$O(V)$

### 备注

<!-- 待填 -->

---

## 117. 填充每个节点的下一个右侧节点指针 II

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/populating-next-right-pointers-in-each-node-ii/" type="info"}

### 思路

本质做层序遍历，每层连起来即可

### 代码

```java
class Solution {
    public Node connect(Node root) {
        if(root == null) return null;
        Queue<Node> queue = new LinkedList<>();
        queue.offer(root);
        while(!queue.isEmpty()){
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                Node cur = queue.poll();
                if(i<size-1){
                    cur.next = queue.peek();
                }
                if(cur.left != null) queue.offer(cur.left);
                if(cur.right != null) queue.offer(cur.right);
            }
        }
        return root;
    }
}
```

### 复杂度

- 时间：$O(V)$
- 空间：$O(V)$

### 备注

<!-- 待填 -->

---

## 114. 二叉树展开为链表

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/" type="info"}

### 思路

递归去压左右，然后左边的last接上右边，左移右即可

### 代码

```java
class Solution {
    public void flatten(TreeNode root) {
        if(root == null) return;
        if(root.left == null && root.right == null) return;
        if(root.left == null){
            flatten(root.right);
        }else if(root.right == null){
            root.right =root.left;
            root.left =null;
            flatten(root.right);
        }else{
            flatten(root.left);
            flatten(root.right);
            TreeNode last = root.left;
            while (last.right != null) {
                last = last.right;
            }
            last.right = root.right;
            root.right = root.left;
            root.left = null;
        }
    }
}
```

### 复杂度

- 时间：$O(V^2)$
- 空间：$O(V)$

### 备注

用stack压入右左，这样弹出的时候就是左右，时间$O(V)$，空间$O(V)$
```java
class Solution {
    public void flatten(TreeNode root) {
    if (root == null) return;
    Stack<TreeNode> stack = new Stack<>();
    stack.push(root);
    TreeNode prev = null;
    while (!stack.isEmpty()) {
        // 弹出节点
        TreeNode node = stack.pop();
        // 连接prev和当前节点
        if (prev != null) {  // 第一个节点不连接
            prev.right = node;
            prev.left = null;
        }
        // 压入右、左子节点
        if (node.right != null) stack.push(node.right);
        if (node.left != null) stack.push(node.left);
        // 更新prev
        prev = node;
    }
}
}
```

---

## 112. 路径总和

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/path-sum/" type="info"}

### 思路

递归找

### 代码

```java
class Solution {
    public boolean hasPathSum(TreeNode root, int targetSum) {
        if(root==null){
            return false;
        }
        if(root.left ==null && root.right == null && targetSum-root.val ==0){
            return true;
        }else if(root.left ==null && root.right == null && targetSum-root.val !=0){
            return false;
        }
        if(root.left !=null && root.right == null){
            return hasPathSum(root.left, targetSum - root.val);
        }else if(root.left ==null && root.right != null){
            return hasPathSum(root.right, targetSum - root.val);
        }else{
            return hasPathSum(root.left, targetSum - root.val) || hasPathSum(root.right,targetSum - root.val);
        }
        
    }
}
```

### 复杂度

- 时间：$O(V)$
- 空间：$O(V)$

### 备注

<!-- 待填 -->

---

## 129. 求根节点到叶节点数字之和

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/sum-root-to-leaf-numbers/" type="info"}

### 思路

因为naive需要深度，所以直接做dfs

### 代码

```java
class Solution {
    public int sumNumbers(TreeNode root) {
        return dfs(root, 0);
    }

    int dfs(TreeNode root, int cur) {
        if (root == null) return 0;
        cur = cur * 10 + root.val;
        if (root.left == null && root.right == null) return cur;
        return dfs(root.left, cur) + dfs(root.right, cur);
    }
}
```

### 复杂度

- 时间：$O(V)$
- 空间：$O(V)$

### 备注

<!-- 待填 -->

---

## 124. 二叉树中的最大路径和

**难度：** 困难

::btn[力扣做题]{link="https://leetcode.cn/problems/binary-tree-maximum-path-sum/" type="info"}

### 思路

一共四种情况
1. 只有node本身
2. node + 左子树的一条路径
3. node + 右子树的一条路径
4. 左子树路径 + node + 右子树路径（不传回给parent）

注意负数直接不选就是0

### 代码

```java
class Solution {
    int ans;
    public int maxPathSum(TreeNode root) {
        ans = Integer.MIN_VALUE;
        dfs(root);
        return ans;
    }
    public int dfs(TreeNode node){
        int val = node.val;
        int left = node.left==null? 0:Math.max(0,dfs(node.left));
        int right = node.right==null? 0:Math.max(0,dfs(node.right));
        ans = Math.max(ans,val+left+right);
        return Math.max(val,Math.max(val+left,val+right));
    }
}
```

### 复杂度

- 时间：$O(V)$
- 空间：$O(V)$

### 备注

<!-- 待填 -->

---

## 173. 二叉搜索树迭代器

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/binary-search-tree-iterator/" type="info"}

### 思路

使用stack模拟中序遍历，每次加入左链

### 代码

```java
class BSTIterator {
    Stack<TreeNode> stack;

    public BSTIterator(TreeNode root) {
        stack = new Stack<>();
        addLeft(root);
    }
    
    public int next() {
        TreeNode node= stack.pop();
        int ret = node.val;
        if(node.right !=null){
           addLeft(node.right); 
        }
        return ret;
    }
    
    public boolean hasNext() {
        return !stack.isEmpty();
    }

    public void addLeft(TreeNode root){
        while (root != null) {
            stack.push(root);
            root = root.left;
        }
    }
}
```

### 复杂度

- 时间：$O(1)$
- 空间：$O(h)$

### 备注

<!-- 待填 -->

---

## 222. 完全二叉树的节点个数

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/count-complete-tree-nodes/" type="info"}

### 思路

完全二叉树如果左边高度大于右边，说明右边是满二叉树；否则左边是满二叉树。每次递归走一边$O(\log n)$次，每次递归最深$O(\log n)$层

### 代码

```java
class Solution {
    public int countNodes(TreeNode root) {
        if(root == null) return 0;
        int leftH = height(root.left);
        int rightH = height(root.right);
        if(leftH > rightH){
            return ((1 << rightH) - 1) + countNodes(root.left) + 1;
        }else{
            return ((1 << leftH) - 1) + countNodes(root.right) + 1;
        }
    }
    public int height(TreeNode root){
        int height =0;
        while(root != null){
            root = root.left;
            height ++;
        }
        return height;
    }
}
```

### 复杂度

- 时间：$O(\log^2 n)$
- 空间：$O(\log n)$

### 备注

<!-- 待填 -->

---

## 236. 二叉树的最近公共祖先

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/" type="info"}

### 思路

用null代表这个子树没有p或者q，然后递归，只有三种情况
1. p和q都在左子树
2. p和q都在右子树  
3. p和q分别在左右子树（root就是答案）

### 代码

```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null) return null;
        if (root == p || root == q) return root;
        
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        
        if (left != null && right != null) return root;
        if (left == null) return right;
        return left;
    }
}
```

### 复杂度

- 时间：$O(N)$
- 空间：$O(N)$

### 备注

<!-- 待填 -->

---
