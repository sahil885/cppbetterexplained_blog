---
title: "C++ 2D Arrays: How to Declare, Initialize, and Iterate"
description: "Learn how to use 2D arrays in C++: declaration, initialization, nested loops, passing to functions, and when to use vectors instead. Beginner tutorial."
pubDatetime: 2026-05-21T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "arrays", "tutorial"]
faqSchema:
  - question: "How do you declare a 2D array in C++?"
    answer: "You declare a 2D array with the syntax: type name[rows][cols]; For example, `int grid[3][4];` creates a 3-row, 4-column array of integers. You must specify both dimensions."
  - question: "How do you iterate over a 2D array in C++?"
    answer: "Use nested for loops: an outer loop over rows and an inner loop over columns. For example: `for (int i = 0; i < rows; i++) { for (int j = 0; j < cols; j++) { /* use grid[i][j] */ } }`"
  - question: "What is the difference between a 2D array and a vector of vectors in C++?"
    answer: "A 2D array has a fixed size set at compile time and is stored in contiguous memory. A vector of vectors (vector<vector<int>>) can be resized at runtime and each row can have a different length, but it's slightly slower and uses more memory due to multiple allocations."
draft: false
featured: false
---

# C++ 2D Arrays: How to Declare, Initialize, and Iterate

A 2D array is exactly what it sounds like: an array with rows and columns, like a grid or a table. It's the natural data structure for anything you'd visualize in rows and columns — a game board, a matrix, a spreadsheet of values, or a pixel grid.

---

## Declaring and Initializing a 2D Array

```cpp
#include <iostream>

int main() {
    // Declare: 3 rows, 4 columns
    int grid[3][4];

    // Initialize with values (row by row)
    int matrix[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    std::cout << matrix[0][0] << "\n";  // 1 (row 0, col 0)
    std::cout << matrix[1][2] << "\n";  // 6 (row 1, col 2)

    return 0;
}
```

The first index is the row, the second is the column. Like a regular array, both indices are zero-based.

---

## Iterating with Nested Loops

The standard way to visit every element is with nested `for` loops:

```cpp
#include <iostream>

int main() {
    int scores[3][3] = {
        {85, 90, 78},
        {92, 88, 95},
        {70, 76, 82}
    };

    // Print the grid
    for (int row = 0; row < 3; row++) {
        for (int col = 0; col < 3; col++) {
            std::cout << scores[row][col] << "\t";
        }
        std::cout << "\n";
    }

    return 0;
}
```

Output:
```
85    90    78
92    88    95
70    76    82
```

The outer loop moves down the rows; the inner loop scans across the columns within each row.

---

## Practical Example: Tic-Tac-Toe Board

```cpp
#include <iostream>

int main() {
    char board[3][3] = {
        {'X', 'O', 'X'},
        {'O', 'X', 'O'},
        {'O', 'X', 'X'}
    };

    std::cout << "--- Tic-Tac-Toe Board ---\n";
    for (int row = 0; row < 3; row++) {
        for (int col = 0; col < 3; col++) {
            std::cout << board[row][col];
            if (col < 2) std::cout << " | ";
        }
        std::cout << "\n";
        if (row < 2) std::cout << "---------\n";
    }

    return 0;
}
```

Output:
```
--- Tic-Tac-Toe Board ---
X | O | X
---------
O | X | O
---------
O | X | X
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Passing a 2D Array to a Function

When passing a 2D array to a function, you must specify the number of columns (the second dimension). The first dimension is optional but good to include for clarity:

```cpp
#include <iostream>

const int ROWS = 2;
const int COLS = 3;

void printMatrix(int arr[ROWS][COLS]) {
    for (int i = 0; i < ROWS; i++) {
        for (int j = 0; j < COLS; j++) {
            std::cout << arr[i][j] << " ";
        }
        std::cout << "\n";
    }
}

int sumMatrix(int arr[ROWS][COLS]) {
    int total = 0;
    for (int i = 0; i < ROWS; i++)
        for (int j = 0; j < COLS; j++)
            total += arr[i][j];
    return total;
}

int main() {
    int data[ROWS][COLS] = {{1, 2, 3}, {4, 5, 6}};
    printMatrix(data);
    std::cout << "Sum: " << sumMatrix(data) << "\n";  // 21
    return 0;
}
```

---

## When to Use vector<vector<int>> Instead

Plain 2D arrays have a fixed size that must be known at compile time. If you need a grid whose size is determined at runtime, use a vector of vectors:

```cpp
#include <iostream>
#include <vector>

int main() {
    int rows, cols;
    std::cout << "Enter rows and cols: ";
    std::cin >> rows >> cols;

    // Create a rows x cols grid initialized to 0
    std::vector<std::vector<int>> grid(rows, std::vector<int>(cols, 0));

    // Fill with row * col product
    for (int i = 0; i < rows; i++)
        for (int j = 0; j < cols; j++)
            grid[i][j] = (i + 1) * (j + 1);

    // Print
    for (auto& row : grid) {
        for (int val : row)
            std::cout << val << "\t";
        std::cout << "\n";
    }

    return 0;
}
```

Use a plain 2D array when the size is fixed and known. Use `vector<vector<T>>` when the size is dynamic or when you need to resize rows independently.

---

## Related Articles

- [C++ Array Length: How to Get the Size of an Array](/posts/cpp-array-size/) — the sizeof trick, std::size, and why an array forgets its length inside a function.
- [C++ Arrays Tutorial: Store and Access Multiple Values](/posts/cpp-arrays-tutorial/)
- [C++ Vector Tutorial: The Complete Guide to std::vector](/posts/cpp-vector-tutorial/)
- [C++ Loops Tutorial: for, while, and do-while Explained](/posts/cpp-loops-tutorial/)
- [C++ Array vs Vector: Which Should You Use?](/posts/cpp-array-vs-vector/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
