---
title: "How to Swap Two Numbers in C++: 4 Methods Explained"
description: "Learn how to swap two numbers in C++ using a temp variable, std::swap, references, and arithmetic. Clear beginner examples showing when to use each method."
pubDatetime: 2026-06-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "fundamentals", "tutorial"]
faqSchema:
  - question: "How do you swap two numbers in C++?"
    answer: "The simplest way is a temporary variable: store the first value in temp, copy the second into the first, then copy temp into the second. C++ also provides std::swap which does this for you in one line."
  - question: "What is std::swap in C++?"
    answer: "std::swap is a standard library function from <utility> that exchanges the values of two variables. It works on almost any type, is efficient, and is the recommended way to swap in modern C++."
  - question: "Can you swap numbers without a temporary variable?"
    answer: "Yes, using arithmetic (a = a + b; b = a - b; a = a - b) or XOR, but these tricks risk overflow and are harder to read. Prefer std::swap or a temp variable in real code."
draft: false
featured: false
---

# How to Swap Two Numbers in C++

Swapping two values — making `a` hold what `b` had and vice versa — is one of the first building blocks you'll use in sorting, shuffling, and countless algorithms. C++ gives you several ways to do it, from a simple temporary variable to the built-in `std::swap`.

---

## Method 1: Using a Temporary Variable

This is the classic, foolproof approach. You can't just write `a = b; b = a;` because the first line destroys the original value of `a` before you can save it. A temporary variable holds it safely:

```cpp
#include <iostream>

int main() {
    int a = 5, b = 10;
    std::cout << "Before: a = " << a << ", b = " << b << "\n";

    int temp = a;  // save a
    a = b;         // a now holds b's value
    b = temp;      // b now holds a's old value

    std::cout << "After:  a = " << a << ", b = " << b << "\n";
    return 0;
}
```

Output shows `a = 10, b = 5`. This works for any type and is impossible to get wrong once you understand why the temp is needed.

---

## Method 2: Using std::swap

Modern C++ ships with a ready-made function that does exactly this. It lives in `<utility>` (and is included by many other headers automatically):

```cpp
#include <iostream>
#include <utility>

int main() {
    int a = 5, b = 10;
    std::swap(a, b);
    std::cout << "a = " << a << ", b = " << b << "\n";  // a = 10, b = 5
    return 0;
}
```

This is the recommended way in real code. It's clear, works on strings, vectors, and custom types, and the compiler optimizes it well. Why reinvent something the standard library already does safely?

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Method 3: Writing Your Own Swap Function

To swap values *inside a function* so the change is visible to the caller, you must use references. Passing by value would only swap local copies:

```cpp
#include <iostream>

void swapValues(int& x, int& y) {  // references, not copies
    int temp = x;
    x = y;
    y = temp;
}

int main() {
    int a = 1, b = 2;
    swapValues(a, b);
    std::cout << "a = " << a << ", b = " << b << "\n";  // a = 2, b = 1
    return 0;
}
```

The `&` makes `x` and `y` aliases for the caller's actual variables. Drop the `&` and the swap would have no effect outside the function — a very common beginner bug.

---

## Method 4: Without a Temporary Variable

You can swap using arithmetic, which looks clever but has real downsides:

```cpp
int a = 5, b = 10;
a = a + b;  // a = 15
b = a - b;  // b = 5
a = a - b;  // a = 10
```

This avoids a temp variable, but for very large values `a + b` can overflow and produce wrong results. It's also harder to read. Interview questions sometimes ask for it, but in actual programs you should prefer `std::swap` or a temporary variable — clarity beats cleverness.

---

## Which Method Should You Use

For everyday code, reach for `std::swap` — it's clear, safe, and works on every type. Use a temporary variable when you want to show the mechanics explicitly or in a learning context. Use references when swapping inside your own functions. Save the no-temp arithmetic trick for puzzles, not production.

---

## Related Articles

- [C++ Pass by Value vs Reference](/posts/cpp-pass-by-value-reference/) — why references matter for swapping
- [C++ Reference vs Pointer](/posts/cpp-reference-vs-pointer/) — two ways to refer to a variable
- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — the basics of storing values
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — parameters and arguments
- [C++ Sort Algorithm](/posts/cpp-sort-algorithm/) — where swapping powers sorting

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
