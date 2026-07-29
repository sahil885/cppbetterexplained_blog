---
title: "C++ priority_queue: A Beginner's Guide with Examples"
description: "Learn the C++ priority_queue from scratch: push, pop, and top, plus how to build a min-heap and use custom comparators. Beginner-friendly examples included."
pubDatetime: 2026-07-29T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "STL", "data-structures", "tutorial"]
faqSchema:
  - question: "What is a priority_queue in C++?"
    answer: "A priority_queue is an STL container adapter that always keeps the highest-priority element at the top. By default it is a max-heap, so top() returns the largest value. You add with push(), read the top with top(), and remove it with pop()."
  - question: "How do you make a min-heap priority_queue in C++?"
    answer: "Declare it as priority_queue<int, vector<int>, greater<int>>. The greater<int> comparator flips the ordering so the smallest element sits on top, giving you a min-heap instead of the default max-heap."
  - question: "Why does priority_queue not have a front() function?"
    answer: "priority_queue is not a plain queue, so it uses top() instead of front(). top() returns the highest-priority element rather than the oldest one, which reflects how a heap orders its elements."
draft: false
featured: false
---

# C++ priority_queue: A Beginner's Guide with Examples

A regular queue serves people in the order they arrive. A **priority queue** serves the most important item first, no matter when it was added — like a hospital treating the most urgent patient ahead of everyone else. In C++, `std::priority_queue` gives you this behaviour out of the box, and it's a favourite in interview problems and algorithms.

---

## The Three Operations You Need

A priority_queue keeps its elements ordered so the top one is always the highest priority. You work with just three functions:

- `push(value)` — add an element
- `top()` — look at the highest-priority element
- `pop()` — remove the highest-priority element

```cpp
#include <iostream>
#include <queue>
using namespace std;

int main() {
    priority_queue<int> pq;

    pq.push(30);
    pq.push(100);
    pq.push(25);
    pq.push(80);

    cout << "Top: " << pq.top() << "\n";   // 100 (the largest)

    pq.pop();                               // removes 100
    cout << "Top now: " << pq.top() << "\n";// 80
    return 0;
}
```

By default, `priority_queue` is a **max-heap**: the largest value has the highest priority and sits on top. Note there's no `front()` here — a priority queue uses `top()`.

---

## Draining the Queue in Order

A common pattern is to pop everything, which gives you the elements from highest to lowest:

```cpp
#include <iostream>
#include <queue>
using namespace std;

int main() {
    priority_queue<int> pq;
    for (int n : {4, 1, 7, 3, 9, 2}) {
        pq.push(n);
    }

    while (!pq.empty()) {
        cout << pq.top() << " ";   // 9 7 4 3 2 1
        pq.pop();
    }
    cout << "\n";
    return 0;
}
```

Each `top()`/`pop()` pair peels off the current maximum, so the output comes out sorted in descending order.

---

## Making a Min-Heap

Often you want the *smallest* element on top instead — for example, the cheapest route or the earliest deadline. Flip the ordering with `greater<int>`:

```cpp
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    priority_queue<int, vector<int>, greater<int>> pq;

    pq.push(30);
    pq.push(100);
    pq.push(25);

    cout << "Smallest: " << pq.top() << "\n";  // 25
    return 0;
}
```

The three template arguments are: the element type, the underlying container (`vector<int>` is the default), and the comparison. Swapping the default `less` for `greater` turns the max-heap into a min-heap. This is efficient because the heap still does all its work in logarithmic time — you've only changed which end counts as "top."

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Priority Queue of Custom Objects

Real programs rarely queue plain ints. Suppose you have tasks, each with a priority number, and you want the most urgent first. Give the priority_queue a custom comparator:

```cpp
#include <iostream>
#include <queue>
#include <string>
#include <vector>
using namespace std;

struct Task {
    string name;
    int priority;
};

// Higher priority number = more urgent = comes out first
struct CompareTask {
    bool operator()(const Task& a, const Task& b) {
        return a.priority < b.priority;
    }
};

int main() {
    priority_queue<Task, vector<Task>, CompareTask> tasks;

    tasks.push({"Email", 2});
    tasks.push({"Server down", 10});
    tasks.push({"Coffee", 1});

    while (!tasks.empty()) {
        Task t = tasks.top();
        cout << t.name << " (priority " << t.priority << ")\n";
        tasks.pop();
    }
    return 0;
}
```

Output:

```
Server down (priority 10)
Email (priority 2)
Coffee (priority 1)
```

The comparator returns `true` when `a` should come *after* `b`, which is why "less than" produces a max-heap. It reads backwards at first, but you get used to it.

---

## How It Works Under the Hood

A `priority_queue` is built on a **binary heap**, usually stored inside a `vector`. That's why the operations are fast:

| Operation | Time complexity |
|-----------|-----------------|
| `push()` | O(log n) |
| `pop()` | O(log n) |
| `top()` | O(1) |

You never see the heap directly — the container adapter hides it — but knowing it's there explains the performance.

---

## Common Uses

Priority queues show up whenever "handle the most important thing next" matters: Dijkstra's shortest-path algorithm, Huffman coding, task schedulers, and merging sorted lists. If you're practising algorithm problems, this is a container you'll use again and again.

---

## Related Articles

- [C++ Queue and Stack Tutorial](/posts/cpp-queue-stack-tutorial/) — the simpler FIFO and LIFO adapters
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — the container a priority_queue is built on
- [C++ STL Containers](/posts/stl-containers-cpp/) — the big picture of the standard library
- [C++ Sort Algorithm](/posts/cpp-sort-algorithm/) — another way to order data
- [C++ Structs Explained](/posts/cpp-structs-explained/) — building the custom types you'll queue

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
