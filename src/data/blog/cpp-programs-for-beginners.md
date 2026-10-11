---
title: "C++ Programs for Beginners: 40+ Examples With Full Code"
description: "40+ C++ example programs for beginners, grouped from easiest to hardest: number, string, array, sorting and game programs, each with full working code."
pubDatetime: 2026-10-11T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "programs", "practice"]
draft: false
featured: false
faqSchema:
  - question: "What are good C++ programs for beginners to practise?"
    answer: "Start with short programs that use one idea at a time: even or odd, swapping two numbers, a leap year check and a multiplication table. Then move on to number programs such as factorial, Fibonacci and prime numbers, then strings, arrays, sorting algorithms and finally small games."
  - question: "In what order should I practise C++ programs?"
    answer: "Follow the order of the concepts they use: input, output and conditions first; then loops; then functions and recursion; then strings and arrays; then sorting and searching; and finally small games and object-oriented projects that combine everything."
  - question: "Should I copy example programs or write them myself?"
    answer: "Write them yourself first, even badly. Read the problem, attempt it, then compare with the example. Typing out a solution you have not attempted teaches far less than struggling with it for ten minutes first."
  - question: "Can I run these C++ programs without installing anything?"
    answer: "Yes. Paste any of them into an online compiler such as OnlineGDB and press Run. To run them on your own computer you need a compiler such as g++, Visual Studio or Xcode."
---

# C++ Programs for Beginners: 40+ Examples With Full Code

**Short answer:** below are 40+ C++ example programs for beginners, grouped from easiest to hardest. Each one links to a full walkthrough with complete, working code you can run. Work down the list in order — every group builds on the one before it.

---

## How to Use This List

Reading example code feels productive. It mostly isn't. What builds skill is **attempting the program first**, getting stuck, and *then* reading the solution.

For each program:

1. Read the title and try to write it yourself — even a broken attempt.
2. Run it. Fix the errors you can.
3. Only then open the walkthrough and compare.

You can run everything here in your browser with an [online C++ compiler](/posts/cpp-online-compiler/), or on your own machine — see [how to run a .cpp file](/posts/how-to-run-cpp-file/).

## Three Examples to Start With

**Even or odd** — conditions and the `%` operator:

```cpp
#include <iostream>

int main() {
    int n;
    std::cout << "Enter a number: ";
    std::cin >> n;

    if (n % 2 == 0) std::cout << n << " is even\n";
    else            std::cout << n << " is odd\n";
}
```

**Factorial** — a loop that builds up a result:

```cpp
#include <iostream>

int main() {
    int n = 5;
    long long result = 1;

    for (int i = 2; i <= n; ++i) {
        result *= i;
    }
    std::cout << n << "! = " << result << '\n';   // 5! = 120
}
```

**Reverse a string** — working with text:

```cpp
#include <algorithm>
#include <iostream>
#include <string>

int main() {
    std::string word = "hello";
    std::reverse(word.begin(), word.end());
    std::cout << word << '\n';   // olleh
}
```

If those three made sense, you're ready for the list. If any of them didn't, start with [C++ Hello World explained](/posts/cpp-hello-world-explained/) and the [loops tutorial](/posts/cpp-loops-tutorial/).

<div class="inline-cta"><strong>Practising the fundamentals?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> explains the concepts behind these programs — and the parts that trip most beginners up, like pointers, memory and OOP — in 87 plain-English pages. Just $19.</div>

## 1. Starter Programs

One idea each: input, output, conditions and simple loops.

| Program | What you practise |
|---|---|
| [Even or odd](/posts/cpp-even-odd-program/) | Conditions, the `%` operator |
| [Swap two numbers](/posts/cpp-swap-two-numbers/) | Variables, temporaries, `std::swap` |
| [Leap year checker](/posts/cpp-leap-year-program/) | Combining conditions with `&&` and `\|\|` |
| [Temperature converter](/posts/cpp-temperature-conversion-program/) | Arithmetic, `double`, formatting output |
| [Multiplication table](/posts/cpp-multiplication-table/) | `for` loops |
| [FizzBuzz](/posts/cpp-fizzbuzz/) | Loops plus conditions — the classic test |
| [Grade calculator](/posts/cpp-grade-calculator/) | `if` / `else if` chains |
| [Calculator](/posts/cpp-calculator-program/) | `switch`, input handling |

## 2. Number Programs

Loops, recursion and a little maths.

