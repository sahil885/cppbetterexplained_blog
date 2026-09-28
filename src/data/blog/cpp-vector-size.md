---
title: "How to Get the Size of a Vector in C++"
description: "Use v.size() to get the number of elements in a C++ vector. Covers size vs capacity, the unsigned size_t trap, empty(), and 2D vectors."
pubDatetime: 2026-09-28T00:00:00Z
author: "Sahil"
tags: ["C++", "vector", "STL", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "How do you get the size of a vector in C++?"
    answer: "Call the size() member function: v.size() returns the number of elements currently stored in the vector. It runs in constant time, so it is safe to call inside a loop condition."
  - question: "What is the difference between size() and capacity() in C++?"
    answer: "size() is how many elements the vector actually holds. capacity() is how many it could hold before it needs to allocate more memory. capacity is always greater than or equal to size."
  - question: "Why does comparing v.size() to a negative number behave strangely?"
    answer: "size() returns an unsigned type, size_t. Comparing it against a signed negative value converts the negative number to a huge positive one, so the comparison is true when you expect it to be false."
  - question: "Is there a length() function for vectors in C++?"
    answer: "No. std::string has both size() and length(), but std::vector only has size(). Use v.size() for vectors."
---

# How to Get the Size of a Vector in C++

**Short answer:** call `.size()`.

```cpp
std::vector<int> v = {10, 20, 30};
std::cout << v.size();      // 3
```

There is no `length()` for vectors — that's a `std::string` thing.

---

## The Basic Call

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {88, 95, 72, 61};

    std::cout << "Elements: " << scores.size() << '\n';   // 4

    scores.push_back(100);
    std::cout << "Elements: " << scores.size() << '\n';   // 5

    scores.pop_back();
    std::cout << "Elements: " << scores.size() << '\n';   // 4
}
```

`size()` always reflects the current number of elements. It's a constant-time lookup — the vector stores the count — so calling it in a loop condition costs nothing.

## Looping With size()

```cpp
for (std::size_t i = 0; i < v.size(); ++i) {
    std::cout << v[i] << '\n';
}
```

Note `std::size_t`, not `int`. That matters, and the next section explains why.

If you don't need the index, the range-based loop is cleaner and avoids the issue entirely:

```cpp
for (const auto& x : v) {
    std::cout << x << '\n';
}
```

<div class="inline-cta"><strong>Learning C++ properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers vectors, the STL and memory in plain English — 87 pages, just $19.</div>

## The Unsigned Trap

`size()` returns `std::size_t`, which is **unsigned** — it can never be negative. That produces one of the classic C++ surprises:

```cpp
std::vector<int> v;                 // empty

for (int i = 0; i < v.size() - 1; ++i) {
    std::cout << v[i];              // runs billions of times!
}
```

`v.size()` is `0`. `0 - 1` on an unsigned type doesn't give `-1` — it wraps around to the largest possible `size_t`, about 18 quintillion. The loop runs and reads far out of bounds.

Two safe fixes:

```cpp
// 1. Compare without subtracting
for (std::size_t i = 0; i + 1 < v.size(); ++i) { ... }

// 2. Guard first
if (!v.empty()) {
    for (std::size_t i = 0; i < v.size() - 1; ++i) { ... }
}
```

The same wrap-around bites when you count downwards. See [size_t in C++](/posts/cpp-size-t/) for the full explanation.

## Use empty() to Check for Emptiness

```cpp
if (v.empty()) {                    // clearer than v.size() == 0
    std::cout << "Nothing here\n";
}
```

`empty()` says what you mean, and on some containers it is faster than computing the size. Prefer it.

## size() vs capacity()

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v;
    v.reserve(100);

    v.push_back(1);
    v.push_back(2);

    std::cout << "size:     " << v.size() << '\n';       // 2
    std::cout << "capacity: " << v.capacity() << '\n';    // 100
}
```

- **`size()`** — how many elements are actually in the vector.
- **`capacity()`** — how many it can hold before reallocating.

`reserve()` changes capacity, not size. `resize()` changes size. Mixing them up is a common bug — [reserve vs resize](/posts/cpp-vector-reserve-vs-resize/) covers it properly.

## Size of a 2D Vector

```cpp
std::vector<std::vector<int>> grid = {
    {1, 2, 3},
    {4, 5, 6}
};

std::cout << grid.size() << '\n';       // 2  — number of rows
std::cout << grid[0].size() << '\n';    // 3  — columns in row 0
```

Rows can have different lengths, so there is no single "column count" — ask each row. See [2D vectors in C++](/posts/cpp-2d-vector/).

## Total Bytes, Not Element Count

`sizeof(v)` does **not** give you the data size:

```cpp
std::vector<int> v(1000);
std::cout << sizeof(v);                          // ~24 — just the header
std::cout << v.size() * sizeof(int);             // 4000 — the actual data
```

A vector stores its elements on the heap, so `sizeof` only measures the small bookkeeping object. This is different from a raw array, where `sizeof` does measure the data — see [C++ array length](/posts/cpp-array-size/).

## Quick Reference

| Goal | Code |
|---|---|
| Number of elements | `v.size()` |
| Is it empty? | `v.empty()` |
| Allocated room | `v.capacity()` |
| Change element count | `v.resize(n)` |
| Reserve room only | `v.reserve(n)` |
| Rows in a 2D vector | `grid.size()` |
| Columns in row i | `grid[i].size()` |
| Bytes of data | `v.size() * sizeof(T)` |

---

## Take Your C++ Further

If you want vectors and the rest of the STL explained properly rather than pieced together, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers it in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — the container from the start.
- [reserve vs resize in C++](/posts/cpp-vector-reserve-vs-resize/) — size and capacity in depth.
- [size_t in C++](/posts/cpp-size-t/) — why the unsigned type matters.
- [C++ Array Length](/posts/cpp-array-size/) — the equivalent for raw arrays.
- [C++ 2D Vectors](/posts/cpp-2d-vector/) — grids and nested vectors.
