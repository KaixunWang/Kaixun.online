---
title: "Top 150 · 字典树（3 题）"
categories: LeetCode
tags: ['Top150', '字典树', 'Trie']
id: "top150-14-trie"
date: 2026-06-22 12:00:00
cover: "/assets/images/covers/top150/14-trie.svg"
hide: false
updated: 2026-07-09 08:57:00
recommend: false
top: false
---

:::note
前缀树实现、带通配符搜索与单词网格搜索。

本模块共 **3** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 208. 实现 Trie (前缀树)

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/implement-trie-prefix-tree/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Trie {
    Trie[] children;
    boolean end;

    public Trie() {
        children = new Trie[26];
        end = false;
    }
    
    public void insert(String word) {
        Trie node = this;
        for (int i = 0; i < word.length(); i++) {
            int idx = word.charAt(i) - 'a';

            if(node.children[idx] == null){
                Trie child = new Trie();
                node.children[idx] = child;
            }
            node = node.children[idx];
            
        }
        node.end = true;
    }
    
    public boolean search(String word) {
        Trie node = this;
        for (int i = 0; i < word.length(); i++) {
            int idx = word.charAt(i) - 'a';

            if(node.children[idx] == null){
                return false;
            }
            node = node.children[idx];
        }
        return node.end;
    }
    
    public boolean startsWith(String prefix) {
        Trie node = this;
        for (int i = 0; i < prefix.length(); i++) {
            int idx = prefix.charAt(i) - 'a';

            if(node.children[idx] == null){
                return false;
            }
            node = node.children[idx];
        }
        return true;
    }
}
```

### 复杂度

- 时间：$O(L)$
- 空间：$O(m)$

### 备注

<!-- 待填 -->

---

## 211. 添加与搜索单词 - 数据结构设计

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/design-add-and-search-words-data-structure/" type="info"}

### 思路

trie树里做dfs

### 代码

```java
class WordDictionary {
    WordDictionary[] children;
    boolean end;

    public WordDictionary() {
        children = new WordDictionary[26];
        end = false;
    }
    
    public void addWord(String word) {
        WordDictionary node = this;
        for (int i = 0; i < word.length(); i++) {
            int idx = word.charAt(i) - 'a';

            if(node.children[idx] == null){
                WordDictionary child = new WordDictionary();
                node.children[idx] = child;
            }
            node = node.children[idx];
        }
        node.end = true;
    }
    
    public boolean search(String word) {
        return dfs(this, word, 0);
    }

    public boolean dfs(WordDictionary node, String word, int i){
        if(i == word.length())return node.end;
        if(word.charAt(i) == '.'){
            for (int j = 0; j < node.children.length; j++) {
                if(node.children[j] != null && dfs(node.children[j], word, i + 1)){
                    return true;
                }
            }
        }else{
            int idx = word.charAt(i) - 'a';
            if(node.children[idx] != null){
                return dfs(node.children[idx],word,i+1);
            }else{
                return false;
            }
        }
        return false;
    }
}
```

### 复杂度

- 时间：`addWord` $O(L)$；`search` 无 `.` 时 $O(L)$，最坏（全为 `.`）$O(26^L)$
- 空间：$O(m+L)$

### 备注

trie一般很稀疏

---

## 212. 单词搜索 II

**难度：** 困难

::btn[力扣做题]{link="https://leetcode.cn/problems/word-search-ii/" type="info"}

### 思路

每个格子在trie节点走一次dfs，回溯标记#代表不能重复使用

### 代码

```java
class Solution {
    char[][] board;
    List<String> ans;
    int m,n;
    public List<String> findWords(char[][] board, String[] words) {
        this.board = board;
        ans = new ArrayList<>();
        Trie root = new Trie();
        for (int i = 0; i < words.length; i++) {
            root.insert(words[i]);
        }
        m = board.length;
        n = board[0].length;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                dfs(root,i,j);
            }
        }
        return ans;
    }
    public void dfs(Trie node,int i,int j){
        if(i<0 || i > m-1 || j<0 || j > n-1)return;
        char cur = board[i][j];
        int idx = cur - 'a';
        if (cur == '#') return;
        if(node.children[idx] != null){
            board[i][j] = '#';
            node = node.children[idx];
            if(node.end){
                ans.add(node.word);
                node.end = false;
            }
            dfs(node,i-1,j);
            dfs(node,i+1,j);
            dfs(node,i,j-1);
            dfs(node,i,j+1);
        }else{
            return;
        }
        board[i][j] = cur;
    }
}

class Trie {
    Trie[] children;
    boolean end;
    String word;

    public Trie() {
        children = new Trie[26];
        end = false;
        word = null;
    }
    
    public void insert(String word) {
        Trie node = this;
        for (int i = 0; i < word.length(); i++) {
            int idx = word.charAt(i) - 'a';

            if(node.children[idx] == null){
                Trie child = new Trie();
                node.children[idx] = child;
            }
            node = node.children[idx];
            
        }
        node.end = true;
        node.word = word;
    }
}
```

### 复杂度

- 时间：$O(m \cdot n \cdot 4 \cdot 3^{l-1})$，上界可写 $O(m \cdot n \cdot 4^l)$
- 空间：$O(w + l)$（$w$ 为词表总字符数，Trie 节点；$l$ 为最长单词长度，DFS 栈）

### 备注

从棋盘上每个格子出发，沿 Trie 做 DFS。

每个起点最多 4 个方向，之后每步最多 3 个新方向（不走回头路），深度不超过最长单词长度 $l$。单起点路径数 $O(4 \cdot 3^{l-1})$，共 $m \times n$ 个起点，故得上式。实际 Trie 剪枝后通常远好于该上界。

---
