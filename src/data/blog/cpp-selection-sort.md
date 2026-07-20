---
title: "Selection Sort in C++: How It Works, With Code and Complexity"
description: "Learn selection sort in C++ with a full working program. See how the algorithm picks the smallest element each pass, plus its time complexity and trade-offs."
pubDatetime: 2026-07-20T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "algorithms", "sorting", "tutorial"]
faqSchema:
  - question: "How does selection sort work in C++?"
    answer: "Selection sort divides the array into a sorted part at the front and an unsorted part behind it. On each pass it scans the unsorted part for the smallest element and swaps it into the first unsorted position. After n-1 passes the whole array is sorted."
  - question: "What is the time complexity of selection sort?"
    answer: "Selection sort is O(n squared) in all cases — best, average, and worst. It always scans the entire remaining unsorted section regardless of the data, so even a fully sorted array takes the same number of comparisons."
  - question: "Is selection sort better than bubble sort?"
    answer: "Selection sort makes far fewer swaps — at most n-1 compared to bubble sort's potential n squared. That matters when swapping is expensive. But bubble sort can detect an already sorted array and finish in O(n), which selection sort cannot."
draft: false
featured: false
---

# Selection Sort in C++: How It Works, With Code and Complexity

Selection sort is how most people sort a hand of cards without thinking about it: find the smallest card, put it at the front, then find the smallest of what's left, and repeat.

It's not fast, but it's the easiest sorting algorithm to reason about — and it has one genuine advantage over bubble sort.

---

## The Core Idea

Imagine the array split into two regions:

```
[ sorted | unsorted ]
```

The sorted region starts empty. On every pass you:

1. Scan the **unsorted** region to find the smallest element.
2. Swap it with the first element of the unsorted region.
3. The boundary moves one step right — the sorted region grew by one.

