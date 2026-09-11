---
title: "How to Insert Into a Vector in C++ (insert, emplace, push_back)"
description: "Insert elements into a C++ vector at the beginning, middle or end. Covers insert with iterators, emplace, inserting ranges, and why iterators get invalidated."
pubDatetime: 2026-09-11T00:00:00Z
author: "Sahil"
tags: ["C++", "vectors", "STL", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "How do you insert an element into a vector in C++?"
    answer: "Use v.insert(position, value), where position is an iterator, not an index. To insert at index 2 write v.insert(v.begin() + 2, value). To add at the end use push_back, which is faster and simpler."
  - question: "How do you insert at the beginning of a vector?"
    answer: "Call v.insert(v.begin(), value). Be aware this shifts every existing element one place to the right, so it costs O(n). If you insert at the front often, std::deque is the better container."
  - question: "What is the difference between insert and emplace in C++ vectors?"
    answer: "insert takes an object and copies or moves it into place. emplace takes constructor arguments and builds the object directly inside the vector, avoiding a temporary. For simple types like int there is no practical difference."
  - question: "Does inserting into a vector invalidate iterators?"
    answer: "Yes. Any insert can trigger a reallocation, which invalidates all iterators, pointers and references to elements. Even without reallocation, iterators at or after the insertion point become invalid. Never reuse an old iterator after inserting."
---

# How to Insert Into a Vector in C++

**Short answer:** `v.insert(v.begin() + index, value)` inserts at a position, and `v.push_back(value)` adds to the end. The key thing to know: `insert` takes an **iterator**, not an index.

---

## Insert at a Specific Position

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {10, 20, 40, 50};

    // insert 30 at index 2
    v.insert(v.begin() + 2, 30);

    for (int n : v) std::cout << n << ' ';
    // 10 20 30 40 50
}
```

`v.begin() + 2` is an iterator pointing at the third slot. The new value goes **before** that position, and everything from there onward shifts right.

## Insert at the Beginning and End

```cpp
std::vector<int> v = {2, 3, 4};

v.insert(v.begin(), 1);      // front: 1 2 3 4
v.push_back(5);              // back:  1 2 3 4 5
v.insert(v.end(), 6);        // also the back: 1 2 3 4 5 6
```

Prefer `push_back` for appending — it is clearer and avoids constructing an iterator. Use `insert(v.end(), ...)` only when the position is a variable that might happen to be the end.

**Inserting at the front is O(n).** Every element must shift one place. Doing it in a loop over `n` items is O(n²), which is fine for 100 elements and painful for 100,000. If you need cheap front insertion, use [std::deque](/posts/cpp-deque/).

<div class="inline-cta"><strong>Want the STL explained properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers vectors, iterators and containers in plain English — 87 pages, just $19.</div>

## Insert Multiple Copies

```cpp
std::vector<int> v = {1, 5};

v.insert(v.begin() + 1, 3, 0);   // three zeros at index 1
// 1 0 0 0 5
```

## Insert a Range from Another Container

```cpp
std::vector<int> a = {1, 2, 6};
std::vector<int> b = {3, 4, 5};

a.insert(a.begin() + 2, b.begin(), b.end());
// 1 2 3 4 5 6
```

This is also how you concatenate two vectors — insert the whole of one at the end of the other:

```cpp
a.insert(a.end(), b.begin(), b.end());
```

And from an initializer list:

```cpp
std::vector<int> v = {1, 4};
v.insert(v.begin() + 1, {2, 3});   // 1 2 3 4
```

## insert vs emplace

`emplace` constructs the object in place from its arguments instead of copying a finished one:

```cpp
struct Point {
    int x, y;
    Point(int x, int y) : x(x), y(y) {}
};

std::vector<Point> pts;

pts.push_back(Point(1, 2));        // build, then move
pts.emplace_back(1, 2);            // build directly in the vector

pts.insert(pts.begin(), Point(0, 0));
pts.emplace(pts.begin(), 0, 0);    // same, no temporary
```

For `int` and other trivial types the difference is nothing. For objects that are expensive to copy, `emplace` saves a construction. Note `emplace_back` takes the **constructor arguments**, not the object.

## What insert Returns

It returns an iterator to the newly inserted element — useful when you want to keep working at that spot:

```cpp
std::vector<int> v = {1, 3};
auto it = v.insert(v.begin() + 1, 2);
std::cout << *it;    // 2
```

## The Iterator Invalidation Trap

This is the bug that bites people:

```cpp
std::vector<int> v = {1, 2, 3};
auto it = v.begin();

v.insert(v.begin(), 0);   // may reallocate

std::cout << *it;         // UNDEFINED BEHAVIOUR — it is dangling
```

When a vector runs out of capacity it allocates a bigger block and moves everything across. Every iterator, pointer and reference into the old block becomes invalid. Use the iterator that `insert` returned, or re-fetch from `begin()`.

Inserting inside a range-based for loop over the same vector is the same mistake in disguise — don't.

## Reserve First When You Know the Size

```cpp
std::vector<int> v;
v.reserve(1000);           // one allocation instead of ~10

for (int i = 0; i < 1000; ++i) {
    v.push_back(i);
}
```

`reserve` allocates capacity without creating elements, so the repeated growth-and-copy cycle never happens. See [reserve vs resize](/posts/cpp-vector-reserve-vs-resize/) for the difference — `resize` actually creates elements, which is usually not what you want here.

## Quick Reference

| Goal             | Code                                    | Cost           |
| ---------------- | --------------------------------------- | -------------- |
| Add to end       | `v.push_back(x)`                        | O(1) amortised |
| Construct at end | `v.emplace_back(args...)`               | O(1) amortised |
| Insert at index  | `v.insert(v.begin() + i, x)`            | O(n)           |
| Insert at front  | `v.insert(v.begin(), x)`                | O(n)           |
| Insert n copies  | `v.insert(pos, n, x)`                   | O(n)           |
| Insert a range   | `v.insert(pos, b.begin(), b.end())`     | O(n)           |
| Concatenate      | `a.insert(a.end(), b.begin(), b.end())` | O(n)           |

---

## Take Your C++ Further

If you want vectors, iterators and the STL explained properly instead of looked up function by function, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers the fundamentals in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ Vector Tutorial: A Complete Guide](/posts/cpp-vector-tutorial/) — everything else vectors can do.
- [How to Remove an Element from a Vector](/posts/cpp-remove-from-vector/) — the opposite operation, with the same iterator traps.
- [reserve vs resize in C++ Vectors](/posts/cpp-vector-reserve-vs-resize/) — controlling capacity before you insert.
- [C++ Iterators Explained](/posts/cpp-iterators/) — what those begin() and end() values really are.
- [C++ deque Explained](/posts/cpp-deque/) — the container for cheap insertion at the front.
