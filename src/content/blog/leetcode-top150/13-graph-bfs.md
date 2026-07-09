---
title: "Top 150 · 图的 BFS（3 题）"
categories: LeetCode
tags: ['Top150', '图', 'BFS']
id: "top150-13-graph-bfs"
date: 2026-06-22 12:00:00
cover: "/assets/images/covers/top150/13-graph-bfs.svg"
hide: false
updated: 2026-07-07 05:30:49
recommend: false
top: false
---

:::note
最短步数 BFS：棋盘、基因链与单词接龙。

本模块共 **3** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 909. 蛇梯棋

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/snakes-and-ladders/" type="info"}

### 思路

bfs模板，每次入队所有可达点，visited数组避免环形访问

### 代码

```java
class Solution {
    public int snakesAndLadders(int[][] board) {
        Queue<Integer> queue = new ArrayDeque<>();
        int n = board.length;
        boolean[] visited = new boolean[n * n + 1];

        queue.offer(1);
        visited[1] = true;
        int step = 0;

        while(!queue.isEmpty()){
            int size = queue.size();
            while(size-- > 0){
                int i = queue.poll();
                if (i == n * n)return step;

                for(int next = i+1;next<=Math.min(i + 6, n*n);next++){
                    int row = n - 1 - (next-1)/n;
                    int bottomRow = n-1-row;
                    int col = (bottomRow%2!=0) ? n-1 - (next-1)%n: (next-1)%n;
                    int realNext = next;
                    if(board[row][col] != -1)realNext = board[row][col];
                    if(visited[realNext] == true)continue;
                    queue.offer(realNext);
                    visited[realNext] = true;
                }
            }
            step++;
        }
        return -1;
    }
}
```

### 复杂度

- 时间：$O(n^2)$
- 空间：$O(n^2)$

### 备注

题目叽里咕噜说一大堆。。。。

---

## 433. 最小基因变化

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/minimum-genetic-mutation/" type="info"}

### 思路

同样bfs，用set当visited

### 代码

```java
class Solution {
    Set<String> set;
    public int minMutation(String startGene, String endGene, String[] bank) {
        set = new HashSet<>();
        for (int i = 0; i < bank.length; i++) {
            set.add(bank[i]);
        }
        
        Queue<String> queue = new ArrayDeque<>();
        queue.offer(startGene);
        int step = 0;
        set.add(startGene);

        while(!queue.isEmpty()){
            int size = queue.size();
            while(size-- > 0){
                String cur = queue.poll();
                if(cur.equals(endGene))return step;
                for (String next : bank) {
                    if (set.contains(next) && oneDiff(cur, next)) {
                        queue.offer(next);
                        set.remove(next);
                    }
                }
            }
            step++;
        }
        return -1;
    }
    public boolean oneDiff(String a,String b){
        int diff =0;
        for (int j = 0; j < 8; j++) {
            if(a.charAt(j) != b.charAt(j))diff++;
        }
        return diff==1;
    }
}
```

### 复杂度

- 时间：$O(n^2)$
- 空间：$O(n)$

### 备注

时间$O(n)$的做法是不遍历bank，遍历24种替换组合
```java
class Solution {
    Set<String> set;
    public int minMutation(String startGene, String endGene, String[] bank) {
        set = new HashSet<>();
        char[] genes = {'A', 'C', 'G', 'T'};

        for (int i = 0; i < bank.length; i++) {
            set.add(bank[i]);
        }
        
        Queue<String> queue = new ArrayDeque<>();
        queue.offer(startGene);
        int step = 0;
        set.add(startGene);

        while(!queue.isEmpty()){
            int size = queue.size();
            while(size-- > 0){
                String cur = queue.poll();
                if(cur.equals(endGene))return step;
                for (int i = 0; i < 8; i++) {
                    char[] arr = cur.toCharArray();
                    for (char c : genes) {
                        if (c == arr[i]) continue;
                        arr[i] = c;
                        String next = new String(arr);
                        if (set.contains(next) && oneDiff(cur, next)) {
                            queue.offer(next);
                            set.remove(next);
                        }
                    }
                }
            }
            step++;
        }
        return -1;
    }
    public boolean oneDiff(String a,String b){
        int diff =0;
        for (int j = 0; j < 8; j++) {
            if(a.charAt(j) != b.charAt(j))diff++;
        }
        return diff==1;
    }
}
```

---

## 127. 单词接龙

**难度：** 困难

::btn[力扣做题]{link="https://leetcode.cn/problems/word-ladder/" type="info"}

### 思路

同样做bfs，每次改一个字母

### 代码

```java
class Solution {
    Set<String> set;
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        set = new HashSet<>();
        char[] genes = {'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'};

        for (int i = 0; i < wordList.size(); i++) {
            set.add(wordList.get(i));
        }
        
        Queue<String> queue = new ArrayDeque<>();
        queue.offer(beginWord);
        int step = 0;
        set.add(beginWord);

        while(!queue.isEmpty()){
            int size = queue.size();
            while(size-- > 0){
                String cur = queue.poll();
                if(cur.equals(endWord))return step+1;
                for (int i = 0; i < cur.length(); i++) {
                    char[] arr = cur.toCharArray();
                    for (char c : genes) {
                        if (c == arr[i]) continue;
                        arr[i] = c;
                        String next = new String(arr);
                        if (set.contains(next)) {
                            queue.offer(next);
                            set.remove(next);
                        }
                    }
                }
            }
            step++;
        }
        return 0;
    }

}
```

### 复杂度

- 时间：$O(n*L^2)$
- 空间：$O(n*L)$

### 备注

可以用双向bfs，把期望时间复杂度变成$O(n*L)$
```java
class Solution {
    char[] genes = {'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'};

    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> dict = new HashSet<>(wordList);
        if (!dict.contains(endWord)) return 0;

        Set<String> beginSet = new HashSet<>();
        Set<String> endSet = new HashSet<>();
        beginSet.add(beginWord);
        endSet.add(endWord);
        int step = 1;  // 起点、终点各算 1

        while (!beginSet.isEmpty() && !endSet.isEmpty()) {
            // 总是扩较小的一边，剪枝
            if (beginSet.size() > endSet.size()) {
                Set<String> tmp = beginSet;
                beginSet = endSet;
                endSet = tmp;
            }

            Set<String> nextSet = new HashSet<>();
            for (String cur : beginSet) {
                char[] arr = cur.toCharArray();
                for (int i = 0; i < arr.length; i++) {
                    char old = arr[i];
                    for (char c : genes) {
                        if (c == old) continue;
                        arr[i] = c;
                        String next = new String(arr);
                        if (endSet.contains(next)) return step + 1; // 两端相遇
                        if (dict.contains(next)) {
                            nextSet.add(next);
                            dict.remove(next);
                        }
                    }
                    arr[i] = old;
                }
            }
            beginSet = nextSet;
            step++;
        }
        return 0;
    }
}
```

---
