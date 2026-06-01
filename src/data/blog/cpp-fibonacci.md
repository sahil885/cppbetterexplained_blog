---
title: "C++ Fibonacci Program: Iterative, Recursive, and Memoized Approaches"
description: "Write a Fibonacci series program in C++ three ways: with a loop, with recursion, and with memoization. Includes full working code and clear explanations."
pubDatetime: 2026-06-01T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "algorithms", "tutorial"]
faqSchema:
  - question: "What is the Fibonacci sequence?"
    answer: "The Fibonacci sequence is a series of numbers where each term is the sum of the two before it: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34... It starts with 0 and 1, and from there each new number is simply previous + before_previous. It appears in nature, mathematics, and is a classic programming exercise."
  - question: "What is the most efficient way to compute Fibonacci in C++?"
    answer: "The iterative approach (using a loop) is the most efficient for most cases — it runs in O(n) time and uses O(1) memory. Recursive Fibonacci without memoization is O(2^n) and very slow for large inputs. Memoized recursion improves this to O(n) time but uses O(n) memory. For very large Fibonacci numbers, matrix exponentiation gives O(log n)."
  - question: "Why is recursive Fibonacci slow in C++?"
    answer: "Naive recursive Fibonacci recalculates the same subproblems over and over. Computing fib(10) calls fib(9) and fib(8); fib(9) calls fib(8) again, and so on. The number of calls grows exponentially — fib(40) makes over a billion recursive calls. Memoization fixes this by caching results so each subproblem is only solved once."
draft: false
featured: false
---

# C++ Fibonacci Program: Three Ways to Solve It

The Fibonacci sequence is one of the most classic exercises in programming — simple enough to understand immediately, but rich enough to teach you three important techniques: loops, recursion, and dynamic programming (memoization).

The sequence: **0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55...**

Each number is the sum of the two before it. That's the whole rule.

---

## Approach 1: Iterative (Best for Beginners)

A simple loop is the most practical and efficient solution:

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "How many terms? ";
    cin >> n;

    int a = 0, b = 1;

    cout << "Fibonacci sequence:" << endl;
    for (int i = 0; i < n; i++) {
        cout << a << " ";

        int next = a + b;
        a = b;
        b = next;
    }
    cout << endl;

    return 0;
}
```

Sample output (n = 8):
```
Fibonacci sequence:
0 1 1 2 3 5 8 13
```

How it works: `a` holds the current term, `b` holds the next. Each iteration we:
1. Print `a`
2. Calculate the next term (`a + b`)
3. Shift: `a` becomes `b`, `b` becomes the new term

This is **O(n) time, O(1) space** — extremely efficient.

---

## Finding the Nth Fibonacci Number

Often you want just the nth term, not the whole sequence:

```cpp
#include <iostream>
using namespace std;

long long fibonacci(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;

    long long a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        long long next = a + b;
        a = b;
        b = next;
    }
    return b;
}

int main() {
    for (int i = 0; i <= 10; i++) {
        cout << "fib(" << i << ") = " << fibonacci(i) << endl;
    }
    return 0;
}
```

Using `long long` lets you compute up to `fib(92)` before overflow (the number exceeds what `int` can hold around `fib(46)`).

---

## Approach 2: Recursive (Classic but Slow)

The mathematical definition maps naturally to recursion:

```
fib(0) = 0
fib(1) = 1
fib(n) = fib(n-1) + fib(n-2)
```

```cpp
#include <iostream>
using namespace std;

long long fib(int n) {
    if (n == 0) return 0;  // Base case
    if (n == 1) return 1;  // Base case

    return fib(n - 1) + fib(n - 2);  // Recursive case
}

int main() {
    cout << fib(10) << endl;  // 55
    cout << fib(20) << endl;  // 6765
    // cout << fib(50) << endl;  // DON'T — takes forever
    return 0;
}
```

This is elegant and easy to understand. But it's catastrophically slow for large inputs.

**Why?** `fib(5)` calls `fib(4)` and `fib(3)`. `fib(4)` calls `fib(3)` again. That `fib(3)` gets calculated multiple times, and the duplication compounds exponentially. Computing `fib(40)` requires over a billion function calls.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Approach 3: Memoized Recursion (Fast and Elegant)

Memoization caches the result of each `fib(n)` so it's never computed twice:

```cpp
#include <iostream>
#include <unordered_map>
using namespace std;

unordered_map<int, long long> memo;

long long fib(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;

    // Check if we already computed this
    if (memo.count(n)) {
        return memo[n];
    }

    // Compute and store
    memo[n] = fib(n - 1) + fib(n - 2);
    return memo[n];
}

int main() {
    cout << fib(50) << endl;   // 12586269025
    cout << fib(70) << endl;   // 190392490709135
    return 0;
}
```

Now `fib(50)` runs almost instantly. Each unique subproblem is solved exactly once and stored — this reduces time complexity from O(2^n) back to O(n), at the cost of O(n) memory for the cache.

---

## Printing the Full Series

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n = 15;
    vector<long long> fib(n);

    fib[0] = 0;
    fib[1] = 1;

    for (int i = 2; i < n; i++) {
        fib[i] = fib[i-1] + fib[i-2];
    }

    cout << "First " << n << " Fibonacci numbers:" << endl;
    for (long long num : fib) {
        cout << num << " ";
    }
    cout << endl;

    return 0;
}
```

Using a vector to store all terms is clean and gives you easy access to any term by index.

---

## Comparison

| Approach        | Time       | Space  | Best for                        |
|-----------------|------------|--------|---------------------------------|
| Iterative       | O(n)       | O(1)   | Most production use cases       |
| Recursive       | O(2^n)     | O(n)   | Understanding recursion         |
| Memoized        | O(n)       | O(n)   | Learning dynamic programming    |

For a beginner, start with the iterative approach. Once you're comfortable with recursion, implement the recursive version, then add memoization to see the speedup firsthand.

---

## Related Articles

- [C++ Recursion Tutorial: How Recursive Functions Work](/posts/cpp-recursion-tutorial/)
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/)
- [C++ Loops Tutorial: for, while, and do-while](/posts/cpp-loops-tutorial/)
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
