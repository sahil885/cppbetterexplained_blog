---
title: "C++ Measure Execution Time with std::chrono (Beginner Guide)"
description: "Learn how to measure execution time in C++ with std::chrono. Time code in milliseconds or microseconds, time a function, and build a simple reusable timer."
pubDatetime: 2026-06-09T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "tutorial", "modern-cpp"]
faqSchema:
  - question: "How do you measure execution time in C++?"
    answer: "Use std::chrono. Record the time before and after your code with std::chrono::high_resolution_clock::now(), subtract the two, and convert the difference with duration_cast to milliseconds or microseconds."
  - question: "Which clock should I use to time code in C++?"
    answer: "Use std::chrono::steady_clock (or high_resolution_clock) for measuring durations, because it never jumps backward. Avoid system_clock for timing, since it can be adjusted by the operating system."
  - question: "Why does my C++ timing show zero milliseconds?"
    answer: "The code ran faster than one millisecond. Measure in microseconds or nanoseconds with duration_cast<std::chrono::microseconds>, or run the operation many times in a loop and divide."
draft: false
featured: false
---

# C++ Measure Execution Time with std::chrono

**To measure execution time in C++, record `std::chrono::high_resolution_clock::now()` before and after your code, then subtract the two time points.** The `<chrono>` library gives you precise, portable timing without any platform-specific code.

---

## The Basic Pattern

Take a timestamp before and after the work, then convert the difference to whatever unit you want:

```cpp
#include <iostream>
#include <chrono>

int main() {
    auto start = std::chrono::high_resolution_clock::now();

    // --- the code you want to time ---
    long long sum = 0;
    for (int i = 0; i < 10000000; i++) sum += i;
    // ---------------------------------

    auto end = std::chrono::high_resolution_clock::now();
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);

    std::cout << "Took " << ms.count() << " ms\n";
    return 0;
}
```

`now()` returns a time point. Subtracting two time points gives a *duration*, and `duration_cast` converts that duration into milliseconds. Calling `.count()` extracts the number so you can print it.

---

## Getting Finer Resolution

If your code runs in under a millisecond, the result will show `0 ms`. Switch the cast to microseconds (or nanoseconds) for more detail:

```cpp
auto us = std::chrono::duration_cast<std::chrono::microseconds>(end - start);
std::cout << "Took " << us.count() << " us\n";
```

The pattern is identical — only the unit type inside `duration_cast` changes. This is why `<chrono>` is so pleasant: you pick the unit at the moment you read the result.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Seconds as a Decimal

To show seconds with decimals (like `1.37 s`), use a `duration<double>` instead of an integer cast:

```cpp
std::chrono::duration<double> elapsed = end - start;
std::cout << "Took " << elapsed.count() << " s\n";
```

Here the duration stores a floating-point number of seconds, so `.count()` gives you `1.37` rather than a whole number.

---

## A Reusable Timer

If you time things often, wrap the pattern in a small helper that times any function you pass it:

```cpp
#include <iostream>
#include <chrono>

template <typename Func>
long long timeMs(Func work) {
    auto start = std::chrono::high_resolution_clock::now();
    work();
    auto end = std::chrono::high_resolution_clock::now();
    return std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count();
}

int main() {
    long long ms = timeMs([]{
        long long s = 0;
        for (int i = 0; i < 10000000; i++) s += i;
    });
    std::cout << "Loop took " << ms << " ms\n";
    return 0;
}
```

You pass the code to time as a lambda, and `timeMs` returns the elapsed milliseconds. This keeps your timing logic in one place instead of repeating `now()` calls everywhere.

---

## Which Clock to Use

`high_resolution_clock` is fine for most beginner timing. For serious benchmarking prefer `steady_clock` — it's guaranteed to never run backward, while `system_clock` can jump if the OS adjusts the wall-clock time. Never use `system_clock` to measure how long code takes.

---

## Related Articles

- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — timing your own functions
- [C++ Lambda Functions](/posts/cpp-lambda-functions/) — passing code to the timer
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — the kind of code you'll measure
- [C++ auto Keyword](/posts/cpp-auto-keyword/) — why auto suits chrono types

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
