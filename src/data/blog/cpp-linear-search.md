---
title: "Linear Search in C++: How It Works, With Code and Complexity"
description: "Learn linear search in C++ with full working code. Search arrays and vectors step by step, handle not-found cases, and see how it compares to binary search."
pubDatetime: 2026-08-20T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "algorithms", "tutorial"]
faqSchema:
  - question: "What is linear search in C++?"
    answer: "Linear search checks every element of a collection one at a time, from the first to the last, until it finds the target or runs out of elements. It is the simplest search algorithm and it works on unsorted data. Its time complexity is O(n)."
  - question: "Does linear search need a sorted array?"
    answer: "No. Linear search works on data in any order, which is its main advantage over binary search. Because it inspects every element anyway, sorting first would only waste time unless you plan to search the same data many times."
  - question: "How do you return not found in a linear search?"
    answer: "Return -1 from a function whose return type is int, and check for it at the call site. Do not return 0, because 0 is a valid array index. If you search a vector with std::find, compare the returned iterator to vec.end() instead."
draft: false
featured: false
---

# Linear Search in C++: How It Works, With Code and Complexity

Linear search is the algorithm you already use when you look for your keys: check the first place, then the next, then the next, until you find them or run out of places.

It is the slowest common search algorithm and also the most useful one to understand first, because it works on *any* data in *any* order — no sorting, no setup, no assumptions.

---

## How Linear Search Works

Given an array and a target value, linear search does exactly one thing:

1. Start at index `0`.
2. Compare the element at the current index to the target.
3. If they match, return the index — you're done.
4. If not, move to the next index and repeat.
5. If you run off the end, the target isn't there.

That's it. There is no clever trick, which is why it never fails on unsorted input.

---

## Linear Search on an Array

Here is the version worth writing out by hand:

```cpp
#include <iostream>

int linearSearch(const int arr[], int size, int target) {
    for (int i = 0; i < size; ++i) {
        if (arr[i] == target) {
            return i;          // found it — return the position
        }
    }
    return -1;                 // not found
}

int main() {
    int numbers[] = {42, 7, 19, 88, 3, 56};
    int size = sizeof(numbers) / sizeof(numbers[0]);

    int index = linearSearch(numbers, size, 88);

    if (index != -1) {
        std::cout << "Found 88 at index " << index << "\n";
    } else {
        std::cout << "88 is not in the array\n";
    }
}
```

Output:

```
Found 88 at index 3
```

Two details matter more than the loop itself.

**Returning `-1` for "not found."** A valid index can be `0`, so you cannot use `0` as a failure signal. `-1` is never a valid index, which makes it a safe sentinel. Just remember to actually check for it — using `arr[index]` without checking is how you get a crash.

**Marking the array `const`.** The function only reads, so `const int arr[]` documents that and lets the compiler stop you if you ever typo an assignment in there.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Linear Search on a Vector

With a `std::vector` you don't need to pass a separate size, because the vector knows its own:

```cpp
#include <iostream>
#include <vector>
#include <string>

int linearSearch(const std::vector<std::string>& names,
                 const std::string& target) {
    for (std::size_t i = 0; i < names.size(); ++i) {
        if (names[i] == target) {
            return static_cast<int>(i);
        }
    }
    return -1;
}

int main() {
    std::vector<std::string> names = {"Ada", "Bjarne", "Grace", "Linus"};

    std::cout << linearSearch(names, "Grace") << "\n";   // 2
    std::cout << linearSearch(names, "Alan")  << "\n";   // -1
}
```

Passing the vector by `const&` avoids copying the whole thing on every call. That matters: passing by value would copy all four strings just to read them.

---

## The Version You Should Actually Use: `std::find`

The standard library already has linear search. It's called `std::find`, it lives in `<algorithm>`, and it works on arrays, vectors, lists, and anything else with iterators:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> scores = {90, 72, 65, 88};

    auto it = std::find(scores.begin(), scores.end(), 65);

    if (it != scores.end()) {
        std::cout << "Found at index "
                  << std::distance(scores.begin(), it) << "\n";
    } else {
        std::cout << "Not found\n";
    }
}
```

`std::find` returns an **iterator**, not an index. When the value is missing it returns `scores.end()`, which is the "one past the last element" marker — so the not-found check is `it != scores.end()`, not `it != -1`.

Write your own version once to understand it, then use `std::find` in real code. It's correct, it's tested, and it reads better.

---

## Time Complexity: Why It's O(n)

Count the comparisons in the worst case — the target is the last element, or missing entirely:

| Array size | Worst-case comparisons |
| ---------- | ---------------------- |
| 10         | 10                     |
| 1,000      | 1,000                  |
| 1,000,000  | 1,000,000              |

Work grows in direct proportion to the input, so linear search is **O(n)**. The best case is O(1) — the target happens to be first — and on random data you average about n/2 comparisons.

---

## Linear Search vs Binary Search

| | Linear search | Binary search |
| --- | --- | --- |
| Sorted data required | No | Yes |
| Time complexity | O(n) | O(log n) |
| 1,000,000 elements | up to 1,000,000 checks | about 20 checks |
| Good for | small or unsorted data, one-off lookups | large sorted data, repeated lookups |

Binary search is dramatically faster, but only on sorted data — and sorting costs O(n log n). If you search a small array once, linear search wins because you skip the sort entirely. If you search a large array thousands of times, sort once and use [binary search](/posts/cpp-binary-search/) forever after.

---

## A Common Mistake: Returning Too Early

Beginners often write this:

```cpp
for (int i = 0; i < size; ++i) {
    if (arr[i] == target) {
        return i;
    } else {
        return -1;      // WRONG — gives up after one comparison
    }
}
```

The `else return -1;` fires on the very first mismatch, so the function only ever inspects `arr[0]`. The `return -1` belongs **after** the loop, where it means "I checked everything and found nothing."

---

## Related Articles

- [Binary Search in C++: Iterative, Recursive, and std::binary_search](/posts/cpp-binary-search/)
- [C++ Arrays Tutorial](/posts/cpp-arrays-tutorial/)
- [C++ Loops Tutorial: for, while, and do-while Explained](/posts/cpp-loops-tutorial/)
- [How to Find an Element in a Vector in C++ (std::find)](/posts/cpp-find-in-vector/)
- [C++ Functions Tutorial: How to Write and Use Functions](/posts/cpp-functions-tutorial/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
