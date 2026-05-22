---
title: "C++ Recursion Tutorial: How Recursive Functions Work"
description: "Learn C++ recursion from scratch. This beginner guide explains how recursive functions work, base cases, the call stack, and classic recursion examples including factorial, Fibonacci, and binary search."
pubDatetime: 2026-05-14T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "recursion", "tutorial"]
faqSchema:
  - question: "What is recursion in C++?"
    answer: "Recursion is when a function calls itself to solve a smaller version of the same problem. Every recursive function needs a base case (where it stops) and a recursive case (where it calls itself with a smaller input). Classic examples include factorial, Fibonacci, and binary search."
  - question: "What is a base case in recursion?"
    answer: "The base case is the condition that stops the recursion. Without a base case, the function would call itself forever until the stack runs out of memory (stack overflow). Every recursive function must have at least one base case that returns a value without making another recursive call."
  - question: "When should you use recursion vs a loop in C++?"
    answer: "Use recursion when the problem naturally breaks into smaller sub-problems of the same type — tree traversal, divide-and-conquer algorithms, and parsing nested structures are good candidates. Use loops for simple repetition where the iterative version is straightforward. Loops are generally faster due to lower overhead."
draft: false
featured: false
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/dyWeVKqaalA" title="C++ Recursion Tutorial: How Recursive Functions Work" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
# C++ Recursion Tutorial: How Recursive Functions Work

Recursion is one of those ideas that sounds circular at first — a function that calls itself? — but clicks quickly once you see it in action.

The key insight: some problems naturally break down into smaller versions of the same problem. Factorial of 5 is `5 × factorial(4)`. Factorial of 4 is `4 × factorial(3)`. And so on. Each step is the same operation on a slightly smaller input, until you hit a case that's simple enough to answer directly.

That's recursion. And once you understand it, you'll see it everywhere.

---

## The Classic Example: Factorial

Factorial of n (written n!) is the product of all integers from 1 to n:

- 5! = 5 × 4 × 3 × 2 × 1 = 120
- 0! = 1 (by definition)

Notice the pattern: `5! = 5 × 4!`. Each factorial is defined in terms of a smaller factorial. That's a perfect fit for recursion.

```cpp
#include <iostream>
using namespace std;

int factorial(int n) {
    // Base case: stop here
    if (n == 0) return 1;

    // Recursive case: call ourselves with a smaller input
    return n * factorial(n - 1);
}

int main() {
    cout << factorial(5) << endl;  // 120
    cout << factorial(0) << endl;  // 1
    return 0;
}
```

---

## The Two Parts of Every Recursive Function

Every recursive function has exactly two parts:

**1. Base case**: The simplest possible input, where you return a value directly without calling yourself. This is what stops the recursion.

**2. Recursive case**: Call yourself with a *smaller* input, moving toward the base case.

```cpp
int factorial(int n) {
    if (n == 0) return 1;         // Base case
    return n * factorial(n - 1); // Recursive case: n-1 is smaller
}
```

If you forget the base case, or your recursive case doesn't move toward it, the function calls itself forever. C++ will terminate the program with a stack overflow.

---

## What Happens on the Call Stack

When `factorial(3)` is called, here's exactly what happens:

```
factorial(3)
  → 3 * factorial(2)
        → 2 * factorial(1)
              → 1 * factorial(0)
                    → returns 1        ← base case reached
              → 1 * 1 = 1             ← result bubbles back up
        → 2 * 1 = 2
  → 3 * 2 = 6
```

Each function call is paused, waiting for the smaller call to complete. The answers bubble back up through the chain. The call stack is how the computer keeps track of all those paused calls — each call reserves a "stack frame" with its local variables and where to resume when the smaller call returns.

Deep recursion with large inputs can exhaust the stack. Typical stack sizes allow thousands to tens of thousands of frames before crashing.

---

## Fibonacci Numbers

The Fibonacci sequence is another classic: each number is the sum of the two before it.

0, 1, 1, 2, 3, 5, 8, 13, 21, 34...

```
fib(n) = fib(n-1) + fib(n-2)
fib(0) = 0
fib(1) = 1
```

In code:

```cpp
#include <iostream>
using namespace std;

int fib(int n) {
    if (n == 0) return 0;   // Base case 1
    if (n == 1) return 1;   // Base case 2
    return fib(n - 1) + fib(n - 2);  // Recursive case
}

int main() {
    for (int i = 0; i <= 10; i++) {
        cout << fib(i) << " ";
    }
    cout << endl;  // 0 1 1 2 3 5 8 13 21 34 55
    return 0;
}
```

