---
title: "C++ Array Length: How to Get the Size of an Array (5 Ways)"
description: "Get the length of an array in C++ five ways: sizeof, std::size, std::array, vector .size(), and inside a function. Copy-paste examples for every case."
modDatetime: 2026-08-04T00:00:00Z
pubDatetime: 2026-06-24T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "arrays", "tutorial"]
faqSchema:
  - question: "How do you find the size of an array in C++?"
    answer: "For a normal stack array, divide the total bytes by the bytes of one element: sizeof(arr) / sizeof(arr[0]). In C++17 and later you can also call std::size(arr) from the <iterator> header, which is clearer and safer."
  - question: "Why does sizeof give the wrong array size inside a function?"
    answer: "When you pass an array to a function it decays to a pointer, so sizeof returns the size of the pointer, not the array. Always pass the length as a separate parameter, or use a std::vector or std::array instead."
  - question: "How do you get the length of an int array in C++?"
    answer: "Exactly the same as any other array: int arr[10]; then sizeof(arr) / sizeof(arr[0]) gives 10, or std::size(arr) in C++17. The element type does not change the technique, because sizeof(arr[0]) adjusts automatically."
  - question: "Does C++ have an array.length or .size() like other languages?"
    answer: "Plain C-style arrays have no members at all, so arr.length and arr.size() do not compile. std::array and std::vector do have .size(), which is one of the main reasons to prefer them over raw arrays in modern C++."
  - question: "How do you find the size of a 2D array in C++?"
    answer: "Use sizeof(arr) / sizeof(arr[0]) for the number of rows, and sizeof(arr[0]) / sizeof(arr[0][0]) for the number of columns. std::size(arr) gives the row count directly in C++17."
  - question: "What is the difference between sizeof and std::size in C++?"
    answer: "sizeof returns a size in bytes, so you must divide to count elements. std::size, added in C++17, returns the element count directly and won't compile on a decayed pointer, which catches a common bug early."
draft: false
featured: false
---

# How to Find the Size of an Array in C++

C++ arrays don't carry a handy `.length` property like arrays in some other languages, so finding how many elements one holds trips up almost every beginner. The good news: there are two reliable ways to do it, plus one big trap you need to know about.

---

## How to Get the Length of an Array in C++

**The short answer:** for a plain C-style array, use `std::size(arr)` (C++17) or the `sizeof(arr) / sizeof(arr[0])` trick. For `std::vector` and `std::array`, just call the `.size()` member function. Each option is explained below — plus the pointer-decay trap that breaks all of them.

---

## The Classic sizeof Trick

`sizeof` tells you how many **bytes** something occupies. An array's total bytes divided by the bytes of a single element gives the number of elements:

```cpp
#include <iostream>

int main() {
    int scores[] = {90, 85, 70, 100, 60};
    int length = sizeof(scores) / sizeof(scores[0]);
    std::cout << "The array has " << length << " elements\n";  // 5
    return 0;
}
```

`sizeof(scores)` is the whole array (5 ints), and `sizeof(scores[0])` is one int. Divide them and you get 5. This works for any element type because the division cancels out the per-element size.

---

## The Modern Way: std::size (C++17)

Since C++17 there's a cleaner option that reads like plain English — `std::size`, from the `<iterator>` header:

```cpp
#include <iostream>
#include <iterator>   // for std::size

int main() {
    double prices[] = {1.99, 2.49, 0.99};
    std::cout << "Elements: " << std::size(prices) << "\n";  // 3
    return 0;
}
```

`std::size` returns the element count directly, so there's no dividing and no chance of mixing up the two `sizeof` calls. Prefer it whenever your compiler supports C++17 or newer.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Big Gotcha: Arrays Decay to Pointers

Here's the trap. Both tricks above only work where the array was *declared*. The moment you pass an array into a function, it "decays" into a pointer to its first element — and the size information is gone:

```cpp
#include <iostream>

void printSize(int arr[]) {
    // arr is really a pointer here, not the whole array
    std::cout << "Inside function: " << sizeof(arr) / sizeof(arr[0]) << "\n";
}

int main() {
    int data[] = {1, 2, 3, 4, 5, 6};
    std::cout << "In main: " << sizeof(data) / sizeof(data[0]) << "\n";  // 6
    printSize(data);  // prints 2 on a typical 64-bit system, NOT 6
    return 0;
}
```

In `main`, `sizeof` sees the real array and prints 6. Inside `printSize`, `sizeof(arr)` is the size of a *pointer* (8 bytes) divided by the size of an int (4 bytes), giving a meaningless 2. The fix is simple: pass the length as a second argument. This is exactly why `std::size` is safer — it refuses to compile on a decayed pointer instead of giving a wrong answer.

