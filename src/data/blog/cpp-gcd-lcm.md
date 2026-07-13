---
title: "GCD and LCM in C++: The Euclidean Algorithm Explained"
description: "Find the GCD and LCM of two numbers in C++. Learn the Euclidean algorithm with loops and recursion, the LCM formula, and the built-in std::gcd in C++17."
pubDatetime: 2026-07-13T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "functions", "tutorial"]
faqSchema:
  - question: "How do you find the GCD of two numbers in C++?"
    answer: "Use the Euclidean algorithm: repeatedly replace the pair (a, b) with (b, a % b) until b becomes 0. The remaining a is the greatest common divisor. This can be written as a short while loop or a one-line recursive function."
  - question: "How do you calculate the LCM in C++?"
    answer: "Compute the GCD first, then use the formula LCM = (a / gcd) * b. Dividing before multiplying avoids overflow. The least common multiple is the smallest number that both a and b divide into evenly."
  - question: "Does C++ have a built-in GCD function?"
    answer: "Yes. Since C++17, std::gcd and std::lcm are available in the <numeric> header. Call std::gcd(a, b) and std::lcm(a, b) directly instead of writing your own, as long as your compiler supports C++17."
draft: false
featured: false
---

# GCD and LCM in C++

The greatest common divisor (GCD) and least common multiple (LCM) are two of the most useful number-theory tools, and computing them in C++ is a great exercise in loops, recursion, and clean function design. The star of the show is the **Euclidean algorithm**, a technique over 2,000 years old that's still the fastest way to do it.

---

## What GCD and LCM Mean

The **GCD** of two numbers is the largest number that divides both evenly. For 12 and 18, the GCD is 6. The **LCM** is the smallest number both divide into — for 12 and 18, it's 36.

The naive way to find a GCD is to test every number down from the smaller input, but that's slow. The Euclidean algorithm is dramatically better.

---

## The Euclidean Algorithm (Loop Version)

The insight is simple: `gcd(a, b)` equals `gcd(b, a % b)`. You keep replacing the larger number with the remainder until the remainder is `0`; the last non-zero value is your answer.

```cpp
#include <iostream>

int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;    // remainder becomes the new b
        a = temp;     // old b becomes the new a
    }
    return a;
}

int main() {
    std::cout << "GCD of 12 and 18: " << gcd(12, 18) << "\n";  // 6
    return 0;
}
```

Trace `gcd(12, 18)`: the pair goes `(12, 18) -> (18, 12) -> (12, 6) -> (6, 0)`. When `b` hits `0`, `a` is `6`. This is efficient because each step shrinks the numbers fast — usually in just a handful of iterations.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Recursive Version

The same algorithm reads beautifully as recursion, because `gcd(a, b) = gcd(b, a % b)` is already a recursive definition. The base case is when `b` reaches `0`:

```cpp
#include <iostream>

int gcd(int a, int b) {
    if (b == 0) return a;      // base case
    return gcd(b, a % b);      // recursive step
}

int main() {
    std::cout << gcd(48, 36) << "\n";  // 12
    return 0;
}
```

Both versions do exactly the same work. Pick the loop if you prefer explicit steps, or the recursion if you like how closely it matches the math.

---

## Computing the LCM

Once you have the GCD, the LCM follows from a simple relationship: `a * b == gcd(a, b) * lcm(a, b)`. Rearranged, that's `lcm = (a * b) / gcd`. To avoid overflow with large inputs, divide **before** multiplying:

```cpp
#include <iostream>

int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

int lcm(int a, int b) {
    return (a / gcd(a, b)) * b;   // divide first to stay safe
}

int main() {
    std::cout << "LCM of 12 and 18: " << lcm(12, 18) << "\n";  // 36
    return 0;
}
```

Writing `(a / gcd(a, b)) * b` instead of `(a * b) / gcd(a, b)` keeps intermediate values smaller, which matters when `a` and `b` are large enough that their product would overflow an `int`.

---

## The Modern Way: std::gcd and std::lcm

Since C++17, you don't have to write these yourself. The `<numeric>` header provides `std::gcd` and `std::lcm`:

```cpp
#include <iostream>
#include <numeric>   // std::gcd, std::lcm

int main() {
    std::cout << "GCD: " << std::gcd(12, 18) << "\n";  // 6
    std::cout << "LCM: " << std::lcm(12, 18) << "\n";  // 36
    return 0;
}
```

For real projects, prefer the standard versions — they're tested, handle edge cases, and make your intent obvious. Writing your own is still worth doing once, though, so you understand what's happening under the hood.

---

## Related Articles

- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — building reusable functions like gcd
- [C++ Recursion Tutorial](/posts/cpp-recursion-tutorial/) — the base case and recursive step
- [C++ Modulo Operator (%)](/posts/cpp-modulo-operator/) — the remainder that powers Euclid's method
- [C++ Math Functions](/posts/cpp-math-functions/) — more numeric tools in the standard library
- [Prime Number Program in C++](/posts/cpp-prime-number-program/) — another number-theory classic

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
