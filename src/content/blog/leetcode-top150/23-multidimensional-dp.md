---
title: "Top 150 · 多维动态规划（9 题）"
categories: LeetCode
tags: ['Top150', '动态规划', '多维DP']
id: "top150-23-multidimensional-dp"
date: 2026-06-22 12:00:00
cover: "/assets/images/covers/top150/23-multidimensional-dp.svg"
hide: false
updated: 2026-06-27 01:30:49
recommend: false
top: false
---

:::note
二维 DP、编辑距离、股票系列与最大正方形。

本模块共 **9** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 120. 三角形最小路径和

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/triangle/" type="info"}

### 思路

从下往上dp代表走到这个点的最短路

### 代码

```java
class Solution {
    public int minimumTotal(List<List<Integer>> triangle) {
        int height = triangle.size();
        int[] dp = new int[height];
        for (int i = 0; i < height; i++) {
            dp[i] = triangle.get(height - 1).get(i);
        }
        for (int i = height - 2; i >=0; i--) {
            for (int j = 0; j <= i; j++) {
                dp[j] = Math.min(dp[j],dp[j+1]) + triangle.get(i).get(j);
            }
        }
        return dp[0];
    }
}
```

### 复杂度

- 时间：$O(n^2)$
- 空间：$O(n)$

### 备注

<!-- 待填 -->

---

## 64. 最小路径和

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/minimum-path-sum/" type="info"}

### 思路

dp[i][j]代表到这个点的最短路

### 代码

```java
class Solution {
    public int minPathSum(int[][] grid) {
        int m= grid.length;
        int n = grid[0].length;
        int[][] dp = new int[m][n];
        dp[0][0] = grid[0][0];

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if(i != 0 && j != 0){
                    dp[i][j] = Math.min(dp[i-1][j],dp[i][j-1]) + grid[i][j];
                }else if(i != 0){
                    dp[i][j] = dp[i-1][j]+ grid[i][j];
                }else if(j != 0){
                    dp[i][j] = dp[i][j-1]+ grid[i][j];
                }
                
            }
        }
        return dp[m-1][n-1];
    }
}
```

### 复杂度

- 时间：$O(m*n)$
- 空间：$O(m*n)$

### 备注

<!-- 待填 -->

---

## 63. 不同路径 II

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/unique-paths-ii/" type="info"}

### 思路

dp[i][j]代表走到这个点的所有路径数

### 代码

```java
class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        int m= obstacleGrid.length;
        int n = obstacleGrid[0].length;
        int[][] dp = new int[m][n];
        dp[0][0] = 1;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if(obstacleGrid[i][j] == 1){
                    dp[i][j] = 0;
                }else{
                    if(i != 0 && j != 0){
                        dp[i][j] = dp[i-1][j] + dp[i][j-1];
                    }else if(i != 0){
                        dp[i][j] = dp[i-1][j];
                    }else if(j != 0){
                        dp[i][j] = dp[i][j-1];
                    }
                }
            }
        }

        return dp[m-1][n-1];
    }
}
```

### 复杂度

- 时间：$O(m*n)$
- 空间：$O(m*n)$

### 备注

<!-- 待填 -->

---

## 5. 最长回文子串

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/longest-palindromic-substring/" type="info"}

### 思路

dp[i][j]代表i...j这个字符串是否是回文，那么初始所有dp[i][i]都是，根据长度遍历所有

如果两端相等`s.charAt(i) == s.charAt(j)`且内部回文`dp[i+1][j-1]`就是回文

### 代码

```java
class Solution {
    public String longestPalindrome(String s) {
        int n = s.length();
        boolean[][] dp = new boolean[n][n];
        int max = 1;
        int[] pair = {0,0};
        for (int len = 1; len <= n; len++) {
            for(int i = 0; i+len-1<n;i++){
                int j = i+len-1;
            if (s.charAt(i) == s.charAt(j) && (len <= 2 || dp[i+1][j-1])) {
                dp[i][j] = true;
                if(len > max){
                    max = len;
                    pair[0] = i;
                    pair[1] = j;
                }
            }
            }
        }
        return s.substring(pair[0],pair[1]+1);
    }
}
```

### 复杂度

- 时间：$O(n^2)$
- 空间：$O(n^2)$

### 备注

<!-- 待填 -->

---

## 97. 交错字符串

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/interleaving-string/" type="info"}

### 思路

dp[i][j]代表了包含第i+j-1个字符的s3的字串是否能被交替表示

### 代码

