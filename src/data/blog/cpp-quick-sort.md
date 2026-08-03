---
title: "Quick Sort in C++: How It Works, With Full Code and Complexity"
description: "Learn quick sort in C++ with a complete working program. Understand the pivot, the partition step, recursion, and why quicksort usually beats merge sort."
pubDatetime: 2026-08-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "algorithms", "sorting", "tutorial"]
faqSchema:
  - question: "How does quick sort work in C++?"
    answer: "Quick sort picks one element as a pivot and rearranges the array so everything smaller than the pivot sits to its left and everything larger sits to its right. The pivot is then in its final sorted position, and quick sort calls itself on the left and right halves until each piece has one element."
  - question: "What is the time complexity of quick sort?"
    answer: "Quick sort is O(n log n) on average and O(n squared) in the worst case. The worst case happens when the pivot is always the smallest or largest element, which splits the array into a piece of size zero and a piece of size n-1 instead of two even halves."
  - question: "Is quick sort faster than merge sort?"
    answer: "In practice quick sort is usually faster even though both are O(n log n) on average. Quick sort sorts in place with no extra array, so it touches memory in a cache-friendly pattern. Merge sort needs an extra buffer but guarantees O(n log n) and keeps equal elements in their original order."
draft: false
featured: false
---

# Quick Sort in C++: How It Works, With Full Code and Complexity

Quick sort is the sorting algorithm most standard libraries are built on, including the `std::sort` you already use. It sorts by repeatedly asking one simple question: *for this pivot value, which elements belong on the left and which belong on the right?*

That single question, applied recursively, sorts an entire array — in place, with no extra memory.

---

## The Core Idea: Partition Around a Pivot

Pick any element and call it the **pivot**. Now rearrange the array so that:

```
[ everything <= pivot ] [ pivot ] [ everything > pivot ]
```

Notice what you get for free: the pivot is now sitting in its **final** sorted position. Nothing to the left will ever need to move past it, and nothing to the right will either.

So you never touch the pivot again. You just repeat the same trick on the left chunk and the right chunk. When a chunk gets down to one element, it's trivially sorted, and the recursion stops.

That's the whole algorithm. The clever part is doing the rearranging efficiently.

---

## The Partition Step, Step by Step

The standard approach (called Lomuto partitioning) uses the **last** element as the pivot and walks through the array with two indices:

- `j` scans forward looking at every element.
- `i` marks the boundary of the "small" region built so far.

Every time `j` finds an element that's `<= pivot`, we grow the small region by one and swap that element into it. At the end we swap the pivot into the slot right after the small region.

Take `[7, 2, 9, 4, 5]` with pivot `5`:

| j | arr[j] | Action | Array after |
|---|--------|--------|-------------|
| 0 | 7 | 7 > 5, skip | `[7, 2, 9, 4, 5]` |
| 1 | 2 | 2 <= 5, swap into position 0 | `[2, 7, 9, 4, 5]` |
| 2 | 9 | 9 > 5, skip | `[2, 7, 9, 4, 5]` |
| 3 | 4 | 4 <= 5, swap into position 1 | `[2, 4, 9, 7, 5]` |
| — | — | swap pivot into position 2 | `[2, 4, 5, 7, 9]` |

The `5` is now home. Everything left of it is smaller, everything right is larger.

---

## The Full Program

```cpp
#include <iostream>
#include <vector>
#include <utility>

// Rearranges arr[low..high] around the pivot arr[high].
// Returns the index where the pivot ended up.
int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;  // boundary of the "<= pivot" region

    for (int j = low; j < high; ++j) {
        if (arr[j] <= pivot) {
            ++i;
            std::swap(arr[i], arr[j]);
        }
    }

    std::swap(arr[i + 1], arr[high]);  // put the pivot in place
    return i + 1;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low >= high) return;  // 0 or 1 element: already sorted

    int p = partition(arr, low, high);
    quickSort(arr, low, p - 1);   // sort the left side
    quickSort(arr, p + 1, high);  // sort the right side
}

int main() {
    std::vector<int> numbers = {29, 10, 14, 37, 14, 3, 55};

    quickSort(numbers, 0, static_cast<int>(numbers.size()) - 1);

    for (int n : numbers) {
        std::cout << n << " ";
    }
    std::cout << "\n";

    return 0;
}
```

Output:

```
3 10 14 14 29 37 55
```

Two details worth noticing. `quickSort` takes the vector **by reference** (`std::vector<int>&`) so the swaps affect the caller's data instead of a copy — see [pass by value vs reference](/posts/cpp-pass-by-value-reference/) if that distinction is still fuzzy. And the recursion excludes index `p` entirely, because the pivot is already correct.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Why It's Usually O(n log n)

Each call to `partition` looks at every element in its range once, so one full "level" of the recursion costs about `n` comparisons total.

The question is how many levels there are. If the pivot lands near the middle each time, the range halves every level, and halving `n` down to 1 takes about `log n` steps. That gives `n × log n`.

---

## The Worst Case, and How to Avoid It

Now imagine the array is **already sorted** and you always pick the last element as the pivot. The pivot is the largest value, so the "greater than" side is empty and the "less than" side has `n - 1` elements. You've removed exactly one element instead of half.

That gives `n` levels instead of `log n` levels — O(n²), the very case quick sort is supposed to beat.

The standard fix is to not pick a fixed position. Choosing a random pivot makes the bad case astronomically unlikely for real inputs:

```cpp
#include <cstdlib>

int randomPartition(std::vector<int>& arr, int low, int high) {
    int randomIndex = low + std::rand() % (high - low + 1);
    std::swap(arr[randomIndex], arr[high]);  // move it to the pivot slot
    return partition(arr, low, high);
}
```

Then call `randomPartition` instead of `partition` inside `quickSort`. (For proper randomness in real code, prefer `<random>` over `std::rand` — see [random numbers in C++](/posts/cpp-random-numbers/).)

---

## Quick Sort vs Merge Sort

| | Quick sort | Merge sort |
|---|---|---|
| Average time | O(n log n) | O(n log n) |
| Worst time | O(n²) | O(n log n) |
| Extra memory | O(log n) for the call stack | O(n) for the merge buffer |
| Stable? | No | Yes |

Quick sort wins in practice because it sorts **in place**. It reads and writes a contiguous chunk of memory over and over, which is exactly what CPU caches are good at. Merge sort's guaranteed worst case is better on paper, but it pays for it with an extra array.

"Stable" means equal elements keep their original relative order. Merge sort guarantees it; quick sort's swaps can reorder equal values. That only matters when you're sorting records by one field and want ties broken by a previous sort.

---

## When to Just Use std::sort

For production code, use [std::sort](/posts/cpp-sort-algorithm/). It's typically an *introsort*: it runs quick sort, monitors the recursion depth, and switches to heap sort if the pivots are behaving badly — giving you quick sort's speed with merge sort's worst-case guarantee.

Write quick sort by hand to understand it. Reach for `std::sort` when you need to ship.

---

## Related Articles

- [Merge Sort in C++](/posts/merge-sort-algorithm-cpp/)
- [Bubble Sort in C++](/posts/bubble-sort-cpp/)
- [Selection Sort in C++](/posts/cpp-selection-sort/)
- [Recursion in C++](/posts/cpp-recursion-tutorial/)
- [std::sort in C++](/posts/cpp-sort-algorithm/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
