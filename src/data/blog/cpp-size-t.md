---
title: "What Is size_t in C++? The Type for Sizes and Indexing"
description: "What is size_t in C++? It's an unsigned integer type for sizes, lengths, and indexes. Learn what it means, why loops use it, and the unsigned pitfalls to avoid."
pubDatetime: 2026-07-29T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "data-types", "tutorial"]
faqSchema:
  - question: "What is size_t in C++?"
    answer: "size_t is an unsigned integer type designed to hold the size of any object in memory. It is the type returned by the sizeof operator and by container size() functions like vector::size(). Because it is unsigned, it can never hold a negative value."
  - question: "Why use size_t instead of int?"
    answer: "size_t is guaranteed to be large enough to represent the size of the biggest possible object, which int is not. Using size_t for sizes and indexes avoids overflow on large containers and matches the type the standard library already returns."
  - question: "What happens if you compare size_t with a negative int?"
    answer: "The negative int gets converted to a huge unsigned value before the comparison, which produces surprising results. This is the most common size_t bug, so avoid mixing signed and unsigned values in the same comparison."
draft: false
featured: false
---

# What Is size_t in C++? The Type for Sizes and Indexing

If you've ever written a loop over a `vector` and seen a warning about "comparison between signed and unsigned," you've already bumped into `size_t`. It's an **unsigned integer type built specifically to represent sizes and indexes**, and understanding it clears up a whole category of confusing warnings.

---

## What size_t Actually Is

`size_t` is an unsigned integer type defined in headers like `<cstddef>`. "Unsigned" means it can only hold zero and positive numbers — never negatives. That makes sense, because the things it measures (the size of an array, the length of a string, an index into a container) are never negative.

It is the type returned by the `sizeof` operator:

```cpp
#include <iostream>
using namespace std;

int main() {
    size_t s = sizeof(int);
    cout << "An int is " << s << " bytes\n";
    return 0;
}
```

It is also the type returned by the `.size()` member function of standard containers like `vector`, `string`, and `map`.

---

## Why Not Just Use int?

Two reasons.

First, **size**. `size_t` is guaranteed to be big enough to represent the size of the largest object your system can create. A plain `int` is often only 4 bytes (max ~2.1 billion), which is not enough to index every element of a very large container on a 64-bit machine. `size_t` scales with the platform.

Second, **matching the standard library**. Since `.size()` already returns `size_t`, using it for your loop counters means no conversions and no warnings:

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {10, 20, 30, 40};

    for (size_t i = 0; i < nums.size(); i++) {
        cout << "nums[" << i << "] = " << nums[i] << "\n";
    }
    return 0;
}
```

Because `i` and `nums.size()` are both `size_t`, the comparison is clean and the compiler stays quiet. This is efficient because you avoid the hidden signed-to-unsigned conversion that happens when you use `int i` instead.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Classic size_t Trap

Because `size_t` is unsigned, subtracting past zero doesn't give you a negative number — it **wraps around** to a gigantic value. This bites people who count backwards:

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};

    // BUG: when i is 0, i-- wraps to a huge number, not -1
    for (size_t i = v.size() - 1; i >= 0; i--) {
        cout << v[i] << " ";
    }
    // This loop never ends!
    return 0;
}
```

The condition `i >= 0` is *always true* for an unsigned type, so the loop runs forever (and reads out of bounds). Two safe fixes:

```cpp
// Option 1: loop with an offset so the counter stays positive
for (size_t i = v.size(); i > 0; i--) {
    cout << v[i - 1] << " ";
}

// Option 2 (C++11+): use a range-based loop and reverse iterators
for (auto it = v.rbegin(); it != v.rend(); ++it) {
    cout << *it << " ";
}
```

---

## Mixing Signed and Unsigned

The other common surprise is comparing a `size_t` with a negative `int`:

```cpp
int a = -1;
size_t b = 5;

if (a < b) {          // looks true...
    cout << "a is less\n";
} else {
    cout << "b is less\n";   // ...but THIS often prints
}
```

Before the comparison, `-1` is converted to a `size_t`, which turns it into a massive positive number. The lesson: **don't mix signed and unsigned values in comparisons.** Keep sizes and indexes as `size_t` and keep genuinely-can-be-negative values as `int`.

---

## Quick Reference

| Question | Answer |
|----------|--------|
| Signed or unsigned? | Unsigned (never negative) |
| Where is it from? | `<cstddef>` (and pulled in by many headers) |
| What returns it? | `sizeof`, `.size()`, `strlen`, and more |
| When to use it | Sizes, lengths, and container indexes |
| Biggest gotcha | Wrap-around when counting below zero |

---

## The Takeaway

Use `size_t` whenever you're dealing with the size of something or indexing into a container, and keep signed and unsigned values on separate sides of your logic. Do that and the "signed/unsigned mismatch" warnings — along with the infinite loops they hide — simply go away.

---

## Related Articles

- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — where int, unsigned, and friends fit in
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — for, while, and do-while explained
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — the container whose size() returns size_t
- [C++ sizeof Operator](/posts/cpp-sizeof-operator/) — the operator that produces a size_t
- [C++ Range-Based For Loop](/posts/cpp-range-based-for-loop/) — often the cleanest way to avoid index bugs

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
