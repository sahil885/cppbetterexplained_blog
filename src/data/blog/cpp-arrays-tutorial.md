---
title: "C++ Arrays Tutorial: Store and Access Multiple Values"
description: "Learn how arrays work in C++ from scratch. This beginner's tutorial covers declaring arrays, accessing elements, looping through arrays, std::vector, and common beginner mistakes."
pubDatetime: 2026-04-18T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "arrays", "vectors", "tutorial"]
draft: false
featured: false
---

# C++ Arrays Tutorial: Store and Access Multiple Values

Imagine you're building a program that tracks the scores of 10 students. With what you've learned so far, you'd create 10 separate variables:

```cpp
int score1 = 85;
int score2 = 92;
int score3 = 78;
// ... and so on to score10
```

Now imagine you want to find the average. You'd write:

```cpp
double average = (score1 + score2 + score3 + ...) / 10;
```

This is painful for 10 values. It's completely unworkable for 1000. Arrays solve this problem by letting you store multiple values of the same type under one name, and loop through them all with a few lines of code.

This tutorial covers arrays in C++, including the modern alternative (`std::vector`) that you'll use in most real code.

---

## What Is an Array?

An array is a collection of values of the same type, stored in contiguous memory, accessed by position (index).

Declaring an array:

```cpp
int scores[5];  // an array of 5 integers
```

Declaring and initializing at the same time:

```cpp
int scores[5] = {85, 92, 78, 95, 88};
```

If you provide all values, you can omit the size and let the compiler count:

```cpp
int scores[] = {85, 92, 78, 95, 88};  // compiler counts: size is 5
```

---

## Accessing Elements: Zero-Based Indexing

Array elements are accessed by their **index**, which starts at **0**, not 1.

```cpp
int scores[] = {85, 92, 78, 95, 88};
//               [0]  [1] [2]  [3]  [4]
```

To access individual elements:

```cpp
std::cout << scores[0] << std::endl;  // 85 (first element)
std::cout << scores[1] << std::endl;  // 92 (second element)
std::cout << scores[4] << std::endl;  // 88 (last element, index 4)
```

To modify an element:

```cpp
scores[2] = 80;  // changes the third element from 78 to 80
```

The most common beginner mistake with arrays is off-by-one errors — accessing `scores[5]` when the last valid index is `scores[4]`. This doesn't cause a compile error but causes **undefined behaviour** at runtime: the program might crash, produce garbage values, or behave unpredictably.

---

## The Size of an Array

For a raw C-style array, you need to know its size — there's no built-in method to ask it. The traditional workaround is `sizeof`:

```cpp
int scores[] = {85, 92, 78, 95, 88};
int size = sizeof(scores) / sizeof(scores[0]);  // 20 bytes / 4 bytes = 5
std::cout << "Size: " << size << std::endl;  // 5
```

In C++17 and later, you can use `std::size()`:

```cpp
#include <array>
int size = std::size(scores);  // 5
```

This limitation (arrays not knowing their own size) is one reason `std::vector` is preferred in modern C++.

---

## Looping Through Arrays

The most common operation with arrays is iterating through every element. The index-based `for` loop does this cleanly:

```cpp
int scores[] = {85, 92, 78, 95, 88};
int size = 5;

for (int i = 0; i < size; i++) {
    std::cout << "Score " << i + 1 << ": " << scores[i] << std::endl;
}
```

Output:
```
Score 1: 85
Score 2: 92
Score 3: 78
Score 4: 95
Score 5: 88
```

C++11 introduced the **range-based for loop**, which is cleaner when you don't need the index:

```cpp
for (int score : scores) {
    std::cout << score << std::endl;
}
```

This reads as "for each `score` in `scores`" — much closer to English.

---

## Common Array Operations

**Finding the sum and average:**

```cpp
int scores[] = {85, 92, 78, 95, 88};
int size = 5;
int total = 0;

for (int i = 0; i < size; i++) {
    total += scores[i];
}

double average = (double)total / size;
std::cout << "Average: " << average << std::endl;  // 87.6
```

**Finding the maximum:**

