---
title: "C++ Move Semantics: rvalue References & std::move"
description: "Understand C++ move semantics from scratch. Learn rvalue references, std::move, and the Rule of Five to write fast, efficient modern C++ code."
pubDatetime: 2026-04-19T00:00:00Z
author: "Sahil"
tags: ["C++", "move semantics", "rvalue", "performance", "C++11", "tutorial"]
faqSchema:
  - question: "What are move semantics in C++?"
    answer: "Move semantics allow a C++ object's resources to be transferred rather than copied. Instead of duplicating heap memory, the source object's pointer is moved to the destination and the source is left in a valid empty state. This is much faster for objects like vectors and strings."
  - question: "What is the difference between std::move and copy in C++?"
    answer: "Copying duplicates all data, which is expensive for large objects. std::move casts an object to an rvalue reference, signalling that its resources can be stolen. After a move, the source object is in a valid but unspecified state and should not be used."
  - question: "What is an rvalue reference in C++?"
    answer: "An rvalue reference (declared with &&) binds to temporary objects or objects explicitly cast with std::move. They enable move constructors and move assignment operators, which transfer resources instead of copying them, improving performance significantly."
draft: false
featured: false
---

# C++ Move Semantics Explained: rvalue References, std::move, and Performance

Before C++11, passing or returning large objects meant copying them — even when you didn't need the original anymore. Move semantics changed that. Instead of copying all the data, you can *transfer ownership* of the data from one object to another in constant time. This is one of the most impactful performance features in modern C++.

This tutorial explains move semantics from first principles, with concrete examples at every step.

---

## The Problem Move Semantics Solves

Consider this:

```cpp
#include <vector>
#include <iostream>

std::vector<int> makeData() {
    std::vector<int> result(1000000, 42); // 1 million elements
    return result;
}

int main() {
    std::vector<int> data = makeData();
    return 0;
}
```

Without move semantics, returning `result` from `makeData()` would copy all 1 million elements into `data`. That's 4 MB of memory copied for no reason — the original `result` is about to be destroyed anyway.

Move semantics lets the compiler (and you) say: "don't copy this data — just give ownership of it to the new variable." The vector's internal pointer is transferred; no elements are copied.

---

## lvalues and rvalues: The Foundation

To understand move semantics, you first need to understand the difference between **lvalues** and **rvalues**.

**lvalue** — has a name and a persistent address in memory. You can take its address with `&`.

```cpp
int x = 10;       // x is an lvalue
std::string s;    // s is an lvalue
```

**rvalue** — temporary, nameless. Exists only for the duration of an expression. You cannot take its address.

```cpp
10                          // rvalue (literal)
x + 5                       // rvalue (result of an expression)
std::string("hello")        // rvalue (temporary object)
makeData()                  // rvalue (return value from a function)
```

The rule is simple: if you can put it on the left side of an assignment, it's an lvalue. If not, it's an rvalue.

```cpp
x = 10;  // OK — x is an lvalue
10 = x;  // Error — 10 is an rvalue, can't assign to it
```

---

## rvalue References: `T&&`

C++11 introduced **rvalue references**, written as `T&&`. They can bind to rvalues (temporaries) but not to lvalues.

```cpp
int x = 5;

int& lref = x;      // lvalue reference — binds to lvalue
int&& rref = 10;    // rvalue reference — binds to rvalue (literal)
int&& rref2 = x;    // ERROR — cannot bind rvalue ref to lvalue
int&& rref3 = x + 1; // OK — x + 1 is an rvalue (temporary)
```

rvalue references are how move semantics is implemented — when a function takes `T&&`, it receives a temporary that no one else is using, so it's safe to steal its resources.

---

## Copy vs Move: A Concrete Example

Let's build a simple class that manages a heap-allocated array to see the difference:

