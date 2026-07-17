---
title: "Top 150 · 栈（5 题）"
categories: LeetCode
tags: ['Top150', '栈']
id: "top150-07-stack"
date: 2026-06-22 12:00:00
cover: "/assets/images/covers/top150/07-stack.svg"
hide: true
recommend: false
top: false
---

:::note
括号匹配、单调栈思想与表达式求值。

本模块共 **5** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 20. 有效的括号

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/valid-parentheses/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        int n = s.length();
        stack.push(s.charAt(0));
        for (int i = 1; i < n; i++) {
            char cur = s.charAt(i);
            if(cur == '(' || cur == '{' || cur == '['){
                stack.push(cur);
                continue;
            }
            if(stack.isEmpty())return false;
            char inStack = stack.pop();
            if(cur == ')'){
                if(inStack == '('){
                    continue;
                }else{
                    return false;
                }
            }
            if(cur == '}'){
                if(inStack == '{'){
                    continue;
                }else{
                    return false;
                }
            }
            if(cur == ']'){
                if(inStack == '['){
                    continue;
                }else{
                    return false;
                }
            }
        }
        return stack.isEmpty();
    }
}
```

### 复杂度

- 时间：$O()$
- 空间：$O()$

### 备注

<!-- 待填 -->

---

## 71. 简化路径

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/simplify-path/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public String simplifyPath(String path) {
        String[] strs = path.split("/");
        Stack<String> stack = new Stack<>();
        for (String s : strs) {
            if(s.isEmpty() || s.equals(".")){
                continue;
            }
            if(!s.equals("..")){
                stack.add(s);
            }else if(!stack.isEmpty()){
                stack.pop();
            }
        }
        StringBuilder sb = new StringBuilder();
        for (String dir : stack) {
            sb.append("/").append(dir);
        }
        return sb.length() == 0 ? "/" : sb.toString();
    }
}
```

### 复杂度

- 时间：$O()$
- 空间：$O()$

### 备注

<!-- 待填 -->

---

## 155. 最小栈

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/min-stack/" type="info"}

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

## 150. 逆波兰表达式求值

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/evaluate-reverse-polish-notation/" type="info"}

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

## 224. 基本计算器

**难度：** 困难

::btn[力扣做题]{link="https://leetcode.cn/problems/basic-calculator/" type="info"}

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
