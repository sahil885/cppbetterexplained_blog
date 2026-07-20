---
title: "Linked Lists in C++: Build One From Scratch (Beginner's Guide)"
description: "Learn how linked lists work in C++. Build a singly linked list from scratch with nodes and pointers, insert and delete elements, and know when to use one."
pubDatetime: 2026-07-20T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "data-structures", "pointers", "tutorial"]
faqSchema:
  - question: "What is a linked list in C++?"
    answer: "A linked list is a data structure where each element (called a node) stores a value and a pointer to the next node. Unlike an array, the nodes are scattered across memory rather than stored in one contiguous block, so the list can grow without reallocating everything."
  - question: "When should I use a linked list instead of a vector?"
    answer: "Use a linked list when you need frequent insertions or deletions in the middle of a sequence and you already hold a pointer to that position. For almost everything else, std::vector is faster because contiguous memory is cache-friendly. In practice, beginners should default to std::vector."
  - question: "Why does my linked list crash with a segmentation fault?"
    answer: "The most common cause is dereferencing a null pointer — walking past the end of the list without checking if the current node is nullptr. Always test 'while (current != nullptr)' before accessing current->data or current->next."
draft: false
featured: false
---

# Linked Lists in C++: Build One From Scratch

A linked list is the first data structure where pointers stop being an abstract exercise and start doing real work. Instead of storing elements side by side like an array, a linked list stores each element in its own box and keeps a pointer to the next box.

Once you build one by hand, pointers make a lot more sense.

---

## The Mental Model: A Chain of Boxes

Think of a treasure hunt. Each clue tells you where to find the next clue. You can't skip to clue #5 — you have to follow the chain from the start.

That's a linked list. Each **node** holds two things:

1. The data you care about
2. A pointer to the next node

The last node points to `nullptr`, which means "the chain ends here."

```cpp
struct Node {
    int data;
    Node* next;
};
```

That's the entire structure. A `Node` contains a pointer to another `Node` — this is legal because the compiler only needs to know the *size of a pointer*, not the full size of `Node`, at that point.

---

## Building a List by Hand

Before writing any functions, let's wire three nodes together manually so you can see what's happening:

```cpp
#include <iostream>

struct Node {
    int data;
    Node* next;
};

int main() {
    // Create three nodes on the heap
    Node* first  = new Node{10, nullptr};
    Node* second = new Node{20, nullptr};
    Node* third  = new Node{30, nullptr};

    // Link them together
    first->next  = second;
    second->next = third;
    // third->next stays nullptr — end of the list

    // Walk the chain
    Node* current = first;
    while (current != nullptr) {
        std::cout << current->data << " -> ";
        current = current->next;
    }
    std::cout << "nullptr\n";

    // Clean up
    delete first;
    delete second;
    delete third;

    return 0;
}
```

Output:
```
10 -> 20 -> 30 -> nullptr
```

The traversal loop is the pattern you'll use constantly: start at the head, print, move to `next`, stop at `nullptr`.

Notice we used `new` to put nodes on the heap. This matters — nodes created on the stack inside a function would be destroyed when that function returns, leaving your list full of dangling pointers.

---

## Inserting at the Front

Adding to the front is the fastest operation a linked list offers. It's three steps and it never depends on how long the list is:

```cpp
void pushFront(Node*& head, int value) {
    Node* newNode = new Node{value, head};  // point new node at old head
    head = newNode;                         // head now points at new node
}
```

Two details worth pausing on:

- `Node*& head` is a **reference to a pointer**. We need it because we're changing what `head` points to. Without the `&`, we'd only modify a local copy and the caller's list would be unchanged.
- We set `newNode->next = head` *before* reassigning `head`. Do it in the other order and you lose the rest of your list forever.

This is O(1) — constant time. Compare that to inserting at the front of an array, which requires shifting every existing element one slot to the right.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Inserting at the End

Appending requires walking to the last node first, which makes it O(n):

```cpp
void pushBack(Node*& head, int value) {
    Node* newNode = new Node{value, nullptr};

    if (head == nullptr) {      // empty list — new node becomes the head
        head = newNode;
        return;
    }

    Node* current = head;
    while (current->next != nullptr) {  // stop at the LAST node
        current = current->next;
    }
    current->next = newNode;
}
```

The empty-list check is not optional. Skip it and `current->next` dereferences a null pointer on the very first append.

Also note the loop condition: `current->next != nullptr`, not `current != nullptr`. We want to *stop on* the last node so we can attach to it, not run past it.

---

## Deleting a Node

Deletion is where beginners lose memory. You need to reconnect the chain **and** free the node:

