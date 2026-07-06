---
title: "typedef vs using in C++: Type Aliases Explained"
description: "typedef vs using in C++ explained for beginners. Learn how to create type aliases, why using is the modern choice, and how alias templates make code cleaner."
pubDatetime: 2026-07-06T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "modern-cpp", "tutorial"]
faqSchema:
  - question: "What is the difference between typedef and using in C++?"
    answer: "Both create a type alias, a second name for an existing type. For simple aliases they behave identically, but using has cleaner, left-to-right syntax and can also create alias templates, which typedef cannot."
  - question: "Should I use typedef or using in modern C++?"
    answer: "Prefer using. Since C++11 it does everything typedef does, reads more naturally like an assignment, and supports templated aliases. You'll still see typedef in older code, so it's worth recognizing both."
  - question: "What is a type alias in C++?"
    answer: "A type alias is an alternative name for an existing type. For example, using Score = int; lets you write Score instead of int, which makes code clearer and easier to change later in one place."
draft: false
featured: false
---

# typedef vs using in C++

As your types get longer — think `std::vector<std::pair<int, std::string>>` — you'll want a shorter name for them. C++ gives you two ways to do that: the old `typedef` and the modern `using`. Here's how they compare and which to reach for.

---

## What a Type Alias Is

A **type alias** is simply a second name for a type you already have. It doesn't create anything new; it just gives an existing type a friendlier label:

```cpp
using Score = int;   // Score is now another name for int

Score highScore = 100;   // exactly the same as: int highScore = 100;
```

Why bother? Clarity and maintainability. `Score` documents *what* the number means, and if you later decide scores should be `long`, you change one line instead of hunting through your whole program.

---

## The Old Way: typedef

Before C++11, aliases were made with `typedef`. You write the existing type, then the new name at the end:

```cpp
typedef unsigned long ulong;
typedef std::vector<int> IntVec;
```

Read it as "make `IntVec` mean `std::vector<int>`." It works, but notice the new name is buried at the *end* of the line — for complex types, it can be hard to spot.

---

## The Modern Way: using

C++11 introduced the alias declaration with `using`. It reads like an assignment: new name on the left, existing type on the right:

```cpp
using ulong = unsigned long;
using IntVec = std::vector<int>;
```

Most people find this far easier to read, because it follows the natural "X *is* Y" order you already know from variables.

---

## For Simple Aliases, They're Identical

Let's be clear: for an everyday alias, the two are completely interchangeable. This program works the same whichever line you uncomment:

```cpp
#include <iostream>
#include <vector>

int main() {
    // typedef std::vector<int> IntVec;
    using IntVec = std::vector<int>;

    IntVec nums = {10, 20, 30};
    std::cout << "Size: " << nums.size() << "\n";  // 3
    return 0;
}
```

So if they do the same thing here, why prefer one? Two reasons: readability with tricky types, and a feature `typedef` simply can't match.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Where using Reads Better: Function Pointers

Function-pointer types are notoriously hard to read as a `typedef`, because the name gets tucked into the middle of the syntax:

```cpp
typedef int (*Operation)(int, int);   // where's the name? in the middle
using   Operation = int (*)(int, int); // name clearly on the left
```

Both define `Operation` as "a pointer to a function taking two ints and returning an int," but the `using` version keeps the name up front where you expect it.

---

## Where using Truly Wins: Alias Templates

This is the feature that settles the debate. With `using`, you can make an alias that still has an open template parameter — something `typedef` cannot do at all:

```cpp
#include <vector>

template<typename T>
using Vec = std::vector<T>;   // a templated alias

int main() {
    Vec<int> a = {1, 2, 3};       // std::vector<int>
    Vec<double> b = {1.5, 2.5};   // std::vector<double>
    return 0;
}
```

`Vec<int>` and `Vec<double>` both expand to the right `std::vector`. There's no clean way to write this with `typedef`, which is the main reason modern guidelines recommend `using`.

---

## Which Should You Use?

For new code, prefer **`using`**. It does everything `typedef` does, reads more naturally, and unlocks alias templates. You should still *recognize* `typedef`, because plenty of existing libraries and tutorials use it — but you rarely need to write it yourself anymore.

---

## Quick Reference

| | `typedef` | `using` |
|---|-----------|---------|
| Simple alias | yes | yes |
| Reads left-to-right | no | yes |
| Clear function-pointer syntax | harder | easier |
| Alias templates | no | yes |
| Recommended for new code | no | yes |

---

## Related Articles

- [C++ auto Keyword Explained](/posts/cpp-auto-keyword/) — let the compiler name types for you
- [C++ Templates Explained](/posts/cpp-templates-explained/) — where alias templates shine
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — the type we kept aliasing
- [C++ Namespace Tutorial](/posts/cpp-namespace-tutorial/) — another use of the using keyword
- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — the types you're renaming

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
