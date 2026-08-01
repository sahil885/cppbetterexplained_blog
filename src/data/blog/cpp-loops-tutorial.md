---
title: "C++ Loops Tutorial: for, while, and do-while Explained"
description: "Master C++ loops with this complete tutorial. Covers for, while, do-while loops, range-based for, break, continue, and common loop patterns."
modDatetime: 2026-08-01T00:00:00Z
pubDatetime: 2026-04-19T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "loops", "tutorial"]
faqSchema:
  - question: "What are the types of loops in C++?"
    answer: "C++ has four loop types: for (for a known number of iterations), while (while a condition is true), do-while (runs at least once before checking the condition), and range-based for (for iterating over containers). Each suits different situations."
  - question: "What is the difference between while and do-while in C++?"
    answer: "A while loop checks its condition before executing the body, so it may run zero times. A do-while loop executes the body first, then checks the condition, guaranteeing at least one execution. Use do-while when you need the loop body to run at least once."
  - question: "What do break and continue do in C++ loops?"
    answer: "break immediately exits the loop, skipping all remaining iterations. continue skips the rest of the current iteration and jumps to the next one. Both work in for, while, and do-while loops."
draft: false
featured: false
---

# C++ Loops Tutorial: for, while, and do-while Explained

Imagine you need to print the numbers 1 to 100. Without loops, you'd write 100 separate `std::cout` statements. With a loop, it's three lines. Loops are one of the most fundamental building blocks in programming — they let you repeat a block of code without repeating yourself.

C++ has three loop types: `for`, `while`, and `do-while`. Each fits a different situation. This tutorial explains all three from scratch, with clear examples.

---

## Video Walkthrough

<iframe width="560" height="315" src="https://www.youtube.com/embed/X4i_p_ntOks" title="How to write an Infinite loop in C++" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

## The `for` Loop

The `for` loop is the most common loop in C++. Use it when you know exactly how many times you want to repeat something.

```cpp
for (initialisation; condition; update) {
    // body — runs each time condition is true
}
```

A concrete example — print numbers 1 to 5:

```cpp
#include <iostream>

int main() {
    for (int i = 1; i <= 5; i++) {
        std::cout << i << std::endl;
    }
    return 0;
}
```

Output:
```
1
2
3
4
5
```

Breaking down what happens on each iteration:

| Step | What C++ does |
|------|--------------|
| Before loop | `int i = 1` — initialise the counter |
| Check condition | `i <= 5` — if true, run the body |
| Run body | `std::cout << i` |
| Update | `i++` — increment, then check condition again |
| When false | Loop exits |

### Counting Down

You can count in any direction:

```cpp
for (int i = 5; i >= 1; i--) {
    std::cout << i << " ";
}
// Output: 5 4 3 2 1
```

### Counting by Steps

```cpp
for (int i = 0; i <= 20; i += 5) {
    std::cout << i << " ";
}
// Output: 0 5 10 15 20
```

### Nested `for` Loops

A loop inside a loop. The inner loop completes all its iterations for each iteration of the outer loop:

```cpp
for (int row = 1; row <= 3; row++) {
    for (int col = 1; col <= 3; col++) {
        std::cout << row << "x" << col << "=" << row * col << "  ";
    }
    std::cout << std::endl;
}
```

Output:
```
1x1=1  1x2=2  1x3=3  
2x1=2  2x2=4  2x3=6  
3x1=3  3x2=6  3x3=9  
```

---

## The Range-Based `for` Loop (C++11)

When iterating over a collection — an array, vector, or string — the range-based `for` loop is cleaner:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {85, 92, 78, 95, 88};

    for (int score : scores) {
        std::cout << score << " ";
    }
    // Output: 85 92 78 95 88

    return 0;
}
```

This reads as "for each `score` in `scores`" — no index, no size, no off-by-one risk.

For large objects like strings, use `const` reference to avoid copying:

```cpp
std::vector<std::string> names = {"Alice", "Bob", "Carol"};

for (const std::string& name : names) {
    std::cout << name << std::endl;
}
```

---

## The `while` Loop

The `while` loop repeats as long as a condition is true. Use it when you **don't know in advance** how many times you'll loop.

```cpp
while (condition) {
    // body
}
```

A simple example — keep halving a number until it's less than 1:

```cpp
#include <iostream>

int main() {
    double value = 100.0;

    while (value >= 1.0) {
        std::cout << value << std::endl;
        value /= 2;
    }

    return 0;
}
```

Output:
```
100
50
25
12.5
6.25
3.125
1.5625
```

### Reading User Input with `while`

`while` loops are natural for input validation:

```cpp
#include <iostream>

int main() {
    int number;
    std::cout << "Enter a positive number: ";
    std::cin >> number;

    while (number <= 0) {
        std::cout << "Invalid. Enter a positive number: ";
        std::cin >> number;
    }

    std::cout << "You entered: " << number << std::endl;
    return 0;
}
```

The loop keeps asking until the user provides valid input. You can't know in advance how many tries they'll need — so `while` is the right choice here.

### Infinite Loops

A `while (true)` loop runs forever until you explicitly break out of it:

```cpp
while (true) {
    // do something
    if (exitCondition) {
        break;  // exit the loop
    }
}
```

This pattern is common in game loops, server loops, and menu systems.

---

## The `do-while` Loop

The `do-while` loop is like a `while` loop, but **the body always runs at least once** — the condition is checked *after* the first execution.

```cpp
do {
    // body — runs at least once
} while (condition);
```

The most natural use case: menus where you always want to show the options at least once:

```cpp
#include <iostream>

