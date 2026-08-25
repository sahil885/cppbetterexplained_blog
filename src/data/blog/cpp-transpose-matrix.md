---
title: "Transpose of a Matrix in C++: Full Program Explained Step by Step"
description: "Learn how to find the transpose of a matrix in C++ with complete working code. Covers rectangular matrices, in-place square transpose, and vector versions."
pubDatetime: 2026-08-25T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "arrays", "programs", "tutorial"]
faqSchema:
  - question: "What is the transpose of a matrix?"
    answer: "The transpose of a matrix flips it over its main diagonal, turning every row into a column and every column into a row. The element at row i column j moves to row j column i, so a 2 by 3 matrix becomes a 3 by 2 matrix."
  - question: "How do you transpose a matrix in C++?"
    answer: "Use two nested loops over the original matrix and assign transposed[j][i] = original[i][j]. The result array must have its rows and columns swapped, so a matrix declared as int a[2][3] transposes into int t[3][2]."
  - question: "Can you transpose a matrix in place in C++?"
    answer: "Only if the matrix is square, because a rectangular transpose changes the shape and will not fit in the original array. For a square matrix, loop with j starting at i plus one and swap a[i][j] with a[j][i], which uses no extra memory."
draft: false
featured: false
---

# Transpose of a Matrix in C++: Full Program Explained Step by Step

Transposing a matrix means flipping it over its diagonal: row 1 becomes column 1, row 2 becomes column 2, and so on. It shows up constantly in graphics, machine learning, and spreadsheet code — and it is one of the cleanest exercises for getting comfortable with [2D arrays](/posts/cpp-2d-array/).

The whole operation reduces to a single line inside two loops.

---

## What Transposing Actually Does

Take this 2×3 matrix:

```
1  2  3
4  5  6
```

Its transpose is 3×2:

```
1  4
2  5
3  6
```

Look at where each number went. The `2` was at row 0, column 1. It is now at row 1, column 0. The `6` was at row 1, column 2, and is now at row 2, column 1.

The rule is exactly that swap of coordinates:

```
transposed[j][i] = original[i][j]
```

Note the shape change too: an **R × C** matrix transposes into a **C × R** matrix. That is why you cannot write the result back into the original array unless the matrix is square.

---

## The Basic Program (Rectangular Matrix)

```cpp
#include <iostream>

int main() {
    const int ROWS = 2;
    const int COLS = 3;

    int matrix[ROWS][COLS] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    // Result has the dimensions swapped.
    int transposed[COLS][ROWS];

    for (int i = 0; i < ROWS; i++)
        for (int j = 0; j < COLS; j++)
            transposed[j][i] = matrix[i][j];

    std::cout << "Original (" << ROWS << "x" << COLS << "):\n";
    for (int i = 0; i < ROWS; i++) {
        for (int j = 0; j < COLS; j++)
            std::cout << matrix[i][j] << " ";
        std::cout << "\n";
    }

    std::cout << "\nTransposed (" << COLS << "x" << ROWS << "):\n";
    for (int i = 0; i < COLS; i++) {
        for (int j = 0; j < ROWS; j++)
            std::cout << transposed[i][j] << " ";
        std::cout << "\n";
    }

    return 0;
}
```

Output:

```
Original (2x3):
1 2 3
4 5 6

Transposed (3x2):
1 4
2 5
3 6
```

The loops still walk the **original** matrix in normal order — `i` over its rows, `j` over its columns. Only the assignment target has the indices reversed. Beginners often try to loop over the result instead and get tangled in bounds; walking the source is easier to reason about because `i` and `j` always mean the same thing.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## In-Place Transpose (Square Matrices Only)

If the matrix is square, you do not need a second array at all — you can swap pairs across the diagonal:

```cpp
#include <iostream>
#include <algorithm>

int main() {
    const int N = 3;
    int matrix[N][N] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };

    for (int i = 0; i < N; i++)
        for (int j = i + 1; j < N; j++)      // note: j starts at i + 1
            std::swap(matrix[i][j], matrix[j][i]);

    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++)
            std::cout << matrix[i][j] << " ";
        std::cout << "\n";
    }

    return 0;
}
```

Output:

```
1 4 7
2 5 8
3 6 9
```

**`j = i + 1` is the critical detail.** If you started `j` at 0, you would swap each pair twice — once as `(i, j)` and again as `(j, i)` — and the second swap would undo the first, leaving the matrix unchanged. Starting above the diagonal visits each pair exactly once. Elements on the diagonal itself (`matrix[i][i]`) never move, which is correct: they are already in their transposed position.

This version uses O(1) extra memory instead of a whole second matrix.

---

## The Vector Version (Any Size, Decided at Runtime)

Raw 2D arrays need their dimensions fixed at compile time. If the size comes from user input or a file, use a [2D vector](/posts/cpp-2d-vector/):

```cpp
#include <iostream>
#include <vector>

std::vector<std::vector<int>> transpose(const std::vector<std::vector<int>>& m) {
    if (m.empty()) return {};

    size_t rows = m.size();
    size_t cols = m[0].size();

    // Build a cols x rows grid filled with zeros.
    std::vector<std::vector<int>> result(cols, std::vector<int>(rows));

    for (size_t i = 0; i < rows; i++)
        for (size_t j = 0; j < cols; j++)
            result[j][i] = m[i][j];

    return result;
}

int main() {
    std::vector<std::vector<int>> matrix = {
        {1, 2, 3, 4},
        {5, 6, 7, 8}
    };

    std::vector<std::vector<int>> t = transpose(matrix);

    for (const auto& row : t) {
        for (int value : row)
            std::cout << value << " ";
        std::cout << "\n";
    }

    return 0;
}
```

Output:

```
1 5
2 6
3 7
4 8
```

Three things make this the version to prefer in real code: the function works for **any** dimensions, it takes the input by `const&` so nothing is copied going in, and the constructor `std::vector<std::vector<int>>(cols, std::vector<int>(rows))` sizes the result correctly in one line — `cols` outer rows, each containing `rows` elements.

---

## Reading a Matrix From the User

Putting it together with input:

```cpp
#include <iostream>
#include <vector>

int main() {
    int rows, cols;
    std::cout << "Enter rows and columns: ";
    std::cin >> rows >> cols;

    std::vector<std::vector<int>> m(rows, std::vector<int>(cols));

    std::cout << "Enter " << rows * cols << " values:\n";
    for (int i = 0; i < rows; i++)
        for (int j = 0; j < cols; j++)
            std::cin >> m[i][j];

    std::cout << "\nTranspose:\n";
    for (int j = 0; j < cols; j++) {
        for (int i = 0; i < rows; i++)
            std::cout << m[i][j] << " ";
        std::cout << "\n";
    }

    return 0;
}
```

Notice this version never builds a second matrix at all — it just **prints** in transposed order by making `j` the outer loop. If all you need is the transposed output, that is the cheapest possible approach: zero extra memory, zero copying.

---

## Related Articles

- [Matrix Multiplication in C++](/posts/cpp-matrix-multiplication/)
- [C++ 2D Arrays Explained](/posts/cpp-2d-array/)
- [2D Vectors in C++](/posts/cpp-2d-vector/)
- [Nested Loops in C++](/posts/cpp-nested-loops/)
- [How to Swap Two Numbers in C++](/posts/cpp-swap-two-numbers/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
