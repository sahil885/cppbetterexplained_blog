---
title: "Matrix Multiplication in C++: Full Program Explained Step by Step"
description: "Multiply two matrices in C++ with complete working code. Understand the triple loop, why inner dimensions must match, and how to do it with vectors safely."
pubDatetime: 2026-08-20T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "arrays", "tutorial"]
faqSchema:
  - question: "How do you multiply two matrices in C++?"
    answer: "Use three nested loops. The outer two walk every row of the first matrix and every column of the second, and the innermost loop sums the products of matching elements. Store each sum in the result matrix at that row and column."
  - question: "Why does matrix multiplication need the inner dimensions to match?"
    answer: "Each result element is the dot product of a row from the first matrix and a column from the second, so those two must have the same number of values. An m x n matrix can only multiply an n x p matrix, giving an m x p result."
  - question: "Should I use arrays or vectors for matrices in C++?"
    answer: "Use std::vector<std::vector<int>> for anything where the size is not known at compile time, because it resizes and carries its own dimensions. Fixed-size C-style arrays are fine for small learning examples but must have compile-time constant bounds."
draft: false
featured: false
---

# Matrix Multiplication in C++: Full Program Explained Step by Step

Matrix multiplication is the first algorithm most beginners meet that genuinely needs three nested loops. That's what makes it confusing — and what makes it worth working through carefully rather than copying.

The good news: once you see *why* there are three loops, the code writes itself.

---

## The Rule: Rows Times Columns

To multiply matrix **A** by matrix **B**, every element of the result is a **dot product** — one row of A paired with one column of B, multiplied element by element and summed.

Take A (2×3) and B (3×2):

```
A = | 1  2  3 |      B = | 7   8 |
    | 4  5  6 |          | 9  10 |
                         | 11 12 |
```

The element at result row 0, column 0 is row 0 of A times column 0 of B:

```
(1 x 7) + (2 x 9) + (3 x 11) = 7 + 18 + 33 = 58
```

Because each pairing walks the length of a row of A and a column of B, those must be the same length. That's the dimension rule:

**(m × n) × (n × p) → (m × p)**

The two `n`s must match. If they don't, the multiplication is undefined — and in C++ you'll read past the end of an array instead of getting an error, so check this yourself.

---

## The Complete Program

```cpp
#include <iostream>

int main() {
    const int m = 2, n = 3, p = 2;

    int A[m][n] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    int B[n][p] = {
        {7,   8},
        {9,  10},
        {11, 12}
    };

    int C[m][p] = {};        // zero-initialise the result

    for (int i = 0; i < m; ++i) {           // each row of A
        for (int j = 0; j < p; ++j) {       // each column of B
            for (int k = 0; k < n; ++k) {   // walk the row and column together
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    for (int i = 0; i < m; ++i) {
        for (int j = 0; j < p; ++j) {
            std::cout << C[i][j] << "\t";
        }
        std::cout << "\n";
    }
}
```

Output:

```
58	64
139	154
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Reading the Three Loops

The indices are the whole trick, so name them deliberately:

- **`i`** picks a **row of A** — and a row of the result.
- **`j`** picks a **column of B** — and a column of the result.
- **`k`** is the one that does the actual work: it slides along A's row and down B's column simultaneously.

Notice the asymmetry in the innermost line:

```cpp
C[i][j] += A[i][k] * B[k][j];
```

In `A[i][k]`, the `k` is the *column* index — moving right across the row. In `B[k][j]`, the same `k` is the *row* index — moving down the column. That mirror image is the dot product, written in C++.

The `+=` matters too. Each result cell accumulates `n` products, so it must start at zero — which is what `int C[m][p] = {};` guarantees. Leave that initialiser off and you sum onto whatever garbage was in memory.

---

## The Vector Version (Runtime Sizes)

C-style arrays need compile-time constant dimensions, so they're useless when the user types in the size. Vectors handle that:

```cpp
#include <iostream>
#include <vector>

std::vector<std::vector<int>> multiply(
        const std::vector<std::vector<int>>& A,
        const std::vector<std::vector<int>>& B) {

    int m = A.size();
    int n = B.size();          // == A[0].size() if valid
    int p = B[0].size();

    std::vector<std::vector<int>> C(m, std::vector<int>(p, 0));

    for (int i = 0; i < m; ++i)
        for (int j = 0; j < p; ++j)
            for (int k = 0; k < n; ++k)
                C[i][j] += A[i][k] * B[k][j];

    return C;
}

int main() {
    std::vector<std::vector<int>> A = {{1, 2, 3}, {4, 5, 6}};
    std::vector<std::vector<int>> B = {{7, 8}, {9, 10}, {11, 12}};

    if (A[0].size() != B.size()) {
        std::cout << "Dimensions do not match\n";
        return 1;
    }

    auto C = multiply(A, B);

    for (const auto& row : C) {
        for (int value : row) std::cout << value << "\t";
        std::cout << "\n";
    }
}
```

Two things this version buys you. The line

```cpp
std::vector<std::vector<int>> C(m, std::vector<int>(p, 0));
```

builds `m` rows, each a vector of `p` zeros — sizing and zeroing in one step. And because vectors know their own size, the dimension check `A[0].size() != B.size()` is something you can actually write, instead of hoping the caller got it right.

---

## Reading Matrices from User Input

For an interactive version, read the dimensions first and size the vectors from them:

```cpp
#include <iostream>
#include <vector>

int main() {
    int m, n;
    std::cout << "Rows and columns of A: ";
    std::cin >> m >> n;

    std::vector<std::vector<int>> A(m, std::vector<int>(n));

    std::cout << "Enter " << m * n << " values:\n";
    for (int i = 0; i < m; ++i)
        for (int j = 0; j < n; ++j)
            std::cin >> A[i][j];

    // ...same for B, then multiply
}
```

---

## Two Mistakes to Avoid

**Forgetting to zero the result.** `int C[m][p];` without `= {}` leaves indeterminate values, and `+=` adds to them. Your first row might even look right, which makes it worse.

**Swapping `B[k][j]` for `B[j][k]`.** This compiles happily and produces confidently wrong numbers — or reads out of bounds when the matrix isn't square. If your output is wrong, check this line first.

---

## A Note on Performance

The triple loop is **O(m × n × p)** — for two 1000×1000 matrices that's a billion multiply-add operations. Real numerical code uses cache-friendly loop orderings and libraries like Eigen or BLAS. For learning, and for the matrix sizes in any beginner exercise, the straightforward version above is exactly right.

---

## Related Articles

- [C++ 2D Array: How to Declare and Use Two-Dimensional Arrays](/posts/cpp-2d-array/)
- [C++ Nested Loops Explained](/posts/cpp-nested-loops/)
- [C++ Multidimensional Arrays](/posts/cpp-multidimensional-array/)
- [C++ 2D Vector: How to Create and Use a Vector of Vectors](/posts/cpp-2d-vector/)
- [How to Pass an Array to a Function in C++](/posts/cpp-pass-array-to-function/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