```cpp
void removeValue(Node*& head, int value) {
    if (head == nullptr) return;

    // Case 1: the head itself matches
    if (head->data == value) {
        Node* doomed = head;
        head = head->next;   // move head forward first
        delete doomed;       // then free the old one
        return;
    }

    // Case 2: search with a "previous" pointer
    Node* current = head;
    while (current->next != nullptr && current->next->data != value) {
        current = current->next;
    }

    if (current->next != nullptr) {
        Node* doomed = current->next;
        current->next = doomed->next;  // bypass the doomed node
        delete doomed;
    }
}
```

The key idea: you must hold a pointer to the node *before* the one you're removing, because that's the node whose `next` needs rewiring. Save the doomed node in a temporary variable before you unlink it — once you overwrite the pointer, you can't reach it to `delete` it, and that's a memory leak.

---

## A Complete Working Program

Here's everything together, including proper cleanup:

```cpp
#include <iostream>

struct Node {
    int data;
    Node* next;
};

void pushFront(Node*& head, int value) {
    head = new Node{value, head};
}

void pushBack(Node*& head, int value) {
    Node* newNode = new Node{value, nullptr};
    if (head == nullptr) {
        head = newNode;
        return;
    }
    Node* current = head;
    while (current->next != nullptr) {
        current = current->next;
    }
    current->next = newNode;
}

void printList(Node* head) {
    Node* current = head;
    while (current != nullptr) {
        std::cout << current->data << " -> ";
        current = current->next;
    }
    std::cout << "nullptr\n";
}

bool contains(Node* head, int value) {
    for (Node* current = head; current != nullptr; current = current->next) {
        if (current->data == value) return true;
    }
    return false;
}

void destroyList(Node*& head) {
    while (head != nullptr) {
        Node* next = head->next;  // save next BEFORE deleting
        delete head;
        head = next;
    }
}

int main() {
    Node* head = nullptr;

    pushBack(head, 20);
    pushBack(head, 30);
    pushFront(head, 10);

    printList(head);
    std::cout << "Contains 30? " << (contains(head, 30) ? "yes" : "no") << "\n";
    std::cout << "Contains 99? " << (contains(head, 99) ? "yes" : "no") << "\n";

    destroyList(head);
    printList(head);

    return 0;
}
```

Output:
```
10 -> 20 -> 30 -> nullptr
Contains 30? yes
Contains 99? no
nullptr
```

Look closely at `destroyList`. It saves `head->next` into a local variable *before* calling `delete head`. Delete first and you've thrown away the only pointer to the rest of your list — a classic beginner bug that leaks every remaining node.

---

## Linked List vs Vector: Which Should You Use?

| Operation | Linked List | `std::vector` |
|-----------|-------------|---------------|
| Insert at front | O(1) | O(n) — shifts everything |
| Insert at back | O(n)* | O(1) amortized |
| Access by index | O(n) — must walk | O(1) — direct math |
| Memory per element | Data + pointer | Data only |
| Cache friendliness | Poor — scattered | Excellent — contiguous |

\*O(1) if you also keep a tail pointer.

Here's the honest advice: **use `std::vector` unless you have a measured reason not to.** Modern CPUs read memory in chunks, so a vector's contiguous layout means the next element is usually already in cache. A linked list forces the CPU to chase pointers all over the heap, and that often makes it slower in practice even when the big-O looks better on paper.

Linked lists earn their keep when you're doing many insertions and removals in the middle of a long sequence and you already hold a pointer to that spot.

If you do need one in production code, reach for [`std::list`](/posts/stl-containers-cpp/) (doubly linked) or `std::forward_list` (singly linked) rather than writing your own. Building one by hand is a learning exercise — and a very good one.

---

## Common Mistakes

**Forgetting the null check while traversing.** `while (current->next != nullptr)` and `while (current != nullptr)` do different things. Use the first when you need to stop *on* the last node, the second when you need to visit *every* node.

**Losing the head pointer.** If you write `head = head->next` in a traversal loop, you've destroyed your only reference to the start of the list. Always walk with a separate `current` pointer.

**Leaking every node.** Every `new` needs a matching `delete`. A list of 1000 nodes needs 1000 deletes — that's what `destroyList` is for.

**Passing `Node* head` when you meant `Node*& head`.** If a function changes which node is the head, it needs a reference to the pointer. This one is silent — no crash, the list just doesn't change.

---

## Related Articles

- [How to Use Pointers in C++](/posts/pointers-in-cpp/) — the foundation every linked list is built on
- [Memory Management in C++](/posts/memory-management-cpp/) — new, delete, and avoiding leaks
- [C++ Structs Explained](/posts/cpp-structs-explained/) — the building block of a node
- [Smart Pointers in Modern C++](/posts/smart-pointers-cpp/) — how to avoid manual delete entirely
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — the container you should usually reach for first
- [C++ nullptr vs NULL](/posts/cpp-nullptr-vs-null/) — why nullptr is the right terminator

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
