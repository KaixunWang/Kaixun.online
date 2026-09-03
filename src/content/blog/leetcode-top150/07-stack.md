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
class MinStack {
    PriorityQueue<Integer> pq;
    Stack<Integer> stack;
    
    public MinStack() {
        pq = new PriorityQueue<>();
        stack = new Stack<>();
    }
    
    public void push(int value) {
        stack.push(value);
        pq.add(value);
    }
    
    public void pop() {
        int temp = stack.pop();
        pq.remove(temp);
    }
    
    public int top() {
        return stack.peek();
    }
    
    public int getMin() {
        return pq.peek();
    }
}
```

### 复杂度

- 时间：$O()$
- 空间：$O()$

### 备注

用两个栈模拟可以全部$O(1)$
```java
class MinStack {
    Stack<Integer> stack;
    Stack<Integer> minStack;

    public MinStack() {
        stack = new Stack<>();
        minStack = new Stack<>();
    }
    
    public void push(int value) {
        stack.push(value);
        if(minStack.isEmpty()){
            minStack.push(value);
            return;
        }
        if(value < minStack.peek()){
            minStack.push(value);
        }else{
            minStack.push(minStack.peek());
        }
    }
    
    public void pop() {
        stack.pop();
        minStack.pop();
    }
    
    public int top() {
        return stack.peek();
    }
    
    public int getMin() {
        return minStack.peek();
    }
}
```

---

## 150. 逆波兰表达式求值

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/evaluate-reverse-polish-notation/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public int evalRPN(String[] tokens) {
        int cur =0;
        Stack<Integer> stack = new Stack<>();
        for (int i = 0; i < tokens.length; i++) {
            if(isNum(tokens[i])){
                stack.push(Integer.parseInt(tokens[i]));
            }else{
                int b = stack.pop();
                int a = stack.pop();
                switch (tokens[i]) {
                    case "+":
                        stack.push(a+b);
                        break;
                    case "-":
                        stack.push(a-b);
                        break;
                    case "*":
                        stack.push(a*b);
                        break;
                    default:
                        stack.push(a/b);
                        break;
                }
            }
        }
        return stack.peek();
    }

    public boolean isNum(String a){
        if(a.length() > 1 && a.charAt(0) == '-'){
            return true;
        }
        return Character.isDigit(a.charAt(0));
    }
}
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

通用方法rpn

### 代码

```java
class Solution {
    public int calculate(String s) {
        List<String> rpn = toRPN(s);
        Stack<Integer> stack = new Stack<>();

        for (String str : rpn) {
            if (!str.equals("+") && !str.equals("-")) {
                stack.push(Integer.parseInt(str));
            } else {
                int b = stack.pop();
                int a = stack.pop();

                if (str.equals("+")) {
                    stack.push(a + b);
                } else {
                    stack.push(a - b);
                }
            }
        }

        return stack.pop();
    }


    public List<String> toRPN(String s) {
        List<String> ans = new ArrayList<>();
        Stack<Character> op = new Stack<>();

        int i = 0;

        while (i < s.length()) {
            char c = s.charAt(i);

            if (c == ' ') {
                i++;
                continue;
            }

            // 数字
            if (Character.isDigit(c)) {
                int num = 0;

                while (i < s.length() && Character.isDigit(s.charAt(i))) {
                    num = num * 10 + (s.charAt(i) - '0');
                    i++;
                }

                ans.add(String.valueOf(num));
                continue;
            }


            // 处理负号
            if (c == '-') {
                boolean unary = false;

                if (i == 0) {
                    unary = true;
                } else {
                    int j = i - 1;

                    // 跳过空格
                    while (j >= 0 && s.charAt(j) == ' ') {
                        j--;
                    }

                    if (j < 0 || s.charAt(j) == '(' 
                            || s.charAt(j) == '+' 
                            || s.charAt(j) == '-') {
                        unary = true;
                    }
                }

                if (unary) {
                    ans.add("0");
                }
            }


            // 左括号
            if (c == '(') {
                op.push(c);
            }

            // 右括号
            else if (c == ')') {
                while (op.peek() != '(') {
                    ans.add(String.valueOf(op.pop()));
                }
                op.pop();
            }

            // 运算符
            else {
                while (!op.isEmpty() && op.peek() != '(') {
                    ans.add(String.valueOf(op.pop()));
                }

                op.push(c);
            }

            i++;
        }


        while (!op.isEmpty()) {
            ans.add(String.valueOf(op.pop()));
        }

        return ans;
    }
}
```

### 复杂度

- 时间：$O()$
- 空间：$O()$

### 备注

因为只有加减法，可以用栈储存符号和结果
```java
class Solution {
    public int calculate(String s) {
        int result =0;
        int sign = 1;
        int num = 0;
        Stack<Integer> stack = new Stack<>();

        for (int i = 0; i < s.length(); i++) {
            switch (s.charAt(i)) {
            case '+':
                result += sign * num;
                sign = 1;
                num =0;
                break;
            case '-':
                result += sign * num;
                sign = -1;
                num =0;
                break;
            case '(':
                stack.push(result);
                stack.push(sign);
                result = 0;
                sign = 1;
                num = 0;
                break;
            case ')':
                result += sign*num;
                num =0;
                int oldSign = stack.pop();
                int oldRes = stack.pop();
                result = oldRes + oldSign * result;
                break;
            case ' ':
                break;
            default:
                num = num * 10 + s.charAt(i)-'0';
                break;   
            }
        }

        return result + sign * num;
    }
}
```

---
