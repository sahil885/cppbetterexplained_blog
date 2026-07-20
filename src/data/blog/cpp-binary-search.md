---
title: "Binary Search in C++: Iterative, Recursive, and std::binary_search"
description: "Learn binary search in C++ step by step. Write the iterative and recursive versions, avoid the classic off-by-one bugs, and use std::binary_search correctly."
pubDatetime: 2026-07-20T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "algorithms", "tutorial"]
faqSchema:
  - question: "What is binary search in C++?"
    answer: "Binary search is an algorithm that finds a value in a sorted collection by repeatedly cutting the search range in half. It compares the target to the middle element and discards the half that cannot contain the target. This makes it O(log n) instead of O(n)."
  - question: "Does binary search require a sorted array?"
    answer: "Yes. Binary search only works on sorted data. If the array is not sorted, the algorithm discards the wrong half and returns incorrect results without any warning or error. Always sort first with std::sort if you are not sure."
  - question: "Why does my binary search loop forever?"
    answer: "The usual cause is updating low or high to mid instead of mid + 1 or mid - 1. If the range never shrinks, the loop never ends. In the standard integer version, use low = mid + 1 and high = mid - 1 so mid is always excluded from the next round."
draft: false
featured: false
---

# Binary Search in C++: Iterative, Recursive, and `std::binary_search`

Searching a sorted array one element at a time is like flipping through a dictionary page by page to find "zebra." Binary search is what you actually do: open to the middle, decide which half to keep, repeat.

That simple idea turns a million-element search from a million comparisons into about twenty.

---

## How Binary Search Works

You need **sorted** data. Then you track two boundaries — `low` and `high` — that mark the range still worth searching.

Each round:

1. Look at the middle element of the current range.
2. If it equals the target, you're done.
3. If it's **too small**, the target must be to the right — move `low` past the middle.
4. If it's **too big**, the target must be to the left — move `high` before the middle.

Every step throws away half of what's left. Searching 1,000,000 items takes at most 20 comparisons, because 2²⁰ is just over a million.

---

## The Iterative Version

This is the version worth memorising:

```cpp
#include <iostream>
#include <vector>

// Returns the index of target, or -1 if not found
int binarySearch(const std::vector<int>& data, int target) {
    int low = 0;
    int high = static_cast<int>(data.size()) - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (data[mid] == target) {
            return mid;
        } else if (data[mid] < target) {
            low = mid + 1;    // target is in the right half
        } else {
            high = mid - 1;   // target is in the left half
        }
    }

    return -1;  // exhausted the range
}

int main() {
    std::vector<int> numbers = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};

    std::cout << "Index of 23: " << binarySearch(numbers, 23) << "\n";
    std::cout << "Index of 2:  " << binarySearch(numbers, 2) << "\n";
    std::cout << "Index of 99: " << binarySearch(numbers, 99) << "\n";

    return 0;
}
```

Output:
```
Index of 23: 5
Index of 2:  0
Index of 99: -1
```

Three details in that code are doing real work:

**`low + (high - low) / 2` instead of `(low + high) / 2`.** These are mathematically identical but not identical in practice. If `low` and `high` are both large, `low + high` can overflow `int` and produce a negative number. This bug lived in the Java standard library for nine years before anyone noticed. The subtraction form can never overflow.

**`low <= high`, not `low < high`.** When the range narrows to a single element, `low == high`. Using `<` would exit before checking that last element, so searching for the smallest or largest value would fail.

**`mid + 1` and `mid - 1`, not `mid`.** We already know `data[mid]` isn't the target, so excluding it guarantees the range shrinks every iteration. Writing `low = mid` instead is the number one cause of infinite loops here.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Recursive Version

The same logic, expressed as a function that calls itself on a smaller range:

