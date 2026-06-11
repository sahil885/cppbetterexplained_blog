---
title: "How to Reverse a String in C++: 4 Simple Methods Explained"
description: "Learn how to reverse a string in C++ using std::reverse, a loop, two pointers, and recursion. Beginner-friendly guide with complete working code examples."
pubDatetime: 2026-06-10T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "strings", "tutorial"]
faqSchema:
  - question: "What is the easiest way to reverse a string in C++?"
    answer: "Use std::reverse from the <algorithm> header: std::reverse(str.begin(), str.end()). It reverses the string in place in one line and is the method most C++ programmers use in practice."
  - question: "How do you reverse a string in C++ without using built-in functions?"
    answer: "Use the two-pointer technique: one index at the start, one at the end, swap the characters they point to, then move both toward the middle until they meet. This reverses the string in place with no extra memory."
  - question: "Does std::reverse create a new string?"
    answer: "No. std::reverse modifies the string in place, so the original order is lost. If you need to keep the original, copy it first or build a new reversed string with reverse iterators."
draft: false
featured: false
---

# How to Reverse a String in C++: 4 Simple Methods Explained

Reversing a string is a classic beginner exercise — and a real interview favorite — because it touches indexing, loops, and the standard library all at once. Here are four ways to do it, from the one-liner you'll use in practice to the manual methods that teach you how it actually works.

---

## Method 1: std::reverse (the practical one-liner)

The `<algorithm>` header gives you `std::reverse`, which reverses any sequence in place:

```cpp
#include <iostream>
#include <string>
#include <algorithm>

int main() {
    std::string word = "hello";
    std::reverse(word.begin(), word.end());
    std::cout << word << '\n';  // olleh
    return 0;
}
```

This is the method to reach for in real code: it's tested, optimized, and instantly readable to other C++ programmers. `begin()` and `end()` are iterators marking the start and end of the string — if those are new to you, see our [iterators guide](/posts/cpp-iterators/).

---

## Method 2: build a new string with a backward loop

If you want to keep the original string, loop from the last character to the first and append each one to a new string:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string original = "hello";
    std::string reversed;

    for (int i = original.length() - 1; i >= 0; i--) {
        reversed += original[i];
    }

    std::cout << original << " -> " << reversed << '\n';  // hello -> olleh
    return 0;
}
```

Note the loop variable is `int`, not `size_t` — `length()` returns an unsigned type, and an unsigned `i` would wrap around to a huge number instead of going below 0, causing an infinite loop. That subtle bug catches a lot of beginners. More loop patterns in our [loops tutorial](/posts/cpp-loops-tutorial/).

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Method 3: two pointers (the interview classic)

This is what `std::reverse` does under the hood: two indices, one at each end, swapping as they move toward the middle.

```cpp
#include <iostream>
#include <string>
#include <utility>  // std::swap

int main() {
    std::string word = "hello";

    int left = 0;
    int right = word.length() - 1;

    while (left < right) {
        std::swap(word[left], word[right]);
        left++;
        right--;
    }

    std::cout << word << '\n';  // olleh
    return 0;
}
```

This is efficient because it does the reversal in place with no extra memory — just n/2 swaps. Interviewers love this version because it shows you understand indexing rather than just knowing the library call. The same two-pointer pattern powers our [palindrome checker](/posts/cpp-palindrome-program/).

---

## Method 4: recursion (the learning exercise)

You can also define reversal recursively: the reverse of a string is its last character plus the reverse of everything before it.

```cpp
#include <iostream>
#include <string>

std::string reverseString(const std::string& s) {
    if (s.empty()) {
        return "";  // base case
    }
    return s.back() + reverseString(s.substr(0, s.length() - 1));
}

int main() {
    std::cout << reverseString("hello") << '\n';  // olleh
    return 0;
}
```

This version is slower (each call copies a substring), so don't use it in production — but it's a great exercise for understanding base cases and the call stack. Our [recursion tutorial](/posts/cpp-recursion-tutorial/) breaks down how calls like this unwind.

---

## Bonus: copy in reverse with reverse iterators

To get a reversed copy in one line without touching the original:

```cpp
std::string reversed(original.rbegin(), original.rend());
```

`rbegin()` and `rend()` are reverse iterators — they walk the string backward, and the string constructor copies characters in that order.

---

## Which method should you use?

Use `std::reverse` in real code, the two-pointer version in interviews when asked to do it manually, and the recursive version to sharpen your understanding. They all produce the same result — the difference is what each one teaches you.

---

## Related Articles

- [C++ String Handling: std::string, string_view, and Performance Tips](/posts/cpp-string-handling/)
- [C++ Palindrome Program: Strings and Numbers](/posts/cpp-palindrome-program/)
- [C++ Loops Tutorial: for, while, and do-while Explained](/posts/cpp-loops-tutorial/)
- [C++ Recursion Tutorial: How Recursive Functions Work](/posts/cpp-recursion-tutorial/)
- [C++ Iterators Explained: How to Traverse STL Containers for Beginners](/posts/cpp-iterators/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
