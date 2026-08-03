---
title: "INT_MAX and numeric_limits in C++: Finding a Type's Range"
description: "Find the max and min value of any C++ type with numeric_limits and INT_MAX. Learn how integer overflow happens and how to detect it before it breaks things."
pubDatetime: 2026-08-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "data-types", "numbers", "tutorial"]
faqSchema:
  - question: "What is INT_MAX in C++?"
    answer: "INT_MAX is a macro from the climits header holding the largest value an int can store, which is 2147483647 on almost every modern system. INT_MIN holds the smallest, -2147483648. The modern equivalent is std::numeric_limits<int>::max()."
  - question: "How do I find the maximum value of a type in C++?"
    answer: "Include the limits header and call std::numeric_limits<T>::max() where T is your type. It works for int, long long, double, char, and any other arithmetic type, which makes it usable inside templates where a fixed macro would not be."
  - question: "What happens when an int overflows in C++?"
    answer: "Signed integer overflow is undefined behaviour, so the compiler is allowed to do anything. In practice the value usually wraps around to the negative end, but optimisers may assume overflow cannot happen and remove your checks. Test before the operation instead of after."
draft: false
featured: false
---

# INT_MAX and numeric_limits in C++: Finding a Type's Range

Every numeric type in C++ has a ceiling. Push past it and your program doesn't error out — it quietly produces a wrong answer, often a large negative number where you expected a large positive one.

Knowing how to ask a type for its range is the first step to writing code that doesn't hit that wall.

---

## The Quick Answer

```cpp
#include <iostream>
#include <limits>

int main() {
    std::cout << "int max:       " << std::numeric_limits<int>::max() << "\n";
    std::cout << "int min:       " << std::numeric_limits<int>::min() << "\n";
    std::cout << "long long max: " << std::numeric_limits<long long>::max() << "\n";
    std::cout << "double max:    " << std::numeric_limits<double>::max() << "\n";
    return 0;
}
```

Output on a typical 64-bit system:

```
int max:       2147483647
int min:       -2147483648
long long max: 9223372036854775807
double max:    1.79769e+308
```

An `int` is 32 bits: one for the sign, 31 for the value. That gives 2³¹ − 1 = 2,147,483,647 as the maximum. The minimum is one further from zero because zero occupies a slot on the positive side.

---

## numeric_limits vs INT_MAX

You'll see both in real code:

```cpp
#include <climits>   // INT_MAX, LONG_MAX, CHAR_BIT, ...
#include <limits>    // std::numeric_limits

int a = INT_MAX;
int b = std::numeric_limits<int>::max();   // identical value
```

`INT_MAX` is a C macro — short and familiar. `std::numeric_limits` is the C++ way and is better for one concrete reason: it's a **template**, so it works with a type you don't know yet.

```cpp
template <typename T>
T findMax(const std::vector<T>& values) {
    T largest = std::numeric_limits<T>::lowest();   // works for any T
    for (const T& v : values) {
        if (v > largest) largest = v;
    }
    return largest;
}
```

There's no macro that can do that. See [C++ templates explained](/posts/cpp-templates-explained/) for why generic code needs this.

---

## min() vs lowest(): The Floating-Point Gotcha

This trips up nearly everyone the first time:

```cpp
#include <iostream>
#include <limits>

int main() {
    std::cout << "int    min: " << std::numeric_limits<int>::min()    << "\n";
    std::cout << "double min: " << std::numeric_limits<double>::min() << "\n";
    std::cout << "double low: " << std::numeric_limits<double>::lowest() << "\n";
    return 0;
}
```

Output:

```
int    min: -2147483648
double min: 2.22507e-308
double low: -1.79769e+308
```

For floating-point types, `min()` means the **smallest positive value**, not the most negative one. If you initialise a "find the maximum" loop with `numeric_limits<double>::min()`, every negative input will fail to beat your starting value and you'll get a wrong answer.

**Use `lowest()` when you want the most negative value.** It does the right thing for both integers and floats.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Watching an Overflow Happen

```cpp
#include <iostream>
#include <limits>

int main() {
    int big = std::numeric_limits<int>::max();
    std::cout << "Before: " << big << "\n";

    ++big;                                    // undefined behaviour
    std::cout << "After:  " << big << "\n";

    return 0;
}
```

Typical output:

```
Before: 2147483647
After:  -2147483648
```

The value wrapped from the largest positive to the most negative — the bit pattern rolled over into the sign bit.

But note the comment: signed overflow is **undefined behaviour**, not "wrap around." The wrap is what the hardware happens to do. The compiler is permitted to assume it never happens, which is why this check does not work:

```cpp
if (big + 1 < big) {           // compiler may delete this entirely
    std::cout << "overflowed\n";
}
```

The optimiser reasons "overflow can't happen, so `big + 1` is always greater than `big`, so this branch is dead" and removes it. Check **before** the operation instead:

```cpp
#include <limits>

bool canAdd(int a, int b) {
    if (b > 0 && a > std::numeric_limits<int>::max() - b) return false;
    if (b < 0 && a < std::numeric_limits<int>::min() - b) return false;
    return true;
}
```

Unsigned types are different: unsigned overflow **is** defined to wrap around. That's also why mixing signed and unsigned causes surprises — see [size_t in C++](/posts/cpp-size-t/).

---

## Other Useful numeric_limits Members

```cpp
#include <iostream>
#include <limits>

int main() {
    std::cout << "digits10:  " << std::numeric_limits<double>::digits10  << "\n";
    std::cout << "epsilon:   " << std::numeric_limits<double>::epsilon() << "\n";
    std::cout << "is_signed: " << std::numeric_limits<char>::is_signed   << "\n";
    return 0;
}
```

- `digits10` — how many decimal digits the type stores reliably (15 for `double`).
- `epsilon()` — the smallest gap between 1.0 and the next representable value. This is the right basis for a floating-point comparison tolerance rather than a magic `0.0001`.
- `is_signed` — whether `char` is signed is implementation-defined, and this tells you.

`epsilon()` is the principled answer to the "never compare doubles with `==`" rule from [float vs double](/posts/cpp-float-vs-double/):

```cpp
#include <cmath>
#include <limits>

bool nearlyEqual(double a, double b) {
    return std::fabs(a - b) <= std::numeric_limits<double>::epsilon() * std::fabs(a + b);
}
```

---

## Picking a Type That Fits

| Type | Typical range |
|------|---------------|
| `int` | ±2.1 billion |
| `unsigned int` | 0 to 4.3 billion |
| `long long` | ±9.2 quintillion |
| `float` | ~7 significant digits |
| `double` | ~15 significant digits |

If a value might exceed roughly two billion — factorials, file sizes in bytes, millisecond timestamps, accumulated counters — reach for `long long` from the start. See [C++ variables and data types](/posts/cpp-variables-data-types/) for the complete list.

---

## Related Articles

- [C++ Variables and Data Types](/posts/cpp-variables-data-types/)
- [float vs double in C++](/posts/cpp-float-vs-double/)
- [size_t in C++](/posts/cpp-size-t/)
- [C++ Type Casting Explained](/posts/cpp-type-casting/)
- [C++ Templates Explained](/posts/cpp-templates-explained/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
