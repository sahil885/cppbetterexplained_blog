---
title: "C++ deque Explained: When to Use It Instead of vector"
description: "Learn what std::deque is in C++, how push_front works, and exactly when a deque beats a vector. Includes working code and a clear performance comparison."
pubDatetime: 2026-08-25T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "stl", "containers", "tutorial"]
faqSchema:
  - question: "What is a deque in C++?"
    answer: "A deque, short for double-ended queue and pronounced deck, is a sequence container from the C++ Standard Library that can add and remove elements efficiently at both the front and the back. It supports index access like a vector but is stored as several separate memory chunks rather than one continuous block."
  - question: "What is the difference between vector and deque in C++?"
    answer: "A vector stores all elements in one continuous block of memory, so inserting at the front costs O(n) because every element must shift. A deque stores elements in multiple fixed-size chunks, which makes push_front O(1), but it gives up the guarantee that the data is contiguous."
  - question: "When should I use a deque instead of a vector?"
    answer: "Use a deque when you need to add or remove items at the front as often as the back, such as a sliding window, a queue of tasks, or an undo history with a size limit. For everything else prefer vector, since it is faster to iterate and plays better with the CPU cache."
draft: false
featured: false
---

# C++ deque Explained: When to Use It Instead of vector

`std::vector` is the container you reach for by default, and that is usually right. But it has one clear weakness: adding something to the **front** is slow, because every existing element has to shuffle over by one.

`std::deque` fixes exactly that one problem. The name is short for **d**ouble-**e**nded **que**ue, and it is pronounced "deck."

---

## The Basics: It Looks Like a vector

If you know [vector](/posts/cpp-vector-tutorial/), you already know most of deque's interface:

```cpp
#include <iostream>
#include <deque>

int main() {
    std::deque<int> d = {10, 20, 30};

    d.push_back(40);    // 10 20 30 40
    d.push_front(5);    // 5 10 20 30 40

    std::cout << "Front: " << d.front() << "\n";
    std::cout << "Back:  " << d.back() << "\n";
    std::cout << "Index 2: " << d[2] << "\n";
    std::cout << "Size: " << d.size() << "\n";

    for (int value : d)
        std::cout << value << " ";
    std::cout << "\n";

    return 0;
}
```

Output:

```
Front: 5
Back:  40
Index 2: 20
Size: 5
5 10 20 30 40
```

Indexing with `[]`, `size()`, `front()`, `back()`, [range-based for](/posts/cpp-range-based-for-loop/) — all identical to vector. The two additions are the ones that matter: **`push_front`** and **`pop_front`**.

---

## Why push_front Is Fast

Picture a vector as one long shelf. Every element sits shoulder to shoulder in a single block of memory. To put something at the start, you must slide all n items one space right — that is O(n) work.

A deque is not one shelf. It is a **row of separate shelves**, each holding a fixed number of elements, plus a small index that tracks where each shelf lives.

```
  [chunk 0]      [chunk 1]      [chunk 2]
  [ _ _ 5 10 ]   [ 20 30 40 _ ] [ _ _ _ _ ]
```

To `push_front`, the deque writes into the free slot at the left end of the first chunk — or allocates one new chunk and points to it. Either way, no existing element moves. That is O(1), and it stays O(1) no matter how large the deque grows.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## What You Give Up

The chunked layout costs you three things:

**1. The data is not contiguous.** With a vector you can do `&v[0]` and hand the pointer to a C library that expects a plain array. You cannot do that with a deque — chunk 1 is not guaranteed to sit right after chunk 0 in memory.

**2. Iteration is slower.** `d[i]` has to work out which chunk `i` falls in and then which offset inside that chunk, so it is two lookups instead of one pointer add. Walking a large deque also jumps between separate allocations, which misses the CPU cache more often than a vector's straight-line scan.

**3. Slightly higher memory overhead** for small containers, because a deque allocates at least one full chunk plus its index even when it holds three elements.

Here is the full comparison:

| Operation | vector | deque |
|-----------|--------|-------|
| `push_back` | O(1) amortised | O(1) |
| `push_front` | **O(n)** | **O(1)** |
| `pop_front` | **O(n)** | **O(1)** |
| `operator[]` | O(1), one lookup | O(1), two lookups |
| Insert in middle | O(n) | O(n) |
| Contiguous memory | **Yes** | No |
| Iteration speed | **Faster** | Slower |

---

## Iterator Invalidation: The Rule That Surprises People

With a vector, `push_back` can reallocate and invalidate **every** iterator, pointer, and reference into the container.

A deque behaves differently, and the difference is subtle. Adding at either end invalidates all **iterators** — but existing **references and pointers to elements stay valid**, because the elements themselves never move.

```cpp
std::deque<int> d = {1, 2, 3};
int& ref = d[1];
d.push_front(0);
std::cout << ref << "\n";   // Safe: still 2
```

Doing the same with a vector is undefined behaviour if the vector reallocates. This makes deque genuinely useful when you need stable references to elements while the container keeps growing.

---

## Where deque Actually Shows Up

You are probably using a deque already without knowing it. **`std::queue` and `std::stack` use deque as their default underlying container**, precisely because a queue needs cheap removal from the front:

```cpp
#include <queue>
std::queue<int> q;   // internally a std::deque<int>
```

That is covered in more depth in the [queue and stack guide](/posts/cpp-queue-stack-tutorial/).

A realistic direct use is a fixed-size sliding window — keep the last N readings and drop the oldest:

```cpp
#include <iostream>
#include <deque>

int main() {
    std::deque<int> window;
    const size_t maxSize = 3;

    int readings[] = {10, 20, 30, 40, 50};

    for (int reading : readings) {
        window.push_back(reading);

        if (window.size() > maxSize)
            window.pop_front();   // O(1) — a vector would be O(n) here

        std::cout << "Window: ";
        for (int value : window)
            std::cout << value << " ";
        std::cout << "\n";
    }

    return 0;
}
```

Output:

```
Window: 10
Window: 10 20
Window: 10 20 30
Window: 20 30 40
Window: 30 40 50
```

Every reading costs O(1) with a deque. With a vector, each `erase(begin())` would shift the whole window.

---

## The Rule of Thumb

**Default to `vector`.** It is faster to iterate, friendlier to the cache, and works with anything expecting contiguous memory.

**Switch to `deque` when you genuinely push or pop at the front**, or when you need references to elements to survive the container growing. Those are the only two reasons — and they are enough to make deque the right answer more often than beginners expect.

---

## Related Articles

- [C++ Vectors: A Complete Beginner's Guide](/posts/cpp-vector-tutorial/)
- [C++ Queue and Stack Tutorial](/posts/cpp-queue-stack-tutorial/)
- [STL Containers in C++](/posts/stl-containers-cpp/)
- [C++ Iterators Explained](/posts/cpp-iterators/)
- [Array vs Vector in C++](/posts/cpp-array-vs-vector/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
