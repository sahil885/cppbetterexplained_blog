---
title: "C++ enum class vs enum: Scoped Enums Explained"
description: "C++ enum class vs enum: scoped enums prevent name clashes and block implicit int conversion. Learn the difference, the syntax, and why enum class is preferred."
pubDatetime: 2026-07-29T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "enums", "tutorial"]
faqSchema:
  - question: "What is the difference between enum and enum class in C++?"
    answer: "A plain enum leaks its names into the surrounding scope and converts implicitly to int. An enum class (scoped enum) keeps its names inside the enum's scope and does not convert to int automatically, making it safer and clash-free."
  - question: "Why should I use enum class instead of enum?"
    answer: "enum class avoids name collisions because you must qualify values like Color::Red, and it prevents accidental integer conversions that hide bugs. It is the recommended default in modern C++ for these safety reasons."
  - question: "How do you convert an enum class to an int in C++?"
    answer: "You use an explicit cast, for example static_cast<int>(Color::Red). Scoped enums do not convert to int automatically, so the explicit cast documents that you really meant to turn the enum into a number."
draft: false
featured: false
---

# C++ enum class vs enum: Scoped Enums Explained

An `enum` gives names to a set of related constants — like `Red`, `Green`, `Blue`. C++11 added a stronger version called `enum class` (a "scoped enum"). The difference matters: **`enum class` keeps its names tidy inside its own scope and refuses to silently turn into an integer**, which stops two whole categories of bugs.

---

## Plain enum: The Original

```cpp
#include <iostream>
using namespace std;

enum Color { Red, Green, Blue };

int main() {
    Color c = Green;         // no scope needed
    cout << c << "\n";       // prints 1 — it's really just an int
    return 0;
}
```

By default the values are numbered from `0`, so `Red` is `0`, `Green` is `1`, `Blue` is `2`. Notice two things: you write `Green` directly (no prefix), and it prints as `1` because a plain enum converts to `int` on its own.

Those two conveniences are also the two problems.

---

## Problem 1: Name Clashes

Plain enum names spill into the surrounding scope. So two enums can't share a value name:

```cpp
enum Color   { Red, Green, Blue };
enum Traffic { Red, Yellow, Green };   // ERROR: Red and Green already defined
```

The compiler rejects this because `Red` and `Green` already exist. In a large program with many enums, these collisions are common and annoying.

---

## Problem 2: Accidental int Conversions

Because a plain enum is basically an `int`, nonsense comparisons compile without complaint:

```cpp
enum Color { Red, Green, Blue };
enum Fruit { Apple, Banana, Cherry };

Color c = Red;
if (c == Apple) {    // compiles! both are 0, so this is TRUE
    // ...a bug that the compiler never warned you about
}
```

`Red` and `Apple` are both `0`, so the comparison is silently true. That's a real bug the language happily lets through.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## enum class Fixes Both

Add the keyword `class` (or `struct`) and both problems disappear:

```cpp
#include <iostream>
using namespace std;

enum class Color   { Red, Green, Blue };
enum class Traffic { Red, Yellow, Green };   // fine — names are scoped

int main() {
    Color c = Color::Red;      // must qualify with Color::
    Traffic t = Traffic::Red;  // no clash with Color::Red

    // if (c == t) { }         // ERROR: different types, won't compile
    // int n = c;              // ERROR: no implicit conversion to int

    if (c == Color::Red) {
        cout << "It's red\n";
    }
    return 0;
}
```

Now `Color::Red` and `Traffic::Red` coexist peacefully, and mixing a `Color` with a `Traffic` — or with an `int` — is a compile error instead of a silent bug. This is safer because the compiler catches the mistake the moment you write it.

---

## Converting a Scoped Enum to int

Sometimes you genuinely need the underlying number (for printing, indexing, or serialising). Scoped enums require an explicit cast, which makes the intent obvious:

```cpp
enum class Color { Red, Green, Blue };

Color c = Color::Blue;
int n = static_cast<int>(c);   // n == 2
std::cout << n << "\n";
```

The explicit `static_cast` is a feature, not a chore — it documents "yes, I really want the integer here."

---

## Choosing the Underlying Type

Both kinds of enum let you pick the underlying integer type, which is handy for saving space or matching a protocol:

```cpp
enum class Status : unsigned char { Ok, Warning, Error };  // stored in 1 byte
```

---

## Quick Comparison

| Feature | `enum` (plain) | `enum class` (scoped) |
|---------|----------------|-----------------------|
| Introduced | C++98 | C++11 |
| Access values | `Green` | `Color::Green` |
| Converts to int automatically? | Yes | No (explicit cast) |
| Names leak into scope? | Yes | No |
| Name clashes possible? | Yes | No |
| Recommended default? | No | Yes |

---

## The Takeaway

Reach for **`enum class` by default** in new code. The extra `Color::` prefix is a tiny price for eliminating name clashes and accidental integer comparisons. Use a plain `enum` only when you specifically want the implicit int behaviour — for example, bit flags — and even then, do it on purpose.

---

## Related Articles

- [C++ Enum Tutorial](/posts/cpp-enum-tutorial/) — the full beginner's guide to enumerations
- [C++ Enum to String](/posts/cpp-enum-to-string/) — printing enum values as readable text
- [C++ Struct vs Class](/posts/cpp-struct-vs-class/) — another "class vs not" distinction explained
- [C++ Type Casting](/posts/cpp-type-casting/) — static_cast and the other cast operators
- [C++ Switch Statement](/posts/cpp-switch-statement/) — a natural fit for handling enum values

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
