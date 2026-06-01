---
title: "C++ Iterators Explained: How to Traverse STL Containers for Beginners"
description: "Understand C++ iterators from scratch. Learn begin(), end(), iterator types, range-based for loops, and how iterators work with vectors, maps, and sets."
pubDatetime: 2026-06-01T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "STL", "tutorial"]
faqSchema:
  - question: "What is an iterator in C++?"
    answer: "An iterator is an object that points to an element inside a container (like a vector or map) and lets you move through the container's elements one by one. It works like a generalized pointer: you dereference it with * to get the value, and increment it with ++ to move to the next element."
  - question: "What is the difference between begin() and end() in C++?"
    answer: "begin() returns an iterator pointing to the first element of a container. end() returns an iterator pointing one past the last element — it does not point to a valid element. The standard loop pattern is: for (auto it = v.begin(); it != v.end(); ++it). When it equals end(), you've gone through all elements."
  - question: "Should I use iterators or range-based for loops in C++?"
    answer: "For simple read-only traversal, prefer the range-based for loop (for (auto& x : container)) — it's cleaner and harder to get wrong. Use explicit iterators when you need to know the position, erase elements while iterating, iterate backwards with rbegin()/rend(), or work with algorithms that require iterator pairs."
draft: false
featured: false
---

# C++ Iterators: How to Traverse STL Containers

When you use a range-based for loop like `for (auto& x : vec)`, C++ is quietly using iterators under the hood. Understanding iterators directly gives you more control: you can iterate backwards, skip elements, erase while traversing, or plug into STL algorithms.

Think of an iterator as a **smart pointer to a container element** — you can dereference it to get the value, and increment it to move forward.

---

## The Basic Iterator Loop

Here's the explicit iterator syntax for a `vector`:

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {10, 20, 30, 40, 50};

    // Declare an iterator and loop
    for (vector<int>::iterator it = nums.begin(); it != nums.end(); ++it) {
        cout << *it << " ";  // Dereference to get value
    }
    cout << endl;

    return 0;
}
```

Output: `10 20 30 40 50`

The three pieces:
- `nums.begin()` — points to the first element (`10`)
- `nums.end()` — points one past the last element (not valid to dereference)
- `*it` — dereferences the iterator to get the value
- `++it` — advances to the next element

---

## Cleaner with `auto`

The type `vector<int>::iterator` is verbose. Use `auto` to let the compiler infer it:

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<string> fruits = {"apple", "banana", "cherry"};

    for (auto it = fruits.begin(); it != fruits.end(); ++it) {
        cout << *it << endl;
    }

    return 0;
}
```

This is equivalent to the verbose version but much easier to read.

---

## Modifying Elements Through Iterators

You can modify container elements through an iterator by assigning to `*it`:

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3, 4, 5};

    // Double every element
    for (auto it = nums.begin(); it != nums.end(); ++it) {
        *it *= 2;
    }

    for (auto n : nums) {
        cout << n << " ";  // 2 4 6 8 10
    }
    cout << endl;

    return 0;
}
```

---

## Reverse Iterators: `rbegin()` and `rend()`

To traverse a container backwards, use `rbegin()` (last element) and `rend()` (before first):

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3, 4, 5};

    for (auto it = nums.rbegin(); it != nums.rend(); ++it) {
        cout << *it << " ";  // 5 4 3 2 1
    }
    cout << endl;

    return 0;
}
```

The `r` versions give you iterators that move backwards when incremented.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Iterating Over a Map

Maps store `pair<key, value>` elements. The iterator gives you access to both:

```cpp
#include <iostream>
#include <map>
using namespace std;

int main() {
    map<string, int> scores = {
        {"Alice", 92},
        {"Bob", 85},
        {"Carol", 97}
    };

    for (auto it = scores.begin(); it != scores.end(); ++it) {
        cout << it->first << ": " << it->second << endl;
    }

    return 0;
}
```

`it->first` is the key, `it->second` is the value. The `->` syntax is shorthand for `(*it).first`.

---

## Iterating Over a Set

Sets work similarly, but every element is its own key:

```cpp
#include <iostream>
#include <set>
using namespace std;

int main() {
    set<int> s = {5, 3, 1, 4, 2};

    for (auto it = s.begin(); it != s.end(); ++it) {
        cout << *it << " ";  // 1 2 3 4 5 (sorted)
    }
    cout << endl;

    return 0;
}
```

---

## Erasing While Iterating

A common pitfall: erasing from a container while iterating invalidates the current iterator. The safe pattern:

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3, 4, 5, 6};

    // Remove all even numbers
    auto it = nums.begin();
    while (it != nums.end()) {
        if (*it % 2 == 0) {
            it = nums.erase(it);  // erase returns next valid iterator
        } else {
            ++it;
        }
    }

    for (auto n : nums) {
        cout << n << " ";  // 1 3 5
    }
    cout << endl;

    return 0;
}
```

`erase()` returns an iterator to the element that followed the erased one, so you use that as the new `it`.

---

## Iterators with STL Algorithms

Many STL algorithms (like `find`, `sort`, `count_if`) take iterator pairs:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {3, 1, 4, 1, 5, 9, 2, 6};

    // Find first element equal to 5
    auto it = find(nums.begin(), nums.end(), 5);
    if (it != nums.end()) {
        cout << "Found 5 at index " << distance(nums.begin(), it) << endl;
    }

    // Sort the vector
    sort(nums.begin(), nums.end());

    for (auto n : nums) cout << n << " ";
    cout << endl;

    return 0;
}
```

The `begin()`/`end()` pairs tell algorithms which range of elements to operate on.

---

## Iterator Types Summary

| Iterator type      | What it can do                            |
|--------------------|-------------------------------------------|
| Input iterator     | Read elements, move forward once          |
| Output iterator    | Write elements, move forward once         |
| Forward iterator   | Read/write, move forward multiple times   |
| Bidirectional      | Move forward and backward (`list`, `map`) |
| Random access      | Jump to any position (`vector`, `deque`)  |

For most beginner work, you'll use bidirectional or random access iterators without thinking about the distinction.

---

## Related Articles

- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/)
- [C++ map and unordered_map Tutorial](/posts/cpp-map-unordered-map/)
- [C++ std::set Tutorial](/posts/cpp-set-tutorial/)
- [C++ std::sort Explained](/posts/cpp-sort-algorithm/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
