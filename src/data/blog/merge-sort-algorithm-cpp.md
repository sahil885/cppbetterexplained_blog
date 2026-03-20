---
title: "Merge Sort Algorithm in C++ with Example - Full Implementation"
description: "Learn how the merge sort algorithm works in C++ with a step-by-step explanation, visual diagram, and full source code implementation."
pubDatetime: 2024-09-28T00:00:00Z
author: "Sahil"
tags: ["C++", "algorithms", "sorting", "merge sort", "divide and conquer", "beginner"]
draft: false
featured: true
---

The Merge Sort algorithm is known as a divide and conquer algorithm. This means that the input array is divided into two halves, it then calls itself recursively for each half, and finally merges the two sorted halves back together.

Merge Sort is the algorithm of choice when an application requires stability — such as sorting linked lists — or when random access is much more costly than sequential access.

## How Does the Merge Sort Algorithm Work?

The algorithm works by repeatedly splitting the array in half until each sub-array contains only one element, then merging them back in sorted order.

For example, sorting the array `{38, 27, 43, 3, 9, 82, 10}` works like this:

```
{38, 27, 43, 3, 9, 82, 10}
        /              \
{38, 27, 43, 3}    {9, 82, 10}
    /      \           /     \
{38, 27} {43, 3}   {9, 82}  {10}
  /   \    /   \    /    \
{38} {27} {43} {3} {9}  {82}

Merge step:
{27, 38} {3, 43} {9, 82} {10}
    {3, 27, 38, 43}   {9, 10, 82}
        {3, 9, 10, 27, 38, 43, 82}
```

At each level the algorithm splits, and at each level coming back up it merges in sorted order. This gives Merge Sort a consistent time complexity of **O(n log n)** in all cases.

## Time and Space Complexity

| Case | Time Complexity |
|---|---|
| Best | O(n log n) |
| Average | O(n log n) |
| Worst | O(n log n) |
| Space | O(n) |

Unlike Quick Sort, Merge Sort always runs in O(n log n) regardless of the input — making it reliable for large datasets.

## Implementation of Merge Sort in C++

The implementation consists of two functions — `merge()` which combines two sorted sub-arrays, and `mergeSort()` which recursively divides the array.

```cpp
#include <iostream>
using namespace std;

// Merges two subarrays of arr[]
// First subarray is arr[l..m]
// Second subarray is arr[m+1..r]
void merge(int arr[], int l, int m, int r) {
    int i, j, k;
    int n1 = m - l + 1;
    int n2 = r - m;

    // Create temp arrays
    int L[n1], R[n2];

    // Copy data to temp arrays L[] and R[]
    for (i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (j = 0; j < n2; j++)
        R[j] = arr[m + 1 + j];

    // Merge the temp arrays back into arr[l..r]
    i = 0; // Initial index of first subarray
    j = 0; // Initial index of second subarray
    k = l; // Initial index of merged subarray

    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    // Copy the remaining elements of L[], if any
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    // Copy the remaining elements of R[], if any
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

// l is the left index and r is the right index of the sub-array to be sorted
void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        // Same as (l+r)/2 but avoids overflow for large l and r
        int m = l + (r - l) / 2;

        // Sort first and second halves
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);

        merge(arr, l, m, r);
    }
}

// Utility function to print an array
void printArray(int A[], int size) {
    for (int i = 0; i < size; i++) {
        cout << A[i] << "\n";
    }
}

int main() {
    int arr[] = {12, 11, 13, 5, 6, 7};
    int arr_size = sizeof(arr) / sizeof(arr[0]);

    cout << "Given array is:\n";
    printArray(arr, arr_size);

    mergeSort(arr, 0, arr_size - 1);

    cout << "\nSorted array is:\n";
    printArray(arr, arr_size);

    return 0;
}
```

## Output

```
Given array is:
12
11
13
5
6
7

Sorted array is:
5
6
7
11
12
13
```

## When Should You Use Merge Sort?

Merge Sort is the right choice when:

- You need a **stable sort** — elements with equal values maintain their original order
- You are sorting a **linked list** — unlike arrays, linked lists allow efficient sequential access which suits Merge Sort perfectly
- You need **guaranteed O(n log n)** performance and cannot risk Quick Sort's worst-case O(n²)
- You are sorting **large datasets** stored on disk where sequential access is faster than random access

## Merge Sort vs Other Sorting Algorithms

| Algorithm | Best | Average | Worst | Stable |
|---|---|---|---|---|
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | No |
| Bubble Sort | O(n) | O(n²) | O(n²) | Yes |
| Insertion Sort | O(n) | O(n²) | O(n²) | Yes |

## Summary

Merge Sort is one of the most reliable sorting algorithms in C++. Its divide and conquer approach guarantees consistent O(n log n) performance and makes it ideal for sorting linked lists and large datasets where stability matters.

---

**Want to go deeper with C++ algorithms and data structures?** [C++ Better Explained](https://start.cppbetterexplained.com/tw-sales-page) covers sorting algorithms, data structures, and real-world C++ projects — grab the book and start building today.
