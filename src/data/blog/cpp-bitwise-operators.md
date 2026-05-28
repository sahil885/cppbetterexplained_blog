---
title: "C++ Bitwise Operators Explained: AND, OR, XOR, Shift, and NOT for Beginners"
description: "Understand C++ bitwise operators with clear examples. Learn &, |, ^, ~, <<, >> and why bit manipulation matters even in everyday beginner programs."
pubDatetime: 2026-05-28T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "operators", "tutorial"]
faqSchema:
  - question: "What are bitwise operators in C++?"
    answer: "Bitwise operators work directly on the binary bits of integer values. C++ has six: & (AND), | (OR), ^ (XOR), ~ (NOT), << (left shift), and >> (right shift). They're faster than most arithmetic operations and are used in flags, masks, and low-level programming."
  - question: "What is the difference between & and && in C++?"
    answer: "& is the bitwise AND operator — it operates on individual bits of two integers. && is the logical AND operator — it works on boolean expressions and short-circuits (stops evaluating once the result is determined). They look similar but do very different things."
  - question: "When would a beginner actually use bitwise operators in C++?"
    answer: "Common beginner uses include checking if a number is odd (n & 1), toggling flags in a settings value, swapping values without a temp variable, and multiplying/dividing by powers of 2 efficiently using shifts."
draft: false
featured: false
---

# C++ Bitwise Operators Explained: AND, OR, XOR, Shift, and NOT

Every integer in your program is stored as a sequence of bits — 0s and 1s. Bitwise operators let you work with those bits directly. You don't need to be writing embedded firmware to use them — checking if a number is odd, toggling settings flags, and fast multiplication by powers of two are all everyday uses.

---

## Quick Reference

| Operator | Name | Example | Result |
|---|---|---|---|
| `&` | AND | `5 & 3` | `1` |
| `\|` | OR | `5 \| 3` | `7` |
| `^` | XOR | `5 ^ 3` | `6` |
| `~` | NOT | `~5` | `-6` |
| `<<` | Left shift | `5 << 1` | `10` |
| `>>` | Right shift | `5 >> 1` | `2` |

---

## Bitwise AND (&)

AND compares each bit position: the result bit is `1` only if **both** bits are `1`.

```cpp
#include <iostream>

int main() {
    int a = 5;  // binary: 0101
    int b = 3;  // binary: 0011

    std::cout << (a & b) << "\n";  // 0001 = 1
    return 0;
}
```

**Most useful beginner trick — check if a number is odd:**
```cpp
if (n & 1) {
    std::cout << n << " is odd\n";
} else {
    std::cout << n << " is even\n";
}
```

The last bit of any odd number is always `1`, so `n & 1` evaluates to `1` for odd numbers and `0` for even ones.

---

## Bitwise OR (|)

OR returns `1` if **either** bit is `1`:

```cpp
#include <iostream>

int main() {
    int a = 5;  // binary: 0101
    int b = 3;  // binary: 0011

    std::cout << (a | b) << "\n";  // 0111 = 7
    return 0;
}
```

OR is used to **set** a specific bit. If you have a settings integer and want to turn on bit 2:

```cpp
int settings = 0b0001;   // bit 0 is on
settings |= 0b0100;      // turn on bit 2
// settings is now 0b0101
```

---

## Bitwise XOR (^)

XOR returns `1` when the bits are **different**, and `0` when they're the same:

```cpp
#include <iostream>

int main() {
    int a = 5;  // 0101
    int b = 3;  // 0011

    std::cout << (a ^ b) << "\n";  // 0110 = 6
    return 0;
}
```

A neat XOR trick: **swapping two variables without a temp:**

```cpp
int x = 10, y = 20;
x ^= y;
y ^= x;
x ^= y;
std::cout << x << " " << y << "\n";  // 20 10
```

XOR also **toggles** bits. If you want to flip bit 1 of a settings value:

```cpp
settings ^= 0b0010;  // toggles bit 1 every time it's called
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Bitwise NOT (~)

NOT flips every bit:

```cpp
#include <iostream>

int main() {
    int a = 5;  // 00000000 00000000 00000000 00000101
    std::cout << ~a << "\n";  // -6
    return 0;
}
```

The result is `-6` because of how negative numbers are stored in two's complement. In practice, `~n` is always `-(n + 1)`.

---

## Left Shift (<<) and Right Shift (>>)

Shift operators move all bits left or right by a number of positions:

```cpp
#include <iostream>

int main() {
    int n = 5;  // binary: 0101

    std::cout << (n << 1) << "\n";  // 10  (multiply by 2)
    std::cout << (n << 2) << "\n";  // 20  (multiply by 4)
    std::cout << (n >> 1) << "\n";  // 2   (divide by 2)
    return 0;
}
```

Left-shifting by `k` is equivalent to multiplying by 2ᵏ. Right-shifting by `k` is equivalent to dividing by 2ᵏ (integer division). These are fast operations the CPU handles in a single instruction.

---

## & vs && (A Common Beginner Confusion)

These two look alike but do completely different things:

```cpp
int a = 5, b = 3;

// Bitwise AND — works on bits of integers
std::cout << (a & b) << "\n";   // 1

// Logical AND — works on boolean expressions, short-circuits
if (a > 0 && b > 0) {
    std::cout << "Both positive\n";
}
```

Always use `&&` for conditions in `if` statements. Use `&` when you genuinely need to work at the bit level.

---

## Related Articles

- [C++ Variables and Data Types: A Complete Beginner's Guide](/posts/cpp-variables-data-types/)
- [C++ Conditionals Tutorial: if, else, and switch Explained](/posts/cpp-conditionals-tutorial/)
- [C++ Operator Overloading: A Beginner's Guide](/posts/cpp-operator-overloading/)
- [C++ Type Casting Explained](/posts/cpp-type-casting/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