int main() {
    int choice;

    do {
        std::cout << "\n--- Menu ---\n";
        std::cout << "1. Start game\n";
        std::cout << "2. Settings\n";
        std::cout << "3. Quit\n";
        std::cout << "Enter choice: ";
        std::cin >> choice;
    } while (choice != 3);

    std::cout << "Goodbye!" << std::endl;
    return 0;
}
```

The menu shows first, then checks if the user chose quit. With a regular `while`, you'd need to show the menu before the loop too — `do-while` avoids that duplication.

---

## `break` and `continue`

### `break` — Exit the Loop Early

`break` immediately exits the loop, regardless of the condition:

```cpp
#include <iostream>

int main() {
    for (int i = 1; i <= 10; i++) {
        if (i == 6) {
            break;  // stop when we hit 6
        }
        std::cout << i << " ";
    }
    // Output: 1 2 3 4 5
    return 0;
}
```

Common use: searching for a value and stopping once found.

```cpp
std::vector<int> data = {4, 7, 2, 9, 1, 5};
int target = 9;
bool found = false;

for (int i = 0; i < data.size(); i++) {
    if (data[i] == target) {
        std::cout << "Found " << target << " at index " << i << std::endl;
        found = true;
        break;  // no need to keep searching
    }
}
```

### `continue` — Skip to Next Iteration

`continue` skips the rest of the current iteration and jumps to the next:

```cpp
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        continue;  // skip even numbers
    }
    std::cout << i << " ";
}
// Output: 1 3 5 7 9
```

---

## Choosing the Right Loop

| Situation | Best Loop |
|-----------|-----------|
| You know exactly how many iterations | `for` |
| Iterating over a collection | Range-based `for` |
| Condition checked before each iteration, unknown count | `while` |
| Body must always run at least once | `do-while` |

In practice, `for` and range-based `for` cover the vast majority of cases. `while` is used for user input, event processing, and anything that reads until a condition changes. `do-while` is relatively rare — mainly menus and input prompts.

---

## Common Mistakes

**Off-by-one error:**

```cpp
// Wrong — prints 0 to 9, missing 10
for (int i = 0; i < 10; i++) { ... }  // if you wanted 1-10

// Correct — prints 1 to 10
for (int i = 1; i <= 10; i++) { ... }
```

**Forgetting to update in a while loop (infinite loop):**

```cpp
int i = 0;
while (i < 5) {
    std::cout << i << std::endl;
    // Missing: i++
    // This runs forever!
}
```

**Modifying the loop variable inside the body:**

```cpp
for (int i = 0; i < 10; i++) {
    std::cout << i << std::endl;
    i += 2;  // skips elements unexpectedly; hard to reason about
}
// Better: use the update expression to control step size
for (int i = 0; i < 10; i += 3) { ... }
```

---

## A Practical Example: Number Guessing Game

```cpp
#include <iostream>
#include <cstdlib>
#include <ctime>

int main() {
    srand(time(0));
    int secret = rand() % 100 + 1;  // random number 1-100
    int guess;
    int attempts = 0;

    std::cout << "Guess the number (1-100):" << std::endl;

    do {
        std::cout << "Your guess: ";
        std::cin >> guess;
        attempts++;

        if (guess < secret) {
            std::cout << "Too low!" << std::endl;
        } else if (guess > secret) {
            std::cout << "Too high!" << std::endl;
        }
    } while (guess != secret);

    std::cout << "Correct! You got it in " << attempts << " attempts." << std::endl;

    return 0;
}
```

This uses `do-while` because we always want at least one guess, and we don't know how many guesses the player will need.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

## Summary

C++ has three loop types: `for` (known iteration count), `while` (unknown count, condition first), and `do-while` (unknown count, body first). The range-based `for` loop from C++11 simplifies iterating over collections. Use `break` to exit early and `continue` to skip an iteration.

The most important habit: always double-check your loop condition and update expression before running. Off-by-one errors and accidental infinite loops are the two most common loop bugs.

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles
- [C++ Variables and Data Types: A Complete Beginner's Guide](/posts/cpp-variables-data-types/) — variables are what loops operate on; make sure you understand them first.
- [C++ Arrays Tutorial: Store and Access Multiple Values](/posts/cpp-arrays-tutorial/) — loops and arrays are used together constantly; learn how to iterate arrays properly.
- [C++ Functions Tutorial: How to Write and Use Functions](/posts/cpp-functions-tutorial/) — once you understand loops, wrapping them in functions is the next step.
- [C++ do-while Loop: How It Works and When to Use It](/posts/cpp-do-while-loop/) — a deeper look at the loop that always runs at least once.
- [C++ Switch Statement: How It Works with Examples](/posts/cpp-switch-statement/) — a cleaner alternative to long if-else chains when branching on one value.
- [C++ Ternary Operator: How to Use ? : in C++](/posts/cpp-ternary-operator/) — the one-line conditional for simple either/or choices.
