---
title: "Integer Division in C++: Why 5 / 2 Equals 2 (Not 2.5)"
description: "Learn why integer division in C++ makes 5 / 2 equal 2, not 2.5. See how to get decimal results, avoid the classic beginner trap, and use casting correctly."
pubDatetime: 2026-07-06T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "operators", "tutorial"]
faqSchema:
  - question: "Why does 5 / 2 equal 2 in C++?"
    answer: "Because both 5 and 2 are integers, C++ performs integer division and throws away the fractional part. The true answer 2.5 is truncated down to 2. Make one operand a double, like 5.0 / 2, to get 2.5."
  - question: "How do I get a decimal result from division in C++?"
    answer: "Make at least one operand a floating-point value. Write 5.0 / 2, or cast a variable with static_cast<double>(a) / b. As long as one side is a double, C++ switches to floating-point division and keeps the decimals."
  - question: "Does C++ round or truncate during integer division?"
    answer: "It truncates toward zero, meaning it drops the fractional part instead of rounding. So 7 / 2 is 3, and -7 / 2 is -3. If you need rounding, divide in floating point and use std::round."
draft: false
featured: false
---

# Integer Division in C++

Sooner or later every C++ beginner types something like `5 / 2` and is shocked to see `2` printed instead of `2.5`. This isn't a bug — it's a rule called **integer division**, and once you understand it, a whole category of mysterious math bugs disappears.

---

## What Integer Division Really Means

In C++, the type of a division's result depends on the types of the numbers you divide. When **both** sides are integers, C++ does *integer* division: it computes the answer and then throws away everything after the decimal point.

```cpp
#include <iostream>

int main() {
    std::cout << 5 / 2 << "\n";   // 2  (not 2.5)
    std::cout << 9 / 4 << "\n";   // 2  (not 2.25)
    std::cout << 20 / 3 << "\n";  // 6  (not 6.666)
    return 0;
}
```

The fractional part isn't rounded — it's simply dropped. `5 / 2` is mathematically `2.5`, but the `.5` is discarded, leaving `2`. This is called **truncation**.

---

## The Rule: Integer / Integer = Integer

The reason is consistency. In C++, an operation between two `int` values produces an `int`. Division is no exception. Since an `int` can't hold `2.5`, the language keeps only the whole-number part.

This matters most with variables, because the trap is harder to spot:

```cpp
#include <iostream>

int main() {
    int total = 7;
    int people = 2;
    int share = total / people;   // 3, not 3.5
    std::cout << "Each person gets " << share << "\n";
    return 0;
}
```

Every value here is an `int`, so the division truncates. That half-unit just vanishes.

---

## How to Get a Decimal Result

The fix is simple: make **at least one** operand a floating-point number. As soon as one side is a `double`, C++ switches to floating-point division and keeps the decimals.

```cpp
#include <iostream>

int main() {
    std::cout << 5.0 / 2 << "\n";   // 2.5
    std::cout << 5 / 2.0 << "\n";   // 2.5
    std::cout << 5.0 / 2.0 << "\n"; // 2.5
    return 0;
}
```

When your values live in `int` variables, convert one of them on the spot with `static_cast<double>`:

```cpp
#include <iostream>

int main() {
    int total = 7;
    int people = 2;
    double share = static_cast<double>(total) / people;  // 3.5
    std::cout << "Each person gets " << share << "\n";
    return 0;
}
```

This is efficient and explicit: you're telling the compiler exactly where the conversion happens, so there's no guessing.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Classic Trap: double result = 5 / 2;

Here's the mistake that catches almost everyone. You store the result in a `double`, so you expect `2.5`:

```cpp
#include <iostream>

int main() {
    double result = 5 / 2;   // still 2.0!
    std::cout << result << "\n";
    return 0;
}
```

Why is it `2` and not `2.5`? Because the **division happens first**, using two integers, and *then* the integer result `2` is copied into the `double`. The variable's type doesn't reach back in time to change how `5 / 2` was calculated. The fix is the same as before — make an operand floating point: `double result = 5.0 / 2;`.

---

## Truncation Goes Toward Zero

Integer division always chops toward zero, which is worth remembering for negative numbers:

```cpp
#include <iostream>

int main() {
    std::cout << 7 / 2 << "\n";    //  3
    std::cout << -7 / 2 << "\n";   // -3  (toward zero, not -4)
    return 0;
}
```

If you actually need rounding, do the math in floating point and use `std::round` from `<cmath>`.

---

## Integer Division and Modulo: The Perfect Pair

Integer division has a useful partner: the modulo operator `%`, which gives the **remainder**. Together they split a number into a whole part and a leftover:

```cpp
#include <iostream>

int main() {
    int seconds = 137;
    int minutes = seconds / 60;   // 2
    int leftover = seconds % 60;  // 17
    std::cout << minutes << " min " << leftover << " sec\n";
    return 0;
}
```

`/` tells you how many whole times something fits; `%` tells you what's left over. That combination shows up constantly in real code.

---

## Quick Reference

| You write | Result | Why |
|-----------|--------|-----|
| `5 / 2` | `2` | both `int`, truncated |
| `5.0 / 2` | `2.5` | one operand is `double` |
| `static_cast<double>(a) / b` | decimal | cast forces float division |
| `double r = 5 / 2;` | `2.0` | division done *before* the assignment |
| `5 % 2` | `1` | remainder, not quotient |

---

## Related Articles

- [C++ Modulo Operator (%)](/posts/cpp-modulo-operator/) — the remainder half of division
- [C++ Type Casting Explained](/posts/cpp-type-casting/) — how static_cast works
- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — int vs double, and why it matters
- [C++ Math Functions](/posts/cpp-math-functions/) — round, floor, ceil, and more
- [C++ Grade Calculator](/posts/cpp-grade-calculator/) — averages, where this trap bites

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
