---
title: "C++ Math Functions: Using the cmath Library for Beginners"
description: "Learn how to use C++ math functions from the cmath library: sqrt, pow, abs, floor, ceil, round, fmod, and more. Includes working code examples."
pubDatetime: 2026-05-23T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "cmath", "tutorial"]
faqSchema:
  - question: "How do I use math functions in C++?"
    answer: "Include the <cmath> header at the top of your file. Then call functions like std::sqrt(x), std::pow(base, exp), std::abs(x), std::floor(x), and std::ceil(x). All these functions work with double by default."
  - question: "What is the difference between abs and fabs in C++?"
    answer: "std::abs in <cmath> works on floating-point numbers (double, float). std::abs in <cstdlib> works on integers. To avoid confusion, always include <cmath> and use std::abs — it handles both cases in modern C++."
  - question: "How do I calculate a square root in C++?"
    answer: "Use std::sqrt(x) from the <cmath> library. For example: double result = std::sqrt(25.0); gives 5.0. The argument should be a non-negative number — passing a negative value returns NaN (Not a Number)."
draft: false
featured: false
---

# C++ Math Functions: Using the cmath Library

When your program needs to compute square roots, raise numbers to powers, round values, or do any serious math, you reach for `<cmath>` — the C++ math library. It provides all the standard mathematical functions you'd find on a scientific calculator, and they're straightforward to use.

---

## Including the cmath Header

All the functions in this article require this include:

```cpp
#include <cmath>
```

The functions live in the `std` namespace, so you'll call them as `std::sqrt()`, `std::pow()`, and so on.

---

## Square Root: std::sqrt

```cpp
#include <iostream>
#include <cmath>

int main() {
    double result = std::sqrt(25.0);
    std::cout << result << "\n"; // 5

    std::cout << std::sqrt(2.0) << "\n"; // 1.41421
    std::cout << std::sqrt(0.0) << "\n"; // 0

    // Negative input gives NaN
    std::cout << std::sqrt(-1.0) << "\n"; // -nan or nan
    return 0;
}
```

`sqrt` takes a `double` and returns a `double`. Always pass a non-negative number. If you need complex square roots, you'd use `<complex>` instead.

---

## Power: std::pow

`pow(base, exponent)` raises `base` to the power of `exponent`:

```cpp
#include <iostream>
#include <cmath>

int main() {
    std::cout << std::pow(2, 10)  << "\n"; // 1024 (2^10)
    std::cout << std::pow(3, 3)   << "\n"; // 27   (3^3)
    std::cout << std::pow(4, 0.5) << "\n"; // 2    (square root of 4)
    std::cout << std::pow(2, -1)  << "\n"; // 0.5  (1/2)
    return 0;
}
```

Note: `pow` returns a `double`, so `pow(2, 10)` gives `1024.0`. If you need an integer result, cast it:

```cpp
int result = static_cast<int>(std::pow(2, 10)); // 1024
```

---

## Absolute Value: std::abs

`abs` returns the non-negative value of a number — it removes the sign:

```cpp
#include <iostream>
#include <cmath>

int main() {
    std::cout << std::abs(-7.5) << "\n"; // 7.5
    std::cout << std::abs(3.0)  << "\n"; // 3
    std::cout << std::abs(-42)  << "\n"; // 42 (works for int too)
    return 0;
}
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Rounding Functions: floor, ceil, round

These three handle different styles of rounding:

- `std::floor(x)` — rounds **down** to the nearest integer (toward negative infinity)
- `std::ceil(x)` — rounds **up** to the nearest integer (toward positive infinity)
- `std::round(x)` — rounds to the **nearest** integer (0.5 rounds up)

```cpp
#include <iostream>
#include <cmath>

