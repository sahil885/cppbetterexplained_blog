---
title: "Insertion Sort in C++: How It Works with Full Source Code"
description: "Learn how insertion sort works in C++ with a clear explanation, step-by-step walkthrough, full source code, and time complexity analysis."
pubDatetime: 2026-04-24T00:00:00Z
author: "Sahil"
tags: ["C++", "algorithms", "sorting", "beginner", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "How does insertion sort work in C++?"
    answer: "Insertion sort builds a sorted array one element at a time. It takes each element from the unsorted portion and inserts it into its correct position in the sorted portion by shifting larger elements one place to the right. This is repeated until all elements are in order."
  - question: "What is the time complexity of insertion sort?"
    answer: "Insertion sort has O(n²) time complexity in the worst and average cases, and O(n) in the best case (when the array is already sorted). Space complexity is O(1) since it sorts in-place."
  - question: "When should you use insertion sort?"
    answer: "Insertion sort is best for small arrays (under ~20 elements), nearly sorted data, and situations where simplicity matters more than performance. For large datasets, prefer std::sort which uses an O(n log n) algorithm."
  - question: "Is insertion sort stable?"
    answer: "Yes. Insertion sort is a stable sorting algorithm — it preserves the relative order of equal elements. This matters when sorting objects by one field where equal values should keep their original order."
---

# Insertion Sort in C++: How It Works with Full Source Code

Insertion sort is one of the simplest sorting algorithms to understand and implement. It's not the fastest for large datasets, but it's intuitive, stable, and performs well on small or nearly-sorted arrays — which is why it's still used inside hybrid algorithms like Timsort and introsort.

This article explains how insertion sort works, walks through the algorithm step by step, provides a complete C++ implementation, and covers when to use it (and when not to).

---

## How Insertion Sort Works

Think of how you sort a hand of playing cards. You pick up cards one at a time, and each time you pick up a new card, you insert it into the correct position among the cards you're already holding.

Insertion sort works exactly the same way:

1. Start with the second element (the first element is trivially sorted)
2. Compare it to the elements before it
3. Shift larger elements one position to the right to make room
4. Insert the current element into its correct position
5. Repeat for each remaining element

---

## Step-by-Step Example

Let's sort `{5, 2, 8, 1, 9}`:

**Pass 1** — key = 2
- Compare 2 with 5: 5 > 2, shift 5 right
- Insert 2 at position 0
- Array: `{2, 5, 8, 1, 9}`

**Pass 2** — key = 8
- Compare 8 with 5: 5 < 8, stop
- Insert 8 in place
- Array: `{2, 5, 8, 1, 9}`

**Pass 3** — key = 1
- Compare 1 with 8: 8 > 1, shift 8 right
- Compare 1 with 5: 5 > 1, shift 5 right
- Compare 1 with 2: 2 > 1, shift 2 right
- Insert 1 at position 0
- Array: `{1, 2, 5, 8, 9}`

**Pass 4** — key = 9
- Compare 9 with 8: 8 < 9, stop
- Insert 9 in place
- Array: `{1, 2, 5, 8, 9}` ✅

---

## C++ Implementation

```cpp
#include <iostream>
#include <vector>
using namespace std;

void insertionSort(vector<int>& arr) {
    int n = arr.size();

    for (int i = 1; i < n; i++) {
        int key = arr[i];   // The element to be inserted
        int j = i - 1;

        // Shift elements that are greater than key one position to the right
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }

        // Insert key into its correct position
        arr[j + 1] = key;
    }
}

int main() {
    vector<int> arr = {5, 2, 8, 1, 9};

    cout << "Before: ";
    for (int x : arr) cout << x << " ";
    cout << endl;

    insertionSort(arr);

    cout << "After:  ";
    for (int x : arr) cout << x << " ";
    cout << endl;

    return 0;
}
```

**Output:**
```
Before: 5 2 8 1 9
After:  1 2 5 8 9
```

---

## Code Walkthrough

```cpp
for (int i = 1; i < n; i++) {
```
We start at index 1 because a single element (index 0) is always sorted.

```cpp
int key = arr[i];
```
Save the current element. We'll be overwriting positions as we shift, so we need to hold this value.

```cpp
while (j >= 0 && arr[j] > key) {
    arr[j + 1] = arr[j];
    j--;
}
```
Walk backwards through the sorted portion, shifting each element one place right until we find where `key` belongs. The `j >= 0` check prevents going out of bounds.

```cpp
arr[j + 1] = key;
```
Insert `key` into the gap we created.

---

## Template Version (Works with Any Type)

```cpp
#include <vector>

template <typename T>
void insertionSort(std::vector<T>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        T key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

This works with `int`, `double`, `string`, or any type that supports `>` comparison.

---

## Time and Space Complexity

| Case | Time Complexity | Notes |
|---|---|---|
| Best case | O(n) | Array already sorted — inner while loop never runs |
| Average case | O(n²) | Random data |
| Worst case | O(n²) | Reverse-sorted array — maximum shifts required |
| Space | O(1) | In-place — no extra memory needed |

The best-case O(n) behaviour is what makes insertion sort genuinely useful for nearly-sorted data. If you have an array that's 95% sorted with a few elements out of place, insertion sort runs almost as fast as a single pass through the array.

---

## Comparison with Other Sorting Algorithms

| Algorithm | Best | Average | Worst | Stable | In-place |
|---|---|---|---|---|---|
| Insertion sort | O(n) | O(n²) | O(n²) | ✅ | ✅ |
| Bubble sort | O(n) | O(n²) | O(n²) | ✅ | ✅ |
| Selection sort | O(n²) | O(n²) | O(n²) | ❌ | ✅ |
| Merge sort | O(n log n) | O(n log n) | O(n log n) | ✅ | ❌ |
| std::sort | O(n log n) | O(n log n) | O(n log n) | ❌ | ✅ |

Insertion sort beats bubble sort in practice because it does fewer swaps — it shifts elements rather than swapping pairs. It beats selection sort on nearly-sorted data because of the O(n) best case.

---

## When to Use Insertion Sort

**Use insertion sort when:**
- The array has fewer than ~20 elements — the overhead of complex algorithms isn't worth it
- The data is nearly sorted — insertion sort is extremely fast in this case
- You need a stable sort with O(1) extra space
- You're implementing a hybrid algorithm (like Timsort, which falls back to insertion sort for small sub-arrays)

**Don't use insertion sort when:**
- The array is large and randomly ordered — use `std::sort` instead
- Performance on worst-case input matters

In production C++ code, you should use `std::sort` from `<algorithm>` for general sorting. Insertion sort is worth knowing because it appears in interviews, in embedded systems where simplicity matters, and as a component inside faster hybrid algorithms.

---

## Using std::sort in Practice

For real-world code, prefer the standard library:

```cpp
#include <algorithm>
#include <vector>

vector<int> arr = {5, 2, 8, 1, 9};
std::sort(arr.begin(), arr.end());              // Ascending
std::sort(arr.begin(), arr.end(), greater<int>()); // Descending
```

`std::sort` uses introsort — a hybrid of quicksort, heapsort, and insertion sort — with O(n log n) guaranteed performance.

---

## Related Articles
- [Merge Sort Algorithm in C++ with Example](/posts/merge-sort-algorithm-cpp/) — a faster O(n log n) sorting algorithm using recursion and divide-and-conquer.
- [C++ STL Containers Explained](/posts/stl-containers-cpp/) — the containers you'll use alongside sorting algorithms.
- [C++ Cheat Sheet: Quick Reference for Syntax, STL, and OOP](/posts/cpp-cheat-sheet/) — includes `std::sort` and common algorithm usage.
- [C++ Projects for Beginners: 4 Guided Projects with Full Source Code](/posts/cpp-beginner-projects/) — apply what you've learned by building real programs.
- [Top 50 C++ Interview Questions and Answers](/posts/cpp-interview-questions/) — sorting algorithms appear regularly in C++ technical interviews.
- [Learn C++ from Scratch: The Complete Beginner Roadmap](/learn-cpp/) — the full structured path from first program to advanced topics.
