---
title: "How to Reverse a Vector in C++ (std::reverse and More)"
description: "Reverse a vector in C++ with std::reverse, reverse iterators, or by building a reversed copy. Includes reversing part of a vector and reversing without a copy."
pubDatetime: 2026-09-11T00:00:00Z
author: "Sahil"
tags: ["C++", "vectors", "STL", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "How do you reverse a vector in C++?"
    answer: "Include <algorithm> and call std::reverse(v.begin(), v.end()). That reverses the vector in place with no extra memory. To keep the original, build a copy from reverse iterators instead."
  - question: "How do you reverse a vector without modifying the original?"
    answer: "Construct a new vector from reverse iterators: std::vector<int> r(v.rbegin(), v.rend()). The original stays untouched and the new vector holds the elements in reverse order."
  - question: "What are rbegin and rend in C++?"
    answer: "rbegin returns a reverse iterator pointing at the last element, and rend points one before the first. Walking from rbegin to rend with ++ moves backwards through the container, which lets you loop in reverse with normal syntax."
  - question: "How do you loop through a vector backwards in C++?"
    answer: "Use a range over reverse iterators: for (auto it = v.rbegin(); it != v.rend(); ++it). Avoid a size_t index counting down to zero, because the unsigned type wraps around and creates an infinite loop."
---

# How to Reverse a Vector in C++

**Short answer:** `std::reverse(v.begin(), v.end())` from `<algorithm>`. It reverses in place, uses no extra memory, and is one line.

---

## Reverse In Place

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5};

    std::reverse(v.begin(), v.end());

    for (int n : v) std::cout << n << ' ';
    // 5 4 3 2 1
}
```

`std::reverse` swaps elements from the two ends inwards, so it costs O(n) time and no extra allocation. This is what you want the vast majority of the time.

## Reverse Into a New Vector

If the original must stay intact, build a copy from reverse iterators:

```cpp
std::vector<int> v = {1, 2, 3, 4, 5};
std::vector<int> r(v.rbegin(), v.rend());

// v: 1 2 3 4 5   (unchanged)
// r: 5 4 3 2 1
```

The two-iterator constructor copies everything between the pair, and because the pair walks backwards the copy comes out reversed. Clean, and no loop needed.

You can also use `std::reverse_copy`:

```cpp
std::vector<int> r(v.size());
std::reverse_copy(v.begin(), v.end(), r.begin());
```

Note the destination must already be big enough — this is why the constructor version is usually nicer.

<div class="inline-cta"><strong>Want the STL explained properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers vectors, iterators and algorithms in plain English — 87 pages, just $19.</div>

## Loop Backwards Without Reversing

Often you do not need to reverse at all — you just need to visit the elements in reverse order:

```cpp
std::vector<int> v = {1, 2, 3, 4, 5};

for (auto it = v.rbegin(); it != v.rend(); ++it) {
    std::cout << *it << ' ';
}
// 5 4 3 2 1
```

`rbegin()` points at the last element and `rend()` points one before the first, so `++it` moves **backwards**. This costs nothing and leaves the vector alone.

## The Unsigned Index Trap

The obvious backwards loop is a classic bug:

```cpp
// BROKEN — infinite loop
for (size_t i = v.size() - 1; i >= 0; --i) {
    std::cout << v[i];
}
```

`size_t` is unsigned, so when `i` is 0 and you decrement it, it wraps around to a gigantic number instead of going negative. `i >= 0` is therefore always true. Worse, on an empty vector `v.size() - 1` is already that gigantic number.

Safe alternatives:

```cpp
// count down with a signed type
for (int i = static_cast<int>(v.size()) - 1; i >= 0; --i) { ... }

// or count up and index from the back
for (size_t i = 0; i < v.size(); ++i) {
    auto& item = v[v.size() - 1 - i];
}

// or just use reverse iterators (best)
for (auto it = v.rbegin(); it != v.rend(); ++it) { ... }
```

## Reverse Only Part of a Vector

`std::reverse` takes any iterator pair, so a sub-range works exactly as you would hope:

```cpp
std::vector<int> v = {1, 2, 3, 4, 5, 6};

std::reverse(v.begin() + 1, v.begin() + 4);
// 1 4 3 2 5 6
```

The range is half-open: `begin()+1` up to but not including `begin()+4`.

## Reversing Other Containers

The same call works on anything with bidirectional iterators:

```cpp
std::string s = "hello";
std::reverse(s.begin(), s.end());     // olleh

int arr[] = {1, 2, 3};
std::reverse(std::begin(arr), std::end(arr));   // 3 2 1

std::list<int> l = {1, 2, 3};
l.reverse();     // list has its own member version — use it
```

`std::list` provides a member `reverse()` that relinks nodes instead of moving values, so prefer it there. For [strings, there is a dedicated guide](/posts/cpp-reverse-string/).

## Quick Reference

| Goal                | Code                                               |
| ------------------- | -------------------------------------------------- |
| Reverse in place    | `std::reverse(v.begin(), v.end())`                 |
| Reversed copy       | `std::vector<int> r(v.rbegin(), v.rend())`         |
| Loop backwards      | `for (auto it = v.rbegin(); it != v.rend(); ++it)` |
| Reverse a sub-range | `std::reverse(v.begin()+a, v.begin()+b)`           |
| Reverse a string    | `std::reverse(s.begin(), s.end())`                 |
| Reverse a list      | `l.reverse()`                                      |

---

## Take Your C++ Further

If you want vectors, iterators and the STL explained properly rather than one function at a time, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers the fundamentals in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ Vector Tutorial: A Complete Guide](/posts/cpp-vector-tutorial/) — the full container reference.
- [C++ Iterators Explained](/posts/cpp-iterators/) — what rbegin and rend actually are.
- [How to Reverse a String in C++](/posts/cpp-reverse-string/) — the same algorithm on text.
- [How to Print a Vector in C++](/posts/cpp-print-vector/) — displaying the result.
- [How to Sort a Vector of Structs](/posts/cpp-sort-vector-of-structs/) — the other common reordering job.