```cpp
#include <iostream>
#include <cstring>

class Buffer {
public:
    int* data;
    size_t size;

    // Constructor
    Buffer(size_t n) : size(n), data(new int[n]) {
        std::cout << "Constructor: allocated " << n << " ints\n";
    }

    // Copy constructor — makes a full copy
    Buffer(const Buffer& other) : size(other.size), data(new int[other.size]) {
        std::memcpy(data, other.data, size * sizeof(int));
        std::cout << "Copy constructor: copied " << size << " ints\n";
    }

    // Move constructor — steals the resource
    Buffer(Buffer&& other) noexcept : size(other.size), data(other.data) {
        other.data = nullptr;  // Leave source in valid but empty state
        other.size = 0;
        std::cout << "Move constructor: moved (no copy!)\n";
    }

    // Destructor
    ~Buffer() {
        delete[] data;
        std::cout << "Destructor\n";
    }
};
```

Now watch what happens:

```cpp
int main() {
    Buffer a(100);          // Constructor

    Buffer b = a;           // Copy constructor — duplicates all 100 ints

    Buffer c = Buffer(200); // Move constructor — no copy, just pointer transfer

    return 0;
}
```

Output:
```
Constructor: allocated 100 ints
Copy constructor: copied 100 ints
Constructor: allocated 200 ints
Move constructor: moved (no copy!)
Destructor
Destructor
Destructor
```

When creating `c`, the `Buffer(200)` temporary is an rvalue — C++ picks the move constructor, which just transfers the pointer. Zero elements copied.

---

## The Move Constructor

The move constructor follows this pattern:

```cpp
ClassName(ClassName&& other) noexcept {
    // Steal the resource from other
    this->data = other.data;
    this->size = other.size;

    // Leave other in a valid but empty state
    other.data = nullptr;
    other.size = 0;
}
```

Key points:
- Takes an rvalue reference `&&` to the same type
- Marked `noexcept` — important for STL containers to use the move constructor during reallocation
- After moving, `other` must be left in a **valid but unspecified state** — typically null/empty, but not corrupted

---

## The Move Assignment Operator

Just as you have copy assignment (`operator=` taking `const T&`), you also have move assignment (taking `T&&`):

```cpp
Buffer& operator=(Buffer&& other) noexcept {
    if (this == &other) return *this;  // Self-assignment check

    // Free existing resource
    delete[] data;

    // Steal the resource from other
    data = other.data;
    size = other.size;

    // Leave other in valid state
    other.data = nullptr;
    other.size = 0;

    return *this;
}
```

Usage:

```cpp
Buffer a(100);
Buffer b(50);

b = std::move(a);  // Move assignment: b now owns a's data; a is left empty
```

---

## std::move: Casting to an rvalue

`std::move` doesn't actually move anything. It's a cast that turns an lvalue into an rvalue reference, telling the compiler "I'm done with this object — feel free to move from it."

```cpp
#include <utility>  // for std::move

Buffer a(100);

// Without std::move — calls copy constructor (a is an lvalue)
Buffer b = a;

// With std::move — calls move constructor (a is cast to rvalue)
Buffer c = std::move(a);

// After this, a.data is nullptr and a.size is 0
// Do not use a after moving from it!
```

**Warning:** After `std::move(a)`, `a` is in a valid but unspecified state. You can reassign it or destroy it, but don't read from it.

---

## When the Compiler Moves Automatically

You don't always need `std::move`. The compiler automatically applies move semantics in several situations:

### Returning a local variable (NRVO / RVO)

```cpp
std::vector<int> makeVector() {
    std::vector<int> v = {1, 2, 3, 4, 5};
    return v;  // Compiler moves or elides the copy automatically
}

std::vector<int> data = makeVector();  // No copy
```

This is called **Return Value Optimization (RVO)** or **Named RVO (NRVO)**. Modern compilers often eliminate the move entirely.

### Passing temporaries to functions

```cpp
void process(std::vector<int> data) { ... }

process(std::vector<int>{1, 2, 3});  // Temporary — moved into parameter
```

### Returning from a branch

```cpp
std::string getMessage(bool isError) {
    std::string msg;
    if (isError) {
        msg = "Error occurred";
    } else {
        msg = "Success";
    }
    return msg;  // Automatically moved (or copy-elided)
}
```

---

## The Rule of Five

