---
title: "The Rule of Three in C++ Explained (with Examples)"
description: "The Rule of Three in C++: if your class needs a destructor, copy constructor, or copy assignment, it usually needs all three. Learn why, with clear examples."
pubDatetime: 2026-07-29T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "OOP", "memory", "tutorial"]
faqSchema:
  - question: "What is the Rule of Three in C++?"
    answer: "The Rule of Three says that if a class needs a custom destructor, copy constructor, or copy assignment operator, it almost certainly needs all three. These functions manage resources like heap memory, and defining only one usually leads to bugs."
  - question: "Why is the Rule of Three important?"
    answer: "When a class owns a raw resource such as memory from new, the compiler-generated copy just copies the pointer, so two objects share and then double-free the same memory. Defining all three functions ensures copies are independent and safe."
  - question: "What is the Rule of Five in C++?"
    answer: "The Rule of Five extends the Rule of Three by adding the move constructor and move assignment operator, introduced in C++11. If you manage a resource manually, you typically define all five to support both copying and efficient moving."
draft: false
featured: false
---

# The Rule of Three in C++ Explained (with Examples)

The Rule of Three is a guideline that saves beginners from one of C++'s nastiest bugs: crashes and memory corruption when objects are copied. It states that **if your class needs a custom destructor, copy constructor, or copy assignment operator, it almost certainly needs all three.** Let's see exactly why.

---

## The Three Special Functions

When a class manages a resource — most commonly memory allocated with `new` — three functions control its lifetime:

1. **Destructor** — cleans up when the object dies (`~MyClass()`)
2. **Copy constructor** — builds a new object as a copy of an existing one (`MyClass(const MyClass&)`)
3. **Copy assignment operator** — replaces one existing object's contents with another's (`operator=`)

If you don't write these, the compiler generates them for you. For simple classes that's fine. But when your class owns a raw pointer, the auto-generated versions do the *wrong* thing.

---

## The Bug: A Class That Owns Memory

Here's a class that allocates memory but only defines a destructor:

```cpp
#include <iostream>
#include <cstring>
using namespace std;

class Buffer {
    char* data;
public:
    Buffer(const char* text) {
        data = new char[strlen(text) + 1];
        strcpy(data, text);
    }
    ~Buffer() {
        delete[] data;   // free the memory
    }
    void print() const { cout << data << "\n"; }
};

int main() {
    Buffer a("hello");
    Buffer b = a;        // compiler-generated copy — DANGER
    return 0;            // both destructors run...
}
```

This program crashes. Why? The compiler's default copy just copies the **pointer**, so `a.data` and `b.data` point at the *same* memory. When both objects are destroyed, `delete[]` runs twice on that one block — a "double free" that corrupts the heap.

This is called a **shallow copy**. What we need is a **deep copy**: each object gets its own independent memory.

---

## The Fix: Implement All Three

```cpp
#include <iostream>
#include <cstring>
using namespace std;

class Buffer {
    char* data;
public:
    // Constructor
    Buffer(const char* text) {
        data = new char[strlen(text) + 1];
        strcpy(data, text);
    }

    // 1. Destructor
    ~Buffer() {
        delete[] data;
    }

    // 2. Copy constructor — allocate our OWN copy
    Buffer(const Buffer& other) {
        data = new char[strlen(other.data) + 1];
        strcpy(data, other.data);
    }

    // 3. Copy assignment operator
    Buffer& operator=(const Buffer& other) {
        if (this == &other) return *this;   // guard against self-assignment
        delete[] data;                      // free our old memory
        data = new char[strlen(other.data) + 1];
        strcpy(data, other.data);
        return *this;
    }

    void print() const { cout << data << "\n"; }
};

int main() {
    Buffer a("hello");
    Buffer b = a;        // deep copy — safe now
    b.print();
    return 0;            // each frees its own memory — no crash
}
```

Now `a` and `b` each own separate memory, so both destructors run safely. This is why the rule bundles the three together: they all deal with the same underlying question — *how is this resource copied and released?* Fixing one without the others leaves a hole.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Why "If One, Then All Three"

The logic is straightforward. If your class needs a custom **destructor**, it owns a resource that must be released manually. But a resource that must be released manually must also be *copied* manually — otherwise the default shallow copy shares it, and you're back to the double-free bug. So needing any one of the three strongly implies needing the other two.

---

## The Modern Answer: Rule of Zero

Here's the twist experienced C++ programmers will tell you: **the best way to follow the Rule of Three is to not need it at all.**

If you store your data in types that already manage their own memory — like `std::string` or `std::vector` — the compiler-generated copy and destructor already do the right thing. You write *zero* special functions:

```cpp
#include <string>
using namespace std;

class Buffer {
    string data;          // string handles its own memory
public:
    Buffer(const string& text) : data(text) {}
    // No destructor, copy constructor, or operator= needed!
};
```

This is called the **Rule of Zero**: prefer classes that need none of the three because their members clean up after themselves. Use the Rule of Three only when you truly must manage a raw resource yourself.

---

## Rule of Three vs Rule of Five

C++11 added **move semantics**, which introduced two more special functions: the move constructor and move assignment operator. When you extend the Rule of Three with these, it becomes the **Rule of Five**. The idea is the same — if you manage a resource by hand, define all the functions that copy, move, and release it so nothing is left to a broken default.

---

## Quick Summary

| Rule | Functions you define | When |
|------|----------------------|------|
| Rule of Zero | none | your members manage their own memory (preferred) |
| Rule of Three | destructor + copy constructor + copy assignment | you manage a raw resource |
| Rule of Five | the three above + move constructor + move assignment | you manage a resource and want efficient moves |

---

## The Takeaway

If you find yourself writing a destructor because your class owns something raw, stop and write the copy constructor and copy assignment operator too. Better yet, lean on `std::string`, `std::vector`, and smart pointers so you never have to — that's the Rule of Zero, and it's the safest path of all.

---

## Related Articles

- [C++ Copy Constructor](/posts/cpp-copy-constructor/) — deep vs shallow copies in detail
- [C++ Constructors and Destructors](/posts/cpp-constructors-destructors/) — the object lifecycle basics
- [Smart Pointers in C++](/posts/smart-pointers-cpp/) — the modern way to own resources safely
- [C++ Move Semantics](/posts/cpp-move-semantics/) — the moves that turn Three into Five
- [Memory Management in C++](/posts/memory-management-cpp/) — new, delete, and why copies matter

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
