---
title: "Maximum Value of a double in C++ (DBL_MAX Explained)"
description: "The max value of a double in C++ is about 1.8e308. Get it with DBL_MAX or numeric_limits, and learn why min() is not the most negative value."
pubDatetime: 2026-09-18T00:00:00Z
author: "Sahil"
tags: ["C++", "data-types", "beginner", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "What is the maximum value of a double in C++?"
    answer: "Approximately 1.7976931348623157e308. Get it with DBL_MAX from the cfloat header or std::numeric_limits max() for double from the limits header, rather than writing the literal out."
  - question: "What is the most negative value a double can hold?"
    answer: "Use std::numeric_limits lowest() for double, which returns about -1.8e308. Do not use min() for this: for floating-point types min() returns the smallest positive normal value, roughly 2.2e-308."
  - question: "What is the difference between numeric_limits min and lowest?"
    answer: "For integers they are the same. For floating-point types min() is the smallest positive normal value while lowest() is the most negative value. Using min() when you meant lowest() is a common and quiet bug."
  - question: "What happens if a double exceeds its maximum in C++?"
    answer: "Unlike integers, floating-point overflow is well defined: the result becomes positive or negative infinity rather than wrapping. You can test for it with std::isinf, and check for invalid results with std::isnan."
---

# Maximum Value of a double in C++

**Short answer:**

```cpp
#include <limits>
std::numeric_limits<double>::max()      // ~1.7976931348623157e308
std::numeric_limits<double>::lowest()   // ~-1.7976931348623157e308
std::numeric_limits<double>::min()      // ~2.2250738585072014e-308  (smallest POSITIVE)
```

The third line is the one that catches people — read on.

---

## The Two Ways to Get It

```cpp
#include <iostream>
#include <cfloat>    // DBL_MAX, DBL_MIN
#include <limits>    // std::numeric_limits

int main() {
    std::cout << DBL_MAX << '\n';                            // 1.79769e+308
    std::cout << std::numeric_limits<double>::max() << '\n';  // same
}
```

To print all the digits rather than the default six significant figures:

```cpp
#include <iomanip>

std::cout << std::setprecision(17)
          << std::numeric_limits<double>::max() << '\n';
// 1.7976931348623157e+308
```

## The min() vs lowest() Trap

This is the single most important thing on this page.

```cpp
std::numeric_limits<int>::min()      // -2147483648  — most negative
std::numeric_limits<double>::min()   //  2.2e-308    — smallest POSITIVE
```

For integers, `min()` is the most negative value. For floating-point types, `min()` means *the smallest positive normal number* — a tiny value just above zero, not a large negative one.

So this common pattern is silently wrong:

```cpp
// BROKEN — finds nothing below 2.2e-308
double largest = std::numeric_limits<double>::min();
for (double v : values) {
    if (v > largest) largest = v;
}
// if every value is negative, largest stays at 2.2e-308
```

Use `lowest()`, added in C++11 precisely to fix this:

```cpp
double largest = std::numeric_limits<double>::lowest();   // -1.8e308
```

<div class="inline-cta"><strong>Learning C++ properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers types, memory and the STL in plain English — 87 pages, just $19.</div>

## float and long double

```cpp
std::cout << std::numeric_limits<float>::max()       << '\n';  // ~3.4e38
std::cout << std::numeric_limits<double>::max()      << '\n';  // ~1.8e308
std::cout << std::numeric_limits<long double>::max() << '\n';  // platform dependent
```

The C-style macros are `FLT_MAX`, `DBL_MAX` and `LDBL_MAX` from `<cfloat>`.

Note the enormous jump from `float` to `double` — that is why `double` is the sensible default for general arithmetic, and `float` is reserved for cases where memory or GPU bandwidth genuinely matters.

## Overflow Gives Infinity, Not Wraparound

Integer overflow is undefined behaviour. Floating-point overflow is well defined:

```cpp
#include <cmath>

double big = std::numeric_limits<double>::max();
double bigger = big * 2;

std::cout << bigger << '\n';            // inf
std::cout << std::isinf(bigger) << '\n'; // 1
```

You can also produce infinity deliberately, which is often useful as a sentinel:

```cpp
double inf = std::numeric_limits<double>::infinity();
double smallest = inf;                  // safe starting point for a minimum search
```

And check for the other special value:

```cpp
double nan = 0.0 / 0.0;
std::cout << std::isnan(nan);           // 1

// NaN is not equal to itself — this is the standard test
std::cout << (nan == nan);              // 0
```

## Precision Is Not the Same as Range

A `double` can represent numbers up to 1.8e308, but only with about **15–17 significant digits**. Huge magnitude does not mean exactness:

```cpp
double a = 1e16;
std::cout << std::setprecision(20) << a + 1 << '\n';   // 10000000000000000
```

Adding 1 to 10¹⁶ changes nothing, because the gap between representable doubles at that magnitude is larger than 1. This is also why you should never compare doubles with `==` — see [comparing floating-point numbers](/posts/cpp-float-comparison/).

The relevant constant is `epsilon`:

```cpp
std::cout << std::numeric_limits<double>::epsilon();   // ~2.22e-16
```

That is the smallest difference from 1.0 that the type can represent.

## Checking What Your Platform Uses

```cpp
std::cout << std::numeric_limits<double>::digits10  << '\n';  // 15
std::cout << std::numeric_limits<double>::is_iec559 << '\n';  // 1 = IEEE 754
std::cout << sizeof(double)                         << '\n';  // 8 bytes
```

`is_iec559` confirms the platform follows IEEE 754, which is what makes infinity and NaN behave as described.

## Quick Reference

| You want | Use |
|---|---|
| Largest double | `numeric_limits<double>::max()` |
| Most negative double | `numeric_limits<double>::lowest()` |
| Smallest positive double | `numeric_limits<double>::min()` |
| Infinity | `numeric_limits<double>::infinity()` |
| Comparison tolerance | `numeric_limits<double>::epsilon()` |
| C-style macro | `DBL_MAX` from `<cfloat>` |

---

## Take Your C++ Further

If you want types, precision and the rest of the fundamentals explained properly, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers them in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [INT_MAX and INT_MIN in C++](/posts/cpp-int-max-min/) — the integer equivalent.
- [INT_MAX and numeric_limits in C++](/posts/cpp-numeric-limits/) — the full numeric_limits reference.
- [Comparing Floating-Point Numbers in C++](/posts/cpp-float-comparison/) — why == fails on doubles.
- [C++ float vs double](/posts/cpp-float-vs-double/) — choosing between them.
- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — the wider type picture.
