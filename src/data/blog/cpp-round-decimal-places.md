---
title: "How to Round to 2 Decimal Places in C++ (Display vs Value)"
description: "Round numbers to 2 decimal places in C++ using setprecision or std::round. Learn which one changes the value, which only changes output, and the float trap."
pubDatetime: 2026-08-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "numbers", "formatting", "tutorial"]
faqSchema:
  - question: "How do I round a number to 2 decimal places in C++?"
    answer: "To change only how the number prints, use std::fixed with std::setprecision(2) from the iomanip header. To change the stored value, multiply by 100, call std::round from cmath, then divide by 100."
  - question: "What is the difference between setprecision and std::round?"
    answer: "setprecision affects only the output stream, so the variable keeps its full precision and later calculations are unaffected. std::round with the multiply-and-divide trick actually changes the value you store, which is what you want before comparing or summing."
  - question: "Why does my rounded number still show extra digits?"
    answer: "Doubles are stored in binary, and many decimal values like 2.67 have no exact binary representation. Rounding gets you to the nearest representable double, which may be 2.6699999999999999. Format the output with setprecision when you print it."
draft: false
featured: false
---

# How to Round to 2 Decimal Places in C++ (Display vs Value)

This question has two completely different answers, and picking the wrong one is the source of a lot of confusion. Before you write any code, answer this:

**Do you want the number to *print* with two decimals, or do you want the stored value to actually *change*?**

A price on a receipt is a display problem. A running total you'll compare against another total is a value problem. They need different tools.

---

## Option 1: Round the Display (setprecision)

If you only care how it looks on screen, use `<iomanip>`:

```cpp
#include <iostream>
#include <iomanip>

int main() {
    double price = 19.98765;

    std::cout << std::fixed << std::setprecision(2) << price << "\n";
    std::cout << "Still full precision: " << std::setprecision(10) << price << "\n";

    return 0;
}
```

Output:

```
19.99
Still full precision: 19.9876500000
```

The variable never changed — only the stream's formatting did. `std::fixed` tells the stream "always use decimal notation," and `setprecision(2)` means "two digits after the point." Without `std::fixed`, `setprecision(2)` means two *significant* digits, so `19.98765` would print as `20`. Those two almost always go together.

Both settings are **sticky**: they apply to every number printed afterwards on that stream, not just the next one. That surprises people who set precision once and wonder why an integer count later prints as `5.00`.

For more on stream formatting — widths, alignment, currency-style output — see [iomanip formatting in C++](/posts/cpp-iomanip-formatting/).

---

## Option 2: Round the Value (std::round)

To actually change the number, shift the decimal point, round, and shift back:

```cpp
#include <iostream>
#include <iomanip>
#include <cmath>

double roundTo2(double value) {
    return std::round(value * 100.0) / 100.0;
}

int main() {
    double total = 19.98765;
    double rounded = roundTo2(total);

    std::cout << std::fixed << std::setprecision(6);
    std::cout << "Original: " << total   << "\n";
    std::cout << "Rounded:  " << rounded << "\n";

    return 0;
}
```

Output:

```
Original: 19.987650
Rounded:  19.990000
```

Multiplying by 100 moves two decimal digits to the left of the point, `std::round` snaps to the nearest whole number, and dividing by 100 moves them back.

A generic version for any number of places:

```cpp
double roundTo(double value, int places) {
    double factor = std::pow(10.0, places);
    return std::round(value * factor) / factor;
}
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Don't Confuse round, floor, and ceil

All three live in `<cmath>` and all three return whole numbers, but they decide differently:

```cpp
#include <iostream>
#include <cmath>

int main() {
    double values[] = {2.3, 2.5, 2.7, -2.5};

    for (double v : values) {
        std::cout << v
                  << "  round=" << std::round(v)
                  << "  floor=" << std::floor(v)
                  << "  ceil="  << std::ceil(v)  << "\n";
    }
    return 0;
}
```

Output:

```
2.3  round=2  floor=2  ceil=3
2.5  round=3  floor=2  ceil=3
2.7  round=3  floor=2  ceil=3
-2.5  round=-3  floor=-3  ceil=-2
```

`std::round` rounds halves **away from zero**, which is why `-2.5` becomes `-3` and not `-2`. That's the behaviour most people expect from school arithmetic, but it differs from the banker's rounding used in some financial systems.

---

## The Trap Nobody Warns You About

Try rounding `2.675` to two places and you may get `2.67` instead of `2.68`. That's not a bug in `std::round`.

Doubles are stored in binary. The decimal value `2.675` has no exact binary representation, so what's actually in memory is closer to `2.67499999999999982`. Multiply by 100 and you get `267.499999...`, which correctly rounds down to `267`.

Two practical consequences:

1. **Never test floating-point equality with `==`.** Compare the difference against a small tolerance instead. [float vs double](/posts/cpp-float-vs-double/) covers this in detail.
2. **For money, don't use doubles at all.** Store cents as an integer — `1999` rather than `19.99` — and format the decimal point only when you print. Integer arithmetic is exact, so totals always add up.

```cpp
#include <iostream>

int main() {
    long long cents = 1999;  // $19.99, exactly

    std::cout << "$" << cents / 100 << "." << cents % 100 << "\n";
    return 0;
}
```

That uses [integer division and the modulo operator](/posts/cpp-integer-division/) to split the value — no floating point anywhere, so no rounding error is even possible.

---

## Which One Should You Use?

| Goal | Use |
|------|-----|
| Print a report or receipt | `std::fixed` + `setprecision(2)` |
| Store a rounded value for later math | `std::round(x * 100) / 100` |
| Handle money correctly | Integer cents |
| Round down / up specifically | `std::floor` / `std::ceil` |

When in doubt, round at the **edges** of your program — when displaying or saving — and keep full precision everywhere in between. Rounding early and repeatedly compounds error.

---

## Related Articles

- [C++ iomanip Formatting](/posts/cpp-iomanip-formatting/)
- [float vs double in C++](/posts/cpp-float-vs-double/)
- [C++ Math Functions](/posts/cpp-math-functions/)
- [Integer Division in C++](/posts/cpp-integer-division/)
- [C++ Variables and Data Types](/posts/cpp-variables-data-types/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
