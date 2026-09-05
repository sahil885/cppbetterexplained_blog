---
title: "std::list in C++: A Beginner's Guide to Linked Lists in the STL"
description: "Learn how std::list works in C++, how it differs from vector, and when a doubly linked list is actually the right choice. With full working code examples."
pubDatetime: 2026-09-05T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "stl", "containers", "tutorial"]
faqSchema:
  - question: "What is std::list in C++?"
    answer: "std::list is a doubly linked list container from the C++ Standard Library. Each element is stored in its own node that holds a pointer to the previous and next node, which makes inserting or erasing anywhere in the list a constant-time operation."
  - question: "What is the difference between list and vector in C++?"
    answer: "A vector stores elements in one contiguous block and gives you instant index access, but inserting in the middle shifts everything after it. A list stores elements in separate nodes linked by pointers, so middle insertion is instant, but there is no operator[] and you must walk the list to reach an element."
  - question: "When should I use std::list instead of std::vector?"
    answer: "Use std::list when you frequently insert or remove elements in the middle of a large sequence and you already hold an iterator to that position, or when you need references to elements to stay valid after insertions. For almost everything else vector is faster because of CPU cache behaviour."
draft: false
featured: false
---

# std::list in C++: The Standard Library's Linked List

If you've ever hand-written a [linked list in C++](/posts/cpp-linked-list/) with `struct Node { int data; Node* next; };`, you know the drill: allocate nodes, wire up pointers, and pray you don't leak memory. `std::list` is that same idea, already written, tested, and memory-safe.

It's also the container beginners reach for far too often. Let's cover both how to use it *and* why `vector` usually wins.

---

## What a list Actually Looks Like in Memory

A [vector](/posts/cpp-vector-tutorial/) is one continuous block:

```
[10][20][30][40]      <- one allocation, elements side by side
```

A `std::list` is a chain of separately allocated nodes:

```
[prev|10|next] <-> [prev|20|next] <-> [prev|30|next]
```

Every element carries two extra pointers. That's the trade: you pay memory and lose index access, and in exchange inserting anywhere costs the same tiny amount of work.

---

## The Basics

```cpp
#include <iostream>
#include <list>

int main() {
    std::list<int> numbers = {10, 20, 30};

    numbers.push_back(40);    // 10 20 30 40
    numbers.push_front(5);    // 5 10 20 30 40

    std::cout << "Front: " << numbers.front() << "\n";
    std::cout << "Back:  " << numbers.back()  << "\n";
    std::cout << "Size:  " << numbers.size()  << "\n";

    for (int n : numbers) {
        std::cout << n << " ";
    }
    std::cout << "\n";

    numbers.pop_front();      // removes 5
    numbers.pop_back();       // removes 40

    return 0;
}
```

Output:

```
Front: 5
Back:  40
Size:  5
5 10 20 30 40
```

Notice `push_front` — a vector doesn't have that, because prepending to a vector means shifting every element. A list just re-points two pointers.

The thing you *can't* do is `numbers[2]`. There is no `operator[]` on a list, and that's not an oversight: reaching element 2 means walking from the start, so the standard refuses to give you a syntax that hides an O(n) cost behind something that looks free.

---

## Inserting and Erasing in the Middle

This is the reason `std::list` exists. You need an [iterator](/posts/cpp-iterators/) pointing at the position:

```cpp
#include <iostream>
#include <list>
#include <algorithm>

int main() {
    std::list<int> nums = {10, 20, 40, 50};

    // find where 40 is
    auto it = std::find(nums.begin(), nums.end(), 40);

    if (it != nums.end()) {
        nums.insert(it, 30);   // inserts BEFORE the iterator
    }

    for (int n : nums) std::cout << n << " ";
    std::cout << "\n";         // 10 20 30 40 50

    // erase returns an iterator to the next element
    it = std::find(nums.begin(), nums.end(), 20);
    if (it != nums.end()) {
        it = nums.erase(it);
        std::cout << "Now pointing at: " << *it << "\n";  // 30
    }

    return 0;
}
```

Two details worth burning into memory:

1. **`insert` places the new element *before* the iterator.** That's consistent across the whole STL.
2. **`erase` returns an iterator to the element after the one removed.** Always reassign it — using an iterator after erasing what it pointed at is undefined behaviour.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Member Functions Only list Has

Because list is built from nodes, it can do a few things no other container can:

```cpp
#include <iostream>
#include <list>

int main() {
    std::list<int> a = {3, 1, 2};
    std::list<int> b = {9, 7, 8};

    a.sort();          // list has its OWN sort — std::sort won't work here
    b.sort();

    a.merge(b);        // b is now empty, a holds all six sorted
    std::cout << "b.size() = " << b.size() << "\n";   // 0

    a.push_back(2);
    a.push_back(2);
    a.sort();
    a.unique();        // removes CONSECUTIVE duplicates

    a.reverse();

    for (int n : a) std::cout << n << " ";
    std::cout << "\n";
    return 0;
}
```

Why does `list` need its own `sort()`? Because `std::sort` from `<algorithm>` requires **random-access iterators** — it needs to jump to the middle of the range. A list can only step one node at a time, so `std::sort(a.begin(), a.end())` won't even compile. The member `sort()` is a merge sort written for linked nodes; see [merge sort explained](/posts/merge-sort-algorithm-cpp/) if you're curious how it works.

Also note `unique()` only removes **adjacent** duplicates — that's why we sort first.

---

## The Honest Performance Story

Textbooks say "list insertion is O(1), vector insertion is O(n), so list is faster." In practice, vector usually wins anyway. Here's why.

Modern CPUs read memory in cache lines of 64 bytes. A vector's elements sit next to each other, so loading one element pulls the next fifteen `int`s along for free. A list's nodes are scattered across the heap, so every single step is potentially a cache miss — and a cache miss costs roughly as much as a hundred arithmetic operations.

So the honest rule is:

**Use `std::list` when:**

- You insert or erase in the middle *a lot*, and you already have the iterator (you didn't have to search for it)
- You need pointers, references, or iterators to elements to stay valid when you add or remove other elements — vector invalidates everything on reallocation, list never does
- You need to splice whole ranges between containers in constant time

**Use `std::vector` when:** basically any other time. Start with vector; switch only if you measure a problem.

---

## list vs vector vs deque at a Glance

| | vector | deque | list |
|---|---|---|---|
| `v[i]` index access | O(1) | O(1) | not available |
| Insert at back | O(1) amortised | O(1) | O(1) |
| Insert at front | O(n) | O(1) | O(1) |
| Insert in middle | O(n) | O(n) | O(1) with iterator |
| Memory per element | smallest | small | largest (2 pointers extra) |
| Cache friendly | excellent | good | poor |

If [deque](/posts/cpp-deque/) is new to you, it's the middle ground: fast at both ends, still indexable.

---

## Related Articles

- [C++ vector Tutorial for Beginners](/posts/cpp-vector-tutorial/)
- [Linked Lists in C++ From Scratch](/posts/cpp-linked-list/)
- [C++ deque Explained](/posts/cpp-deque/)
- [C++ Iterators Explained](/posts/cpp-iterators/)
- [STL Containers in C++](/posts/stl-containers-cpp/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
