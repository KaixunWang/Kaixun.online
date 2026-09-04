---
title: "Top 150 · 回溯（7 题）"
categories: LeetCode
tags: ['Top150', '回溯']
id: "top150-15-backtracking"
date: 2026-07-14 21:18:52
cover: "/assets/images/covers/top150/15-backtracking.svg"
hide: false
updated: 2026-07-14 21:18:27
recommend: false
top: false
---

:::note
组合、排列、子集与剪枝搜索。

本模块共 **7** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 17. 电话号码的字母组合

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/letter-combinations-of-a-phone-number/" type="info"}

### 思路

dfs查找即可

### 代码

```java
class Solution {
    ArrayList<String> res;
    int n;
    String digits;
    String letterMap[] = {
            " ",    //0
            "",     //1
            "abc",  //2
            "def",  //3
            "ghi",  //4
            "jkl",  //5
            "mno",  //6
            "pqrs", //7
            "tuv",  //8
            "wxyz"  //9
    };
    public List<String> letterCombinations(String digits) {
        res = new ArrayList<String>();
        n = digits.length();
        this.digits = digits;
        if(digits.equals("")){
            return res;
        }
        dfs(0,"");
        return res;
    }

    public void dfs(int i,String s){
        if(i == n){
            res.add(s);
            return;
        }
        char c = digits.charAt(i);
        String letter = letterMap[c-'0'];
        for (int j = 0; j < letter.length(); j++) {
            dfs(i+1,s+letter.charAt(j));
        }
        return;
    }
}
```

### 复杂度

- 时间：$O(3^a \cdot 4^b)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---

## 77. 组合

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/combinations/" type="info"}

### 思路

注意可以用长度剪枝

### 代码

```java
class Solution {
    List<List<Integer>> res;
    int n,k;
    List<Integer> path;
    public List<List<Integer>> combine(int n, int k) {
        res = new ArrayList<>();
        this.n=n;
        this.k=k;
        path = new ArrayList<>();
        dfs(1);
        return res;
    }
    public void dfs(int index){
        if (path.size() == k) {
            res.add(new ArrayList<>(path));
            return;
        }
        for (int i = index; i <= n - (k - path.size()) + 1; i++){
            path.add(i);
            dfs(i+1);
            path.remove(path.size() - 1);
        }
    }
}
```

### 复杂度

- 时间：$O(C(n, k) · k)$
- 空间：$O(k)$

### 备注

<!-- 待填 -->

---

## 46. 全排列

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/permutations/" type="info"}

### 思路

注意remove的时候，remove的是下标，不是元素值，只能`temp.remove(temp.size() - 1);`

注意add的时候，add的是复制的一个新的list，不是原始地址，只能`ans.add(new ArrayList<>(temp));`
### 代码

```java
class Solution {
    List<List<Integer>> ans;
    List<Integer> temp;
    int[] nums;
    int len;
    Set<Integer> visited;
    public List<List<Integer>> permute(int[] nums) {
        this.nums = nums;
        len = nums.length;
        ans = new ArrayList<List<Integer>>();
        temp = new ArrayList<>();
        visited = new HashSet<>();
        dfs();
        return ans;
    }
    public void dfs(){
        if(temp.size() == len){
            ans.add(new ArrayList<>(temp));
            return;
        }
        for (int i = 0; i < len; i++) {
            if(visited.contains(nums[i]))continue;
            temp.add(nums[i]);
            visited.add(nums[i]);
            dfs();
            temp.remove(temp.size() - 1);
            visited.remove(nums[i]);
        }
        return;
    }
}
```

### 复杂度

- 时间：$O(n \cdot n!)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---

## 39. 组合总和

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/combination-sum/" type="info"}

### 思路

用index做自动去重即可

### 代码

```java
class Solution {
    List<List<Integer>> ans;
    List<Integer> temp;
    int[] candidates;
    int target;
    int n;
    int cur;

    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        ans = new ArrayList<>();
        temp = new ArrayList<>();
        this.candidates = candidates;
        this.target = target;
        n = candidates.length;
        for (int i = 0; i < n; i++) {
            cur = 0;
            temp.add(candidates[i]);
            dfs(i);
            temp.remove(0);
        }
        return ans;
    }

    public void dfs(int index){
        if(index == n)return;
        int now = cur + candidates[index];
        if(now > target){
            return;
        }else if(now == target){
            ans.add(new ArrayList<>(temp));
            return;
        }else{
            for (int j = index; j < n; j++) {
                temp.add(candidates[j]);
                cur = now;
                dfs(j);
                temp.remove(temp.size() - 1);
            }
        }

        return;
    }
}
```