```cpp
#include <iostream>
#include <vector>

int binarySearchRec(const std::vector<int>& data, int target, int low, int high) {
    if (low > high) {
        return -1;  // base case: empty range
    }

    int mid = low + (high - low) / 2;

    if (data[mid] == target) {
        return mid;
    } else if (data[mid] < target) {
        return binarySearchRec(data, target, mid + 1, high);
    } else {
        return binarySearchRec(data, target, low, mid - 1);
    }
}

// Convenience wrapper so callers don't pass indices
int binarySearchRec(const std::vector<int>& data, int target) {
    return binarySearchRec(data, target, 0, static_cast<int>(data.size()) - 1);
}

int main() {
    std::vector<int> numbers = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    std::cout << "Index of 56: " << binarySearchRec(numbers, 56) << "\n";
    std::cout << "Index of 7:  " << binarySearchRec(numbers, 7)  << "\n";
    return 0;
}
```

Output:
```
Index of 56: 7
Index of 7:  -1
```

The base case is `low > high` — an empty range means the target isn't there.

Which version should you use? The iterative one, in most cases. It uses constant memory, while the recursive version adds a stack frame per call. For binary search the recursion depth is only about log₂(n) — roughly 20 frames for a million elements — so it won't overflow the stack, but there's no benefit either. Write the recursive version to understand the algorithm; ship the iterative one.

---

## Using the Standard Library

You rarely need to write binary search yourself. The `<algorithm>` header ships three related functions:

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};

    // 1. Does it exist? Returns bool.
    bool found = std::binary_search(numbers.begin(), numbers.end(), 23);
    std::cout << "Found 23? " << (found ? "yes" : "no") << "\n";

    // 2. Where is it? lower_bound returns an iterator.
    auto it = std::lower_bound(numbers.begin(), numbers.end(), 23);
    if (it != numbers.end() && *it == 23) {
        std::cout << "23 is at index " << (it - numbers.begin()) << "\n";
    }

    // 3. Where would a new value go?
    auto pos = std::lower_bound(numbers.begin(), numbers.end(), 30);
    std::cout << "30 would be inserted at index " << (pos - numbers.begin()) << "\n";

    return 0;
}
```

Output:
```
Found 23? yes
23 is at index 5
30 would be inserted at index 6
```

The catch with `std::binary_search` is that it only returns `true` or `false` — it won't tell you *where* the element is. That's why `std::lower_bound` is usually more useful: it returns an iterator to the first element not less than your target. Check both that the iterator isn't `end()` and that it actually points at your value, since `lower_bound` returns an insertion point even when the value is absent.

---

## Linear Search vs Binary Search

| | Linear search | Binary search |
|---|---|---|
| Sorted data required | No | **Yes** |
| Time complexity | O(n) | O(log n) |
| Comparisons for 1,000,000 items | up to 1,000,000 | about 20 |
| Works on linked lists | Yes | No — needs random access |
| Setup cost | None | O(n log n) to sort first |

That last row matters more than beginners expect. If you're searching an unsorted array **once**, a linear scan wins — sorting costs more than the search saves. Binary search pays off when you search the same sorted data many times.

---

## Common Mistakes

**Searching unsorted data.** This is the big one. Binary search on an unsorted array doesn't crash and doesn't warn you — it just returns wrong answers. Sort with [`std::sort`](/posts/cpp-sort-algorithm/) first.

**Integer overflow in the midpoint.** Use `low + (high - low) / 2`.

**Using `size()` directly with `int`.** `data.size()` returns an unsigned type. If the vector is empty, `data.size() - 1` wraps around to a huge positive number instead of `-1`. The `static_cast<int>` in the examples above prevents this.

**Off-by-one in the loop condition.** `low <= high` for the closed-range version shown here.

---

## Related Articles

- [C++ Sort Algorithm: Using std::sort](/posts/cpp-sort-algorithm/) — sort before you search
- [C++ Recursion Tutorial](/posts/cpp-recursion-tutorial/) — the call stack behind the recursive version
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — the container used throughout this guide
- [How to Find an Element in a Vector](/posts/cpp-find-in-vector/) — std::find for unsorted data
- [Merge Sort in C++](/posts/merge-sort-algorithm-cpp/) — another divide-and-conquer algorithm

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
