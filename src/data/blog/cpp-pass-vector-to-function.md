---
title: "C++ Pass Vector to Function: By Reference, Value, or Const"
description: "Learn how to pass a vector to a function in C++ by value, by reference, and by const reference. Understand copies vs references and which to use, with examples."
pubDatetime: 2026-06-09T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "vector", "functions"]
faqSchema:
  - question: "How do you pass a vector to a function in C++?"
    answer: "Declare the parameter as std::vector<int>& to pass by reference, or const std::vector<int>& for read-only access without copying. Passing by plain value (std::vector<int>) copies the whole vector, which is usually wasteful."
  - question: "Should you pass a vector by value or reference in C++?"
    answer: "Pass by const reference when the function only reads the vector, and by non-const reference when it must modify the caller's vector. Pass by value only when you genuinely need an independent copy to change locally."
  - question: "How do you return a vector from a function in C++?"
    answer: "Just return it by value: std::vector<int> makeData() { ... return v; }. Modern C++ moves the vector out efficiently, so there's no costly copy and the code stays simple."
draft: false
featured: false
---

# C++ Pass Vector to Function: By Reference, Value, or Const

**To pass a vector to a function efficiently in C++, use a reference: `const std::vector<int>&` for read-only access, or `std::vector<int>&` when the function must modify it.** Passing by plain value copies the entire vector, which is almost always wasteful. Here's each option and when to reach for it.

---

## Pass by Value (Makes a Copy)

If you declare the parameter as a plain `std::vector`, the function receives its own copy:

```cpp
#include <iostream>
#include <vector>

void printAll(std::vector<int> v) {   // v is a COPY
    v[0] = 999;                       // changes the copy only
    for (int n : v) std::cout << n << " ";
    std::cout << "\n";
}

int main() {
    std::vector<int> nums = {1, 2, 3};
    printAll(nums);
    std::cout << nums[0] << "\n";      // still 1 — original untouched
    return 0;
}
```

Copying a 3-element vector is cheap, but copying one with a million elements duplicates all that memory on every call. Changes inside the function don't affect the caller, because they happen on the copy.

---

## Pass by Reference (Modify the Original)

Add `&` and the function works directly on the caller's vector — no copy, and changes stick:

```cpp
#include <iostream>
#include <vector>

void doubleAll(std::vector<int>& v) {   // reference to the original
    for (int& n : v) n *= 2;
}

int main() {
    std::vector<int> nums = {1, 2, 3};
    doubleAll(nums);
    for (int n : nums) std::cout << n << " ";  // 2 4 6
    return 0;
}
```

This is what you want when the function's job is to change the vector — filling it, sorting it, or transforming its contents.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Pass by const Reference (Read-Only, No Copy)

When the function only needs to *read* the vector, use a `const` reference. You get the speed of a reference with a guarantee you won't accidentally modify the data:

```cpp
#include <iostream>
#include <vector>

int sum(const std::vector<int>& v) {   // no copy, can't modify
    int total = 0;
    for (int n : v) total += n;
    return total;
}

int main() {
    std::vector<int> nums = {1, 2, 3, 4};
    std::cout << sum(nums) << "\n";    // 10
    return 0;
}
```

This is the most common and recommended way to pass a vector. The `const` documents your intent and lets the compiler catch mistakes if you try to change the vector by accident.

---

## Returning a Vector

Returning a vector by value is fine in modern C++ — the compiler moves it out instead of copying:

```cpp
std::vector<int> firstN(int n) {
    std::vector<int> v;
    for (int i = 0; i < n; i++) v.push_back(i);
    return v;   // efficiently moved, not copied
}
```

Don't contort your code to avoid returning by value; it's both clear and efficient.

---

## Quick Reference

| You want to... | Parameter type |
|----------------|----------------|
| Read only, no copy (default choice) | `const std::vector<T>&` |
| Modify the caller's vector | `std::vector<T>&` |
| Work on an independent copy | `std::vector<T>` |
| Hand back a new vector | return `std::vector<T>` by value |

The rule of thumb: pass by `const` reference unless you have a specific reason not to.

---

## Related Articles

- [C++ Pass by Value vs Reference](/posts/cpp-pass-by-value-reference/) — the core concept
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — everything about std::vector
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — parameters and return values
- [C++ Reference vs Pointer](/posts/cpp-reference-vs-pointer/) — two ways to refer to data

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
