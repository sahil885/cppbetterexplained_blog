---
title: "C++ std::sort Explained: How to Sort Vectors and Arrays for Beginners"
description: "Master C++ std::sort with clear examples. Sort vectors, arrays, strings, and custom objects using comparators and lambdas — beginner-friendly tutorial."
pubDatetime: 2026-05-28T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "STL", "tutorial"]
faqSchema:
  - question: "How do you sort a vector in C++?"
    answer: "Include <algorithm> and call std::sort(v.begin(), v.end()) to sort a vector in ascending order. For descending order, use std::sort(v.begin(), v.end(), std::greater<int>())."
  - question: "What is the time complexity of std::sort in C++?"
    answer: "std::sort has average O(n log n) time complexity. It typically uses an introsort — a hybrid of quicksort, heapsort, and insertion sort — chosen automatically for best performance."
  - question: "Can you sort a C++ vector of custom objects with std::sort?"
    answer: "Yes. Provide a comparator function or lambda as the third argument to std::sort. The comparator takes two objects and returns true if the first should come before the second."
draft: false
featured: false
---

# C++ std::sort Explained: How to Sort Vectors and Arrays for Beginners

Sorting is one of the most common operations in programming — arranging a list of names alphabetically, ordering scores from highest to lowest, or ranking items by price. C++ gives you `std::sort` from the `<algorithm>` header, and it's both fast (O(n log n)) and easy to use.

---

## Sorting a Vector: The Basics

Include `<algorithm>` and pass iterators pointing to the beginning and end of your container:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 3};

    std::sort(nums.begin(), nums.end());

    for (int n : nums) {
        std::cout << n << " ";
    }
    // Output: 1 2 3 5 8 9
    return 0;
}
```

`nums.begin()` points to the first element; `nums.end()` points one past the last. This two-iterator pattern is used throughout the entire C++ standard library.

---

## Sorting in Descending Order

Pass `std::greater<T>()` as a third argument:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 3};

    std::sort(nums.begin(), nums.end(), std::greater<int>());

    for (int n : nums) {
        std::cout << n << " ";
    }
    // Output: 9 8 5 3 2 1
    return 0;
}
```

The third argument is a **comparator** — a function (or object) that tells `sort` which element should come first. `std::greater<int>()` says "larger values come first."

---

## Sorting Strings

`std::sort` works just as well on strings — alphabetically by default:

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

int main() {
    std::vector<std::string> names = {"Charlie", "Alice", "Bob", "Diana"};

    std::sort(names.begin(), names.end());

    for (const auto& name : names) {
        std::cout << name << "\n";
    }
    // Alice, Bob, Charlie, Diana
    return 0;
}
```

---

## Sorting a Portion of a Vector

You don't have to sort the whole container. Use pointer arithmetic to sort just a slice:

```cpp
std::vector<int> v = {9, 3, 7, 1, 5, 2, 8};

// Sort only the first 4 elements
std::sort(v.begin(), v.begin() + 4);

for (int n : v) std::cout << n << " ";
// Output: 1 3 7 9 5 2 8
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Custom Comparators with Lambdas

The real power of `std::sort` is the custom comparator. Use a [lambda function](/posts/cpp-lambda-functions/) to define any ordering you want:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 3};

    // Sort by absolute distance from 5
    std::sort(nums.begin(), nums.end(), [](int a, int b) {
        return std::abs(a - 5) < std::abs(b - 5);
    });

    for (int n : nums) std::cout << n << " ";
    // 5 3 8 2 9 1  (closest to 5 first)
    return 0;
}
```

The lambda takes two elements and returns `true` if the first should come before the second.

---

## Sorting Custom Objects

Here's a practical example: sorting a list of students by score, then alphabetically for ties:

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

struct Student {
    std::string name;
    int score;
};

int main() {
    std::vector<Student> students = {
        {"Charlie", 85},
        {"Alice", 92},
        {"Bob", 85},
        {"Diana", 78}
    };

    // Sort by score descending, then name ascending on tie
    std::sort(students.begin(), students.end(), [](const Student& a, const Student& b) {
        if (a.score != b.score) return a.score > b.score;
        return a.name < b.name;
    });

    for (const auto& s : students) {
        std::cout << s.name << ": " << s.score << "\n";
    }
    return 0;
}
```

Output:
```
Alice: 92
Bob: 85
Charlie: 85
Diana: 78
```

Bob comes before Charlie because their scores tie at 85 and "Bob" < "Charlie" alphabetically.

---

## Sorting Arrays (Not Just Vectors)

`std::sort` works on raw arrays too using pointer syntax:

```cpp
#include <algorithm>
#include <iostream>

int main() {
    int arr[] = {4, 1, 7, 2, 5};
    int size = 5;

    std::sort(arr, arr + size);

    for (int i = 0; i < size; i++) std::cout << arr[i] << " ";
    // 1 2 4 5 7
    return 0;
}
```

---

## Related Articles

- [C++ Vector Tutorial: The Complete Guide to std::vector](/posts/cpp-vector-tutorial/)
- [C++ Lambda Functions Explained: Closures, Captures, and std::function](/posts/cpp-lambda-functions/)
- [C++ STL Containers Explained: Choosing the Right Container](/posts/stl-containers-cpp/)
- [Merge Sort in C++: How It Works and How to Implement It](/posts/merge-sort-algorithm-cpp/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
