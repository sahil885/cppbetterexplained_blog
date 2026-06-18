---
title: "C++ Modulo Operator (%): Remainders Explained for Beginners"
description: "Understand the C++ modulo operator (%) the easy way: how remainders work, checking even or odd, the integer-only rule, negative numbers, and wrap-around tricks."
pubDatetime: 2026-06-18T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "operators", "tutorial"]
faqSchema:
  - question: "What does the modulo operator (%) do in C++?"
    answer: "The % operator returns the remainder of integer division. For example, 10 % 3 is 1 because 10 divided by 3 leaves a remainder of 1. It's commonly used to test divisibility."
  - question: "Can you use modulo with doubles in C++?"
    answer: "No. The % operator only works with integers. For floating-point remainders, use std::fmod from the <cmath> header, such as std::fmod(5.5, 2.0) which gives 1.5."
  - question: "How does modulo work with negative numbers in C++?"
    answer: "In C++ the result takes the sign of the left operand. So -7 % 3 is -1, while 7 % -3 is 1. This can differ from the mathematical definition of modulo, so test carefully."
draft: false
featured: false
---

# C++ Modulo Operator (%)

The modulo operator `%` gives you the **remainder** left over after dividing two integers. It looks tiny, but it powers a surprising amount of real code — from checking even and odd numbers to wrapping values around a clock. Here's everything a beginner needs.

---

## What % Actually Does

`%` answers the question "what's left over after division?":

```cpp
#include <iostream>

int main() {
    std::cout << 10 % 3 << "\n";  // 1  (10 = 3*3 + 1)
    std::cout << 7 % 4 << "\n";   // 3  (7  = 1*4 + 3)
    std::cout << 12 % 4 << "\n";  // 0  (divides evenly)
    return 0;
}
```

Notice the last one: `12 % 4` is `0`. A remainder of zero means the division was exact — and that single fact is what makes modulo so useful.

---

## The Most Common Use: Divisibility

If `a % b == 0`, then `a` divides evenly by `b`. The classic case is testing whether a number is even (divisible by 2):

```cpp
#include <iostream>

int main() {
    int n = 18;
    if (n % 2 == 0)
        std::cout << n << " is even\n";
    else
        std::cout << n << " is odd\n";
    return 0;
}
```

Swap the `2` for any number and you can check "every 3rd item," "is this a multiple of 10," and so on. This pattern shows up constantly in loops.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Integer-Only Rule

`%` only works on integers. Try it on a `double` and the compiler refuses. For floating-point remainders, use `std::fmod` from `<cmath>`:

```cpp
#include <iostream>
#include <cmath>

int main() {
    // double r = 5.5 % 2.0;       // ERROR: % needs integers
    double r = std::fmod(5.5, 2.0); // 1.5
    std::cout << r << "\n";
    return 0;
}
```

This is one of the most common beginner compiler errors. Remember: `%` is for whole numbers, `std::fmod` is for decimals.

---

## Watch Out for Negative Numbers

When a negative number is involved, the result takes the **sign of the left operand**:

```cpp
#include <iostream>

int main() {
    std::cout << -7 % 3 << "\n";  // -1
    std::cout << 7 % -3 << "\n";  //  1
    return 0;
}
```

This sometimes differs from the "always positive" modulo you may have learned in math class. If you need a guaranteed-positive result, you can write `((a % b) + b) % b`.

---

## A Neat Trick: Wrapping Values Around

Modulo is perfect for keeping a value inside a fixed range — like hours on a clock that wrap from 12 back to 1:

```cpp
#include <iostream>

int main() {
    int start = 9;
    int hoursLater = 7;
    int clock = (start + hoursLater) % 12;  // 16 % 12 = 4
    std::cout << "It will be " << clock << " o'clock\n";
    return 0;
}
```

The same idea cycles through array indices, rotates colors, or loops an animation back to the start. Whenever something needs to "wrap around," modulo is the tool.

---

## Quick Reference

| Goal | Code |
|------|------|
| Remainder of a ÷ b | `a % b` |
| Is n even? | `n % 2 == 0` |
| Is a divisible by b? | `a % b == 0` |
| Float remainder | `std::fmod(a, b)` |
| Always-positive result | `((a % b) + b) % b` |

---

## Related Articles

- [C++ Even or Odd Program](/posts/cpp-even-odd-program/) — modulo in action
- [C++ Math Functions](/posts/cpp-math-functions/) — fmod, pow, sqrt, and more
- [C++ Bitwise Operators](/posts/cpp-bitwise-operators/) — another fast way to test even/odd
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — where modulo shines
- [C++ Ternary Operator](/posts/cpp-ternary-operator/) — tidy your even/odd checks

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
