---
title: "C++ float vs double: Which One Should You Use?"
description: "C++ float vs double explained: float uses 4 bytes and ~7 digits, double uses 8 bytes and ~15. Learn which to pick and why double is the safer default."
pubDatetime: 2026-07-29T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "data-types", "tutorial"]
faqSchema:
  - question: "What is the difference between float and double in C++?"
    answer: "A float is a 32-bit floating-point number using 4 bytes with about 7 decimal digits of precision. A double is a 64-bit number using 8 bytes with about 15 digits. Double is more precise but uses twice the memory."
  - question: "Should I use float or double in C++?"
    answer: "Use double by default. It has more precision and is the type most standard library math functions expect. Only reach for float when you have a specific reason, such as saving memory in large arrays or matching a graphics API."
  - question: "Why does float lose precision in C++?"
    answer: "Float only stores about 7 significant decimal digits, so numbers with more digits get rounded to the nearest representable value. This rounding error grows as you do more calculations, which is why double is safer for most math."
draft: false
featured: false
---

# C++ float vs double: Which One Should You Use?

Both `float` and `double` store decimal numbers like `3.14` or `0.001`, but they are not interchangeable. The short answer is simple: **use `double` unless you have a specific reason not to.** This article explains why, and what actually changes when you pick one over the other.

---

## The Core Difference: Size and Precision

A `float` is a single-precision floating-point number. It uses **4 bytes** (32 bits) and stores roughly **7 significant decimal digits**.

A `double` is a double-precision floating-point number. It uses **8 bytes** (64 bits) and stores roughly **15 significant decimal digits**.

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "float:  " << sizeof(float) << " bytes\n";
    cout << "double: " << sizeof(double) << " bytes\n";
    return 0;
}
```

Output:

```
float:  4 bytes
double: 8 bytes
```

The name "double" literally means it uses double the storage of a float, and gets you double the precision in exchange.

---

## Seeing Precision Loss in Action

This is the part that trips up beginners. A `float` can only remember about 7 digits, so extra digits silently disappear.

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    float  f = 3.14159265358979;
    double d = 3.14159265358979;

    cout << setprecision(15);
    cout << "float:  " << f << "\n";
    cout << "double: " << d << "\n";
    return 0;
}
```

Output:

```
float:  3.14159274101257
double: 3.14159265358979
```

Notice the `float` version drifts after the 7th digit — it stored the *closest value it could*, not the exact number you typed. The `double` keeps all 15 digits you gave it. This is efficient to know because those tiny errors add up across thousands of calculations.

---

## Default Type of Decimal Literals

Here's a subtle gotcha. When you write a plain decimal like `3.14` in your code, C++ treats it as a `double` by default, **not** a float.

```cpp
float x = 3.14;    // 3.14 is a double, then narrowed to float
float y = 3.14f;   // the f suffix makes it a float literal
```

Adding the `f` suffix tells the compiler "this is a float." Without it, the value starts life as a double and gets converted. Most compilers will warn you about this narrowing, which is another quiet hint that double is the expected default in C++.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## When to Actually Use float

Double is the default, but float earns its place in a few situations:

- **Large arrays or buffers.** If you have millions of decimal values, using float halves your memory use and can improve cache performance.
- **Graphics and GPUs.** Many graphics APIs (OpenGL, game engines) work in float because GPUs are optimised for it.
- **Embedded or memory-constrained devices.** When every byte counts, float's smaller footprint matters.

For everyday programs — calculators, physics for a school project, financial-style math, general algorithms — reach for `double`.

---

## Why double Is the Safe Default

Beyond precision, there's a practical reason: the C++ standard library math functions in `<cmath>` are written for `double`.

```cpp
#include <cmath>

double r = sqrt(2.0);   // sqrt returns double
double a = sin(1.5);    // trig functions return double
```

If you feed these functions a `float`, the value gets promoted to `double` anyway, the calculation runs in double, and then you'd narrow it back. Starting with `double` avoids the round trip and the precision loss that comes with it.

---

## Quick Comparison

| Feature | `float` | `double` |
|---------|---------|----------|
| Size | 4 bytes | 8 bytes |
| Precision | ~7 digits | ~15 digits |
| Literal suffix | `3.14f` | `3.14` (default) |
| Best for | graphics, huge arrays, embedded | almost everything else |
| Standard math functions | promoted to double | native |

---

## The One-Line Rule

If you remember nothing else: **default to `double`, and only switch to `float` when memory or a specific API demands it.** You'll avoid an entire class of subtle precision bugs that beginners spend hours debugging.

---

## Related Articles

- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — the full set of built-in types
- [C++ Integer Division](/posts/cpp-integer-division/) — another common source of "wrong number" bugs
- [C++ Math Functions](/posts/cpp-math-functions/) — sqrt, pow, and the rest of cmath
- [C++ iomanip Formatting](/posts/cpp-iomanip-formatting/) — controlling how decimals print
- [C++ Type Casting](/posts/cpp-type-casting/) — converting between numeric types safely

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
