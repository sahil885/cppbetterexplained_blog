---
title: "How to Fix 'vector subscript out of range' in C++"
description: "Fix vector subscript out of range and std::out_of_range errors in C++. The five usual causes, with code, and how to find the bad index fast."
pubDatetime: 2026-10-17T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "vectors"]
draft: false
featured: false
faqSchema:
  - question: "What does vector subscript out of range mean?"
    answer: "Your program used an index that does not exist in the vector. Valid indexes run from 0 to size() minus 1, so a 5-element vector has no element 5, and an empty vector has no elements at all. Visual Studio's Debug build stops the program when this happens."
  - question: "How do I fix vector subscript out of range in a for loop?"
    answer: "Loop while i is less than v.size(), not less than or equal to it. Or switch to a range-based for loop, which can never go past the end."
  - question: "What is the difference between v[i] and v.at(i)?"
    answer: "v.at(i) checks the index and throws std::out_of_range if it is invalid. v[i] does not check in normal builds, so a bad index reads or writes memory it should not, which is undefined behaviour. Visual Studio only checks [] in Debug builds."
  - question: "Why doesn't my program crash with GCC when the index is out of range?"
    answer: "GCC does not check [] by default, so the program may print a garbage value, crash later, or appear to work. Use .at() while debugging, or compile with -D_GLIBCXX_ASSERTIONS to make [] check its index."
---

# How to Fix "vector subscript out of range" in C++

**Short answer:** your code used an index that doesn't exist in the vector. A vector with 5 elements has indexes **0 to 4** — asking for element 5, or for anything at all in an empty vector, is out of range. The usual culprits are `<=` in a loop, an empty vector, and mixing up `reserve()` with `resize()`.

What you see depends on your compiler and on how you accessed the element:

| Where | What you see |
|---|---|
| Visual Studio (Debug build) | A **Debug Assertion Failed!** window with `Expression: vector subscript out of range` |
| GCC, using `.at()` | `terminate called after throwing an instance of 'std::out_of_range'` |
| Clang on macOS, using `.at()` | `libc++abi: terminating due to uncaught exception of type std::out_of_range: vector` |
| GCC, using `[]` | Often **nothing** — a garbage value, or a crash with `Segmentation fault` |

That last row is the dangerous one: the same bug that stops Visual Studio can run silently with GCC.

---

## Why Indexes Stop at size() - 1

Indexes count from zero, so the last valid index is always one less than the size:

```
scores:  [ 90 | 85 | 77 | 64 | 58 ]
index:      0    1    2    3    4      size() is 5, so there is no index 5
```

Every cause below is a different way of asking for an index outside that range.

## Cause 1: <= Instead of < in a Loop

The most common one by far:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {90, 85, 77, 64, 58};
    for (int i = 0; i <= scores.size(); ++i) {
        std::cout << scores[i] << '\n';
    }
}
```

On the last pass `i` is 5, so the loop reads `scores[5]`. Visual Studio stops with the assertion. GCC printed this — note the made-up sixth value:

```
90
85
77
64
58
0
```

**Fix:** use `<`, or let a range-based for loop do the counting:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {90, 85, 77, 64, 58};

    for (std::size_t i = 0; i < scores.size(); ++i) {   // < not <=
        std::cout << scores[i] << '\n';
    }

    for (int s : scores) {   // or let a range-based for loop do the counting
        std::cout << s << '\n';
    }
}
```

A [range-based for loop](/posts/cpp-range-based-for-loop/) can't go out of range, so use it whenever you don't need the index.

<div class="inline-cta"><strong>Learning C++ from scratch?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> explains the fundamentals — and the parts that trip most beginners up, like pointers, memory and OOP — in 87 plain-English pages. Just $19.</div>

## Cause 2: Indexing an Empty Vector

A vector starts empty. `[]` can read and change elements, but it can't **create** them:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores;   // empty: size() is 0
    scores[0] = 90;            // there is no element 0
    std::cout << scores[0] << '\n';
}
```

With GCC this crashed with `Segmentation fault`. In Visual Studio it's the subscript assertion — or `front() called on empty vector` / `back() called on empty vector` if you used those.

**Fix:** add elements with `push_back()`, or create the vector with a size:

```cpp
std::vector<int> scores;
scores.push_back(90);          // now scores[0] exists

