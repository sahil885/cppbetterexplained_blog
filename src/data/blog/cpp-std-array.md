---
title: "std::array in C++: A Safer, Modern Alternative to C-Style Arrays"
description: "Learn std::array in C++, the size-aware, safer alternative to C-style arrays. How to declare it, loop over it, pass it to functions, and when to use it."
pubDatetime: 2026-07-13T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "arrays", "STL"]
faqSchema:
  - question: "What is the difference between std::array and a normal array in C++?"
    answer: "std::array is a fixed-size container that knows its own length and behaves like a normal object, while a C-style array decays to a pointer and loses its size when passed around. std::array adds safety features like .at() bounds checking and .size(), with zero runtime overhead."
  - question: "Is std::array slower than a C-style array?"
    answer: "No. std::array is a thin wrapper with the same memory layout and performance as a built-in array. The extra methods like .size() and .at() are resolved at compile time, so you pay nothing for the added safety and convenience."
  - question: "When should I use std::array instead of std::vector?"
    answer: "Use std::array when the number of elements is known at compile time and never changes, such as the days of the week or a fixed lookup table. Use std::vector when the size can grow or shrink at runtime."
draft: false
featured: false
---

# std::array in C++

If you've used plain C-style arrays in C++, you've probably hit their annoying limits: they forget their own size, they can't be copied with `=`, and they silently decay into pointers the moment you pass them to a function. `std::array` fixes all of that while staying just as fast.

---

## What Is std::array?

`std::array` is a fixed-size container from the C++ Standard Library, added in C++11. It wraps a normal array in a proper object so it knows its own length, works with STL algorithms, and can be copied and returned like any other value — all with **zero runtime cost**. It lives in the `<array>` header.

```cpp
#include <array>
#include <iostream>

int main() {
    std::array<int, 5> scores = {90, 85, 70, 100, 60};
    std::cout << "First score: " << scores[0] << "\n";
    std::cout << "How many: " << scores.size() << "\n";
    return 0;
}
```

The type is `std::array<ElementType, Count>`. Here it's an array of 5 `int`s. That `5` is part of the type — the size is fixed at compile time and can never change.

---

## Declaring a std::array

You can initialize a `std::array` a few different ways:

```cpp
#include <array>

int main() {
    std::array<int, 3> a = {1, 2, 3};   // full list
    std::array<int, 3> b = {1};         // {1, 0, 0} — rest are zero
    std::array<int, 3> c = {};          // {0, 0, 0} — all zero
    std::array<double, 2> d{3.14, 2.7}; // brace init, no =
    return 0;
}
```

Notice that if you supply fewer values than the size, the remaining elements are **value-initialized** to zero. That's safer than a C-style array, whose uninitialized elements contain garbage.

---

## Why std::array Knows Its Own Size

This is the headline feature. A C-style array can't reliably tell you how many elements it holds once you pass it anywhere. A `std::array` always can, because the length is baked into its type:

```cpp
#include <array>
#include <iostream>

int main() {
    std::array<int, 4> nums = {10, 20, 30, 40};
    std::cout << "Elements: " << nums.size() << "\n";  // 4, always correct
    return 0;
}
```

This matters because it kills a whole class of bugs. You never have to pass a separate "length" variable around and hope it stays in sync with the array.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Looping Over a std::array

Because `std::array` knows its size, the clean range-based `for` loop just works:

```cpp
#include <array>
#include <iostream>

int main() {
    std::array<int, 5> scores = {90, 85, 70, 100, 60};

    for (int s : scores) {
        std::cout << s << " ";
    }
    std::cout << "\n";
    return 0;
}
```

If you need the index too, a classic loop with `.size()` is safe here — no risk of getting the length wrong:

```cpp
for (std::size_t i = 0; i < scores.size(); ++i) {
    std::cout << "scores[" << i << "] = " << scores[i] << "\n";
}
```

---

## Passing std::array to a Function

A C-style array decays to a pointer when passed to a function, losing its size. A `std::array` does not — you pass it as a whole object, usually by `const` reference to avoid copying:

```cpp
#include <array>
#include <iostream>

double average(const std::array<int, 5>& data) {
    int total = 0;
    for (int x : data) total += x;
    return static_cast<double>(total) / data.size();  // size still known!
}

int main() {
    std::array<int, 5> scores = {90, 85, 70, 100, 60};
    std::cout << "Average: " << average(scores) << "\n";
    return 0;
}
```

The function can call `data.size()` because the length travels with the object. This is efficient because `const&` avoids copying the array while still giving read access.

---

## Bounds Checking with .at()

Like `std::vector`, `std::array` offers `.at()`, which checks the index and throws `std::out_of_range` if you go too far. Plain `[]` does not check and is undefined behavior out of bounds:

```cpp
std::array<int, 3> a = {1, 2, 3};
int x = a[5];      // undefined behavior — silent bug
int y = a.at(5);   // throws std::out_of_range — a clear, catchable error
```

Use `[]` in tight loops where you know the index is valid, and `.at()` when an index might be wrong and you want a real error instead of corruption.

---

## std::array vs C-Style Array vs std::vector

| Feature | C-style array | std::array | std::vector |
|---------|---------------|------------|-------------|
| Size fixed at compile time | yes | yes | no |
| Knows its own `.size()` | no | yes | yes |
| Can grow/shrink | no | no | yes |
| Bounds-checked `.at()` | no | yes | yes |
| Decays to pointer | yes | no | no |
| Lives on | stack | stack | heap |

The rule of thumb: reach for `std::array` when the size is known and constant, `std::vector` when it changes, and avoid raw C-style arrays in new code.

---

## Related Articles

- [C++ Arrays Tutorial](/posts/cpp-arrays-tutorial/) — the C-style arrays std::array improves on
- [C++ Array vs Vector](/posts/cpp-array-vs-vector/) — when fixed size beats dynamic size
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — the resizable cousin of std::array
- [How to Find the Size of an Array in C++](/posts/cpp-array-size/) — the problem std::array solves cleanly
- [How to Pass an Array to a Function in C++](/posts/cpp-pass-array-to-function/) — pointer decay explained

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