### 复杂度

- 时间：$O(n^{T/M})$，$T$ 为 target，$M$ 为最小候选数
- 空间：$O(T/M)$

### 备注

<!-- 待填 -->

---

## 51. N 皇后 II

**难度：** 困难

::btn[力扣做题]{link="https://leetcode.cn/problems/n-queens-ii/" type="info"}

### 思路

对角线计算方式想一想就好了

### 代码

```java
class Solution {
    int cnt;
    boolean[] col,diag1,diag2;
    int n;
    public int totalNQueens(int n) {
        col = new boolean[n];
        diag1 = new boolean[2 * n - 1];
        diag2 = new boolean[2 * n - 1];
        this.n = n;
        cnt = 0;
        for (int i = 0; i < n; i++) {
            dfs(0,i);
        }
        return cnt;
    }
    public void dfs(int i ,int j){
        if(diag1[i+j] || diag2[i-j + n-1] || col[j])return;
        if(i == n-1){
            if(diag1[i+j] ==false && col[j]==false && diag2[i-j + n-1] == false){
                cnt++;
            } 
        }else{
            col[j] = true;
            diag1[i+j] = true;
            diag2[i-j + n-1] =true;
            for (int k = 0; k < n; k++) {
                if(k != j)dfs(i+1,k);
            }
            col[j] = false;
            diag1[i+j] = false;
            diag2[i-j + n-1] = false;
        }
        return;
    }
}
```

### 复杂度

- 时间：$O(n!)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---

## 22. 括号生成

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/generate-parentheses/" type="info"}

### 思路

用StringBuilder应该内存会比String+"xxx"好一些

### 代码

```java
class Solution {
    int n,l,r;
    List<String> ans;
    StringBuilder sb;

    public List<String> generateParenthesis(int n) {
        this.n = n;
        l = 0;
        r = 0;
        ans = new ArrayList<String>();
        sb = new StringBuilder();
        dfs();
        return ans;
    }
    public void dfs(){
        if(r == n){
            ans.add(sb.toString());
            return;
        }
        if(l==r){
            sb.append("(");
            l++;
            dfs();
            l--;
            sb.deleteCharAt(sb.length() - 1);
        }else{
                sb.append(")");
                r++;
                dfs();
                r--;
                sb.deleteCharAt(sb.length() - 1);

                if(n-l != 0){
                    sb.append("(");
                    l++;
                    dfs();
                    l--;
                    sb.deleteCharAt(sb.length() - 1);
                }
        }
        return;
    }
}
```

### 复杂度

- 时间：$O(4^n / \sqrt{n})$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---

## 79. 单词搜索

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/word-search/" type="info"}

### 思路

还是回溯搜索，优化一下调用开销即可

### 代码

```java
class Solution {
    boolean ans;
    int n,m;
    char[][] board;
    String word;

    public boolean exist(char[][] board, String word) {
        n = board.length;
        m = board[0].length;
        this.board = board;
        ans = false;
        this.word = word;

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if(!ans && board[i][j] == word.charAt(0))dfs(i,j,0);
            }
        }
        return ans;
    }

    public void dfs(int i,int j,int index){
        if(ans)return;
        if(index == word.length()){
            ans = true;
            return;
        }
        if(i<0 || i >n-1 || j<0 || j > m-1)return;
        if(board[i][j] != word.charAt(index))return;
        char temp = board[i][j];
        board[i][j] = '#';
        dfs(i+1,j,index+1);
        dfs(i-1,j,index+1);
        dfs(i,j+1,index+1);
        dfs(i,j-1,index+1);
        board[i][j] = temp;
        return;
    }
}
```

### 复杂度

- 时间：$O(m \cdot n \cdot 3^L)$，$L$ 为单词长度
- 空间：$O(L)$

### 备注

<!-- 待填 -->

---
