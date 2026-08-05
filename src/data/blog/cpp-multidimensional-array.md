---
title: "C++ Multidimensional Array: 2D and 3D Arrays Explained"
description: "Learn C++ multidimensional arrays: how to declare, initialize, and loop over 2D and 3D arrays, pass them to functions, and when a vector is the better choice."
pubDatetime: 2026-06-09T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "arrays", "tutorial"]
faqSchema:
  - question: "What is a multidimensional array in C++?"
    answer: "A multidimensional array is an array of arrays — a grid of values accessed by more than one index. A 2D array like grid[3][4] has 3 rows and 4 columns, and you read an element with grid[row][col]."
  - question: "How do you loop through a 2D array in C++?"
    answer: "Use nested loops: an outer loop over the rows and an inner loop over the columns. Inside, access each element with array[i][j], where i is the row index and j is the column index."
  - question: "How do you pass a multidimensional array to a function in C++?"
    answer: "You must specify every dimension except the first: void print(int arr[][4], int rows). The column size has to be known at compile time. For flexible sizes, use a vector of vectors instead."
draft: false
featured: false
---

# C++ Multidimensional Array: 2D and 3D Arrays Explained

**A multidimensional array in C++ is an array of arrays — a grid you access with more than one index, like `grid[row][col]`.** They're perfect for tables, matrices, and game boards. Here's how to declare, fill, and loop over 2D and 3D arrays, and when to switch to a vector.

---

## Declaring a 2D Array

A 2D array needs two sizes: rows and columns. This makes a 3-row, 4-column grid of integers:

```cpp
#include <iostream>

int main() {
    int grid[3][4];          // 3 rows, 4 columns
    grid[0][0] = 1;          // top-left
    grid[2][3] = 99;         // bottom-right
    std::cout << grid[2][3] << "\n";  // 99
    return 0;
}
```

The first index selects the row, the second selects the column. Internally it's stored as 12 integers laid out row by row.

---

## Initializing with Values

You can fill a 2D array at the moment you declare it, using nested braces for clarity:

```cpp
int grid[2][3] = {
    {1, 2, 3},   // row 0
    {4, 5, 6}    // row 1
};
```

Each inner brace is one row. This is much easier to read than assigning each cell one by one, and the compiler checks that the shape matches.

---

## Looping with Nested Loops

To visit every element, use one loop for rows and a nested loop for columns:

```cpp
#include <iostream>

int main() {
    int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};

    for (int row = 0; row < 2; row++) {
        for (int col = 0; col < 3; col++) {
            std::cout << grid[row][col] << " ";
        }
        std::cout << "\n";
    }
    return 0;
}
```

The outer loop picks a row; the inner loop walks across that row's columns. This nested pattern is the standard way to process any 2D structure.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Passing a 2D Array to a Function

When passing a 2D array, you must tell the function every dimension except the first — the column count is required:

```cpp
#include <iostream>

void printGrid(int arr[][3], int rows) {   // column size (3) is required
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < 3; c++)
            std::cout << arr[r][c] << " ";
        std::cout << "\n";
    }
}

int main() {
    int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};
    printGrid(grid, 2);
    return 0;
}
```

The fixed column size is a real limitation: this function only works for arrays with exactly 3 columns. That rigidity is the main reason many C++ programmers prefer vectors for grids.

---

## 3D Arrays

Add a third dimension for, say, a stack of grids. The same rules apply with one more index:

```cpp
int cube[2][3][4];        // 2 layers, 3 rows, 4 columns
cube[1][2][3] = 7;        // last element of the second layer
```

You can go further, but beyond three dimensions arrays become hard to reason about — that's usually a sign to rethink your data structure.

---

## When to Use a Vector Instead

C-style multidimensional arrays have fixed sizes set at compile time and are awkward to pass around. If you need sizes decided at runtime, or want bounds-checked, resizable grids, use a `std::vector<std::vector<int>>` (a 2D vector). It trades a little raw speed for far more flexibility and safety.

---

## Related Articles

- [C++ Array Length: How to Get the Size of an Array](/posts/cpp-array-size/) — the sizeof trick, std::size, and why an array forgets its length inside a function.
- [C++ 2D Array Tutorial](/posts/cpp-2d-array/) — a deeper dive into 2D arrays
- [C++ 2D Vector](/posts/cpp-2d-vector/) — the flexible vector alternative
- [C++ Arrays Tutorial](/posts/cpp-arrays-tutorial/) — one-dimensional array basics
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — the nested loops used here

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
