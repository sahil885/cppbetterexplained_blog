---
title: "C++ Pass by Value, Reference & Pointer: Complete Guide"
description: "Understand C++ pass by value, pass by reference, and pass by pointer with clear examples. Learn when to use each and how they affect performance."
pubDatetime: 2026-04-28T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "tutorial", "pointers", "functions"]
draft: false
featured: false
faqSchema:
  - question: "What is pass by value in C++?"
    answer: "Pass by value copies the argument into the function parameter. Changes made to the parameter inside the function do not affect the original variable. It is safe but can be expensive for large objects like vectors or strings."
  - question: "What is pass by reference in C++?"
    answer: "Pass by reference passes an alias to the original variable. Changes made inside the function directly affect the original. Use const reference (const T&) to pass large objects efficiently without allowing modification."
  - question: "What is the difference between pass by reference and pass by pointer in C++?"
    answer: "A reference is an alias that cannot be null and cannot be reassigned. A pointer holds a memory address and can be null or reassigned. Both allow modifying the original variable, but references are safer and cleaner for most use cases."
  - question: "When should you pass by const reference in C++?"
    answer: "Use const reference (const T&) when passing large objects like std::string, std::vector, or custom classes to a function that only needs to read them. This avoids an expensive copy while preventing the function from modifying the original."
---

# C++ Pass by Value, Reference & Pointer: Complete Guide

One of the questions that trips up almost every C++ beginner is: when do I pass by value, by reference, or by pointer? The choice affects whether your function can modify the original variable, how much memory is used, and how fast your program runs.

This article breaks down all three approaches with clear examples and a practical guide on when to use each.

---

## The Three Ways to Pass Arguments

### 1. Pass by Value

When you pass by value, C++ makes a **copy** of the argument. The function works with the copy — any changes it makes do not affect the original variable.

```cpp
#include <iostream>
using namespace std;

void addTen(int x) {
    x += 10;  // Modifies the copy, not the original
    cout << "Inside function: " << x << endl;
}

int main() {
    int num = 5;
    addTen(num);
    cout << "After function: " << num << endl; // Still 5
    return 0;
}
```

**Output:**
```
Inside function: 15
After function: 5
```

The original `num` is unchanged because `addTen` received a copy.

---

### 2. Pass by Reference

When you pass by reference using `&`, the function receives an **alias** to the original variable. Any changes inside the function directly modify the original.

```cpp
void addTen(int& x) {  // & means reference
    x += 10;  // Modifies the original
}

int main() {
    int num = 5;
    addTen(num);
    cout << "After function: " << num << endl; // Now 15
    return 0;
}
```

**Output:**
```
After function: 15
```

---

### 3. Pass by Pointer

When you pass by pointer, the function receives the **memory address** of the variable. You must dereference the pointer with `*` to access or modify the value.

```cpp
void addTen(int* x) {  // * means pointer
    *x += 10;  // Dereference to modify the original
}

int main() {
    int num = 5;
    addTen(&num);  // Pass the address with &
    cout << "After function: " << num << endl; // Now 15
    return 0;
}
```

**Output:**
```
After function: 15
```

---

## Side-by-Side Comparison

```cpp
#include <iostream>
using namespace std;

void byValue(int x)     { x = 100; }
void byReference(int& x) { x = 100; }
void byPointer(int* x)  { *x = 100; }

int main() {
    int a = 5, b = 5, c = 5;

    byValue(a);
    byReference(b);
    byPointer(&c);

    cout << "byValue:     " << a << endl; // 5  — unchanged
    cout << "byReference: " << b << endl; // 100 — changed
    cout << "byPointer:   " << c << endl; // 100 — changed

    return 0;
}
```

---

## Pass by Const Reference — The Best of Both Worlds

Passing large objects by value makes a full copy, which is expensive. Passing by reference allows the function to modify the original, which may not be what you want. The solution is **const reference** — efficient like a pointer, safe like pass by value:

```cpp
// BAD: copies the entire string (potentially thousands of characters)
void printName(string name) {
    cout << name << endl;
}

// GOOD: no copy, but can't modify the original
void printName(const string& name) {
    cout << name << endl;
}
```

Const reference is the standard way to pass strings, vectors, and custom objects to functions that only need to read them.

---

## Practical Example: Swap Two Numbers

This is a classic demonstration of why pass by reference matters:

```cpp
#include <iostream>
using namespace std;

// This does NOT work — changes are lost
void swapByValue(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}

// This DOES work — modifies the originals
void swapByReference(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 10, y = 20;

    swapByValue(x, y);
    cout << "After swapByValue: x=" << x << " y=" << y << endl; // 10, 20

    swapByReference(x, y);
    cout << "After swapByReference: x=" << x << " y=" << y << endl; // 20, 10

    return 0;
}
```

---

## Passing Arrays

Arrays are always passed as pointers in C++. You cannot pass an array by value:

```cpp
void printArray(int arr[], int size) {
    // arr is actually a pointer to the first element
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
}
```

For modern C++, prefer passing `std::vector` by const reference instead:

```cpp
void printVector(const vector<int>& v) {
    for (int x : v) cout << x << " ";
}
```

---

## When to Use Each

| Situation | Use |
|-----------|-----|
| Small primitive type (int, char, bool) — read only | Pass by value |
| Need to modify the original variable | Pass by reference (`&`) |
| Large object (string, vector, class) — read only | Pass by const reference (`const &`) |
| Optional parameter that might be absent | Pass by pointer (can be nullptr) |
| Returning multiple values from a function | Pass by reference |
| Working with arrays of unknown size | Pass by pointer |

A practical rule: **for primitives use value, for objects use const reference, for output parameters use reference, for optional parameters use pointer.**

---

## References vs Pointers: Key Differences

| Feature | Reference | Pointer |
|---------|-----------|---------|
| Can be null | ❌ No | ✅ Yes (nullptr) |
| Can be reassigned | ❌ No | ✅ Yes |
| Syntax to use | Direct (`x`) | Dereference (`*x`) |
| Must initialise on declaration | ✅ Yes | ❌ No |
| Safer to use | ✅ Generally | ❌ More error-prone |

References are almost always the better choice for function parameters. Use pointers when you need nullable or reassignable semantics.

---

## Related Articles
- [How to Use Pointers in C++: A Complete Beginner's Guide](/posts/pointers-in-cpp/) — the foundation for understanding pass by pointer.
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — master functions before diving into parameter passing strategies.
- [C++ Memory Management: Heap, Stack, new/delete Explained](/posts/memory-management-cpp/) — understand why copies are expensive and how memory works under the hood.
- [Smart Pointers in C++: unique_ptr & shared_ptr Guide](/posts/smart-pointers-cpp/) — the modern C++ alternative to raw pointers.
- [C++ Cheat Sheet: Quick Reference for Syntax, STL, and OOP](/posts/cpp-cheat-sheet/) — a quick reference for function parameter syntax.
