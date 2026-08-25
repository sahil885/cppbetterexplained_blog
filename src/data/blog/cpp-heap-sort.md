---
title: "Heap Sort in C++: How It Works, With Full Code and Complexity"
description: "Learn heap sort in C++ with a complete working program. Understand what a max heap is, how heapify works, and why heap sort is always O(n log n) time."
pubDatetime: 2026-08-25T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "algorithms", "sorting", "tutorial"]
faqSchema:
  - question: "How does heap sort work in C++?"
    answer: "Heap sort first rearranges the array into a max heap, a structure where every parent is larger than its children, which puts the biggest value at index 0. It then swaps that value to the end of the array, shrinks the heap by one, and repairs the heap. Repeating this until the heap is empty leaves the array fully sorted."
  - question: "What is the time complexity of heap sort?"
    answer: "Heap sort is O(n log n) in the best, average, and worst case. Building the heap costs O(n), and each of the n extractions costs O(log n) to repair the heap, so no input can ever make it degrade the way quick sort does."
  - question: "Is heap sort better than quick sort?"
    answer: "Heap sort has a better worst case, O(n log n) versus quick sort's O(n squared), and uses no extra memory. In practice quick sort is usually faster because it reads memory in a cache-friendly straight line while heap sort jumps between distant indices, so heap sort is chosen when a guaranteed worst case matters more than raw speed."
draft: false
featured: false
---

# Heap Sort in C++: How It Works, With Full Code and Complexity

Heap sort is the sorting algorithm that never has a bad day. Quick sort can degrade to O(n squared) on an unlucky input, and merge sort needs an extra array to work in — heap sort avoids both problems by sorting in place with a guaranteed O(n log n) running time.

The price is that you have to understand one idea first: the **heap**.

---

## What Is a Max Heap?

A max heap is an array that you *pretend* is a binary tree. Element 0 is the root, and for any element at index `i`:

```
left child  = 2*i + 1
right child = 2*i + 2
parent      = (i - 1) / 2
```

So the array `[9, 5, 8, 1, 4, 3]` is really this tree:

```
            9        (index 0)
          /   \
         5     8     (index 1, 2)
        / \   /
       1   4 3       (index 3, 4, 5)
```

The **max heap property** is one simple rule: *every parent is greater than or equal to both of its children*. The array above satisfies it — 9 beats 5 and 8, 5 beats 1 and 4, 8 beats 3.

Notice what that rule buys you. It does **not** mean the array is sorted. But it does guarantee the largest element in the whole array is sitting at index 0, where you can grab it instantly. That single guarantee is the entire engine of heap sort.

---

## The heapify Function: Repairing One Broken Parent

`heapify` is the workhorse. It assumes the two subtrees below index `i` are already valid heaps, but `i` itself might be too small. Its job is to push that value down until it lands in a legal spot.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

// Repair the heap rooted at index i, within an array of size n.
void heapify(std::vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest])
        largest = left;

    if (right < n && arr[right] > arr[largest])
        largest = right;

    // If a child was bigger, swap and keep sinking down.
    if (largest != i) {
        std::swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}
```

Read the logic literally: find the biggest of the three values (parent, left child, right child). If the parent already wins, we are done — the subtree is a valid heap. If a child wins, swap them and recurse, because that swap may have broken the subtree we just pushed the small value into.

Each call moves the value down one level, and the tree is only about log n levels deep, so `heapify` costs O(log n).

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Building the Heap From an Unsorted Array

To turn a random array into a max heap, call `heapify` on every non-leaf node, working **backwards** from the middle:

```cpp
for (int i = n / 2 - 1; i >= 0; i--)
    heapify(arr, n, i);
```

Why backwards, and why start at `n / 2 - 1`? Because `heapify` requires the subtrees below `i` to already be valid. Leaf nodes — everything from index `n / 2` onward — have no children, so they are trivially valid heaps already. Starting just before them and moving toward index 0 means every call always has valid subtrees underneath it.

This loop looks like it should cost O(n log n), but it is actually O(n). Most nodes are near the bottom, where `heapify` has almost no distance to sink.

---

## The Sort Itself

Once you have a max heap, sorting is a short loop:

1. The largest element is at index 0. Swap it with the last element of the heap — it is now in its final sorted position.
2. Shrink the heap by one so the sorted tail is left alone.
3. The new root is probably wrong, so call `heapify` on index 0 to repair it.
4. Repeat.

Here is the complete program:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

void heapify(std::vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;

    if (largest != i) {
        std::swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(std::vector<int>& arr) {
    int n = static_cast<int>(arr.size());

    // Step 1: build a max heap out of the whole array.
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    // Step 2: repeatedly move the root to the sorted tail.
    for (int i = n - 1; i > 0; i--) {
        std::swap(arr[0], arr[i]);  // biggest value goes to its final spot
        heapify(arr, i, 0);         // repair the heap, now one element smaller
    }
}

int main() {
    std::vector<int> numbers = {12, 11, 13, 5, 6, 7};

    heapSort(numbers);

    for (int value : numbers)
        std::cout << value << " ";
    std::cout << "\n";

    return 0;
}
```

Output:

```
5 6 7 11 12 13
```

The key detail is that second `heapify(arr, i, 0)` call. Passing `i` — not `n` — as the size is what hides the sorted tail from the heap. Every element past index `i - 1` is finished and must never move again.

---

## Why Heap Sort Is Always O(n log n)

Walk the cost:

| Phase | Cost |
|-------|------|
| Build the heap | O(n) |
| n swaps, each followed by a `heapify` | n × O(log n) |
| **Total** | **O(n log n)** |

There is no input that breaks this. Quick sort's worst case comes from bad pivot choices, and merge sort's extra buffer costs O(n) memory. Heap sort has neither weakness: it uses O(1) extra space and its bound holds for sorted, reversed, and random data alike.

The tradeoff is real-world speed. Heap sort jumps from index `i` to `2*i + 1`, which on a large array means constantly missing the CPU cache. Quick sort scans memory in order, so it stays cache-friendly and usually wins on a stopwatch despite the worse theoretical bound. Heap sort is also **not stable** — equal elements can end up in a different relative order than they started.

---

## Using the Standard Library Instead

C++ gives you heap operations directly, so you rarely write the code above outside of learning or interviews:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {12, 11, 13, 5, 6, 7};

    std::make_heap(numbers.begin(), numbers.end());  // build the max heap
    std::sort_heap(numbers.begin(), numbers.end());  // drain it into sorted order

    for (int value : numbers)
        std::cout << value << " ";
    std::cout << "\n";

    return 0;
}
```

For real code, just use `std::sort`. It uses introsort, which starts with quick sort and *falls back to heap sort* when the recursion gets too deep — literally using heap sort as its safety net against the O(n squared) worst case.

---

## Related Articles

- [Quick Sort in C++](/posts/cpp-quick-sort/)
- [Merge Sort in C++](/posts/merge-sort-algorithm-cpp/)
- [C++ priority_queue: A Beginner's Guide](/posts/cpp-priority-queue/)
- [Selection Sort in C++](/posts/cpp-selection-sort/)
- [How to Use std::sort in C++](/posts/cpp-sort-algorithm/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
