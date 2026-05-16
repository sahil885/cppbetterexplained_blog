---
title: "C++ Array vs Vector: Which One Should You Use?"
description: "Learn the differences between C++ arrays and vectors. This guide explains when to use std::vector vs raw arrays, with examples, performance notes, and a clear recommendation for beginners."
pubDatetime: 2026-05-16T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "arrays", "vectors", "STL", "tutorial"]
faqSchema:
  - question: "Should I use array or vector in C++?"
    answer: "For most purposes, prefer std::vector. Vectors resize automatically, work with STL algorithms, are safe to pass to functions, and have no gotchas around size and decay. Use raw arrays only when you have a fixed-size collection known at compile time and performance is critical, or when interfacing with C APIs."
  - question: "What is the difference between an array and a vector in C++?"
    answer: "A C++ array has a fixed size set at compile time and doesn't track its own size. A std::vector has a dynamic size that grows automatically, knows its own size (.size()), and manages its own memory. Vectors are safer and easier to use; arrays are slightly faster in some constrained scenarios."
  - question: "Is std::vector slower than an array in C++?"
    answer: "In practice, the performance difference is negligible for most programs. Vectors use heap allocation and store a size/capacity counter, while arrays can live on the stack. For tight loops with small fixed-size collections, arrays can be marginally faster — but modern compilers often optimize vectors to be just as fast."
draft: false
featured: false
---

# C++ Array vs Vector: Which One Should You Use?

C++ gives you two main ways to store sequences of values: old-style arrays inherited from C, and `std::vector` from the standard library. Beginners often wonder which to use.

The short answer: **use `std::vector` by default**. Here's why — and when arrays are the right choice.

---

## The Key Differences

### Fixed Size vs Dynamic Size

Arrays have a fixed size set at compile time:

```cpp
int arr[5];       // Always exactly 5 integers
arr[5] = 10;      // Out of bounds — undefined behavior, no error
```

Vectors grow automatically:

```cpp
vector<int> v;    // Starts empty
v.push_back(1);   // Now has 1 element
v.push_back(2);   // Now has 2 elements
v.push_back(3);   // Now has 3 elements
// v grows as needed — no size limit
```

### Size Tracking

Arrays don't know their own size:

```cpp
int arr[5] = {1, 2, 3, 4, 5};
// No arr.size() — you must track the size yourself
int size = 5;  // Manual tracking is error-prone
```

Vectors always know their size:

```cpp
vector<int> v = {1, 2, 3, 4, 5};
cout << v.size();  // 5 — always accurate
```

### Function Parameter Decay

Arrays "decay" to pointers when passed to functions, losing their size:

```cpp
void print(int arr[], int size) {  // Must pass size separately
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
}

int arr[5] = {1, 2, 3, 4, 5};
print(arr, 5);  // Must manually pass the size
```

Vectors pass cleanly and keep their size:

```cpp
void print(const vector<int>& v) {  // v.size() works inside
    for (int x : v) {
        cout << x << " ";
    }
}

vector<int> v = {1, 2, 3, 4, 5};
print(v);  // Size travels with the vector
```

### Bounds Checking

Arrays do not check bounds at all:

```cpp
int arr[3] = {1, 2, 3};
cout << arr[10];  // No error — reads garbage memory (or crashes)
```

Vectors offer `.at()` with bounds checking:

```cpp
vector<int> v = {1, 2, 3};
cout << v[10];    // No error — reads garbage (same as array)
cout << v.at(10); // Throws std::out_of_range exception
```

---

## Memory: Stack vs Heap

**Arrays (local)** live on the stack:

```cpp
int arr[1000];  // 4,000 bytes on the stack (may overflow for very large arrays)
```

**Vectors** store their data on the heap:

```cpp
vector<int> v(1000);  // 4,000 bytes on the heap (no stack limit issue)
```

Stack space is limited (typically 1–8 MB). For large collections, vectors are safer.

---

## Common Operations Compared

| Operation | Array | Vector |
|-----------|-------|--------|
| Declare with size | `int arr[5]` | `vector<int> v(5)` |
| Initialize with values | `int arr[] = {1,2,3}` | `vector<int> v = {1,2,3}` |
| Access element | `arr[i]` | `v[i]` or `v.at(i)` |
| Get size | `sizeof(arr)/sizeof(arr[0])` | `v.size()` |
| Add element | Not possible (fixed size) | `v.push_back(x)` |
| Remove last | Not applicable | `v.pop_back()` |
| Iterate | `for (int i=0; i<5; i++)` | Range-for or iterator |
| Pass to function | Decays to pointer | Passes by reference cleanly |
| Sort | `sort(arr, arr+5)` | `sort(v.begin(), v.end())` |

---

## When to Use Each

**Use `std::vector` when:**
- You don't know the size at compile time
- The size might change
- You're writing a function that accepts a sequence
- You want the convenience of `.size()`, `.push_back()`, `.erase()`
- You want STL algorithm compatibility

**Use arrays when:**
- Size is fixed and known at compile time
- You need stack allocation for maximum performance in tight loops
- You're interfacing with a C API that requires a raw array
- You're writing embedded or systems code where heap allocation is avoided

**Use `std::array` (the best of both worlds) when:**
- Size is fixed and known at compile time
- You want value semantics and STL compatibility with no heap overhead

```cpp
#include <array>
array<int, 5> a = {1, 2, 3, 4, 5};  // Fixed size, but has .size(), works with STL
cout << a.size();  // 5
sort(a.begin(), a.end());
```

`std::array` is a fixed-size array wrapped in a class — it has all the STL benefits without dynamic allocation.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Practical Example: Comparing the Two

**With array:**
```cpp
#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    int scores[5] = {85, 92, 78, 95, 88};
    int size = 5;

    sort(scores, scores + size);

    for (int i = 0; i < size; i++) {
        cout << scores[i] << " ";
    }
    return 0;
}
```

**With vector:**
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> scores = {85, 92, 78, 95, 88};

    sort(scores.begin(), scores.end());

    for (int score : scores) {
        cout << score << " ";
    }
    return 0;
}
```

The vector version is cleaner — no manual size tracking, range-based for loop works, and you could add `scores.push_back(100)` at any point.

---

## The Recommendation

For beginners: **start with `std::vector`**. It's the right tool for almost every situation you'll encounter. Switch to raw arrays only when you have a specific reason — and consider `std::array` as a middle ground when you need fixed size with STL compatibility.

---

## Related Articles

- [C++ Arrays Tutorial](/posts/cpp-arrays-tutorial/) — how arrays work from scratch
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — the complete guide to std::vector
- [C++ STL Containers Explained](/posts/stl-containers-cpp/) — choosing between vector, list, set, and more
- [Memory Management in C++](/posts/memory-management-cpp/) — stack vs heap

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