| Program | What you practise |
|---|---|
| [Factorial](/posts/cpp-factorial-program/) | Loops vs recursion |
| [Fibonacci](/posts/cpp-fibonacci/) | Recursion, iteration, memoisation |
| [Prime numbers](/posts/cpp-prime-number-program/) | Nested loops, early exit |
| [Palindrome](/posts/cpp-palindrome-program/) | Reversing numbers and strings |
| [Armstrong numbers](/posts/cpp-armstrong-number-program/) | Extracting digits, `pow` |
| [Sum of digits](/posts/cpp-sum-of-digits/) | `%` and `/` to take a number apart |
| [Reverse a number](/posts/cpp-reverse-number/) | `while` loops |
| [GCD and LCM](/posts/cpp-gcd-lcm/) | The Euclidean algorithm |
| [Powers and exponents](/posts/cpp-exponent-power/) | Why `^` isn't power, `std::pow` |
| [Binary to decimal](/posts/cpp-binary-to-decimal/) | Number bases |

## 3. String Programs

Working with text and characters.

| Program | What you practise |
|---|---|
| [Reverse a string](/posts/cpp-reverse-string/) | `std::string`, `std::reverse` |
| [Count vowels](/posts/cpp-count-vowels-string/) | Looping over characters |
| [Count words](/posts/cpp-word-count-program/) | `std::stringstream` |
| [Uppercase and lowercase](/posts/cpp-uppercase-lowercase/) | `toupper`, `tolower`, `std::transform` |

## 4. Array and Matrix Programs

Storing and processing collections.

| Program | What you practise |
|---|---|
| [Sum of array elements](/posts/cpp-sum-of-array-elements/) | Loops, `std::accumulate` |
| [Find max and min](/posts/cpp-find-max-min/) | `std::max_element`, `std::min_element` |
| [Matrix multiplication](/posts/cpp-matrix-multiplication/) | 2D arrays, triple loops |
| [Transpose a matrix](/posts/cpp-transpose-matrix/) | 2D indexing |

## 5. Searching and Sorting

The algorithms every course and interview covers.

| Program | What you practise |
|---|---|
| [Linear search](/posts/cpp-linear-search/) | The simplest search |
| [Binary search](/posts/cpp-binary-search/) | Halving a sorted range |
| [Bubble sort](/posts/bubble-sort-cpp/) | Swapping neighbours |
| [Selection sort](/posts/cpp-selection-sort/) | Finding the minimum repeatedly |
| [Insertion sort](/posts/insertion-sort-cpp/) | Building a sorted section |
| [Merge sort](/posts/merge-sort-algorithm-cpp/) | Divide and conquer, recursion |
| [Quick sort](/posts/cpp-quick-sort/) | Partitioning |
| [Heap sort](/posts/cpp-heap-sort/) | Heaps |

## 6. Games and Projects

Bigger programs that combine everything above.

| Program | What you practise |
|---|---|
| [Number guessing game](/posts/cpp-number-guessing-game/) | Random numbers, loops, input |
| [Rock paper scissors](/posts/cpp-rock-paper-scissors/) | Game logic, `enum` |
| [Menu-driven program](/posts/cpp-menu-driven-program/) | Program structure, functions |
| [Tic tac toe](/posts/cpp-tic-tac-toe/) | 2D arrays, win checks |
| [Lottery program](/posts/lottery-program-cpp/) | Arrays, random numbers |
| [Bank account](/posts/cpp-bank-account-program/) | Classes and encapsulation |
| [Traffic light simulation](/posts/traffic-light-project/) | OOP basics |
| [Blackjack](/posts/blackjack-cpp-using-classes/) | Multiple classes working together |

Ready for something bigger? See the [guided beginner projects](/posts/cpp-beginner-projects/).

## A Suggested Four-Week Plan

| Week | Work through |
|---|---|
| 1 | Starter programs |
| 2 | Number programs |
| 3 | Strings, arrays, and the first three searching and sorting programs |
| 4 | The rest of the sorting algorithms, then one game |

Half an hour a day is enough. Consistency beats long weekend sessions.

---

## Take Your C++ Further

These programs teach you to *write* C++. If you want the concepts underneath explained properly — especially pointers, memory and OOP, which the later programs lean on — the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers them in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ Projects for Beginners](/posts/cpp-beginner-projects/) — four larger guided projects.
- [Online C++ Compilers](/posts/cpp-online-compiler/) — run any of these in your browser.
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — the concept most of these programs depend on.
- [How to Start Learning C++](/posts/how-to-start-learning-cpp/) — the order to learn things in.
- [C++ Cheat Sheet](/posts/cpp-cheat-sheet/) — the syntax at a glance.
