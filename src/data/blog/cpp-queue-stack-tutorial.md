---
title: "C++ Queue and Stack Tutorial: FIFO and LIFO Containers Explained"
description: "Learn how to use std::queue and std::stack in C++. Understand FIFO vs LIFO, push, pop, front, top, and when to choose each container."
pubDatetime: 2026-05-23T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "STL", "data-structures", "tutorial"]
faqSchema:
  - question: "What is the difference between a stack and a queue in C++?"
    answer: "A stack is LIFO (Last In, First Out) — the last item pushed is the first removed, like a stack of plates. A queue is FIFO (First In, First Out) — the first item added is the first removed, like a line of people. In C++, std::stack and std::queue are both in the <stack> and <queue> headers respectively."
  - question: "How do I add and remove elements from a C++ queue?"
    answer: "Use push() to add to the back and pop() to remove from the front. Access the front element with front() and the back with back(). Always check empty() before calling front() or pop() to avoid undefined behavior."
  - question: "How do I add and remove elements from a C++ stack?"
    answer: "Use push() to add to the top and pop() to remove from the top. Access the top element with top(). Always check empty() before calling top() or pop() — calling them on an empty stack is undefined behavior."
draft: false
featured: false
---

# C++ Queue and Stack Tutorial: FIFO and LIFO Containers

Two of the most fundamental data structures in programming are the **queue** and the **stack**. They both store a sequence of items, but they have completely opposite rules for which item comes out first. C++ provides both as ready-to-use containers in the Standard Library.

---

## The Core Idea: LIFO vs FIFO

**Stack (LIFO — Last In, First Out):** Think of a stack of plates. You always add and remove from the top. The last plate you put on is the first one you take off.

**Queue (FIFO — First In, First Out):** Think of a queue at a checkout. The first person who joined is the first to be served. New people join at the back.

---

## std::stack

`std::stack` is in the `<stack>` header. Its key operations are:

- `push(val)` — add to the top
- `pop()` — remove from the top (returns nothing)
- `top()` — peek at the top element without removing it
- `empty()` — returns true if the stack has no elements
- `size()` — number of elements

```cpp
#include <iostream>
#include <stack>

int main() {
    std::stack<int> s;

    s.push(10);
    s.push(20);
    s.push(30);

    std::cout << "Top: " << s.top() << "\n"; // 30

    s.pop(); // removes 30
    std::cout << "Top: " << s.top() << "\n"; // 20

    std::cout << "Size: " << s.size() << "\n"; // 2
    return 0;
}
```

### Iterating a Stack

There's no iterator for `std::stack`. To process all elements, pop them one by one:

```cpp
std::stack<int> s;
s.push(1); s.push(2); s.push(3);

while (!s.empty()) {
    std::cout << s.top() << " "; // 3 2 1
    s.pop();
}
```

Note they come out in reverse order — that's LIFO.

### Practical Use: Checking Balanced Brackets

Stacks are perfect for bracket-matching problems because you need to remember what you opened most recently:

```cpp
#include <iostream>
#include <stack>
#include <string>

bool isBalanced(const std::string& expr) {
    std::stack<char> s;
    for (char c : expr) {
        if (c == '(' || c == '[' || c == '{') {
            s.push(c);
        } else if (c == ')' || c == ']' || c == '}') {
            if (s.empty()) return false;
            char top = s.top();
            s.pop();
            if ((c == ')' && top != '(') ||
                (c == ']' && top != '[') ||
                (c == '}' && top != '{')) {
                return false;
            }
        }
    }
    return s.empty();
}

int main() {
    std::cout << isBalanced("(a + [b * c])")   << "\n"; // 1 (true)
    std::cout << isBalanced("(a + [b * c)")    << "\n"; // 0 (false)
    std::cout << isBalanced("{[(hello)]}") << "\n"; // 1 (true)
    return 0;
}
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## std::queue

`std::queue` is in the `<queue>` header. Its key operations are:

- `push(val)` — add to the back
- `pop()` — remove from the front (returns nothing)
- `front()` — peek at the front element
- `back()` — peek at the back element
- `empty()` — returns true if the queue has no elements
- `size()` — number of elements

```cpp
#include <iostream>
#include <queue>

int main() {
    std::queue<std::string> q;

    q.push("Alice");
    q.push("Bob");
    q.push("Carol");

    std::cout << "Front: " << q.front() << "\n"; // Alice
    std::cout << "Back:  " << q.back()  << "\n"; // Carol

    q.pop(); // removes Alice
    std::cout << "Front: " << q.front() << "\n"; // Bob

    std::cout << "Size: " << q.size() << "\n"; // 2
    return 0;
}
```

### Iterating a Queue

Like stack, there's no iterator — drain it with a loop:

```cpp
std::queue<std::string> q;
q.push("Alice"); q.push("Bob"); q.push("Carol");

while (!q.empty()) {
    std::cout << q.front() << " "; // Alice Bob Carol
    q.pop();
}
```

They come out in insertion order — that's FIFO.

### Practical Use: Print Queue Simulation

```cpp
#include <iostream>
#include <queue>
#include <string>

int main() {
    std::queue<std::string> printQueue;

    printQueue.push("report.pdf");
    printQueue.push("invoice.pdf");
    printQueue.push("photo.png");

    std::cout << "Processing print jobs:\n";
    int jobNum = 1;
    while (!printQueue.empty()) {
        std::cout << "Job " << jobNum++ << ": " << printQueue.front() << "\n";
        printQueue.pop();
    }
    return 0;
}
```

Output:
```
Processing print jobs:
Job 1: report.pdf
Job 2: invoice.pdf
Job 3: photo.png
```

---

## Always Check empty() Before Accessing Elements

Calling `top()` on an empty stack or `front()` on an empty queue is **undefined behavior** — your program may crash or produce garbage output. Always guard with `empty()`:

```cpp
if (!myStack.empty()) {
    std::cout << myStack.top() << "\n";
}

if (!myQueue.empty()) {
    std::cout << myQueue.front() << "\n";
}
```

---

## Quick Reference Comparison

| Operation | std::stack | std::queue |
|---|---|---|
| Add element | `push(val)` — goes to top | `push(val)` — goes to back |
| Remove element | `pop()` — removes top | `pop()` — removes front |
| Peek | `top()` | `front()`, `back()` |
| Order | LIFO (Last In, First Out) | FIFO (First In, First Out) |
| Header | `<stack>` | `<queue>` |

---

## When to Use Each

**Use a stack when:**
- You need to reverse something (reverse a string, undo history)
- You're implementing recursion iteratively
- You're parsing nested structures (brackets, XML tags)
- The most recently added item is always the most relevant

**Use a queue when:**
- You're processing items in the order they arrived
- You're simulating a waiting line or task queue
- You're doing breadth-first search (BFS) on a graph or tree

---

## Related Articles

- [C++ STL Containers Overview: vector, map, set, and More](/posts/stl-containers-cpp/)
- [C++ Vector Tutorial: Dynamic Arrays Explained](/posts/cpp-vector-tutorial/)
- [C++ Recursion Tutorial: How Recursive Functions Work](/posts/cpp-recursion-tutorial/)
- [C++ set Tutorial: Sorted Unique Collections Explained](/posts/cpp-set-tutorial/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
