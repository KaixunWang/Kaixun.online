---
title: "Top 150 · 哈希表（9 题）"
categories: LeetCode
tags: ['Top150', '哈希表']
id: "top150-05-hashmap"
date: 2026-06-22 12:00:00
cover: "/assets/images/covers/top150/05-hashmap.svg"
hide: true
recommend: false
top: false
---

:::note
哈希映射计数、分组与 O(1) 查找，含快乐数等经典题。

本模块共 **9** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 383. 赎金信

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/ransom-note/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        int[] setR = new int[26];
        int[] setM = new int[26];
        for (int i = 0; i < ransomNote.length(); i++) {
            setR[ransomNote.charAt(i) - 'a']++;
        }
        for (int i = 0; i < magazine.length(); i++) {
            setM[magazine.charAt(i) - 'a']++;
        }
        for (int i = 0; i < 26; i++) {
            if(setM[i] - setR[i] <0){
                return false;
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

## 205. 同构字符串

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/isomorphic-strings/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public boolean isIsomorphic(String s, String t) {
        if (s.length() != t.length()) return false;
        Map<Character, Character> s2t = new HashMap<>();
        Map<Character, Character> t2s = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            char a = s.charAt(i), b = t.charAt(i);
            if (s2t.containsKey(a) && s2t.get(a) != b) return false;
            if (t2s.containsKey(b) && t2s.get(b) != a) return false;
            s2t.put(a, b);
            t2s.put(b, a);
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

## 290. 单词规律

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/word-pattern/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public boolean wordPattern(String pattern, String s) {
        String[] words = s.split(" ");
        HashMap<Character,String> c2w = new HashMap();
        HashMap<String,Character> w2c = new HashMap();

        if(pattern.length() != words.length)return false;
        for (int i = 0; i < pattern.length(); i++) {
            char a = pattern.charAt(i);
            String b = words[i];
            if(c2w.containsKey(a) && !c2w.get(a).equals(b))return false;
            if(w2c.containsKey(b) && w2c.get(b) != a)return false;
            c2w.put(a,b);
            w2c.put(b,a);
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

## 242. 有效的字母异位词

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/valid-anagram/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        HashMap<Character,Integer> mapS = new HashMap();
        HashMap<Character,Integer> mapT = new HashMap();

        for (int i = 0; i < s.length(); i++) {
            mapS.put(s.charAt(i),mapS.getOrDefault(s.charAt(i),0)+1);
            mapT.put(t.charAt(i),mapT.getOrDefault(t.charAt(i),0)+1);
        }

        return mapS.equals(mapT);
    }
}
```

### 复杂度

- 时间：$O()$
- 空间：$O()$

### 备注

<!-- 待填 -->

---

## 49. 字母异位词分组

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/group-anagrams/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<String, List<String>>();
        for(String str: strs){
            int[] counts = new int[26];
            int len = str.length();
            for(int i =0; i < len;i++){
                counts[str.charAt(i) - 'a']++;
            }

            StringBuilder sb = new StringBuilder();
            for(int i=0;i<26;i++){
                if(counts[i]!=0){
                    sb.append(('a'+i));
                    sb.append(counts[i]);
                }
            }

            String key = sb.toString();
            List<String> list = map.getOrDefault(key, new ArrayList<String>());
            list.add(str);
            map.put(key, list);
        }
        return new ArrayList<List<String>>(map.values());
    }
}
```

### 复杂度

- 时间：$O()$
- 空间：$O()$

### 备注

<!-- 待填 -->

---

## 1. 两数之和

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/two-sum/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer,Integer> need = new HashMap();
        for (int i = 0; i < nums.length; i++) {
            if(need.containsKey(target - nums[i])){
                return new int[]{need.get(target - nums[i]), i};
            }else{
                need.put(nums[i],i);
            }
        }
        return null;
    }
}
```

### 复杂度

- 时间：$O()$
- 空间：$O()$

### 备注

<!-- 待填 -->

---

## 202. 快乐数

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/happy-number/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public boolean isHappy(int n) {
        Set<Integer> seen = new HashSet<>();

        while(n != 1 && !seen.contains(n)){
            seen.add(n);
            n = next(n);
        }
        return n==1;
    }
    public int next(int n){
        int temp =0;
        while(n > 0){
            int digit = n%10;
            temp += digit * digit;
            n=n/10;
        }

        return temp;
    }
}
```

### 复杂度

- 时间：$O()$
- 空间：$O()$

### 备注

<!-- 待填 -->

---

## 219. 存在重复元素 II

**难度：** 简单

::btn[力扣做题]{link="https://leetcode.cn/problems/contains-duplicate-ii/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        HashMap<Integer,Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            if(map.containsKey(nums[i])){
                if(Math.abs(map.get(nums[i])-i) <= k)return true;
            }
            map.put(nums[i],i);
        }
        return false;
    }
}
```

### 复杂度

- 时间：$O()$
- 空间：$O()$

### 备注

<!-- 待填 -->

---

## 128. 最长连续序列

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/longest-consecutive-sequence/" type="info"}

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
