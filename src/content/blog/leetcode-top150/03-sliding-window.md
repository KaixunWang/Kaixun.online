---
title: "Top 150 · 滑动窗口（4 题）"
categories: LeetCode
tags: ['Top150', '滑动窗口']
id: "top150-03-sliding-window"
date: 2026-09-05 10:31:18
cover: "/assets/images/covers/top150/03-sliding-window.svg"
hide: false
recommend: false
top: false
---

:::note
固定/可变窗口维护区间状态，处理子数组与子串问题。

本模块共 **4** 题，属于 [LeetCode 面试经典 150 题](https://leetcode.cn/studyplan/top-interview-150/) 系列。
:::

## 209. 长度最小的子数组

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/minimum-size-subarray-sum/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int minL =Integer.MAX_VALUE;
        int l =0;
        int r = 0;
        int cur = 0;
        int n = nums.length;

        while(r<n){
            if(cur< target){//r++
                cur+=nums[r];
                r++;
            }else{//l++
                minL = Math.min(minL,r-l);
                cur -= nums[l];
                l++;
            }
        }

        while(l<n){
            if(cur >= target){
                minL = Math.min(minL,r-l);
                cur -= nums[l];
                l++;
            }else{
                break;
            }
        }
        return minL==Integer.MAX_VALUE ? 0:minL;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(1)$

### 备注

<!-- 待填 -->

---

## 3. 无重复字符的最长子串

**难度：** 中等

::btn[力扣做题]{link="https://leetcode.cn/problems/longest-substring-without-repeating-characters/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        HashMap<Character,Integer> map = new HashMap<>();
        int ans =0;
        int l=0;
        int r =0;
        int n = s.length();

        while(r < n){
            if(map.containsKey(s.charAt(r))){
                int oldPos = map.get(s.charAt(r));

                while(l<=oldPos){
                    map.remove(s.charAt(l));
                    l++;
                }

                map.put(s.charAt(r),r);
                r++;
            }else{
                map.put(s.charAt(r),r);
                ans = Math.max(ans,r-l+1);
                r++;
            }
        }


        return ans;
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(k)$

### 备注

<!-- 待填 -->

---

## 30. 串联所有单词的子串

**难度：** 困难

::btn[力扣做题]{link="https://leetcode.cn/problems/substring-with-concatenation-of-all-words/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public List<Integer> findSubstring(String s, String[] words) {
        HashMap<String,Integer> map = new HashMap<>();
        HashMap<String,Integer> window = new HashMap<>();

        int patternLen = words[0].length();
        int n = words.length;
        int sn = s.length();


        for (int i = 0; i < n; i++) {
            map.put(words[i],map.getOrDefault(words[i],0)+1);
        }
        List<Integer> ans = new ArrayList<>();

        for (int i = 0; i < patternLen; i++) {
            int l = i;
            int r = i;
            int count = 0;
            while (r + patternLen <= sn) {

                String word = s.substring(r, r + patternLen);
                r += patternLen;

                // ① word 不在 map
                // window 清空
                // count = 0
                // l = r
                if(!map.containsKey(word)){
                    window.clear();
                    count = 0;
                    l=r;
                }
                // ② word 在 map
                // 加入 window
                // count++
                else{
                    window.put(word,window.getOrDefault(word,0)+1);
                    count++;
                    // ③ 如果 word 超量
                    // while (window[word] > map[word])
                    // 从 l 移出一个 word
                    while(window.get(word) > map.get(word)){
                        String delete = s.substring(l,l+patternLen);
                        if(window.get(delete) == 1){
                            window.remove(delete);
                        }else{
                            window.put(delete,window.get(delete) - 1);
                        }
                        l+= patternLen;
                        count--;
                    }
                    // ④ count == n
                    // ans.add(l)
                    if(count == n){
                        ans.add(l);
                    }
                }
            }

            window.clear();
        }
        return ans;
    }
}
```

### 复杂度

- 时间：$O(n \cdot m)$
- 空间：$O(m)$

### 备注

<!-- 待填 -->

---

## 76. 最小覆盖子串

**难度：** 困难

::btn[力扣做题]{link="https://leetcode.cn/problems/minimum-window-substring/" type="info"}

### 思路

<!-- 待填 -->

### 代码

```java
class Solution {
    public String minWindow(String s, String t) {
        int m = s.length();
        int n = t.length();
        if(m < n) return "";

        int l = 0;
        int r = 0;

        int minL =0;
        int minR =10000000;

        HashMap<Character,Integer> mapT = new HashMap<>();
        for (int i = 0; i < t.length(); i++) {
            mapT.put(t.charAt(i),mapT.getOrDefault(t.charAt(i),0)+1);
        }

        HashMap<Character,Integer> window = new HashMap<>();

        int valid =0;
        while(r< m){
            char c = s.charAt(r);
            r++;

            window.put(c, window.getOrDefault(c,0)+1);
            if(mapT.getOrDefault(c,-1).equals(window.get(c)))valid++;
            while(valid == mapT.size()){
                if(r-l < minR-minL){
                    minL = l;
                    minR = r;
                }
                char delete = s.charAt(l);
                if(window.get(delete).equals(mapT.getOrDefault(delete,-1)))valid--;
                window.put(delete,window.get(delete) -1);
                l++;
            }
        }
        if(minR == 10000000)return "";
        return s.substring(minL,minR);
    }
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(k)$

### 备注

请检查你代码中所有使用 == 比较 Integer 对象的地方，比如：

if(mapT.getOrDefault(c,-1) == window.get(c))

if(window.get(delete) == mapT.getOrDefault(delete,-1))

这些比较操作比较的是 Integer 对象的引用，而不是数值。Java 的 Integer 缓存了 -128 到 127 之间的值，超过这个范围的数值即使相等，== 也可能返回 false。在你的场景中，字符计数很可能超过 127（例如 t 中有大量重复字符），这会导致 valid 的计算错误，从而影响收缩窗口的时机。



---
