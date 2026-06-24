---
title: "How to Pass an Array to a Function in C++ (The Right Way)"
description: "Learn how to pass an array to a function in C++: pointer decay, why you must pass the length, modifying in place, and how a std::vector makes it safer."
pubDatetime: 2026-06-24T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "arrays", "functions"]
faqSchema:
  - question: "How do you pass an array to a function in C++?"
    answer: "Declare the parameter as type arr[] and pass just the array's name when calling, like average(scores, n). Because the array decays to a pointer, you should also pass its length so the function knows how many elements exist."
  - question: "Is an array passed by value or by reference in C++?"
    answer: "Neither in the usual sense — the array decays to a pointer to its first element, so the function works on the original data, not a copy. Changes made inside the function are visible to the caller."
  - question: "Why do I need to pass the array size to a function?"
    answer: "Once an array decays to a pointer, sizeof can no longer tell the function how long it is. Passing the length lets your loop stop in the right place and avoids reading past the end of the array."
draft: false
featured: false
---

# How to Pass an Array to a Function in C++

Passing an array to a function looks simple, but C++ does something surprising behind the scenes that catches almost every beginner: the array doesn't go in as a whole array. Understand that one detail and array-and-function code stops being mysterious.

---

## The Basic Syntax

Write the parameter with square brackets, and when you call the function, pass only the array's **name** — no brackets:

```cpp
#include <iostream>

double average(int arr[], int n) {
    int sum = 0;
    for (int i = 0; i < n; ++i)
        sum += arr[i];
    return static_cast<double>(sum) / n;
}

int main() {
    int scores[] = {80, 90, 100, 70};
    int n = sizeof(scores) / sizeof(scores[0]);
    std::cout << "Average: " << average(scores, n) << "\n";  // 85
    return 0;
}
```

Notice we pass `n`, the number of elements, as a second argument. That's not optional bookkeeping — it's required, and here's why.

---

## Why You Must Pass the Length

When an array is passed to a function, it **decays** into a pointer to its first element. The function never receives the array's length, so a trick like `sizeof(arr) / sizeof(arr[0])` would *not* work inside the function — it would measure the pointer, not the array.

That's the reason for the extra `int n`. Without it, your loop has no idea where the array ends, and reading past the end is a common source of crashes and garbage values. Pass the length and your loop always stops in the right place.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Arrays Are Effectively Passed by Reference

Because the function holds a pointer to the *original* array, any change it makes is seen by the caller — there's no copy. That's different from passing a single `int`, which *is* copied. Watch this function change the caller's data directly:

```cpp
#include <iostream>

void doubleEach(int arr[], int n) {
    for (int i = 0; i < n; ++i)
        arr[i] *= 2;
}

int main() {
    int nums[] = {1, 2, 3};
    doubleEach(nums, 3);
    for (int i = 0; i < 3; ++i)
        std::cout << nums[i] << " ";   // 2 4 6
    std::cout << "\n";
    return 0;
}
```

This is powerful — and a little dangerous. If you *don't* want a function to modify your array, mark the parameter `const`, like `const int arr[]`, and the compiler will stop any accidental writes.

---

## The Modern Alternative: std::vector

Raw arrays force you to juggle a separate length everywhere. A `std::vector` carries its own size, so you pass one thing and call `.size()` inside:

```cpp
#include <iostream>
#include <vector>

double average(const std::vector<int>& v) {
    int sum = 0;
    for (int x : v)
        sum += x;
    return static_cast<double>(sum) / v.size();
}

int main() {
    std::vector<int> scores = {80, 90, 100, 70};
    std::cout << "Average: " << average(scores) << "\n";  // 85
    return 0;
}
```

Passing by `const` reference (`const std::vector<int>&`) avoids copying the whole list and promises the function won't change it. For most beginner code, reaching for a vector is the cleaner choice.

---

## Quick Reference

| Goal | How |
|------|-----|
| Pass a raw array | `void f(int arr[], int n)` and call `f(a, n)` |
| Let the function edit it | pass `int arr[]` (changes are visible) |
| Protect it from edits | pass `const int arr[]` |
| Avoid tracking length | use `std::vector` and `.size()` |
| Avoid copying a vector | pass `const std::vector<int>&` |

---

## Related Articles

- [C++ Arrays Tutorial](/posts/cpp-arrays-tutorial/) — the basics of declaring arrays
- [How to Find the Size of an Array in C++](/posts/cpp-array-size/) — measure length before passing
- [C++ Pass by Value vs Reference](/posts/cpp-pass-by-value-reference/) — why arrays behave like references
- [C++ Pass a Vector to a Function](/posts/cpp-pass-vector-to-function/) — the modern alternative
- [C++ Pointers Tutorial](/posts/pointers-in-cpp/) — what "decay to a pointer" really means

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)*