After `n - 1` passes, everything is in place. (The last element needs no pass; if everything else is sorted and smaller, it's already correct.)

---

## Walking Through an Example

Start with `[64, 25, 12, 22, 11]`:

| Pass | Array state | Smallest found | Swap |
|------|-------------|----------------|------|
| 1 | `[64, 25, 12, 22, 11]` | 11 (index 4) | 64 ↔ 11 |
| 2 | `[11, 25, 12, 22, 64]` | 12 (index 2) | 25 ↔ 12 |
| 3 | `[11, 12, 25, 22, 64]` | 22 (index 3) | 25 ↔ 22 |
| 4 | `[11, 12, 22, 25, 64]` | 25 (already in place) | none |
| — | `[11, 12, 22, 25, 64]` | done | |

Notice pass 4 found the minimum was already where it belonged. Selection sort still had to scan to discover that — it can't know in advance.

---

## The Code

```cpp
#include <iostream>
#include <vector>

void selectionSort(std::vector<int>& data) {
    int n = static_cast<int>(data.size());

    for (int i = 0; i < n - 1; i++) {
        // Assume the first unsorted element is the smallest
        int minIndex = i;

        // Scan the rest of the unsorted region for something smaller
        for (int j = i + 1; j < n; j++) {
            if (data[j] < data[minIndex]) {
                minIndex = j;
            }
        }

        // Swap it into place (skip if it's already there)
        if (minIndex != i) {
            std::swap(data[i], data[minIndex]);
        }
    }
}

void print(const std::vector<int>& data) {
    for (int value : data) {
        std::cout << value << " ";
    }
    std::cout << "\n";
}

int main() {
    std::vector<int> numbers = {64, 25, 12, 22, 11};

    std::cout << "Before: ";
    print(numbers);

    selectionSort(numbers);

    std::cout << "After:  ";
    print(numbers);

    return 0;
}
```

Output:
```
Before: 64 25 12 22 11
After:  11 12 22 25 64
```

A few decisions in that code are worth explaining.

**`std::vector<int>& data`** — the ampersand passes by reference, so the function sorts the caller's actual vector. Drop it and you'd sort a copy and change nothing.

**`i < n - 1`** — the outer loop stops one short. Once the first `n-1` elements are correct, the last one has nowhere else to be.

**`j = i + 1`** — the inner loop starts *after* the current position, because everything before `i` is already sorted and everything from `i` onward is the unsorted region.

**`if (minIndex != i)`** — skipping a self-swap. Not required for correctness, but it avoids pointless work when an element is already in position.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Watching It Work

To see the algorithm rather than just its result, print after every pass:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> data = {64, 25, 12, 22, 11};
    int n = static_cast<int>(data.size());

    for (int i = 0; i < n - 1; i++) {
        int minIndex = i;
        for (int j = i + 1; j < n; j++) {
            if (data[j] < data[minIndex]) {
                minIndex = j;
            }
        }
        std::swap(data[i], data[minIndex]);

        std::cout << "Pass " << (i + 1) << ": ";
        for (int k = 0; k < n; k++) {
            if (k == i) std::cout << "[";
            std::cout << data[k];
            if (k == i) std::cout << "]";
            std::cout << " ";
        }
        std::cout << "\n";
    }

    return 0;
}
```

Output:
```
Pass 1: [11] 25 12 22 64 
Pass 2: 11 [12] 25 22 64 
Pass 3: 11 12 [22] 25 64 
Pass 4: 11 12 22 [25] 64 
```

The bracketed element is the one just locked into place. You can watch the sorted region grow from the left.

---

## Time and Space Complexity

| Case | Comparisons | Swaps | Complexity |
|------|-------------|-------|------------|
| Best (already sorted) | n(n−1)/2 | 0 | O(n²) |
| Average | n(n−1)/2 | ~n−1 | O(n²) |
| Worst (reverse sorted) | n(n−1)/2 | n−1 | O(n²) |

The comparison count is identical in every case, and that's the defining property of selection sort. The outer loop always runs `n-1` times and the inner loop always scans the full remaining region. There is no early exit, no shortcut for sorted data.

Space complexity is **O(1)** — it sorts in place using only a couple of index variables.

---

## Selection Sort vs Bubble Sort vs Insertion Sort

| | Selection sort | [Bubble sort](/posts/bubble-sort-cpp/) | [Insertion sort](/posts/insertion-sort-cpp/) |
|---|---|---|---|
| Best case | O(n²) | O(n) with early exit | O(n) |
| Worst case | O(n²) | O(n²) | O(n²) |
| Number of swaps | **O(n)** | O(n²) | O(n²) shifts |
| Stable | No | Yes | Yes |
| Adaptive (fast on sorted data) | No | Yes | Yes |

Selection sort's one real advantage is in that swaps row. It performs **at most n−1 swaps**, while bubble sort can perform thousands. If you're sorting large objects where each swap copies a lot of bytes, that difference is real.

Its weakness is that it's **not adaptive**. Hand bubble sort or insertion sort an already-sorted array and they finish in O(n). Selection sort grinds through every comparison anyway.

It's also **not stable** — equal elements can have their relative order changed by a long-distance swap. If you're sorting records by one field and want to preserve a previous ordering, that matters.

---

## Should You Actually Use It?

In production code: no. Use [`std::sort`](/posts/cpp-sort-algorithm/):

```cpp
#include <algorithm>
#include <vector>

std::vector<int> data = {64, 25, 12, 22, 11};
std::sort(data.begin(), data.end());   // O(n log n), heavily optimised
```

`std::sort` is O(n log n) and tuned by compiler engineers. For anything beyond a few dozen elements it wins by a wide margin.

Learn selection sort because it teaches the nested-loop pattern cleanly and because "find the minimum of a range" is a genuinely useful subroutine on its own. Then use `std::sort` for real work.

---

## Related Articles

- [Bubble Sort in C++](/posts/bubble-sort-cpp/) — the other classic O(n²) sort
- [Insertion Sort in C++](/posts/insertion-sort-cpp/) — usually the fastest of the simple sorts
- [Merge Sort in C++](/posts/merge-sort-algorithm-cpp/) — stepping up to O(n log n)
- [C++ Sort Algorithm](/posts/cpp-sort-algorithm/) — what to actually use in real code
- [Finding Max and Min in C++](/posts/cpp-find-max-min/) — the inner loop, on its own
- [C++ Nested Loops](/posts/cpp-nested-loops/) — the pattern this algorithm is built on

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