This is correct but slow — `fib(40)` makes over a billion function calls because it recalculates the same sub-problems repeatedly. A loop-based version is much faster for large n. Recursion is elegant but not always efficient.

---

## Sum of an Array

Recursion isn't limited to math problems. Here's a recursive sum:

```cpp
#include <iostream>
using namespace std;

int sum(int arr[], int size) {
    if (size == 0) return 0;  // Empty array sums to 0
    return arr[0] + sum(arr + 1, size - 1);  // First element + rest
}

int main() {
    int nums[] = {1, 2, 3, 4, 5};
    cout << sum(nums, 5) << endl;  // 15
    return 0;
}
```

`arr + 1` advances the pointer to the next element. Each recursive call processes one fewer element, approaching the base case (empty array).

---

## Counting Down (and Up)

Simple countdown:

```cpp
void countdown(int n) {
    if (n < 0) return;  // Base case: stop
    cout << n << " ";
    countdown(n - 1);   // Recursive call first, then print
}
// countdown(5) → 5 4 3 2 1 0
```

Notice what happens if you print after the recursive call instead of before:

```cpp
void countup(int n) {
    if (n < 0) return;
    countup(n - 1);     // Recursive call first
    cout << n << " ";   // Print after
}
// countup(5) → 0 1 2 3 4 5
```

The order of printing relative to the recursive call reverses the output. This "print after returning" pattern is how recursive reversal works.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Binary Search (Recursive)

Binary search finds a target in a sorted array by repeatedly halving the search range. It's a natural fit for recursion:

```cpp
#include <iostream>
using namespace std;

int binarySearch(int arr[], int low, int high, int target) {
    if (low > high) return -1;  // Base case: not found

    int mid = (low + high) / 2;

    if (arr[mid] == target) return mid;        // Found it
    if (arr[mid] > target) return binarySearch(arr, low, mid - 1, target);  // Search left
    return binarySearch(arr, mid + 1, high, target);   // Search right
}

int main() {
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56};
    int size = 8;
    int target = 23;

    int result = binarySearch(arr, 0, size - 1, target);
    if (result != -1) cout << "Found at index " << result << endl;  // Found at index 5
    else cout << "Not found" << endl;
    return 0;
}
```

Each call reduces the search space by half. This is why binary search is O(log n).

---

## Recursion vs Loops: When to Use Which

Recursion and loops can solve many of the same problems. Here's when to reach for each:

**Use recursion when**:
- The problem naturally splits into smaller sub-problems (trees, graphs, divide-and-conquer)
- The recursive solution is significantly clearer than the loop version
- You're dealing with recursive data structures (linked lists, trees)

**Use loops when**:
- Simple repetition — count from 1 to 100, process every element in an array
- Performance matters — recursion has overhead (function call setup, stack frame allocation)
- The depth could be large — deep recursion risks stack overflow

Factorial and Fibonacci are cleaner with loops in production code, even though they're classic recursion teaching examples. Tree traversal is genuinely cleaner with recursion.

```cpp
// Iterative factorial — usually preferred for production
int factorial(int n) {
    int result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}
```

---

## Tail Recursion

**Tail recursion** is when the recursive call is the last thing the function does. Some compilers can optimise this into a loop (eliminating the stack overhead):

```cpp
// Non-tail recursive: multiplication happens AFTER the recursive call
int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);  // *n happens after
}

// Tail recursive: accumulator carries the result
int factorial(int n, int acc = 1) {
    if (n == 0) return acc;
    return factorial(n - 1, n * acc);  // Last thing done
}
```

In the tail-recursive version, no computation happens after the recursive call, so the compiler can reuse the same stack frame.

---

## Common Recursion Mistakes

**No base case**  
```cpp
int forever(int n) {
    return forever(n - 1);  // Calls itself forever → stack overflow
}
```

**Base case never reached**  
```cpp
int broken(int n) {
    if (n == 0) return 0;
    return broken(n + 1);  // Going the wrong direction — never reaches 0
}
```

Make sure your recursive case moves *toward* the base case, not away from it.

**Stack overflow on large inputs**  
`factorial(100000)` will overflow the stack before completing. Use iterative solutions for large inputs.

---

## Related Articles

- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — understand regular functions before recursion
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — the alternative to recursion for repetition
- [C++ Arrays Tutorial](/posts/cpp-arrays-tutorial/) — recursion on arrays is a classic pattern
- [C++ Interview Questions](/posts/cpp-interview-questions/) — recursion questions appear frequently in interviews

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
