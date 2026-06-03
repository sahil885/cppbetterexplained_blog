---
title: "C++ Prime Number Program: Check and Print Primes for Beginners"
description: "Learn to write a C++ prime number program. Check if a number is prime, print primes up to n, and optimize with the square root method. Beginner friendly."
pubDatetime: 2026-06-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "loops", "tutorial"]
faqSchema:
  - question: "How do you check if a number is prime in C++?"
    answer: "Loop from 2 up to the square root of the number and test whether any value divides it evenly using the modulo operator (%). If none do, the number is prime. Numbers less than 2 are never prime."
  - question: "Why only check divisors up to the square root?"
    answer: "If a number n has a factor larger than its square root, it must also have a matching factor smaller than the square root. So checking up to sqrt(n) catches every possible factor while doing far less work."
  - question: "Is 1 a prime number in C++?"
    answer: "No. By definition a prime number must be greater than 1 and divisible only by 1 and itself. Your program should treat 0 and 1 as not prime before running the divisor loop."
draft: false
featured: false
---

# C++ Prime Number Program: Check and Print Primes

A prime number is a whole number greater than 1 that can only be divided evenly by 1 and itself. Writing a program to detect primes is one of the best early exercises in C++ because it combines loops, conditionals, and a little math reasoning into a small, satisfying problem.

---

## What Counts as Prime

The numbers 2, 3, 5, 7, 11, and 13 are prime. Numbers like 4, 6, 8, and 9 are not, because they have factors other than 1 and themselves. The numbers 0 and 1 are special cases: neither is prime, so we handle them separately before doing any real work.

---

## The Basic Approach

To check whether a number `n` is prime, we try to divide it by every integer from 2 up to `n - 1`. If any division leaves no remainder, `n` has a factor and is therefore not prime.

```cpp
#include <iostream>

int main() {
    int n;
    std::cout << "Enter a number: ";
    std::cin >> n;

    bool isPrime = true;

    if (n <= 1) {
        isPrime = false;  // 0 and 1 are not prime
    } else {
        for (int i = 2; i < n; i++) {
            if (n % i == 0) {  // i divides n evenly
                isPrime = false;
                break;         // no need to keep checking
            }
        }
    }

    if (isPrime)
        std::cout << n << " is prime.\n";
    else
        std::cout << n << " is not prime.\n";

    return 0;
}
```

The `%` (modulo) operator gives the remainder of a division. When `n % i == 0`, it means `i` divides `n` with nothing left over — a factor. The `break` statement stops the loop early because once we find a single factor, we already know the answer.

---

## Optimizing with the Square Root

Checking every number up to `n - 1` works, but it wastes effort. If `n` has a factor larger than its square root, it must also have a partner factor smaller than the square root. That means we only ever need to test divisors up to `sqrt(n)`.

```cpp
#include <iostream>
#include <cmath>

bool isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i <= std::sqrt(n); i++) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    std::cout << std::boolalpha;  // print true/false instead of 1/0
    std::cout << isPrime(29) << "\n";  // true
    std::cout << isPrime(30) << "\n";  // false
    return 0;
}
```

This is dramatically faster for large numbers. Checking 1,000,003 now takes about 1,000 steps instead of a million. This is efficient because the work grows with the square root of the input rather than the input itself.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Printing All Primes Up to N

A common follow-up exercise is printing every prime in a range. We simply call our `isPrime` helper inside a loop:

```cpp
#include <iostream>
#include <cmath>

bool isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i <= std::sqrt(n); i++) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    int limit = 30;
    std::cout << "Primes up to " << limit << ": ";
    for (int n = 2; n <= limit; n++) {
        if (isPrime(n)) std::cout << n << " ";
    }
    std::cout << "\n";
    return 0;
}
```

Output: `Primes up to 30: 2 3 5 7 11 13 17 19 23 29`

Pulling the check into its own `isPrime` function keeps `main` readable and lets you reuse the logic anywhere.

---

## Common Mistakes

Forgetting the `n <= 1` check is the classic bug — without it, 1 is wrongly reported as prime. Another mistake is writing `i < std::sqrt(n)` instead of `i <= std::sqrt(n)`, which misses perfect squares like 25 (25 = 5 × 5). Finally, leaving out `break` in the basic version still gives the right answer but does unnecessary work.

---

## Related Articles

- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — for, while, and do-while explained
- [C++ Conditionals Tutorial](/posts/cpp-conditionals-tutorial/) — if, else, and switch
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — writing reusable helpers like isPrime
- [C++ Math Functions](/posts/cpp-math-functions/) — sqrt, pow, and the cmath library
- [C++ cin User Input](/posts/cpp-cin-user-input/) — reading numbers from the keyboard

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
