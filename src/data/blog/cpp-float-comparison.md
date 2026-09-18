---
title: "How to Compare Floating-Point Numbers in C++ (Why == Fails)"
description: "Why 0.1 + 0.2 != 0.3 in C++, and how to compare doubles correctly with an epsilon tolerance. Includes a reusable almostEqual function and when exact == is fine."
pubDatetime: 2026-09-18T00:00:00Z
author: "Sahil"
tags: ["C++", "data-types", "beginner", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "Why does 0.1 + 0.2 not equal 0.3 in C++?"
    answer: "Because 0.1 and 0.2 cannot be stored exactly in binary floating point, just as one third cannot be written exactly in decimal. The tiny representation errors add up, so the sum is 0.30000000000000004 rather than 0.3."
  - question: "How do you compare two doubles in C++?"
    answer: "Compare the absolute difference against a small tolerance instead of using ==. A robust version scales the tolerance with the magnitude of the values: std::fabs(a-b) <= epsilon * std::max(std::fabs(a), std::fabs(b))."
  - question: "Is it ever safe to use == on floating-point numbers?"
    answer: "Yes, when comparing against a value you assigned directly with no arithmetic in between, or when checking a sentinel such as infinity. It is arithmetic, especially repeated arithmetic, that introduces the error that makes == unreliable."
  - question: "What is machine epsilon in C++?"
    answer: "std::numeric_limits epsilon() for double is the smallest difference from 1.0 that a double can represent, about 2.22e-16. It is the right starting point for a tolerance, but it must be scaled by the size of the numbers being compared."
---

# How to Compare Floating-Point Numbers in C++

**Short answer:** do not use `==`. Compare the difference against a tolerance:

```cpp
#include <cmath>
#include <limits>

bool almostEqual(double a, double b) {
    double diff = std::fabs(a - b);
    double scale = std::max(std::fabs(a), std::fabs(b));
    return diff <= std::numeric_limits<double>::epsilon() * scale * 4;
}
```

---

## The Problem, Demonstrated

```cpp
#include <iostream>
#include <iomanip>

int main() {
    double a = 0.1 + 0.2;

    std::cout << (a == 0.3) << '\n';                    // 0 — false!
    std::cout << std::setprecision(20) << a << '\n';    // 0.30000000000000004441
}
```

This is not a C++ bug, and it is not your compiler. Every language using IEEE 754 doubles behaves the same way — Python, JavaScript, Java, C#.

## Why It Happens

Binary fractions can represent halves, quarters and eighths exactly. They cannot represent one tenth, for the same reason decimal cannot represent one third — writing 0.333… never terminates.

So `0.1` in a double is not 0.1. It is the nearest representable binary value, which is very slightly off. Add two such approximations and the errors compound into something visible.

Integers up to 2⁵³ are stored exactly, which is why this surprise only appears with fractions.

<div class="inline-cta"><strong>Learning C++ properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers types, precision and the STL in plain English — 87 pages, just $19.</div>

## The Naive Fix, and Why It Is Not Enough

```cpp
// works for small numbers, fails for large ones
bool almostEqual(double a, double b) {
    return std::fabs(a - b) < 0.00001;
}
```

A fixed tolerance breaks down as magnitudes grow. At around 10¹⁶, consecutive doubles are more than 1 apart, so two genuinely different values can never differ by less than 0.00001 — and two identical-in-practice values may differ by far more.

## The Scaled Tolerance Version

```cpp
#include <algorithm>
#include <cmath>
#include <limits>

bool almostEqual(double a, double b, double factor = 4.0) {
    double diff = std::fabs(a - b);
    if (diff <= std::numeric_limits<double>::min()) return true;  // both ~0

    double scale = std::max(std::fabs(a), std::fabs(b));
    return diff <= std::numeric_limits<double>::epsilon() * scale * factor;
}

int main() {
    std::cout << almostEqual(0.1 + 0.2, 0.3) << '\n';       // 1
    std::cout << almostEqual(1e16, 1e16 + 1) << '\n';       // 1 — indistinguishable
    std::cout << almostEqual(1.0, 1.1) << '\n';             // 0
}
```

The tolerance now grows with the numbers, so it behaves sensibly at any magnitude. The `factor` controls how many representable steps apart you will still call "equal" — 4 is a reasonable default for ordinary arithmetic.

Note the early return: when both values are essentially zero, the scaled tolerance collapses to zero and would reject them, so that case needs handling separately.

## Comparing Against Zero

Zero is the one case where a scaled tolerance cannot work, because there is no magnitude to scale by. Use a small absolute tolerance chosen for your problem:

```cpp
bool isZero(double x, double tolerance = 1e-12) {
    return std::fabs(x) < tolerance;
}
```

What counts as "small" depends entirely on your domain — 1e-12 is meaningless if you are working in nanometres.

## When == Is Actually Fine

Exact comparison is correct when no arithmetic has happened:

```cpp
double x = 3.14;
if (x == 3.14) { ... }              // fine — same literal, no computation

double v = getSentinel();
if (v == std::numeric_limits<double>::infinity()) { ... }   // fine
```

It is arithmetic — especially repeated arithmetic in loops — that accumulates the error.

## The NaN Exception

Not-a-number is never equal to anything, including itself:

```cpp
double nan = std::numeric_limits<double>::quiet_NaN();

std::cout << (nan == nan) << '\n';      // 0
std::cout << std::isnan(nan) << '\n';   // 1 — the correct test
```

That self-inequality is actually the classic trick for detecting NaN without `<cmath>`.

## Avoid Accumulating Error in Loops

```cpp
// error grows with every iteration
for (double t = 0.0; t != 1.0; t += 0.1) { ... }   // may never terminate!

// count in integers instead
for (int i = 0; i < 10; ++i) {
    double t = i * 0.1;
}
```

The first loop can run forever because `t` never lands exactly on 1.0. Counting with an integer and deriving the double each time keeps the error from compounding.

## When to Use a Different Type Entirely

For money, do not use `double` at all. Store cents as an integer:

```cpp
long long cents = 1999;      // $19.99 — exact
```

Floating point is for measurement and science, where small relative error is acceptable. Currency needs exact decimal arithmetic.

## Quick Reference

| Goal | Code |
|---|---|
| Compare two doubles | `almostEqual(a, b)` from above |
| Compare against zero | `std::fabs(x) < 1e-12` |
| Detect NaN | `std::isnan(x)` |
| Detect infinity | `std::isinf(x)` |
| Machine epsilon | `numeric_limits<double>::epsilon()` |
| Money | use integer cents, not double |

---

## Take Your C++ Further

If you want precision, types and the rest of the fundamentals explained properly, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers them in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [Maximum Value of a double in C++](/posts/cpp-double-max/) — range, epsilon and infinity.
- [C++ float vs double](/posts/cpp-float-vs-double/) — which to use and why.
- [INT_MAX and INT_MIN in C++](/posts/cpp-int-max-min/) — the integer limits.
- [Integer Division in C++](/posts/cpp-integer-division/) — the other classic arithmetic surprise.
- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — the wider type picture.
