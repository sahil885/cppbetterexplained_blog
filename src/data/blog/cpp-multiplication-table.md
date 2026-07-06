---
title: "Multiplication Table Program in C++ (Using Loops)"
description: "Write a multiplication table program in C++ using loops. A clear beginner walkthrough with cin input, neat formatted output, and a full nested-loop grid."
pubDatetime: 2026-07-06T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "loops", "tutorial"]
faqSchema:
  - question: "How do you print a multiplication table in C++?"
    answer: "Use a for loop that runs from 1 to 10 and prints n * i on each pass. For a full grid, nest a second loop inside the first so every row multiplies by every column."
  - question: "How do I make the multiplication table line up neatly?"
    answer: "Use std::setw from the <iomanip> header to give each number a fixed width. Writing std::cout << std::setw(4) << value pads shorter numbers with spaces so the columns align."
  - question: "How do I let the user choose the number for the table?"
    answer: "Read it with std::cin. Print a prompt, then use std::cin >> n to store the user's number, and multiply n inside the loop to print that number's table."
draft: false
featured: false
---

# Multiplication Table Program in C++

Printing a multiplication table is one of the best first programs you can write, because it teaches loops in the most visual way possible. We'll start with a single table, add user input, make it line up neatly, then build the full grid.

---

## The Simplest Version: One Number's Table

A multiplication table for `7` is just `7 x 1`, `7 x 2`, and so on up to `7 x 10`. A single `for` loop handles it perfectly — the loop counter becomes the number we multiply by:

```cpp
#include <iostream>

int main() {
    int n = 7;
    for (int i = 1; i <= 10; ++i) {
        std::cout << n << " x " << i << " = " << n * i << "\n";
    }
    return 0;
}
```

Output:

```
7 x 1 = 7
7 x 2 = 14
...
7 x 10 = 70
```

Each time through the loop, `i` climbs by one, and `n * i` gives the next line. That's the whole idea.

---

## Letting the User Pick the Number

A hard-coded `7` is boring. Let's ask the user which table they want with `std::cin`:

```cpp
#include <iostream>

int main() {
    int n;
    std::cout << "Enter a number: ";
    std::cin >> n;

    for (int i = 1; i <= 10; ++i) {
        std::cout << n << " x " << i << " = " << n * i << "\n";
    }
    return 0;
}
```

Now the program works for any number the user types. This tiny change — reading input instead of fixing the value — is what turns a snippet into a real, reusable program.

---

## Making the Output Line Up

Once numbers get into the hundreds, the columns look ragged. The `<iomanip>` header gives us `std::setw`, which pads each value to a fixed width so everything aligns:

```cpp
#include <iostream>
#include <iomanip>

int main() {
    int n = 12;
    for (int i = 1; i <= 10; ++i) {
        std::cout << std::setw(2) << n << " x "
                  << std::setw(2) << i << " = "
                  << std::setw(3) << n * i << "\n";
    }
    return 0;
}
```

`std::setw(3)` reserves three character slots for the result, so `24` and `120` still end in the same column. Neat output makes your programs feel polished.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Full Grid: A Times Table

To print the classic 10x10 times table, you need a loop *inside* a loop. The outer loop picks the row; the inner loop walks across the columns:

```cpp
#include <iostream>
#include <iomanip>

int main() {
    for (int row = 1; row <= 10; ++row) {
        for (int col = 1; col <= 10; ++col) {
            std::cout << std::setw(4) << row * col;
        }
        std::cout << "\n";   // move to the next line after each row
    }
    return 0;
}
```

The inner loop runs completely (all 10 columns) for **each** step of the outer loop, producing a tidy grid. Notice the `"\n"` sits *outside* the inner loop — that's what ends each row. This nested-loop pattern is the foundation for grids, boards, and tables of every kind.

---

## Recap: What Each Piece Does

- A single `for` loop prints one number's table.
- `std::cin >> n` lets the user choose the number.
- `std::setw` from `<iomanip>` aligns the columns.
- A **nested** loop turns one table into a full grid.

Master this and you've genuinely understood loops — the workhorse of every C++ program.

---

## Related Articles

- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — for, while, and do-while explained
- [C++ Nested Loops](/posts/cpp-nested-loops/) — patterns and grids in depth
- [C++ User Input with cin](/posts/cpp-cin-user-input/) — reading from the keyboard
- [C++ Output Formatting with iomanip](/posts/cpp-iomanip-formatting/) — setw, setprecision, and more
- [FizzBuzz in C++](/posts/cpp-fizzbuzz/) — another classic loop exercise

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
