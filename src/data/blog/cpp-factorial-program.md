---
title: "C++ Factorial Program: Loop and Recursion Methods Explained"
description: "Write a C++ factorial program two ways: with a loop and recursion. Learn how factorials work, avoid integer overflow, and pick the right method for the job."
pubDatetime: 2026-06-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "recursion", "tutorial"]
faqSchema:
  - question: "How do you calculate factorial in C++?"
    answer: "Multiply every whole number from 1 up to n together. You can do this with a for loop that accumulates the product, or with a recursive function where factorial(n) returns n * factorial(n-1). Both give the same result."
  - question: "What is the factorial of 0?"
    answer: "The factorial of 0 is 1 by definition. This is the base case that makes recursive factorial functions terminate correctly, so always handle n == 0 before multiplying."
  - question: "Why does factorial overflow so quickly in C++?"
    answer: "Factorials grow extremely fast. A regular int overflows after 12! and even unsigned long long overflows after 20!. Use a wider type or a big-integer library if you need larger values."
draft: false
featured: false
---

# C++ Factorial Program: Loop and Recursion

The factorial of a number is the product of every whole number from 1 up to that number. We write it with an exclamation mark: 5! means 5 × 4 × 3 × 2 × 1 = 120. Factorials show up everywhere in math and are a perfect way to practice both loops and recursion in C++.

---

## Understanding Factorials

By definition, `n!` multiplies all integers from 1 through `n`. So `4! = 24`, `6! = 720`, and the special case `0! = 1`. That last rule looks odd but it keeps the math consistent and gives recursion a clean stopping point.

---

## Method 1: Using a Loop

The most direct way is to start with a running product of 1 and multiply it by each number up to `n`:

```cpp
#include <iostream>

int main() {
    int n;
    std::cout << "Enter a number: ";
    std::cin >> n;

    unsigned long long factorial = 1;
    for (int i = 2; i <= n; i++) {
        factorial *= i;  // multiply running total by i
    }

    std::cout << n << "! = " << factorial << "\n";
    return 0;
}
```

We start the loop at 2 because multiplying by 1 changes nothing. Using `unsigned long long` instead of `int` lets us reach much larger results before overflowing. This loop version is efficient because it uses constant memory no matter how large `n` is.

---

## Method 2: Using Recursion

A recursive function calls itself with a smaller input until it hits a base case. Factorial maps onto recursion beautifully because `n! = n × (n-1)!`.

```cpp
#include <iostream>

unsigned long long factorial(int n) {
    if (n <= 1) return 1;          // base case: 0! and 1! are 1
    return n * factorial(n - 1);   // recursive step
}

int main() {
    std::cout << "5! = " << factorial(5) << "\n";  // 120
    return 0;
}
```

The base case `n <= 1` is essential. Without it, the function would call itself forever and crash with a stack overflow. Each call waits for the smaller call to finish, then multiplies the result by `n` on the way back up.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Loop vs Recursion: Which to Use

Both produce identical answers, so the choice comes down to style and constraints. The loop version uses a fixed amount of memory and is slightly faster, making it the safer default. The recursive version reads almost exactly like the mathematical definition, which makes the logic easy to understand. For very large `n`, prefer the loop — deep recursion can exhaust the call stack.

| Aspect | Loop | Recursion |
|--------|------|-----------|
| Memory | Constant | Grows with n |
| Speed | Slightly faster | Slight call overhead |
| Readability | Clear | Matches the math |
| Risk | None | Stack overflow if n is huge |

---

## Watch Out for Overflow

Factorials explode in size. A plain `int` can only hold up to `12!` (479,001,600). Even `unsigned long long` overflows past `20!`. If your program silently returns a wrong or negative number for larger inputs, overflow is almost always the cause. For genuinely big factorials you would need a big-integer library or a different representation.

---

## Related Articles

- [C++ Recursion Tutorial](/posts/cpp-recursion-tutorial/) — how functions call themselves
- [C++ Fibonacci Program](/posts/cpp-fibonacci/) — another classic loop vs recursion example
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — for and while loops in depth
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — defining and calling functions
- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — choosing int vs long long

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