int main() {
    double x = 3.7;
    std::cout << std::floor(x) << "\n"; // 3
    std::cout << std::ceil(x)  << "\n"; // 4
    std::cout << std::round(x) << "\n"; // 4

    double y = 3.2;
    std::cout << std::floor(y) << "\n"; // 3
    std::cout << std::ceil(y)  << "\n"; // 4
    std::cout << std::round(y) << "\n"; // 3

    double z = -2.5;
    std::cout << std::floor(z) << "\n"; // -3
    std::cout << std::ceil(z)  << "\n"; // -2
    std::cout << std::round(z) << "\n"; // -3 (rounds away from zero)
    return 0;
}
```

These return `double` — to get an `int`, use `static_cast<int>(std::floor(x))`.

---

## Floating-Point Modulo: std::fmod

The regular `%` operator works for integers. For floating-point remainder, use `std::fmod`:

```cpp
#include <iostream>
#include <cmath>

int main() {
    std::cout << std::fmod(10.5, 3.0) << "\n"; // 1.5 (10.5 = 3×3 + 1.5)
    std::cout << std::fmod(7.0, 2.5)  << "\n"; // 2.0 (7.0 = 2×2.5 + 2.0)
    return 0;
}
```

---

## Logarithms: std::log and std::log10

- `std::log(x)` — natural logarithm (base e)
- `std::log2(x)` — logarithm base 2
- `std::log10(x)` — logarithm base 10

```cpp
#include <iostream>
#include <cmath>

int main() {
    std::cout << std::log(std::exp(1.0)) << "\n"; // 1 (ln(e) = 1)
    std::cout << std::log10(100.0) << "\n";        // 2
    std::cout << std::log2(8.0)    << "\n";        // 3
    return 0;
}
```

---

## Trigonometry: sin, cos, tan

These functions take angles in **radians**, not degrees:

```cpp
#include <iostream>
#include <cmath>

int main() {
    const double PI = std::acos(-1.0); // a portable way to get pi

    std::cout << std::sin(PI / 2) << "\n"; // 1.0 (sin 90°)
    std::cout << std::cos(0)      << "\n"; // 1.0 (cos 0°)
    std::cout << std::tan(PI / 4) << "\n"; // 1.0 (tan 45°)
    return 0;
}
```

To convert degrees to radians: `radians = degrees * PI / 180.0`

---

## Quick Reference: Common cmath Functions

| Function | What it does | Example | Result |
|---|---|---|---|
| `sqrt(x)` | Square root | `sqrt(9.0)` | `3.0` |
| `pow(b, e)` | b raised to e | `pow(2, 8)` | `256.0` |
| `abs(x)` | Absolute value | `abs(-5.0)` | `5.0` |
| `floor(x)` | Round down | `floor(3.9)` | `3.0` |
| `ceil(x)` | Round up | `ceil(3.1)` | `4.0` |
| `round(x)` | Round nearest | `round(3.5)` | `4.0` |
| `fmod(a,b)` | Float remainder | `fmod(10.5, 3.0)` | `1.5` |
| `log(x)` | Natural log | `log(exp(1.0))` | `1.0` |
| `log10(x)` | Log base 10 | `log10(1000.0)` | `3.0` |
| `sin(x)` | Sine (radians) | `sin(PI/2)` | `1.0` |
| `cos(x)` | Cosine (radians) | `cos(0)` | `1.0` |

---

## Complete Example: Pythagorean Theorem Calculator

```cpp
#include <iostream>
#include <cmath>

int main() {
    double a, b;
    std::cout << "Enter side a: ";
    std::cin >> a;
    std::cout << "Enter side b: ";
    std::cin >> b;

    double c = std::sqrt(std::pow(a, 2) + std::pow(b, 2));
    std::cout << "Hypotenuse c = " << c << "\n";

    return 0;
}
```

Sample run:
```
Enter side a: 3
Enter side b: 4
Hypotenuse c = 5
```

---

## Related Articles

- [C++ Variables and Data Types: A Complete Beginner's Guide](/posts/cpp-variables-data-types/)
- [C++ Random Numbers: How to Generate Them Correctly](/posts/cpp-random-numbers/)
- [C++ Functions Tutorial: How to Write and Use Functions](/posts/cpp-functions-tutorial/)
- [C++ Calculator Program: A Beginner Project with Full Code](/posts/cpp-calculator-program/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
