---
title: "Nested Loops in C++: Patterns, Grids, and the Multiplication Table"
description: "Learn nested loops in C++ with beginner examples: print star patterns, a multiplication table, and row-and-column grids using an outer and inner for loop."
pubDatetime: 2026-06-24T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "loops", "tutorial"]
faqSchema:
  - question: "What is a nested loop in C++?"
    answer: "A nested loop is a loop placed inside another loop. The outer loop runs once for each complete pass of the inner loop, which makes nested loops ideal for rows-and-columns work like grids, tables, and patterns."
  - question: "How many times does a nested loop run?"
    answer: "Multiply the counts. If the outer loop runs 5 times and the inner loop runs 4 times, the inner body runs 5 times 4 = 20 times total. This is why deeply nested loops can get slow on large inputs."
  - question: "How do you print a star pattern in C++?"
    answer: "Use an outer loop for the rows and an inner loop for the stars in each row. Print a star inside the inner loop, then print a newline after the inner loop finishes to move down to the next row."
draft: false
featured: false
---

# Nested Loops in C++

A nested loop is simply a loop inside another loop. It's the tool you reach for whenever you're working with rows and columns — grids, tables, and the star patterns that show up in every beginner exercise set. Once you see how the two loops interact, all of those problems start to look the same.

---

## How a Nested Loop Works

The **outer** loop controls the rows; the **inner** loop runs fully for each single step of the outer loop. Watch the order things print:

```cpp
#include <iostream>

int main() {
    for (int row = 1; row <= 3; ++row) {
        for (int col = 1; col <= 4; ++col) {
            std::cout << "(" << row << "," << col << ") ";
        }
        std::cout << "\n";
    }
    return 0;
}
```

For `row = 1`, the inner loop runs all the way from `col = 1` to `col = 4`. Only then does `row` become 2 and the inner loop starts over. The `"\n"` *after* the inner loop is what moves you to the next row.

---

## Example 1: A Rectangle of Stars

Print stars in a fixed grid — outer loop for rows, inner loop for the stars across each row:

```cpp
#include <iostream>

int main() {
    int rows = 4, cols = 6;
    for (int r = 0; r < rows; ++r) {
        for (int c = 0; c < cols; ++c) {
            std::cout << "* ";
        }
        std::cout << "\n";
    }
    return 0;
}
```

This gives you a clean 4 by 6 block of stars. Change `rows` and `cols` to resize it.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Example 2: A Right-Triangle Pattern

Here's where nested loops get interesting. Make the inner loop's limit depend on the outer counter, and the shape changes:

```cpp
#include <iostream>

int main() {
    int height = 5;
    for (int r = 1; r <= height; ++r) {
        for (int c = 1; c <= r; ++c) {
            std::cout << "*";
        }
        std::cout << "\n";
    }
    return 0;
}
```

Row 1 prints 1 star, row 2 prints 2, and so on, because the inner loop runs `r` times. That single link — `c <= r` — turns a rectangle into a triangle. Almost every pattern puzzle is a variation of this idea.

---

## Example 3: The Multiplication Table

A times table is just a grid where each cell holds `row * column`. Using `std::setw` lines the numbers up in neat columns:

```cpp
#include <iostream>
#include <iomanip>

int main() {
    for (int i = 1; i <= 10; ++i) {
        for (int j = 1; j <= 10; ++j) {
            std::cout << std::setw(4) << i * j;
        }
        std::cout << "\n";
    }
    return 0;
}
```

The outer loop picks the row number, the inner loop walks across the columns, and `i * j` fills in each product. `std::setw(4)` reserves four spaces per number so the grid stays aligned.

---

## Watch the Iteration Count

Nested loops multiply work. Two loops of 10 means 100 inner steps; two loops of 1,000 means a *million*. That's fine for printing a small table, but it's worth remembering: as the numbers grow, nested loops grow much faster. When a problem feels slow, a hidden pair of nested loops is often the reason.

A quick tip: give your counters different names (`i`/`j` or `row`/`col`). Reusing the same variable for both loops is a classic beginner bug that breaks the inner loop's count.

---

## Related Articles

- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — for, while, and do-while basics
- [C++ break and continue](/posts/cpp-break-continue/) — control the flow inside loops
- [C++ 2D Arrays](/posts/cpp-2d-array/) — store the grids your loops walk over
- [C++ Arrays Tutorial](/posts/cpp-arrays-tutorial/) — the foundation for rows and columns
- [C++ Conditionals Tutorial](/posts/cpp-conditionals-tutorial/) — add logic inside your loops

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
