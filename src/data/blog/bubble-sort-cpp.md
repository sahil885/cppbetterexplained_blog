---
title: "Bubble Sort in C++: How It Works with Full Source Code"
description: "Learn how bubble sort works in C++ with a clear explanation, step-by-step walkthrough, full source code, and time complexity analysis."
pubDatetime: 2026-04-28T00:00:00Z
author: "Sahil"
tags: ["C++", "algorithms", "sorting", "beginner", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "How does bubble sort work in C++?"
    answer: "Bubble sort repeatedly steps through the array, compares adjacent elements, and swaps them if they are in the wrong order. Each pass through the array moves the largest unsorted element to its correct position at the end. This is repeated until no swaps are needed and the array is sorted."
  - question: "What is the time complexity of bubble sort?"
    answer: "Bubble sort has O(n²) time complexity in the worst and average cases, and O(n) in the best case when the array is already sorted (with the optimised version using a swapped flag). Space complexity is O(1) since it sorts in-place."
  - question: "Is bubble sort stable?"
    answer: "Yes. Bubble sort is a stable sorting algorithm — it preserves the relative order of equal elements because it only swaps adjacent elements that are strictly out of order."
  - question: "When should you use bubble sort?"
    answer: "Bubble sort is almost never used in production code due to its O(n²) average performance. It is mainly useful for educational purposes and for detecting nearly-sorted arrays, where the optimised version with a swapped flag runs in O(n)."
---

# Bubble Sort in C++: How It Works with Full Source Code

Bubble sort is one of the simplest sorting algorithms to understand — and one of the first you will encounter when learning algorithms. It is not efficient for large datasets, but it is a great starting point for understanding how sorting algorithms work before moving on to faster ones like merge sort or quicksort.

This article explains how bubble sort works, walks through it step by step, provides a full C++ implementation with an optimisation, and covers when you would (and would not) use it.

## Video Walkthrough

Watch this video walkthrough of bubble sort in C++:

<iframe width="560" height="315" src="https://www.youtube.com/embed/hGNqwO5EAMI" title="How to implement a bubble sort algorithm with C++" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## How Bubble Sort Works

The idea behind bubble sort is simple: repeatedly walk through the array comparing adjacent pairs of elements and swapping them if they are in the wrong order. After each full pass through the array, the largest unsorted element has "bubbled up" to its correct position at the end.

Here is the process step by step:

1. Compare element at index 0 with element at index 1 — swap if out of order
2. Compare element at index 1 with element at index 2 — swap if out of order
3. Continue until the end of the array
4. Repeat the whole process for the remaining unsorted portion
5. Stop when a full pass completes with no swaps

---

## Step-by-Step Example

Let's sort `{5, 3, 8, 1, 2}`:

**Pass 1:**
- Compare 5 and 3: swap → `{3, 5, 8, 1, 2}`
- Compare 5 and 8: no swap → `{3, 5, 8, 1, 2}`
- Compare 8 and 1: swap → `{3, 5, 1, 8, 2}`
- Compare 8 and 2: swap → `{3, 5, 1, 2, 8}` ← 8 is now in its final position

**Pass 2:**
- Compare 3 and 5: no swap
- Compare 5 and 1: swap → `{3, 1, 5, 2, 8}`
- Compare 5 and 2: swap → `{3, 1, 2, 5, 8}` ← 5 is in final position

**Pass 3:**
- Compare 3 and 1: swap → `{1, 3, 2, 5, 8}`
- Compare 3 and 2: swap → `{1, 2, 3, 5, 8}` ← 3 is in final position

**Pass 4:**
- Compare 1 and 2: no swap — array is sorted ✅

---

## C++ Implementation

```cpp
#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();

    for (int i = 0; i < n - 1; i++) {
        // Each pass moves the largest unsorted element to its final position
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    vector<int> arr = {5, 3, 8, 1, 2};

    cout << "Before: ";
    for (int x : arr) cout << x << " ";
    cout << endl;

    bubbleSort(arr);

    cout << "After:  ";
    for (int x : arr) cout << x << " ";
    cout << endl;

    return 0;
}
```

**Output:**
```
Before: 5 3 8 1 2
After:  1 2 3 5 8
```

---

## Optimised Version with Early Exit

The basic implementation always runs all passes even if the array is already sorted. Adding a `swapped` flag lets the algorithm detect when no swaps occurred and exit early — giving O(n) best-case performance on already-sorted or nearly-sorted data:

```cpp
void bubbleSortOptimised(vector<int>& arr) {
    int n = arr.size();

    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;

        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }

        // If no swaps occurred this pass, the array is already sorted
        if (!swapped) break;
    }
}
```

This is the version you should always use in practice when bubble sort is appropriate.

---

## Code Walkthrough

```cpp
for (int i = 0; i < n - 1; i++) {
```
The outer loop runs `n - 1` passes. After each pass, one more element is in its final position at the end, so the inner loop shrinks by one each time.

```cpp
for (int j = 0; j < n - i - 1; j++) {
```
The inner loop goes up to `n - i - 1` because the last `i` elements are already sorted and don't need to be compared.

```cpp
if (arr[j] > arr[j + 1]) {
    swap(arr[j], arr[j + 1]);
}
```
Compare adjacent elements and swap if the left one is greater. `std::swap` from `<algorithm>` handles the swap cleanly.

---

## Time and Space Complexity

| Case | Time Complexity | Notes |
|------|----------------|-------|
| Best case | O(n) | Array already sorted — optimised version exits after one pass |
| Average case | O(n²) | Random data — many comparisons and swaps |
| Worst case | O(n²) | Reverse-sorted array — maximum swaps required |
| Space | O(1) | In-place — no extra memory needed |

---

## Comparison with Other Sorting Algorithms

| Algorithm | Best | Average | Worst | Stable | In-place |
|-----------|------|---------|-------|--------|----------|
| Bubble sort | O(n) | O(n²) | O(n²) | ✅ | ✅ |
| Insertion sort | O(n) | O(n²) | O(n²) | ✅ | ✅ |
| Selection sort | O(n²) | O(n²) | O(n²) | ❌ | ✅ |
| Merge sort | O(n log n) | O(n log n) | O(n log n) | ✅ | ❌ |
| std::sort | O(n log n) | O(n log n) | O(n log n) | ❌ | ✅ |

Bubble sort performs similarly to insertion sort on most inputs, but insertion sort is generally faster in practice because it does fewer writes to memory. Both are outclassed by `std::sort` for any real workload.

---

## When to Use Bubble Sort

**Use bubble sort when:**
- You are learning algorithms and want to understand the basics before moving to faster sorts
- The array is very small (under 10 elements) and simplicity matters
- The data is nearly sorted and you use the optimised version with early exit

**Don't use bubble sort when:**
- The array has more than a few dozen elements — use `std::sort` instead
- Performance matters at all — insertion sort is almost always a better O(n²) choice

For production C++ code, always use `std::sort` from `<algorithm>`:

```cpp
#include <algorithm>
#include <vector>

vector<int> arr = {5, 3, 8, 1, 2};
std::sort(arr.begin(), arr.end());
```

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles
- [Insertion Sort in C++: How It Works with Full Source Code](/posts/insertion-sort-cpp/) — another simple O(n²) sort that outperforms bubble sort in practice.
- [Merge Sort in C++: Algorithm with Full Source Code](/posts/merge-sort-algorithm-cpp/) — a faster O(n log n) sort using divide-and-conquer.
- [C++ STL Containers Explained](/posts/stl-containers-cpp/) — the containers you will use alongside sorting algorithms.
- [Top 50 C++ Interview Questions and Answers](/posts/cpp-interview-questions/) — sorting algorithms are a staple of C++ technical interviews.
- [C++ Cheat Sheet: Quick Reference for Syntax, STL, and OOP](/posts/cpp-cheat-sheet/) — includes std::sort and algorithm usage.
