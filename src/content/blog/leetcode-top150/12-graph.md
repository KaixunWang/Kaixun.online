---
title: "Top 150 · 图（6 题）"
categories: LeetCode
tags: ['Top150', '图']
id: "top150-12-graph"
date: 2026-07-14 21:18:40
cover: "/assets/images/covers/top150/12-graph.svg"
hide: false
updated: 2026-07-06 04:30:49
recommend: false
top: false
---

:::note
DFS/BFS 遍历、并查集思想与拓扑排序。

本模块共 **6** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 200. 岛屿数量

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/number-of-islands/" type="info"}

### 思路

每次遇到一块1，就递归把周围所有1变成0，然后计数即可

### 代码

```java
class Solution {
    int row;
    int col;
    char[][] grid;

    public int numIslands(char[][] grid) {
        row = grid.length;
        col = grid[0].length;
        this.grid = grid;

        int cnt =0;
        for (int i = 0; i < row; i++) {
            for (int j = 0; j < col; j++) {
                if(grid[i][j] == '1'){
                    dfs(i,j);
                    cnt++;
                }
            }
        }
        return cnt;
    }

    public void dfs(int i, int j) {
        if(i<0 || j < 0 || i > row-1 || j >col-1) return;
        if(grid[i][j] != '1') return;
        grid[i][j] = '0';
        dfs(i-1,j);
        dfs(i+1,j);
        dfs(i,j-1);
        dfs(i,j+1);
    }
}
```

### 复杂度

- 时间：$O(m \cdot n)$
- 空间：$O(m*n)$

### 备注

<!-- 待填 -->

---

## 130. 被围绕的区域

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/surrounded-regions/" type="info"}

### 思路

用额外字符来标记已处理过的位置，即可做到原地替换

### 代码

```java
class Solution {
    int m;
    int n;
    public void solve(char[][] board) {
        m = board.length;
        n = board[0].length;
        for (int i = 0; i < m; i++) {
            if(board[i][0] == 'O')check(i,0,board);
        }
        for (int i = 0; i < m; i++) {
            if(board[i][n-1] == 'O')check(i,n-1,board);
        }
        for (int i = 0; i < n; i++) {
            if(board[0][i] == 'O')check(0,i,board);
        }
        for (int i = 0; i < n; i++) {
            if(board[m-1][i] == 'O')check(m-1,i,board);
        }
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if(board[i][j] == 'O')board[i][j] = 'X';
                if(board[i][j] == '#')board[i][j] = 'O';
            }
        }
    }

    public void check(int i,int j,char[][] board){
        if(i<0 || j < 0 || i > m-1 || j >n-1) return;
        if(board[i][j] != 'O') return;
        board[i][j] = '#';
        check(i,j-1,board);
        check(i-1,j,board);
        check(i+1,j,board);
        check(i,j+1,board);
        return;
    }
}
```

### 复杂度

- 时间：$O(m \cdot n)$
- 空间：$O(m*n)$

### 备注

<!-- 待填 -->

---

## 133. 克隆图

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/clone-graph/" type="info"}

### 思路

dfs去找邻居的copy，用map存访问过的节点和对应的copy

### 代码

```java
class Solution {
    Map<Node, Node> map;

    public Node cloneGraph(Node node) {
        if(node == null) return null;
        map = new HashMap<>();
        dfs(node);
        return map.get(node);
    }

    public Node dfs(Node node){
        if(map.containsKey(node)) return null;
        Node copy = new Node(node.val);
        map.put(node, copy);

        for (int i = 0; i < node.neighbors.size(); i++) {
            if(!map.containsKey(node.neighbors.get(i))){
                Node temp = dfs(node.neighbors.get(i));
                if(temp != null)copy.neighbors.add(temp);
            }else{
                copy.neighbors.add(map.get(node.neighbors.get(i)));
            }
        }
        return copy;
    }
}
```

### 复杂度

- 时间：$O(V+E)$
- 空间：$O(V+E)$

### 备注

<!-- 待填 -->

---

## 399. 除法求值

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/evaluate-division/" type="info"}

### 思路

转化成图的问题，dfs求路径乘积

### 代码

```java
class Solution {
    HashMap<String,Node> graph;
    double[] ans;
    Set<Node> visited;

    static class Node{
        String val;
        HashMap<String, Double> neighbors = new HashMap<>();//neighbor, a/b
    }

    public double[] calcEquation(List<List<String>> equations, double[] values, List<List<String>> queries) {
        int len = queries.size();
        ans = new double[len];
        //建图
        graph = new HashMap<>();
        for (int i = 0; i < equations.size(); i++) {
            List<String> temp = equations.get(i);
            if(!graph.containsKey(temp.get(0))){
                Node newNode = new Node();
                newNode.val = temp.get(0);
                graph.put(temp.get(0), newNode);
            }
            if(!graph.containsKey(temp.get(1))){
                Node newNode = new Node();
                newNode.val = temp.get(1);
                graph.put(temp.get(1), newNode);
            }
            Node a =graph.get(temp.get(0));
            Node b =graph.get(temp.get(1));
            a.neighbors.put(temp.get(1),values[i]);
            b.neighbors.put(temp.get(0),1/values[i]);
        }

        //遍历queries
        for (int i = 0; i < queries.size(); i++) {
            List<String> temp = queries.get(i);
            String start = temp.get(0);
            String end = temp.get(1);

            if(!graph.containsKey(start) ||!graph.containsKey(end)){
                ans[i] = -1.0;
                continue;
            }
            if(start.equals(end)){
                ans[i] = 1.0;
                continue;
            }

            visited = new HashSet<>();
            ans[i] = dfs(graph.get(start),graph.get(end),1.0);
        }
        return ans;
    }

    public double dfs(Node cur,Node target,double product){
        visited.add(cur);
        
        for (Map.Entry<String, Double> entry : cur.neighbors.entrySet()) {
            String nextVal = entry.getKey();
            double weight = entry.getValue();
            if(visited.contains(graph.get(nextVal))){
                continue;
            }
            if(nextVal.equals(target.val)){
                    return product*weight;
            }
            double ans = dfs(graph.get(nextVal),target,product*weight);
            if(ans != -1.0)return ans;
        }
        return -1;
    }
}
```

