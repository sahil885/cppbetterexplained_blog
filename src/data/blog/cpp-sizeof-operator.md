---
title: "The sizeof Operator in C++: Find the Size of Any Type"
description: "Learn how the C++ sizeof operator works. Find the size of types, variables, and arrays in bytes, count array elements, and avoid the pointer-decay trap."
pubDatetime: 2026-07-06T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "memory", "tutorial"]
faqSchema:
  - question: "What does the sizeof operator do in C++?"
    answer: "sizeof reports how many bytes a type or variable occupies in memory. For example, sizeof(int) is usually 4. It returns a value of type size_t and is calculated at compile time, so it costs nothing at runtime."
  - question: "How do I count the number of elements in an array with sizeof?"
    answer: "Divide the array's total size by the size of one element: sizeof(arr) / sizeof(arr[0]). This works only where the real array is visible, not after it has decayed to a pointer inside a function."
  - question: "Why does sizeof give the wrong array size inside a function?"
    answer: "When you pass a C-style array to a function it decays into a pointer, so sizeof returns the pointer's size (often 8), not the array's. Pass the length separately, or use std::vector or std::array instead."
draft: false
featured: false
---

# The sizeof Operator in C++

`sizeof` answers a very concrete question: *how many bytes does this take up in memory?* It's a small tool, but it teaches you a lot about how C++ stores data — and it has one famous trap that every beginner should know about.

---

## What sizeof Does

`sizeof` gives you the size, in bytes, of a type or a variable:

```cpp
#include <iostream>

int main() {
    std::cout << sizeof(int) << "\n";     // 4 (on most systems)
    std::cout << sizeof(double) << "\n";  // 8
    std::cout << sizeof(char) << "\n";    // 1 (always)
    std::cout << sizeof(bool) << "\n";    // 1
    return 0;
}
```

You can apply it to a type name in parentheses, like `sizeof(int)`, or directly to a variable:

```cpp
#include <iostream>

int main() {
    double price = 9.99;
    std::cout << sizeof price << "\n";   // 8
    return 0;
}
```

One value is guaranteed: `sizeof(char)` is always `1`. Every other size is measured in units of `char`.

---

## sizeof Is a Compile-Time Operator

Here's something surprising: `sizeof` doesn't run at runtime. The compiler figures out the answer while building your program and drops the number straight into the code. That means it costs **zero** at runtime, and the expression inside it is never actually executed:

```cpp
int x = 5;
std::cout << sizeof(x++);  // prints the size; x is STILL 5 afterward
```

The `x++` is never evaluated — only its *type* is inspected. Good to know so it never surprises you.

---

## Counting the Elements in an Array

A classic use of `sizeof` is figuring out how many items a stack array holds. Divide the whole array's size by the size of one element:

```cpp
#include <iostream>

int main() {
    int scores[] = {90, 85, 72, 60, 95};

    int totalBytes = sizeof(scores);       // 20  (5 ints x 4 bytes)
    int oneElement = sizeof(scores[0]);    // 4
    int count = totalBytes / oneElement;   // 5

    std::cout << "The array has " << count << " elements\n";
    return 0;
}
```

The formula `sizeof(arr) / sizeof(arr[0])` is worth memorizing. It's the traditional way to loop over a raw array without hard-coding the length.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Famous Trap: Arrays Decay to Pointers

Here's where beginners get burned. That counting trick works only where the **real array** is visible. The moment you pass an array to a function, it "decays" into a pointer to its first element — and `sizeof` then measures the *pointer*, not the array:

```cpp
#include <iostream>

void printCount(int arr[]) {
    // arr is really an int* here!
    std::cout << sizeof(arr) / sizeof(arr[0]) << "\n";  // WRONG: prints 2, not 5
}

int main() {
    int scores[] = {90, 85, 72, 60, 95};
    printCount(scores);
    return 0;
}
```

Inside `printCount`, `sizeof(arr)` is the size of a pointer (often 8 bytes), so `8 / 4` gives `2` — a meaningless answer. The fix is to either **pass the length as a separate argument**, or better, use a `std::vector` or `std::array`, which always know their own size:

```cpp
#include <iostream>
#include <vector>

void printCount(const std::vector<int>& v) {
    std::cout << v.size() << "\n";   // 5, correct
}

int main() {
    std::vector<int> scores = {90, 85, 72, 60, 95};
    printCount(scores);
    return 0;
}
```

This is a big reason modern C++ code favors `std::vector` over raw arrays.

---

## sizeof on Structs

For a `struct`, `sizeof` reports the size of the whole thing — which may be a bit larger than the sum of its members because the compiler adds invisible "padding" to keep data aligned in memory:

```cpp
#include <iostream>

struct Point {
    int x;      // 4 bytes
    int y;      // 4 bytes
};

int main() {
    std::cout << sizeof(Point) << "\n";  // 8
    return 0;
}
```

You rarely need to worry about padding as a beginner — just know that `sizeof(struct)` can be a little bigger than you'd expect, and that's normal.

---

## Quick Reference

| Expression | Meaning |
|------------|---------|
| `sizeof(int)` | bytes for the `int` type |
| `sizeof x` | bytes for variable `x` |
| `sizeof(arr) / sizeof(arr[0])` | element count (real array only) |
| `sizeof(ptr)` | size of the pointer, **not** the data |
| `v.size()` | element count for a `std::vector` |

---

## Related Articles

- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — what those bytes are storing
- [How to Find the Size of an Array in C++](/posts/cpp-array-size/) — the full guide
- [How to Use Pointers in C++](/posts/pointers-in-cpp/) — understand pointer decay
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — containers that know their own size
- [C++ Structs Explained](/posts/cpp-structs-explained/) — where padding comes from

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
