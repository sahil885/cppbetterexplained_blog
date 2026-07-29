---
title: "C++ new vs malloc: What's the Difference and Which to Use"
description: "C++ new vs malloc explained: new calls constructors and is type-safe, malloc hands you raw memory. Learn the real differences and why new is preferred in C++."
pubDatetime: 2026-07-29T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "memory", "pointers", "tutorial"]
faqSchema:
  - question: "What is the difference between new and malloc in C++?"
    answer: "new is a C++ operator that allocates memory and calls the object's constructor, returning a correctly typed pointer. malloc is a C function that only allocates raw bytes, returns a void pointer, and never calls constructors. new is the idiomatic choice in C++."
  - question: "Should I use new or malloc in C++?"
    answer: "Use new (or better, smart pointers) in C++. new initialises objects by calling their constructors and is type-safe. malloc is mainly needed when interfacing with C code or when you deliberately want uninitialised raw memory."
  - question: "Can I free memory allocated with new using free()?"
    answer: "No. Memory from new must be released with delete, and memory from malloc must be released with free. Mixing them is undefined behaviour because they use different bookkeeping and new/delete also run constructors and destructors."
draft: false
featured: false
---

# C++ new vs malloc: What's the Difference and Which to Use

Both `new` and `malloc` grab memory from the heap, so beginners often assume they're interchangeable. They're not. The key difference is that **`new` builds actual C++ objects (it runs constructors), while `malloc` just hands you a block of raw, uninitialised bytes.** In C++, `new` is almost always the right tool.

---

## The Two in a Nutshell

```cpp
#include <cstdlib>   // for malloc/free

int main() {
    // C++ style
    int* a = new int(42);   // allocates AND initialises to 42
    delete a;               // frees AND (for objects) runs the destructor

    // C style
    int* b = (int*)malloc(sizeof(int));   // allocates raw memory only
    *b = 42;                              // you must initialise it yourself
    free(b);                              // frees the raw memory

    return 0;
}
```

Right away you can see three differences: `new` knows the type, `new` can initialise the value in the same step, and `new` is paired with `delete` rather than `free`.

---

## Difference 1: Constructors and Destructors

This is the big one. `new` calls the constructor of a class; `malloc` does not. For a plain `int` that doesn't matter, but for an object it's everything.

```cpp
#include <iostream>
#include <cstdlib>
using namespace std;

struct Player {
    string name;
    Player() {
        name = "Unnamed";
        cout << "Player constructed\n";
    }
};

int main() {
    Player* p1 = new Player();   // prints "Player constructed"
    delete p1;                   // runs the destructor

    // malloc skips the constructor entirely:
    Player* p2 = (Player*)malloc(sizeof(Player));
    // p2->name is NOT properly constructed — using it is undefined behaviour!
    free(p2);
    return 0;
}
```

With `malloc`, the `Player`'s `string name` member is never constructed, so touching it can crash your program. `new` is safer because it guarantees the object is fully built before you use it.

---

## Difference 2: Type Safety

`new` returns a pointer of the exact type you asked for. `malloc` returns `void*`, which you have to cast yourself.

```cpp
int* a = new int;              // already an int*
int* b = (int*)malloc(sizeof(int));   // must cast the void*
```

The cast is easy to get wrong, and a wrong cast compiles happily and then misbehaves at runtime. Fewer casts means fewer bugs.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Difference 3: Size Calculation

With `new`, the compiler works out how many bytes to allocate. With `malloc`, you compute the size by hand — and forgetting `sizeof` or getting a count wrong is a classic bug.

```cpp
int* arr1 = new int[10];                    // compiler knows: 10 ints
int* arr2 = (int*)malloc(10 * sizeof(int)); // you must spell it out
```

Remember to release array memory the matching way: `delete[] arr1;` for the `new[]` version and `free(arr2);` for the malloc version.

---

## Difference 4: What Happens on Failure

If allocation fails, the two behave differently:

- `new` throws a `std::bad_alloc` exception.
- `malloc` returns a null pointer, which you have to check manually.

```cpp
int* p = (int*)malloc(sizeof(int));
if (p == nullptr) {
    // handle failure yourself
}
```

Forgetting that null check is another way malloc code goes wrong quietly.

---

## Never Mix Them

Because `new`/`delete` and `malloc`/`free` use different internal bookkeeping, you must pair them correctly:

```cpp
int* a = new int;
free(a);        // WRONG — undefined behaviour

int* b = (int*)malloc(sizeof(int));
delete b;       // WRONG — undefined behaviour
```

Always match `new` with `delete`, `new[]` with `delete[]`, and `malloc` with `free`.

---

## Side-by-Side Summary

| Feature | `new` | `malloc` |
|---------|-------|----------|
| Language | C++ operator | C library function |
| Calls constructor? | Yes | No |
| Return type | exact type (e.g. `int*`) | `void*` (needs cast) |
| Size calculation | automatic | manual `sizeof` |
| On failure | throws `bad_alloc` | returns `nullptr` |
| Paired with | `delete` / `delete[]` | `free` |

---

## Which Should You Use?

In modern C++, prefer **`new`** over `malloc` for anything object-shaped, because it initialises properly and is type-safe. And whenever you can, go one step further and use **smart pointers** (`std::unique_ptr`, `std::shared_ptr`) so memory is freed automatically and you never leak. Reserve `malloc` for talking to C libraries or the rare case where you truly want raw, uninitialised memory.

---

## Related Articles

- [Memory Management in C++](/posts/memory-management-cpp/) — the heap, the stack, and manual allocation
- [Smart Pointers in C++](/posts/smart-pointers-cpp/) — the modern way to avoid manual delete
- [Pointers in C++](/posts/pointers-in-cpp/) — how pointers work from the ground up
- [C++ Stack vs Heap](/posts/cpp-stack-vs-heap/) — where your memory actually lives
- [C++ nullptr vs NULL](/posts/cpp-nullptr-vs-null/) — checking for failed allocations the right way

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
