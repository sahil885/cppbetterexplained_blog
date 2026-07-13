---
title: "Star Pattern Programs in C++: Triangles, Pyramids, and Diamonds"
description: "Print star patterns in C++ with nested loops. Step-by-step code for right triangles, inverted triangles, pyramids, and diamonds, explained for beginners."
pubDatetime: 2026-07-13T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "loops", "tutorial"]
faqSchema:
  - question: "How do you print a star pattern in C++?"
    answer: "Use two nested loops: an outer loop that runs once per row and an inner loop that prints the stars for that row. Change how many stars the inner loop prints on each row to control the shape. Print a newline after each row."
  - question: "Why do star patterns use nested loops?"
    answer: "A pattern is a 2D grid, so you need one loop for rows and another for the columns within each row. The outer loop picks the row, and the inner loop draws that row's characters. Nesting them lets the column count depend on the current row."
  - question: "How do I center a pyramid pattern in C++?"
    answer: "Print leading spaces before the stars on each row. As the row number grows, print fewer spaces and more stars, so the widening rows stay centered under one another and form a symmetrical pyramid."
draft: false
featured: false
---

# Star Pattern Programs in C++

Printing star patterns is a rite of passage for every C++ beginner. They look impressive, but they all come down to one idea: **nested loops** — a loop inside a loop. Once that clicks, you can draw almost any shape on the console.

---

## The Core Idea: Rows and Columns

Every pattern is a grid. The **outer loop** handles the rows (top to bottom), and the **inner loop** handles the columns (left to right within a row). After each row, you print a newline to drop to the next line.

```cpp
#include <iostream>

int main() {
    int rows = 5;
    for (int i = 1; i <= rows; ++i) {      // outer: one pass per row
        for (int j = 1; j <= i; ++j) {     // inner: print i stars
            std::cout << "* ";
        }
        std::cout << "\n";                 // move to the next row
    }
    return 0;
}
```

Output:

```
*
* *
* * *
* * * *
* * * * *
```

The trick is the inner loop condition `j <= i`. On row 1, `i` is 1 so you print one star; on row 5, you print five. The number of stars **depends on the current row**, which is exactly why the loops are nested.

---

## Inverted Right Triangle

Flip the logic: start with the most stars and print one fewer each row. Just have the inner loop count down from `rows - i + 1`:

```cpp
#include <iostream>

int main() {
    int rows = 5;
    for (int i = 1; i <= rows; ++i) {
        for (int j = i; j <= rows; ++j) {  // fewer stars as i grows
            std::cout << "* ";
        }
        std::cout << "\n";
    }
    return 0;
}
```

Output:

```
* * * * *
* * * *
* * *
* *
*
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Centered Pyramid

A pyramid is a triangle plus **leading spaces**. Each row needs two inner loops: one to print the spaces that push the row toward the center, and one to print the stars. As rows widen, the spaces shrink.

```cpp
#include <iostream>

int main() {
    int rows = 5;
    for (int i = 1; i <= rows; ++i) {
        for (int s = 1; s <= rows - i; ++s)  // leading spaces
            std::cout << " ";
        for (int j = 1; j <= 2 * i - 1; ++j) // odd number of stars
            std::cout << "*";
        std::cout << "\n";
    }
    return 0;
}
```

Output:

```
    *
   ***
  *****
 *******
*********
```

Two details make this work. First, the spaces per row are `rows - i`, so they decrease as you go down. Second, the stars per row follow `2 * i - 1`, giving the odd counts (1, 3, 5, 7, 9) that keep the pyramid symmetrical.

---

## Diamond Pattern

A diamond is just a pyramid stacked on top of an inverted pyramid. Print the top half, then loop the bottom half in reverse:

```cpp
#include <iostream>

int main() {
    int n = 4;
    // Top half (including the widest row)
    for (int i = 1; i <= n; ++i) {
        for (int s = 1; s <= n - i; ++s) std::cout << " ";
        for (int j = 1; j <= 2 * i - 1; ++j) std::cout << "*";
        std::cout << "\n";
    }
    // Bottom half
    for (int i = n - 1; i >= 1; --i) {
        for (int s = 1; s <= n - i; ++s) std::cout << " ";
        for (int j = 1; j <= 2 * i - 1; ++j) std::cout << "*";
        std::cout << "\n";
    }
    return 0;
}
```

Output:

```
   *
  ***
 *****
*******
 *****
  ***
   *
```

The only difference between the two halves is the direction of the outer loop: the first counts up, the second counts down.

---

## How to Approach Any Pattern

When you meet a new pattern, ask three questions:

1. **How many rows?** That sets your outer loop.
2. **How many characters in each row, and does it depend on the row number?** That sets your inner loop condition.
3. **Are there leading spaces?** If the shape is centered or right-aligned, add a spaces loop before the stars.

Answer those and the code almost writes itself. Every pattern in this article uses the exact same skeleton — only the inner loop bounds change.

---

## Related Articles

- [C++ Nested Loops Explained](/posts/cpp-nested-loops/) — the technique behind every pattern
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — for, while, and do-while basics
- [Multiplication Table Program in C++](/posts/cpp-multiplication-table/) — another classic nested-loop exercise
- [C++ break and continue](/posts/cpp-break-continue/) — controlling loop flow
- [FizzBuzz in C++](/posts/cpp-fizzbuzz/) — a favorite beginner loop challenge

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