In classic C++, you had the **Rule of Three**: if you define any of these, define all three:
1. Destructor
2. Copy constructor
3. Copy assignment operator

With move semantics, this becomes the **Rule of Five** — add:

4. Move constructor
5. Move assignment operator

```cpp
class Resource {
public:
    Resource();                              // Constructor
    ~Resource();                             // Destructor
    Resource(const Resource& other);         // Copy constructor
    Resource& operator=(const Resource& other); // Copy assignment
    Resource(Resource&& other) noexcept;     // Move constructor
    Resource& operator=(Resource&& other) noexcept; // Move assignment
};
```

Or use **Rule of Zero**: don't manage resources manually. Use RAII wrappers like `std::unique_ptr`, `std::vector`, and `std::string` — they already implement move semantics correctly.

---

## Move Semantics with STL Containers

The standard library is fully move-aware. Moving STL containers is O(1):

```cpp
#include <vector>
#include <string>
#include <utility>

std::vector<int> large(1000000, 1);

// Copy: duplicates 1 million elements — O(n)
std::vector<int> copy = large;

// Move: just transfers the internal pointer — O(1)
std::vector<int> moved = std::move(large);

// large is now empty — don't use it
```

This applies to `std::vector`, `std::string`, `std::map`, `std::unique_ptr`, and virtually every STL type.

### Moving into a function

```cpp
void process(std::vector<int> data) {
    // data is now the sole owner of the elements
    for (int x : data) { ... }
}

std::vector<int> myData = {1, 2, 3, 4, 5};

// Move myData into the function — no copy
process(std::move(myData));

// myData is now empty — the function owns the elements
```

---

## Practical Example: Efficient String Building

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <utility>

std::vector<std::string> buildMessages(int count) {
    std::vector<std::string> messages;
    messages.reserve(count);

    for (int i = 0; i < count; i++) {
        std::string msg = "Message number " + std::to_string(i);
        messages.push_back(std::move(msg));  // Move msg into vector — no copy
        // msg is now in a valid but empty state
    }

    return messages;  // NRVO — moved or elided by compiler
}

int main() {
    auto msgs = buildMessages(5);
    for (const auto& m : msgs) {
        std::cout << m << "\n";
    }
    return 0;
}
```

---

## When to Use std::move

Use `std::move` explicitly when:

1. **You're done with a local variable and want to transfer it efficiently**
   ```cpp
   container.push_back(std::move(localObject));
   ```

2. **Moving in a move constructor/assignment operator** (to forward the rvalue reference)
   ```cpp
   Buffer(Buffer&& other) : data(other.data), size(other.size) {
       other.data = nullptr;
   }
   ```

3. **Transferring unique ownership** (e.g., with `std::unique_ptr`)
   ```cpp
   auto ptr = std::make_unique<int>(42);
   auto ptr2 = std::move(ptr);  // ptr is now null
   ```

Don't use `std::move` on:
- Function return values — the compiler handles this automatically
- Trivially copyable types like `int`, `double` — no benefit, no harm, just noise

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

## Summary

Move semantics transfers ownership of resources instead of copying them. The key ideas: rvalue references (`T&&`) bind to temporaries; the move constructor and move assignment operator steal resources from rvalues; `std::move` casts an lvalue to an rvalue so you can trigger a move explicitly. The compiler automatically moves in many situations — returning local variables, passing temporaries to functions.

For most code, you don't need to write your own move constructors — use STL types and smart pointers which already implement move semantics correctly. The main practical use of `std::move` is transferring large containers into functions or containers without copying.

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles
- [How to Use Pointers in C++: A Complete Beginner's Guide](/posts/pointers-in-cpp/) — move semantics transfers ownership of heap memory; pointers are how that memory is managed.
- [Memory Management in C++: Heap vs Stack, new/delete, and How to Prevent Memory Leaks](/posts/memory-management-cpp/) — understanding heap allocation explains why moving is faster than copying.
- [Smart Pointers in Modern C++: unique_ptr, shared_ptr, and weak_ptr Explained](/posts/smart-pointers-cpp/) — `std::unique_ptr` uses move semantics exclusively; you cannot copy it.
