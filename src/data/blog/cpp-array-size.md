---
title: "How to Find the Size of an Array in C++ (Length of an Array)"
description: "Find the length of an array in C++ the right way: the sizeof trick, std::size in C++17, and why an array's size is lost once you pass it to a function."
modDatetime: 2026-08-01T00:00:00Z
pubDatetime: 2026-06-24T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "arrays", "tutorial"]
faqSchema:
  - question: "How do you find the size of an array in C++?"
    answer: "For a normal stack array, divide the total bytes by the bytes of one element: sizeof(arr) / sizeof(arr[0]). In C++17 and later you can also call std::size(arr) from the <iterator> header, which is clearer and safer."
  - question: "Why does sizeof give the wrong array size inside a function?"
    answer: "When you pass an array to a function it decays to a pointer, so sizeof returns the size of the pointer, not the array. Always pass the length as a separate parameter, or use a std::vector or std::array instead."
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

- [C++ Arrays Tutorial](/posts/cpp-arrays-tutorial/) — declaring and using arrays
- [How to Pass an Array to a Function in C++](/posts/cpp-pass-array-to-function/) — handle the decay problem
- [C++ Array vs Vector](/posts/cpp-array-vs-vector/) — when to switch to a vector
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — resizable lists that track their size
- [C++ 2D Arrays](/posts/cpp-2d-array/) — sizing arrays with more than one dimension

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
