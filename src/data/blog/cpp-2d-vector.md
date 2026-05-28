---
title: "C++ 2D Vector: How to Create and Use a Vector of Vectors"
description: "Learn how to create, resize, and iterate over 2D vectors in C++. The flexible alternative to 2D arrays with beginner-friendly examples and common patterns."
pubDatetime: 2026-05-28T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "STL", "tutorial"]
faqSchema:
  - question: "What is a 2D vector in C++?"
    answer: "A 2D vector in C++ is a vector whose elements are themselves vectors — written as vector<vector<int>>. It acts like a grid or matrix but unlike a 2D array, it can be resized at runtime and each row can have a different length."
  - question: "How do you declare a 2D vector in C++?"
    answer: "Use vector<vector<int>> grid(rows, vector<int>(cols, 0)) to create a rows×cols grid filled with zeros. Replace int with any type you need."
  - question: "What is the difference between a 2D array and a 2D vector in C++?"
    answer: "A 2D array has a fixed size set at compile time. A 2D vector can be created and resized at runtime, and each row can have a different number of columns. 2D vectors are easier to work with in most beginner programs."
draft: false
featured: false
---

# C++ 2D Vector: How to Create and Use a Vector of Vectors

A regular `std::vector` holds a list of values. A 2D vector is a vector whose values are themselves vectors — giving you a **grid**, **matrix**, or **table** that you can resize at runtime. It's the flexible, modern alternative to fixed-size 2D arrays.

---

## Declaring a 2D Vector

The type is `vector<vector<T>>` where `T` is the element type:

```cpp
#include <iostream>
#include <vector>

int main() {
    // A 3x4 grid of integers, all initialised to 0
    int rows = 3, cols = 4;
    std::vector<std::vector<int>> grid(rows, std::vector<int>(cols, 0));

    std::cout << "Rows: " << grid.size() << "\n";
    std::cout << "Cols: " << grid[0].size() << "\n";

    return 0;
}
```

Output:
```
Rows: 3
Cols: 4
```

The constructor `std::vector<int>(cols, 0)` creates one row of `cols` zeros. Passing it as the second argument to the outer vector creates `rows` copies of that row.

---

## Accessing and Modifying Elements

Use double bracket notation `grid[row][col]`:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<std::vector<int>> grid(3, std::vector<int>(3, 0));

    // Set some values
    grid[0][0] = 1;
    grid[1][1] = 5;
    grid[2][2] = 9;

    // Print the grid
    for (int r = 0; r < 3; r++) {
        for (int c = 0; c < 3; c++) {
            std::cout << grid[r][c] << " ";
        }
        std::cout << "\n";
    }

    return 0;
}
```

Output:
```
1 0 0
0 5 0
0 0 9
```

---

## Using Range-Based for Loops

The modern C++ way to iterate is with range-based for loops. Use `auto&` to avoid copying each row:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<std::vector<int>> matrix = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };

    for (const auto& row : matrix) {
        for (int val : row) {
            std::cout << val << "\t";
        }
        std::cout << "\n";
    }

    return 0;
}
```

Output:
```
1	2	3
4	5	6
7	8	9
```

Initializing with `{ {1,2,3}, {4,5,6}, {7,8,9} }` uses an initializer list — a clean way to set up small grids.

---

## Adding Rows Dynamically

Because this is a vector, you can `push_back` new rows at runtime:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<std::vector<int>> table;

    // Add rows one at a time
    table.push_back({10, 20, 30});
    table.push_back({40, 50, 60});
    table.push_back({70, 80, 90});

    for (const auto& row : table) {
        for (int val : row) {
            std::cout << val << " ";
        }
        std::cout << "\n";
    }

    return 0;
}
```

You can also start with an empty outer vector and fill it entirely at runtime — useful when you don't know the dimensions until the program runs.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Jagged Vectors: Rows of Different Lengths

Unlike 2D arrays, each row in a 2D vector can have a different length:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<std::vector<int>> jagged;

    jagged.push_back({1});
    jagged.push_back({2, 3});
    jagged.push_back({4, 5, 6});

    for (const auto& row : jagged) {
        for (int val : row) {
            std::cout << val << " ";
        }
        std::cout << "\n";
    }

    return 0;
}
```

Output:
```
1
2 3
4 5 6
```

This is impossible with a traditional 2D array but trivial with a vector of vectors.

---

## 2D Vector vs 2D Array: Which to Use?

A [C++ 2D array](/posts/cpp-2d-array/) has fixed dimensions set at compile time. A 2D vector can be sized and resized at runtime. For most beginner programs, prefer the 2D vector — it's easier to pass to functions, safer to use, and more flexible. Only prefer a 2D array when you know the exact size at compile time and want raw performance.

---

## Passing a 2D Vector to a Function

Pass by const reference to avoid copying the entire grid:

```cpp
#include <iostream>
#include <vector>

void printGrid(const std::vector<std::vector<int>>& grid) {
    for (const auto& row : grid) {
        for (int val : row) {
            std::cout << val << " ";
        }
        std::cout << "\n";
    }
}

int main() {
    std::vector<std::vector<int>> g = {{1,2},{3,4},{5,6}};
    printGrid(g);
    return 0;
}
```

---

## Related Articles

- [C++ Vector Tutorial: The Complete Guide to std::vector](/posts/cpp-vector-tutorial/)
- [C++ 2D Arrays: How to Declare, Initialize, and Iterate](/posts/cpp-2d-array/)
- [C++ Arrays Tutorial: Store and Access Multiple Values](/posts/cpp-arrays-tutorial/)
- [C++ STL Containers Explained: Choosing the Right Container](/posts/stl-containers-cpp/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