```cpp
int max = scores[0];  // start with first element
for (int i = 1; i < size; i++) {
    if (scores[i] > max) {
        max = scores[i];
    }
}
std::cout << "Max: " << max << std::endl;  // 95
```

**Searching for a value:**

```cpp
int target = 78;
bool found = false;
for (int i = 0; i < size; i++) {
    if (scores[i] == target) {
        std::cout << "Found " << target << " at index " << i << std::endl;
        found = true;
        break;
    }
}
if (!found) {
    std::cout << target << " not found" << std::endl;
}
```

---

## Passing Arrays to Functions

When you pass an array to a function, C++ passes a **pointer to the first element** — not a copy of the array. This means the function can modify the original array's elements.

Because of this, you typically pass the size separately:

```cpp
void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        std::cout << arr[i];
        if (i < size - 1) std::cout << ", ";
    }
    std::cout << std::endl;
}

double calculateAverage(int arr[], int size) {
    int total = 0;
    for (int i = 0; i < size; i++) {
        total += arr[i];
    }
    return (double)total / size;
}

int main() {
    int scores[] = {85, 92, 78, 95, 88};
    int size = 5;

    printArray(scores, size);
    std::cout << "Average: " << calculateAverage(scores, size) << std::endl;

    return 0;
}
```

---

## Two-Dimensional Arrays

Arrays can have multiple dimensions. A 2D array is like a table with rows and columns.

```cpp
int grid[3][4] = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
};

// Access: grid[row][column]
std::cout << grid[0][0] << std::endl;  // 1 (top-left)
std::cout << grid[1][2] << std::endl;  // 7 (row 1, column 2)
std::cout << grid[2][3] << std::endl;  // 12 (bottom-right)
```

Iterating a 2D array requires nested loops:

```cpp
for (int row = 0; row < 3; row++) {
    for (int col = 0; col < 4; col++) {
        std::cout << grid[row][col] << " ";
    }
    std::cout << std::endl;
}
```

Output:
```
1 2 3 4 
5 6 7 8 
9 10 11 12 
```

2D arrays are used for game boards, matrices, images, and any tabular data.

---

## `std::vector`: The Modern Alternative

Raw C-style arrays have limitations:
- Fixed size — you must know the size at compile time
- No built-in methods
- Prone to off-by-one errors and buffer overflows
- Don't know their own size

`std::vector` is the C++ Standard Library's dynamic array. It handles all of these issues:

```cpp
#include <vector>

std::vector<int> scores;  // starts empty, grows as needed

scores.push_back(85);
scores.push_back(92);
scores.push_back(78);

std::cout << "Size: " << scores.size() << std::endl;  // 3
std::cout << "First: " << scores[0] << std::endl;     // 85
```

You can also initialize it with values:

```cpp
std::vector<int> scores = {85, 92, 78, 95, 88};
```

### Useful `std::vector` Methods

```cpp
std::vector<int> v = {3, 1, 4, 1, 5};

v.push_back(9);       // add to end: {3, 1, 4, 1, 5, 9}
v.pop_back();         // remove last: {3, 1, 4, 1, 5}
v.size();             // number of elements: 5
v.empty();            // true if size == 0: false
v.front();            // first element: 3
v.back();             // last element: 5
v.clear();            // remove all elements
v.insert(v.begin() + 2, 99);  // insert 99 at position 2
v.erase(v.begin() + 1);       // remove element at position 1
```

### Sorting a Vector

```cpp
#include <algorithm>

std::vector<int> scores = {85, 92, 78, 95, 88};
std::sort(scores.begin(), scores.end());
// scores is now: {78, 85, 88, 92, 95}
```

Sort in descending order:

```cpp
std::sort(scores.begin(), scores.end(), std::greater<int>());
// scores is now: {95, 92, 88, 85, 78}
```

### Range-Based For Loop with Vector

```cpp
std::vector<int> scores = {85, 92, 78, 95, 88};

for (int score : scores) {
    std::cout << score << " ";
}
```

Use `const int& score` for large types to avoid copying:

```cpp
std::vector<std::string> names = {"Alice", "Bob", "Carol"};
for (const std::string& name : names) {
    std::cout << name << std::endl;
}
```

