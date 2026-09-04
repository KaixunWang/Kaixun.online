---
title: "Top 150 · 矩阵（5 题）"
categories: LeetCode
tags: ['Top150', '矩阵']
id: "top150-04-matrix"
date: 2026-06-22 12:00:00
cover: "/assets/images/covers/top150/04-matrix.svg"
hide: true
recommend: false
top: false
---

:::note
二维数组遍历、原地变换与模拟类问题。

本模块共 **5** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 36. 有效的数独

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/valid-sudoku/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public boolean isValidSudoku(char[][] board) {
        int[][] row = new int[9][9];
        int[][] col = new int[9][9];
        int[][] cube = new int[9][9];

        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if(board[i][j] != '.') {
                    int curCube = (i / 3) * 3 + (j / 3);
                    int cur = Integer.parseInt(Character.toString(board[i][j])) - 1;
                    if (row[i][cur] != 0 || col[j][cur] != 0 || cube[curCube][cur] != 0) {
                        return false;
                    }
                    row[i][cur] = 1;
                    col[j][cur] = 1;
                    cube[curCube][cur] = 1;
                }
            }
        }
        return true;
    }
}
```

### 复杂度

- 时间：$O()$
- 空间：$O()$

### 备注

<!-- 待填 -->

---

## 54. 螺旋矩阵

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/spiral-matrix/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;
        int top=-1,left=-1;
        int bottom = m;
        int right = n;

        List<Integer> ans = new ArrayList<>();

        int dx = 1;
        int dy = 0;

        int i = 0;
        int j = 0;

        while(ans.size() < m * n){
            ans.add(matrix[i][j]);
            int ni = i+dy;
            int nj = j+dx;

            if(ni == top){
                dx = 1;
                dy = 0;
                left =j;
                i = i + dy;
                j = j + dx;
            }else if(ni ==bottom){
                dx = -1;
                dy = 0;
                right = j;
                i = i + dy;
                j = j + dx;
            }else if(nj == left){
                dx = 0;
                dy = -1;
                bottom = i;
                i = i + dy;
                j = j + dx;
            }else if(nj == right){
                dx =0;
                dy =1;
                top = i;
                i = i + dy;
                j = j + dx;
            }else{
                i=ni;
                j=nj;
            }
        }
        return ans;
    }
}
```

### 复杂度

- 时间：$O()$
- 空间：$O()$

### 备注

<!-- 待填 -->

---

## 48. 旋转图像

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/rotate-image/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public void rotate(int[][] matrix) {
        //transpose
        for (int i = 0; i < matrix.length; ++i) {
            for (int j = 0; j < i; ++j) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        //上下翻转
        for (int[] col : matrix) {
            int top = 0, bottom = col.length - 1;
            while (top < bottom) {
                int tmp = col[top];
                col[top] = col[bottom];
                col[bottom] = tmp;
                top++;
                bottom--;
            }
        }
    }
}
```

### 复杂度

- 时间：$O()$
- 空间：$O()$

### 备注

<!-- 待填 -->

---

## 73. 矩阵置零

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/set-matrix-zeroes/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
// 待填
```

### 复杂度

- 时间：$O()$
- 空间：$O()$

### 备注

<!-- 待填 -->

---

## 289. 生命游戏

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/game-of-life/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
// 待填
```

### 复杂度

- 时间：$O()$
- 空间：$O()$

### 备注

<!-- 待填 -->

---