std::vector<int> totals(5);    // five elements, all 0
totals[4] = 100;               // fine
```

And check before you read from a vector that might be empty: `if (!scores.empty()) { ... }`.

## Cause 3: reserve() Doesn't Create Elements

This one looks correct, which is what makes it confusing:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores;
    scores.reserve(5);              // makes room, but size() is still 0
    std::cout << scores.size() << '\n';
    scores.at(0) = 90;              // out of range
}
```

```
0
terminate called after throwing an instance of 'std::out_of_range'
  what():  vector::_M_range_check: __n (which is 0) >= this->size() (which is 0)
```

`reserve(5)` only sets aside memory for future elements. The vector still has **zero** elements. `resize(5)` is the one that creates them:

| Call | size() afterwards | Can you use `v[0]` to `v[4]`? |
|---|---|---|
| `v.reserve(5)` | 0 | No |
| `v.resize(5)` | 5 | Yes |
| `std::vector<int> v(5);` | 5 | Yes |

## Cause 4: size() - 1 on an Empty Vector

`size()` returns an **unsigned** number, which can't go below zero. Subtract 1 from an empty vector's size and it wraps around to a huge value:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores;   // empty
    std::cout << scores.size() - 1 << '\n';
}
```

```
18446744073709551615
```

So a loop written as `i <= scores.size() - 1` runs far past the end of an empty vector instead of not running at all. **Fix:** write `i < scores.size()`, which is correct for empty vectors too.

## Cause 5: Erasing Elements Inside an Index Loop

Removing elements makes the vector shorter, but a loop that saved the old size keeps going:

```cpp
#include <vector>

int main() {
    std::vector<int> scores = {55, 85, 40, 64, 58};
    const std::size_t count = scores.size();   // 5, but the vector is about to shrink

    for (std::size_t i = 0; i < count; ++i) {
        if (scores[i] < 60) {
            scores.erase(scores.begin() + i);  // removes an element: size() drops
        }
    }
}
```

After three erases the vector has 2 elements, but the loop still asks for index 3. With GCC this crashed with `Segmentation fault`. It also skips the element after each one it erases — a second bug hiding inside the first.

**Fix:** let the library do the removing. In C++20:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {55, 85, 40, 64, 58};

    std::erase_if(scores, [](int s) { return s < 60; });   // C++20

    for (int s : scores) std::cout << s << ' ';   // 85 64
    std::cout << '\n';
}
```

For older standards and more options, see [how to remove elements from a vector](/posts/cpp-remove-from-vector/).

## How to Find the Bad Index Fast

1. **Swap `[i]` for `.at(i)` while debugging.** It checks every access and throws `std::out_of_range` on a bad index — and GCC's message even tells you the index and the size: `__n (which is 5) >= this->size() (which is 5)`.
2. **In Visual Studio, click Retry** on the assertion window. That breaks into the debugger; the **Call Stack** window shows which line of *your* code made the bad access.
3. **With GCC, compile with `-D_GLIBCXX_ASSERTIONS`.** That makes `[]` check its index too, so the silent bug becomes a clear stop: `Assertion '__n < this->size()' failed.`
4. **Step through it.** A debugger shows you the index and the size at the moment it goes wrong — see [debugging with GDB](/posts/debugging-cpp-gdb/).

## Quick Reference

| Cause | Fix |
|---|---|
| `i <= v.size()` in a loop | `i < v.size()`, or a range-based for loop |
| `v[0]` on an empty vector | `push_back()` first, or check `!v.empty()` |
| `reserve(n)` then `v[i]` | Use `resize(n)` or `std::vector<int> v(n)` |
| `v.size() - 1` when empty | Write `i < v.size()` instead |
| `erase()` inside an index loop | `std::erase_if` (C++20), or the erase-remove idiom |
| Can't find the bad line | `.at()`, Visual Studio's Retry, or `-D_GLIBCXX_ASSERTIONS` |

---

## Take Your C++ Further

Out-of-range errors stop being mysterious once you can picture how a vector sits in memory. The **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** explains the fundamentals in plain English, then the parts that really trip beginners up — pointers, memory and OOP. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — how vectors work, from the start.
- [Segmentation Fault in C++](/posts/cpp-segmentation-fault/) — the crash an out-of-range index often turns into.
- [Range-Based For Loops in C++](/posts/cpp-range-based-for-loop/) — loops that can't go out of range.
- [How to Remove Elements From a Vector](/posts/cpp-remove-from-vector/) — erasing without breaking your loop.
- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the other errors beginners hit most.
