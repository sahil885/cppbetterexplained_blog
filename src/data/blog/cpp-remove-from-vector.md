---
title: "C++ Remove Element from Vector (and Remove Duplicates)"
description: "Learn how to remove elements from a vector in C++ by index or by value with the erase-remove idiom, plus how to remove duplicates. Clear beginner examples."
pubDatetime: 2026-06-09T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "vector", "STL"]
faqSchema:
  - question: "How do you remove an element from a vector in C++?"
    answer: "To remove by position, call v.erase(v.begin() + index). To remove every element equal to a value, use the erase-remove idiom: v.erase(std::remove(v.begin(), v.end(), value), v.end())."
  - question: "What is the erase-remove idiom in C++?"
    answer: "It is the standard way to delete all elements matching a value. std::remove shifts the kept elements to the front and returns a new logical end; vector::erase then deletes the leftover tail. Together they remove every match in one pass."
  - question: "How do you remove duplicates from a vector in C++?"
    answer: "If order doesn't matter, sort the vector then call std::unique followed by erase. If you must keep the original order, track seen values in a std::set as you build a new vector."
draft: false
featured: false
---

# C++ Remove Element from Vector (and Remove Duplicates)

**To remove one element from a vector by position, use `v.erase(v.begin() + index)`. To remove every element equal to a value, use the erase-remove idiom.** Deleting from a vector has a few gotchas around iterators and efficiency, so let's walk through each case clearly.

---

## Remove by Index

`vector::erase` takes an iterator, not a plain number, so add the index to `begin()`:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {10, 20, 30, 40};
    v.erase(v.begin() + 2);   // remove the element at index 2 (the 30)

    for (int n : v) std::cout << n << " ";  // 10 20 40
    std::cout << "\n";
    return 0;
}
```

Everything after the removed element shifts left by one, so removing from the middle or front is O(n). Removing from the very end is cheaper with `v.pop_back()`.

---

## Remove by Value: The Erase-Remove Idiom

To delete *every* element equal to some value, the correct tool is the erase-remove idiom from `<algorithm>`:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> v = {1, 2, 3, 2, 4, 2};
    v.erase(std::remove(v.begin(), v.end(), 2), v.end());

    for (int n : v) std::cout << n << " ";  // 1 3 4
    std::cout << "\n";
    return 0;
}
```

This looks odd at first, so here's what happens: `std::remove` doesn't actually shrink the vector. It shifts all the elements you want to *keep* to the front and returns an iterator to the new logical end. `vector::erase` then chops off the leftover tail. Doing it in this two-part way removes all matches in a single efficient pass.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Remove Elements Matching a Condition

To remove by a rule instead of an exact value — say, all even numbers — swap `std::remove` for `std::remove_if` with a lambda:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5, 6};
    v.erase(std::remove_if(v.begin(), v.end(),
            [](int x){ return x % 2 == 0; }), v.end());

    for (int n : v) std::cout << n << " ";  // 1 3 5
    std::cout << "\n";
    return 0;
}
```

The lambda returns `true` for elements to remove. This is the cleanest way to filter a vector in place.

---

## Remove Duplicates

The fastest approach, when order doesn't matter, is sort then `unique` then erase:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> v = {3, 1, 2, 3, 1, 4};
    std::sort(v.begin(), v.end());
    v.erase(std::unique(v.begin(), v.end()), v.end());

    for (int n : v) std::cout << n << " ";  // 1 2 3 4
    std::cout << "\n";
    return 0;
}
```

`std::unique` only removes *adjacent* duplicates, which is why we sort first. If you need to preserve the original order, keep a `std::set` of values you've already seen and copy each new value into a result vector.

---

## Quick Reference

| Goal | Tool |
|------|------|
| Remove at index | `v.erase(v.begin() + i)` |
| Remove last element | `v.pop_back()` |
| Remove all equal to value | `erase` + `std::remove` |
| Remove by condition | `erase` + `std::remove_if` |
| Remove duplicates | `sort` + `unique` + `erase` |

---

## Related Articles

- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — the complete guide to std::vector
- [C++ Sort Algorithm](/posts/cpp-sort-algorithm/) — sorting before deduplicating
- [C++ Iterators](/posts/cpp-iterators/) — what begin() and end() really are
- [C++ std::set Tutorial](/posts/cpp-set-tutorial/) — order-preserving deduplication
- [C++ Lambda Functions](/posts/cpp-lambda-functions/) — the predicate in remove_if

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