---

## When to Use Arrays vs. Vectors

**Use `std::vector` in almost all cases.** It's safer, more flexible, and has built-in size tracking. The performance difference from raw arrays is negligible in most programs.

**Use raw arrays when:**
- Working with legacy code or C libraries that expect raw arrays
- Writing embedded or systems code where dynamic allocation isn't available
- Declaring fixed-size data that never changes (like lookup tables)

In modern C++, there's also `std::array<T, N>` — a fixed-size array wrapper that knows its own size and has iterator support:

```cpp
#include <array>

std::array<int, 5> scores = {85, 92, 78, 95, 88};
std::cout << scores.size() << std::endl;  // 5
```

Use `std::array` instead of raw arrays when you know the size at compile time.

---

## A Practical Example: Statistics Calculator

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

int main() {
    std::vector<int> scores = {72, 85, 91, 68, 95, 88, 76, 82, 90, 79};

    // Sort for median and display
    std::sort(scores.begin(), scores.end());

    // Sum and average
    int total = std::accumulate(scores.begin(), scores.end(), 0);
    double average = (double)total / scores.size();

    // Min and max (from sorted vector)
    int minimum = scores.front();
    int maximum = scores.back();

    // Median
    double median;
    int n = scores.size();
    if (n % 2 == 0) {
        median = (scores[n/2 - 1] + scores[n/2]) / 2.0;
    } else {
        median = scores[n/2];
    }

    std::cout << "Scores (sorted): ";
    for (int s : scores) std::cout << s << " ";
    std::cout << std::endl;
    std::cout << "Count:   " << scores.size() << std::endl;
    std::cout << "Average: " << average << std::endl;
    std::cout << "Median:  " << median << std::endl;
    std::cout << "Min:     " << minimum << std::endl;
    std::cout << "Max:     " << maximum << std::endl;

    return 0;
}
```

Output:
```
Scores (sorted): 68 72 76 79 82 85 88 90 91 95 
Count:   10
Average: 82.6
Median:  83.5
Min:     68
Max:     95
```

---

## Common Mistakes

**Accessing out-of-bounds indices:**
```cpp
int arr[5] = {1, 2, 3, 4, 5};
std::cout << arr[5];  // undefined behaviour! valid indices are 0-4
```

**Forgetting zero-based indexing:**
```cpp
// Wrong — thinking the last element of a 5-element array is arr[5]
for (int i = 1; i <= 5; i++) { ... }

// Correct
for (int i = 0; i < 5; i++) { ... }
```

**Off-by-one in the loop condition:**
```cpp
int arr[5] = {10, 20, 30, 40, 50};
for (int i = 0; i <= 5; i++) {  // <= 5 goes one too far!
    std::cout << arr[i];
}
// Fix: use i < 5
```

**Using raw arrays when you need dynamic sizing:**
```cpp
int n;
std::cin >> n;
int scores[n];  // variable-length arrays: not standard in C++
// Fix: use std::vector<int> scores(n);
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

## Summary

Arrays store multiple values of the same type. Elements are accessed by zero-based index. Raw arrays have fixed size and don't know their own length — which is why `std::vector` is preferred in modern C++. Vectors grow dynamically, know their size, and come with built-in methods for sorting, searching, and manipulation.

Always initialize your arrays, be careful with index bounds, and prefer `std::vector` unless you have a specific reason to use a raw array.

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles
- [C++ Variables and Data Types: A Complete Beginner's Guide](/posts/cpp-variables-data-types/) — arrays store collections of typed variables; understand single variables first.
- [C++ Loops Tutorial: for, while, and do-while Explained](/posts/cpp-loops-tutorial/) — arrays and loops go hand in hand; iterating over an array with a for loop is one of the most common patterns in C++.
- [C++ Vector Tutorial: The Complete Guide to std::vector](/posts/cpp-vector-tutorial/) — vectors are the modern, safer alternative to raw arrays; learn when to use each.
- [C++ Functions Tutorial: How to Write and Use Functions](/posts/cpp-functions-tutorial/) — arrays are commonly passed to functions; learn how that works.
