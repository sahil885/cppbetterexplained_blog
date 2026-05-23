---
title: "C++ std::set Tutorial: Sorted Unique Collections for Beginners"
description: "Learn how to use std::set in C++ to store sorted, unique elements. Covers insert, find, erase, iteration, and when to choose set over vector."
pubDatetime: 2026-05-23T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "STL", "tutorial"]
faqSchema:
  - question: "What is std::set in C++?"
    answer: "std::set is a container from the C++ Standard Library that stores unique elements in sorted order automatically. Inserting a duplicate has no effect. It uses a balanced binary tree internally, so insert, find, and erase are all O(log n)."
  - question: "What is the difference between std::set and std::vector in C++?"
    answer: "std::vector stores elements in insertion order and allows duplicates. std::set stores elements in sorted order, removes duplicates automatically, and provides fast O(log n) lookup — but does not support index-based access."
  - question: "How do I check if an element is in a std::set?"
    answer: "Use the count() method: if (mySet.count(value)) checks if value exists. You can also use find(), which returns an iterator: if (mySet.find(value) != mySet.end()) means the element was found."
draft: false
featured: false
---

# C++ std::set Tutorial: Sorted Unique Collections

Sometimes you need a collection where every element appears exactly once and you always want them in sorted order. That's exactly what `std::set` is for. It handles both automatically — no manual sorting, no duplicate removal needed.

---

## What Is std::set?

`std::set` is a container in the C++ Standard Library that:
- Stores elements in **sorted order** (ascending by default)
- Allows **no duplicates** — inserting an element that already exists is silently ignored
- Provides **fast lookup** — finding, inserting, and removing elements are all O(log n)

The header you need is `<set>`.

```cpp
#include <iostream>
#include <set>

int main() {
    std::set<int> numbers;
    numbers.insert(5);
    numbers.insert(2);
    numbers.insert(8);
    numbers.insert(2); // duplicate — ignored

    for (int n : numbers) {
        std::cout << n << " "; // prints: 2 5 8
    }
    std::cout << "\n";
    return 0;
}
```

Notice the output is sorted even though we inserted `5` first. The set maintains order for you.

---

## Creating and Initializing a Set

You can initialize a set from a list of values, just like a vector:

```cpp
#include <iostream>
#include <set>

int main() {
    std::set<std::string> fruits = {"banana", "apple", "cherry", "apple"};

    for (const std::string& f : fruits) {
        std::cout << f << "\n";
        // apple
        // banana
        // cherry
        // (apple duplicate was dropped, sorted alphabetically)
    }
    return 0;
}
```

---

## Adding and Removing Elements

**insert()** adds an element. If it's already in the set, nothing happens.

**erase()** removes an element by value. If the element doesn't exist, nothing happens.

```cpp
#include <iostream>
#include <set>

int main() {
    std::set<int> s = {10, 20, 30};

    s.insert(25);   // adds 25
    s.insert(10);   // already there — ignored
    s.erase(20);    // removes 20

    for (int n : s) {
        std::cout << n << " "; // prints: 10 25 30
    }
    std::cout << "\n";
    return 0;
}
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Checking If an Element Exists

Use `count()` for a simple yes/no check — for a set, it returns either 0 or 1:

```cpp
std::set<int> s = {1, 2, 3, 4, 5};

if (s.count(3)) {
    std::cout << "3 is in the set\n";
}

if (!s.count(9)) {
    std::cout << "9 is NOT in the set\n";
}
```

You can also use `find()`, which returns an iterator. If the element isn't found, it returns `s.end()`:

```cpp
auto it = s.find(3);
if (it != s.end()) {
    std::cout << "Found: " << *it << "\n";
}
```

---

## Iterating Over a Set

A range-based for loop works perfectly with sets:

```cpp
std::set<std::string> words = {"zebra", "ant", "monkey"};
for (const std::string& w : words) {
    std::cout << w << "\n"; // ant, monkey, zebra (sorted)
}
```

You can also iterate with iterators for more control:

```cpp
for (auto it = words.begin(); it != words.end(); ++it) {
    std::cout << *it << "\n";
}
```

---

## Useful Set Methods at a Glance

```cpp
std::set<int> s = {1, 2, 3, 4, 5};

s.size();       // number of elements: 5
s.empty();      // false
s.clear();      // removes all elements
s.count(3);     // 1 if exists, 0 if not
s.find(3);      // iterator to element, or s.end()
s.insert(6);    // add element
s.erase(1);     // remove element by value
```

---

## Set vs Vector: When to Use Which

| Feature | `std::vector` | `std::set` |
|---|---|---|
| Preserves insertion order | Yes | No (always sorted) |
| Allows duplicates | Yes | No |
| Index access (`v[i]`) | Yes | No |
| Lookup speed | O(n) linear | O(log n) fast |
| Sorted automatically | No | Yes |

**Use a vector** when you need to preserve order, allow duplicates, or access elements by index.

**Use a set** when you need unique elements, automatic sorting, or fast membership testing.

---

## Practical Example: Removing Duplicates from a Vector

A common use of `set` is deduplicating a vector:

```cpp
#include <iostream>
#include <vector>
#include <set>

int main() {
    std::vector<int> nums = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3};

    // Insert all elements into a set to deduplicate
    std::set<int> unique(nums.begin(), nums.end());

    std::cout << "Unique sorted values:\n";
    for (int n : unique) {
        std::cout << n << " "; // 1 2 3 4 5 6 9
    }
    std::cout << "\n";
    return 0;
}
```

---

## What About std::unordered_set?

If you don't need elements sorted — you just want fast duplicate checking — use `std::unordered_set` from `<unordered_set>`. It's O(1) average for insert and lookup instead of O(log n), but the order is unpredictable.

```cpp
#include <unordered_set>
std::unordered_set<int> fast = {5, 2, 8};
fast.insert(2); // still ignored — duplicates not allowed
```

Use `std::set` when order matters or when you need consistent iteration order. Use `std::unordered_set` when raw speed matters more.

---

## Related Articles

- [C++ STL Containers Overview: vector, map, set, and More](/posts/stl-containers-cpp/)
- [C++ map and unordered_map Tutorial for Beginners](/posts/cpp-map-unordered-map/)
- [C++ Vector Tutorial: Dynamic Arrays Explained](/posts/cpp-vector-tutorial/)
- [C++ Arrays vs Vector: Which Should You Use?](/posts/cpp-array-vs-vector/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