### 复杂度

- 时间：$O(E + Q(V+E))$
- 空间：$O(V+E)$

### 备注

并查集做法可以做到$O((E+Q) \alpha(V))$
```java
class Solution {

    class UnionFind {
        int[] parent;
        double[] weight;   // weight[x] = x / parent[x]

        public UnionFind(int n) {
            parent = new int[n];
            weight = new double[n];

            for (int i = 0; i < n; i++) {
                parent[i] = i;
                weight[i] = 1.0;
            }
        }

        // 查找根节点，并进行路径压缩
        public int find(int x) {
            if (parent[x] != x) {
                int oldParent = parent[x];

                parent[x] = find(oldParent);

                // 更新为 x / root
                weight[x] *= weight[oldParent];
            }
            return parent[x];
        }

        // 已知 x / y = value
        public void union(int x, int y, double value) {

            int rootX = find(x);
            int rootY = find(y);

            if (rootX == rootY) return;

            // 把 rootX 挂到 rootY
            parent[rootX] = rootY;

            // 更新 rootX 到 rootY 的权值
            // rootX/rootY = value * (y/rootY) / (x/rootX)
            weight[rootX] = value * weight[y] / weight[x];
        }

        public double query(int x, int y) {

            if (find(x) != find(y))
                return -1.0;

            return weight[x] / weight[y];
        }
    }

    public double[] calcEquation(List<List<String>> equations,
                                 double[] values,
                                 List<List<String>> queries) {

        // 字符串编号
        HashMap<String, Integer> id = new HashMap<>();
        int idx = 0;

        for (List<String> eq : equations) {
            if (!id.containsKey(eq.get(0)))
                id.put(eq.get(0), idx++);

            if (!id.containsKey(eq.get(1)))
                id.put(eq.get(1), idx++);
        }

        // 初始化并查集
        UnionFind uf = new UnionFind(idx);

        // 建立所有关系
        for (int i = 0; i < equations.size(); i++) {

            int a = id.get(equations.get(i).get(0));
            int b = id.get(equations.get(i).get(1));

            uf.union(a, b, values[i]);
        }

        // 回答查询
        double[] ans = new double[queries.size()];

        for (int i = 0; i < queries.size(); i++) {

            String s = queries.get(i).get(0);
            String t = queries.get(i).get(1);

            // 有变量不存在
            if (!id.containsKey(s) || !id.containsKey(t)) {
                ans[i] = -1.0;
                continue;
            }

            ans[i] = uf.query(id.get(s), id.get(t));
        }

        return ans;
    }
}
```

---

## 207. 课程表

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/course-schedule/" type="info"}

### 思路

单纯拓扑排序维护入度数组

### 代码

```java
class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        int count = 0;

        for (int i = 0; i < numCourses; i++) {
            adj.add(new ArrayList<>());
        }

        int[] in = new int[numCourses];
        for (int i = 0; i < prerequisites.length; i++) {
            int from = prerequisites[i][1];
            int to   = prerequisites[i][0];
            adj.get(from).add(to);
            in[to]++;
        }

        Deque<Integer> deque = new ArrayDeque<>();
        for (int i = 0; i < in.length; i++) {
            if(in[i] == 0){
                deque.offer(i);
            }
        }

        while(!deque.isEmpty()){
            int i = deque.pop();
            count++;
            List<Integer> neighbors = adj.get(i);
            for (int j = 0; j < neighbors.size(); j++) {
                in[neighbors.get(j)]--;
                if(in[neighbors.get(j)] == 0) deque.offer(neighbors.get(j));
            }
        }

        return count==numCourses;
    }
}
```

### 复杂度

- 时间：$O(V+E)$
- 空间：$O(V+E)$

### 备注

<!-- 待填 -->

---

## 210. 课程表 II

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/course-schedule-ii/" type="info"}

### 思路

同样拓扑排序存答案

### 代码

```java
class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        int[] ans = new int[numCourses];
        int k =0;

        for (int i = 0; i < numCourses; i++) {
            adj.add(new ArrayList<>());
        }

        int[] in = new int[numCourses];
        for (int i = 0; i < prerequisites.length; i++) {
            int from = prerequisites[i][1];
            int to   = prerequisites[i][0];
            adj.get(from).add(to);
            in[to]++;
        }

        Deque<Integer> deque = new ArrayDeque<>();
        for (int i = 0; i < in.length; i++) {
            if(in[i] == 0){
                deque.offer(i);
            }
        }

        while(!deque.isEmpty()){
            int i = deque.pop();
            ans[k] = i;
            k++;
            List<Integer> neighbors = adj.get(i);
            for (int j = 0; j < neighbors.size(); j++) {
                in[neighbors.get(j)]--;
                if(in[neighbors.get(j)] == 0) deque.offer(neighbors.get(j));
            }
        }

        return k==numCourses ? ans : new int[0];
    }
}
```

### 复杂度

- 时间：$O(V+E)$
- 空间：$O(V+E)$

### 备注

<!-- 待填 -->

---