---

## std::array Knows Its Own Size

If you want a fixed-size array that *does* remember its length everywhere, use `std::array`. It behaves like a built-in array but carries a `.size()` method that always works:

```cpp
#include <iostream>
#include <array>

int main() {
    std::array<int, 4> nums = {10, 20, 30, 40};
    std::cout << "Size: " << nums.size() << "\n";  // 4
    return 0;
}
```

For a resizable list, `std::vector` works the same way with `.size()`. Both keep their length when passed to functions, which sidesteps the decay problem entirely.

---

## What About .size()? (Vectors and std::array)

If you're coming from another language and typed `arr.size()` on a plain array, you've hit a wall: **C-style arrays have no member functions.** But every standard container does. `std::vector`, `std::array`, and `std::string` all support `.size()`, which returns the number of elements as an unsigned `size_t`:

```cpp
std::vector<int> v = {1, 2, 3, 4};
std::array<int, 3> a = {10, 20, 30};
std::string s = "hello";

std::cout << v.size() << '\n';  // 4
std::cout << a.size() << '\n';  // 3
std::cout << s.size() << '\n';  // 5
```

This is the biggest practical reason to prefer `std::vector` or `std::array` over raw arrays: the size travels with the object, so there's nothing to compute and nothing to get wrong. If you find yourself repeatedly needing an array's length, that's usually a hint to switch to a [vector](/posts/cpp-vector-tutorial/).

## Getting the Length of an int Array (or Any Type)

The technique never changes with the element type — that's the point of dividing by `sizeof(arr[0])`:

```cpp
int    nums[10];
double vals[7];
char   letters[26];

std::cout << sizeof(nums)    / sizeof(nums[0])    << '\n';  // 10
std::cout << sizeof(vals)    / sizeof(vals[0])    << '\n';  // 7
std::cout << sizeof(letters) / sizeof(letters[0]) << '\n';  // 26
```

An `int` is usually 4 bytes and a `double` 8, but because the denominator scales with the type, the result is always the element count. Same with `std::size(nums)` — it returns 10 regardless of type.

## How to Get the Size of a 2D Array in C++

A [2D array](/posts/cpp-2d-array/) needs two calculations — rows and columns:

```cpp
int grid[3][5];

int rows = sizeof(grid)    / sizeof(grid[0]);     // 3
int cols = sizeof(grid[0]) / sizeof(grid[0][0]);  // 5
int total = rows * cols;                          // 15
```

`sizeof(grid)` is the whole block of memory, `sizeof(grid[0])` is one row, and `sizeof(grid[0][0])` is a single element. In C++17, `std::size(grid)` gives the row count and `std::size(grid[0])` the column count — much easier to read.

## Which Method Should You Use?

| You have | Get the length with | Works inside a function? |
|---|---|---|
| C-style array (`int arr[10]`) | `std::size(arr)` (C++17) or `sizeof(arr)/sizeof(arr[0])` | No — the array decays to a pointer |
| `std::array<int, 10>` | `arr.size()` | Yes |
| `std::vector<int>` | `vec.size()` | Yes |
| 2D array (`int g[3][5]`) | `sizeof(g)/sizeof(g[0])` for rows | No |
| C-string (`char s[]`) | `strlen(s)` for text length | Yes |

The pattern: if the length has to survive being passed around, use [std::vector](/posts/cpp-vector-tutorial/) or [std::array](/posts/cpp-std-array/). Raw arrays only know their own size in the scope where they were declared.

## Quick Reference

| Situation | How to get the size |
|-----------|---------------------|
| Stack array, same scope | `sizeof(a) / sizeof(a[0])` |
| C++17 or later | `std::size(a)` |
| Inside a function | pass the length as a parameter |
| Need a resizable list | use `std::vector` and `.size()` |
| Fixed size, but safer | use `std::array` and `.size()` |

---

## Related Articles

- [Best C++ Books and Resources for Beginners in 2026](/posts/best-cpp-books-resources/) — if you'd rather learn from one structured source than a hundred scattered tutorials, start here.
- [How to Learn C++ From Scratch: The Complete Roadmap](/learn-cpp/) — the full step-by-step learning path, in order, from your first program onward.
- [C++ Arrays Tutorial](/posts/cpp-arrays-tutorial/) — declaring and using arrays
- [How to Pass an Array to a Function in C++](/posts/cpp-pass-array-to-function/) — handle the decay problem
- [C++ Array vs Vector](/posts/cpp-array-vs-vector/) — when to switch to a vector
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — resizable lists that track their size
- [C++ 2D Arrays](/posts/cpp-2d-array/) — sizing arrays with more than one dimension

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
