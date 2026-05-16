---
title: "C++ Stack vs Heap Memory: What's the Difference?"
description: "Learn the difference between stack and heap memory in C++. This guide explains how each works, when to use new/delete, how memory leaks happen, and what RAII and smart pointers solve."
pubDatetime: 2026-05-16T00:00:00Z
author: "Sahil"
tags: ["C++", "memory", "pointers", "beginner", "tutorial"]
faqSchema:
  - question: "What is the difference between stack and heap in C++?"
    answer: "The stack is a region of memory that automatically grows and shrinks as functions are called and return. Local variables live on the stack and are automatically cleaned up. The heap is a large pool of memory that you explicitly allocate with 'new' and must manually free with 'delete'. Stack allocation is faster; heap gives you more space and control over object lifetime."
  - question: "When should I use heap allocation (new/delete) in C++?"
    answer: "Use heap allocation when: the object must outlive the function that created it, the size is not known at compile time, you need a large amount of memory (the stack is typically 1-8MB), or you need to share ownership of an object. In modern C++, prefer smart pointers (unique_ptr, shared_ptr) over raw new/delete."
  - question: "What is a memory leak in C++ and how do I prevent it?"
    answer: "A memory leak occurs when you allocate heap memory with 'new' and never free it with 'delete'. The memory stays allocated until the program exits, gradually consuming available memory. Prevent leaks by matching every 'new' with a 'delete', or better — use smart pointers (unique_ptr, shared_ptr) which automatically free memory when no longer needed."
draft: false
featured: false
---

# C++ Stack vs Heap Memory: What's the Difference?

When a C++ program runs, it uses two regions of memory in very different ways: the **stack** and the **heap**. Understanding both is essential — it explains why pointers exist, why memory leaks happen, and why smart pointers were invented.

---

## The Stack

The stack is automatic memory. When you declare a local variable, it lives on the stack:

```cpp
void myFunction() {
    int x = 10;       // On the stack
    double pi = 3.14; // On the stack
    char c = 'A';     // On the stack

    // When myFunction returns, all these are automatically destroyed
}
```

The stack works like a physical stack of plates:
- **Push**: calling a function pushes a new "stack frame" (space for local variables)
- **Pop**: returning from a function pops that frame — all local variables are destroyed

**Properties of stack memory:**
- **Automatic**: allocated and freed automatically — you don't do anything
- **Fast**: just moving a stack pointer
- **Limited**: typically 1–8 MB depending on the OS
- **Predictable lifetime**: destroyed when the containing scope ends

---

## The Heap

The heap is manual memory. You explicitly ask for it with `new` and must free it with `delete`:

```cpp
int* p = new int(42);     // Allocate an int on the heap, p points to it
cout << *p << endl;       // 42

delete p;                 // Free the heap memory
p = nullptr;              // Set to null to avoid dangling pointer
```

```cpp
int* arr = new int[100];  // Allocate array of 100 ints on the heap
arr[0] = 1;
// ...use arr...
delete[] arr;             // Free array heap memory — note [] for arrays
```

**Properties of heap memory:**
- **Manual**: you control when it's allocated and freed
- **Larger**: gigabytes available (limited only by physical/virtual memory)
- **Flexible lifetime**: persists until you explicitly free it (or the program ends)
- **Slower**: involves bookkeeping to track allocations

---

## Side-by-Side Comparison

```cpp
// Stack allocation
void stackExample() {
    int x = 42;           // Created on entry to this scope
    int arr[100];         // 400 bytes on the stack
    // x and arr destroyed automatically when function returns
}

// Heap allocation
void heapExample() {
    int* p = new int(42); // Created on heap — persists after return!
    int* arr = new int[100]; // 400 bytes on heap

    // You MUST free this before losing the pointer
    delete p;
    delete[] arr;
}
```

The crucial difference: stack memory is cleaned up automatically. Heap memory is not — if you lose the pointer without freeing the memory, it leaks.

---

## Memory Leaks

A memory leak occurs when heap memory is allocated but never freed:

```cpp
void leaky() {
    int* p = new int(42);
    // Function returns without delete p — the int leaks
    // p (the pointer on the stack) is destroyed, but the int (on the heap) is not
}

int main() {
    while (true) {
        leaky();  // Leaks 4 bytes every iteration
        // After enough iterations, the program runs out of memory
    }
}
```

Leaks are hard to spot because the program appears to work — it just gradually consumes memory.

---

## What Lives Where

**On the stack:**
- Local variables
- Function parameters
- Return addresses
- Small fixed-size arrays (e.g., `int arr[10]`)

**On the heap:**
- Anything allocated with `new`
- Dynamic arrays (`new int[n]` where n isn't known at compile time)
- STL containers like `std::vector`, `std::string`, `std::map` (they manage heap internally)

---

## Stack vs Heap: When to Use Each

**Use the stack (local variables) when:**
- The object's lifetime matches the containing function/scope
- The size is known at compile time and isn't huge
- Performance matters (stack allocation is essentially free)

**Use the heap (`new`/smart pointers) when:**
- The object must outlive the function that creates it
- Size is determined at runtime
- You need more memory than the stack allows
- Multiple parts of the program need to share ownership

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Modern C++: Smart Pointers

Raw `new`/`delete` is error-prone. Smart pointers automate memory management:

```cpp
#include <memory>

void smartExample() {
    // unique_ptr: automatically frees when it goes out of scope
    unique_ptr<int> p = make_unique<int>(42);
    cout << *p << endl;  // 42
    // No delete needed — p is destroyed at end of scope, memory freed automatically
}
```

```cpp
// shared_ptr: multiple owners, freed when the last owner is gone
shared_ptr<int> a = make_shared<int>(10);
shared_ptr<int> b = a;   // Both a and b own the int
// The int is freed when both a and b go out of scope
```

Smart pointers give you the control of heap allocation with the safety of stack (automatic cleanup). In modern C++, you rarely need to write `new` and `delete` directly.

---

## Visualising the Stack and Heap

```
Memory layout of a running program:
┌─────────────────┐  ← High addresses
│      Stack      │  ← Grows downward
│  (local vars)   │
│                 │
│  (free space)   │
│                 │
│      Heap       │  ← Grows upward
│  (new/delete)   │
├─────────────────┤
│   Static data   │  (global vars, static vars)
├─────────────────┤
│    Code (text)  │  (compiled instructions)
└─────────────────┘  ← Low addresses
```

Stack starts at a high address and grows toward lower addresses. The heap starts lower and grows upward. If they meet (in very large programs), you get out-of-memory errors.

---

## Quick Reference

| | Stack | Heap |
|-|-------|------|
| Allocation | Automatic | Manual (`new`) |
| Deallocation | Automatic | Manual (`delete`) |
| Speed | Very fast | Slower |
| Size | Limited (~8 MB) | Large (GBs) |
| Lifetime | Scope-bound | Until `delete` |
| Fragmentation | No | Can fragment |
| Risk | Stack overflow | Memory leaks |

---

## Related Articles

- [Memory Management in C++](/posts/memory-management-cpp/) — new, delete, and memory leaks in depth
- [Smart Pointers in C++](/posts/smart-pointers-cpp/) — unique_ptr, shared_ptr, weak_ptr
- [How to Use Pointers in C++](/posts/pointers-in-cpp/) — pointer fundamentals
- [C++ Segmentation Fault](/posts/cpp-segmentation-fault/) — what happens when memory access goes wrong

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
