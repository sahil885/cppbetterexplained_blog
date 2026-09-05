---
title: "Dynamic Arrays in C++: How to Create an Array With a Runtime Size"
description: "Learn how to create a dynamic array in C++ with new and delete[], why sizeof breaks on it, how to resize one, and why std::vector is the safer choice."
pubDatetime: 2026-09-05T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "memory", "arrays", "tutorial"]
faqSchema:
  - question: "How do you create a dynamic array in C++?"
    answer: "Declare a pointer and allocate with new followed by the type and the size in square brackets, for example int* arr = new int[n]. The size can be a variable decided at runtime. When you are finished you must release the memory with delete[] arr."
  - question: "What is the difference between a static array and a dynamic array in C++?"
    answer: "A static array has a size fixed at compile time and lives on the stack, so it is freed automatically when it goes out of scope. A dynamic array is allocated on the heap with new, its size can be chosen at runtime, and you are responsible for freeing it with delete[]."
  - question: "Why does sizeof not work on a dynamic array in C++?"
    answer: "A dynamic array is accessed through a pointer, and sizeof on a pointer returns the size of the pointer itself, usually 8 bytes, not the size of the block it points to. You have to store the length in a separate variable yourself."
draft: false
featured: false
---

# Dynamic Arrays in C++: Arrays When You Don't Know the Size Yet

Your program asks the user how many test scores they want to enter. They say 47. But you wrote `int scores[100];` and hoped for the best.

That's the problem dynamic arrays solve: an array whose length is decided while the program is running, not while it's being compiled.

---

## Why a Normal Array Won't Do

```cpp
int n;
std::cin >> n;
int scores[n];   // ✗ not standard C++
```

You may be surprised that this *compiles* on g++ and clang. It's a compiler extension called a variable-length array, borrowed from C. MSVC rejects it, and it isn't in the C++ standard, so code that relies on it isn't portable. Don't build habits on it.

The array size in a regular declaration must be a **compile-time constant**, because the compiler needs to know exactly how many bytes to reserve on the stack before your program ever runs. See [stack vs heap](/posts/cpp-stack-vs-heap/) for why that restriction exists.

---

## Creating a Dynamic Array With `new`

```cpp
#include <iostream>

int main() {
    int n;
    std::cout << "How many numbers? ";
    std::cin >> n;

    int* scores = new int[n];      // allocated on the heap, size decided now

    for (int i = 0; i < n; ++i) {
        std::cout << "Score " << (i + 1) << ": ";
        std::cin >> scores[i];
    }

    int total = 0;
    for (int i = 0; i < n; ++i) total += scores[i];

    std::cout << "Average: " << static_cast<double>(total) / n << "\n";

    delete[] scores;               // give the memory back
    scores = nullptr;              // avoid a dangling pointer

    return 0;
}
```

`new int[n]` asks the operating system for enough heap memory to hold `n` integers and hands back the address of the first one. From there, `scores[i]` works exactly like a normal array — because array indexing was always pointer arithmetic underneath. Our guide to [pointers in C++](/posts/pointers-in-cpp/) unpacks that connection.

Note `static_cast<double>` in the average: without it, `total / n` performs [integer division](/posts/cpp-integer-division/) and quietly throws away the decimals.

---

## The Three Rules You Must Not Break

**1. `new[]` pairs with `delete[]`, never plain `delete`.**

```cpp
int* arr = new int[10];
delete arr;      // ✗ undefined behaviour
delete[] arr;    // ✓
```

The square-bracket form tells the runtime to free the whole block (and, for class types, to run every element's destructor). Mixing the forms is undefined behaviour — it may appear to work and corrupt the heap anyway.

**2. Never `delete` the same pointer twice**, and set it to `nullptr` afterwards so an accidental second delete is harmless. See [nullptr vs NULL](/posts/cpp-nullptr-vs-null/).

**3. `sizeof` will lie to you.**

```cpp
int stack_arr[10];
int* heap_arr = new int[10];

std::cout << sizeof(stack_arr) << "\n";   // 40 — the whole array
std::cout << sizeof(heap_arr)  << "\n";   // 8  — just the pointer!
```

The size information simply isn't part of the pointer's type. You have to carry `n` around yourself, which is exactly the kind of bookkeeping that leads to bugs. More on this in [how to get the size of an array](/posts/cpp-array-size/).

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Initialising a Dynamic Array

Raw `new int[n]` leaves the memory **uninitialised** — it contains whatever garbage was there before. Reading it before writing is undefined behaviour:

```cpp
int* a = new int[5];         // garbage values
int* b = new int[5]();       // all zeros — note the empty parentheses
int* c = new int[5]{1,2,3};  // 1, 2, 3, 0, 0  (C++11)
```

That tiny `()` is easy to miss and easy to forget. Default to `new int[n]()` unless you're about to fill every slot immediately.

---

## "Resizing" a Dynamic Array

There's no `realloc` for `new`. To grow an array you allocate a new one, copy, and free the old:

```cpp
#include <iostream>
#include <algorithm>   // std::copy

int* growArray(int* old, int oldSize, int newSize) {
    int* bigger = new int[newSize]();
    std::copy(old, old + oldSize, bigger);
    delete[] old;
    return bigger;
}

int main() {
    int size = 3;
    int* data = new int[size]{10, 20, 30};

    size = 6;
    data = growArray(data, 3, size);
    data[3] = 40;

    for (int i = 0; i < size; ++i) std::cout << data[i] << " ";
    std::cout << "\n";      // 10 20 30 40 0 0

    delete[] data;
    return 0;
}
```

Look at how much can go wrong here: forget the copy, mismatch the sizes, delete the wrong pointer, or return early and leak the whole block. This is genuinely hard to get right every time.

---

## Just Use std::vector

Everything above is what `std::vector` does for you, correctly, every time:

```cpp
#include <iostream>
#include <vector>

int main() {
    int n;
    std::cout << "How many numbers? ";
    std::cin >> n;

    std::vector<int> scores(n);          // n zero-initialised ints

    for (int i = 0; i < n; ++i) std::cin >> scores[i];

    scores.push_back(100);               // grows automatically
    std::cout << "Size: " << scores.size() << "\n";   // knows its own size

    return 0;                            // memory freed automatically
}
```

No `delete[]`. No separate size variable. No leak if an exception is thrown halfway through. `std::vector` *is* a dynamic array — it holds a `new[]` block internally and manages it properly.

So why learn `new[]` at all? Because you'll read older code that uses it, because interviewers ask, and because understanding what vector does under the hood makes you better at using it. Write vectors; understand `new[]`.

---

## Quick Comparison

| | Static array | `new[]` | `std::vector` |
|---|---|---|---|
| Size decided | compile time | runtime | runtime, changeable |
| Lives on | stack | heap | heap (managed) |
| Frees itself | yes | no | yes |
| Knows its size | via `sizeof` | no | `.size()` |
| Can grow | no | manually | `push_back` |

---

## Related Articles

- [C++ Arrays Tutorial for Beginners](/posts/cpp-arrays-tutorial/)
- [Memory Management in C++](/posts/memory-management-cpp/)
- [new vs malloc in C++](/posts/cpp-new-vs-malloc/)
- [Stack vs Heap in C++](/posts/cpp-stack-vs-heap/)
- [C++ vector Tutorial for Beginners](/posts/cpp-vector-tutorial/)
- [Smart Pointers in C++](/posts/smart-pointers-cpp/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
