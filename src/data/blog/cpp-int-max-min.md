---
title: "INT_MAX and INT_MIN in C++: The Maximum and Minimum int Value"
description: "The maximum value of an int in C++ is 2147483647 and the minimum is -2147483648. How to get them with INT_MAX, INT_MIN and numeric_limits, plus overflow traps."
pubDatetime: 2026-09-18T00:00:00Z
author: "Sahil"
tags: ["C++", "data-types", "beginner", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "What is the maximum value of an int in C++?"
    answer: "On virtually every modern platform a 32-bit int holds up to 2,147,483,647. Get it in code with INT_MAX from the climits header or std::numeric_limits max() for int from the limits header rather than hard-coding the number."
  - question: "What is the minimum value of an int in C++?"
    answer: "The minimum is -2,147,483,648, available as INT_MIN or std::numeric_limits min() for int. Note the minimum is one further from zero than the maximum, because zero occupies a slot on the positive side."
  - question: "What is the difference between INT_MAX and numeric_limits max() for int?"
    answer: "They give the same value. INT_MAX is a C-style macro from the climits header, while numeric_limits is a C++ template that works with any type, including in generic code where the type is a template parameter."
  - question: "What happens when an int exceeds INT_MAX in C++?"
    answer: "Signed integer overflow is undefined behaviour. In practice the value usually wraps around to INT_MIN, but the compiler is allowed to assume overflow never happens and optimise accordingly, which can produce surprising results. Check before adding rather than after."
---

# INT_MAX and INT_MIN in C++

**Short answer:**

| | Value | How to get it |
|---|---|---|
| Maximum int | **2,147,483,647** | `INT_MAX` or `std::numeric_limits<int>::max()` |
| Minimum int | **−2,147,483,648** | `INT_MIN` or `std::numeric_limits<int>::min()` |

---

## The Two Ways to Get Them

```cpp
#include <iostream>
#include <climits>   // INT_MAX, INT_MIN
#include <limits>    // std::numeric_limits

int main() {
    std::cout << INT_MAX << '\n';   // 2147483647
    std::cout << INT_MIN << '\n';   // -2147483648

    std::cout << std::numeric_limits<int>::max() << '\n';   // same
    std::cout << std::numeric_limits<int>::min() << '\n';   // same
}
```

Both are correct. `INT_MAX` is shorter; `numeric_limits` is the C++ way and works in templates where the type is not known in advance:

```cpp
template <typename T>
T largest() {
    return std::numeric_limits<T>::max();   // INT_MAX can't do this
}
```

**Never hard-code `2147483647`.** It is not guaranteed by the standard — `int` is only required to hold at least ±32,767 — and a literal number hides its meaning from anyone reading your code.

## Why the Minimum Is One Bigger

Look closely and the range is asymmetric:

```
INT_MIN = -2,147,483,648
INT_MAX =  2,147,483,647
```

A 32-bit signed int stores 2³² = 4,294,967,296 distinct values. Half are negative, and the other half must cover zero **and** the positives — so the positive side loses one slot to zero. This is a consequence of two's complement representation, which is what essentially every machine uses.

It leads to a genuinely surprising result:

```cpp
std::cout << -INT_MIN;      // still negative! Undefined behaviour.
std::abs(INT_MIN);          // also undefined
```

There is no positive int equal to `-INT_MIN`, so negating it overflows.

<div class="inline-cta"><strong>Learning C++ properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers types, memory and the STL in plain English — 87 pages, just $19.</div>

## Limits for Other Integer Types

```cpp
#include <climits>
#include <limits>

std::cout << SHRT_MAX  << '\n';   // 32767
std::cout << LONG_MAX  << '\n';   // platform dependent
std::cout << LLONG_MAX << '\n';   // 9223372036854775807
std::cout << UINT_MAX  << '\n';   // 4294967295

std::cout << std::numeric_limits<long long>::max() << '\n';
std::cout << std::numeric_limits<unsigned>::max()  << '\n';
```

Note `long` is 64-bit on Linux and macOS but 32-bit on Windows. If you need a guaranteed width, use the fixed-size types:

```cpp
#include <cstdint>

std::int32_t a;    // exactly 32 bits everywhere
std::int64_t b;    // exactly 64 bits everywhere
```

## What Overflow Actually Does

```cpp
int big = INT_MAX;
big = big + 1;
std::cout << big;      // usually -2147483648
```

In practice the value wraps to `INT_MIN`. But this is **undefined behaviour**, not a defined wrap — the standard lets the compiler assume signed overflow never happens. That means optimisers can delete checks you thought were protecting you:

```cpp
// The compiler may remove this entirely!
if (x + 1 < x) { /* "overflow happened" */ }
```

Because `x + 1 < x` can only be true after overflow, and overflow "cannot happen", the branch is dead code by the compiler's reasoning.

## Checking Before You Overflow

Test with subtraction so the overflow never occurs:

```cpp
bool safeAdd(int a, int b, int& result) {
    if (b > 0 && a > INT_MAX - b) return false;   // would overflow
    if (b < 0 && a < INT_MIN - b) return false;   // would underflow
    result = a + b;
    return true;
}
```

Or use the compiler builtins, available in GCC and Clang:

```cpp
int result;
if (__builtin_add_overflow(a, b, &result)) {
    // overflow detected safely
}
```

## Unsigned Wraps Instead

Unsigned overflow is **defined** — it wraps modulo 2ⁿ:

```cpp
unsigned int u = 0;
u = u - 1;
std::cout << u;        // 4294967295 — defined, not UB
```

That is why counting down a `size_t` loop to below zero produces an enormous number rather than −1, a trap covered in [reversing a vector](/posts/cpp-reverse-vector/) and [string length](/posts/cpp-string-length/).

## Using INT_MAX as a Sentinel

A common pattern when searching for a minimum:

```cpp
int smallest = INT_MAX;
for (int v : values) {
    if (v < smallest) smallest = v;
}
```

It works, but `std::min_element` says it more clearly — see [finding the max and min](/posts/cpp-find-max-min/). And beware: if the container is empty you are left holding `INT_MAX`, which is rarely what you want to display.

## Quick Reference

| Type | Max macro | numeric_limits |
|---|---|---|
| `int` | `INT_MAX` | `numeric_limits<int>::max()` |
| `int` (min) | `INT_MIN` | `numeric_limits<int>::min()` |
| `short` | `SHRT_MAX` | `numeric_limits<short>::max()` |
| `long long` | `LLONG_MAX` | `numeric_limits<long long>::max()` |
| `unsigned` | `UINT_MAX` | `numeric_limits<unsigned>::max()` |

---

## Take Your C++ Further

If you want types, memory and the rest of the fundamentals explained properly, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers them in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [INT_MAX and numeric_limits in C++](/posts/cpp-numeric-limits/) — the full numeric_limits reference.
- [Maximum Value of a double in C++](/posts/cpp-double-max/) — the floating-point equivalent.
- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — picking the right type in the first place.
- [How to Find the Maximum and Minimum in C++](/posts/cpp-find-max-min/) — max of a collection, not a type.
- [C++ String Length: size() vs length()](/posts/cpp-string-length/) — another unsigned-overflow trap.