```java
class Solution {
    public boolean isInterleave(String s1, String s2, String s3) {
        int m = s1.length();
        int n = s2.length();
        int len = s3.length();
        if(m+n != len){
            return false;
        }
        boolean[][] dp = new boolean[m+1][n+1];
        
        for (int i = 0; i <= m; i++) {
            for (int j = 0; j <= n; j++) {
                if(i == 0 && j == 0){
                    dp[i][j] = true;
                }else if(i == 0){
                    dp[i][j] = (dp[i][j-1]==true && s3.charAt(i+j-1)==s2.charAt(j-1));
                }else if(j == 0){
                    dp[i][j] = (dp[i-1][j]==true && s3.charAt(i+j-1)==s1.charAt(i-1));
                }else if(dp[i-1][j] ==false && dp[i][j-1] ==false){
                    dp[i][j] = false;
                }else{
                    char char1 = s1.charAt(i-1);
                    char char2 = s2.charAt(j-1);
                    char char3 = s3.charAt(i+j-1);
                    dp[i][j] = (dp[i-1][j] && char3==char1 || dp[i][j-1] &&char3==char2);
                }
            }
        }
        return dp[m][n];
    }
}
```

### 复杂度

- 时间：$O(m*n)$
- 空间：$O(m*n)$

### 备注

<!-- 待填 -->

---

## 72. 编辑距离

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/edit-distance/" type="info"}

### 思路

dp[i][j]代表word1的前i个变成word2的前j个需要多少次操作

### 代码

```java
class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        int[][] dp = new int[m+1][n+1];
        
        for (int i = 0; i <= m; i++) {
            for (int j = 0; j <=n; j++) {
                if(i==0 && j==0){
                    dp[i][j] = 0;
                }else if(j==0){
                    dp[i][j] = i;
                }else if(i==0){
                    dp[i][j] = j;
                }else if(word1.charAt(i-1) !=word2.charAt(j-1)){
                    int add = dp[i][j-1] + 1;
                    int delete = dp[i-1][j] +1;
                    int change = dp[i-1][j-1] +1;
                    dp[i][j] = Math.min(Math.min(add,delete),change);
                }else{
                    dp[i][j] = dp[i-1][j-1];
                }
            }
        }
        return dp[m][n];
    }
}
```

### 复杂度

- 时间：$O(m*n)$
- 空间：$O(m*n)$

### 备注

<!-- 待填 -->

---

## 123. 买卖股票的最佳时机 III

**难度：** 困难

::btn[力扣做题]{link="https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iii/" type="info"}

### 思路

naive想法是便利分割点，然后$O(n^2)$做法

这里用四个状态，分别表示每天结束时的最佳选择，然后转移

### 代码

```java
class Solution {
    public int maxProfit(int[] prices) {
        int n = prices.length;
        int buy1  = -prices[0];  // 第一天买入
        int sell1 = 0;           // 还没卖出，利润0
        int buy2  = -prices[0];  // 第一天买入再卖再买，等价于-prices[0]
        int sell2 = 0;           // 还没卖出，利润0

        for (int i = 1; i < n; i++) {
            buy1 = Math.max(buy1,-prices[i]);
            sell1 = Math.max(sell1,prices[i] + buy1);
            buy2 = Math.max(buy2,sell1-prices[i]);
            sell2 = Math.max(sell2,prices[i] + buy2);
        }
        return sell2;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 188. 买卖股票的最佳时机 IV

**难度：** 困难

::btn[力扣做题]{link="https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iv/" type="info"}

### 思路

和上一题相似，只是现在转移变量从2\*2个变成2\*k个，转移方程类似

### 代码

```java
class Solution {
    public int maxProfit(int k, int[] prices) {
        int n = prices.length;
        int[] buy = new int[k+1];
        int[] sell = new int[k+1];
        
        for (int i = 1; i <= k; i++) {
            buy[i] = -prices[0];
            sell[i] = 0;
        }
        
        for (int i = 1; i < n; i++) {
            for (int j = 1; j <= k; j++) {
                buy[j] = Math.max(buy[j], sell[j-1] - prices[i]);
                sell[j] = Math.max(sell[j], buy[j] + prices[i]);
            }
        }
        return sell[k];
    }
}
```

### 复杂度

- 时间：$O(n*k)$
- 空间：$O(k)$

### 备注

<!-- 待填 -->

---

## 221. 最大正方形

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/maximal-square/" type="info"}

### 思路

dp[i][j]代表从(i,j)作为右下角，最大的正方形边长

### 代码

```java
class Solution {
    public int maximalSquare(char[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;
        int[][] dp = new int[m][n];
        int max = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if((i==0 || j ==0) && matrix[i][j] == '1'){
                    dp[i][j] = 1;
                    max = Math.max(max, 1);
                }else if(matrix[i][j] == '0'){
                    dp[i][j] = 0;
                }else{
                    dp[i][j] = Math.min(Math.min(dp[i-1][j],dp[i-1][j-1]),dp[i][j-1])+1;
                    max = Math.max(max,dp[i][j]);
                }
            }
        }
        return max*max;
    }
}
```

### 复杂度

- 时间：$O(m*n)$
- 空间：$O(m*n)$

### 备注

<!-- 待填 -->

---
