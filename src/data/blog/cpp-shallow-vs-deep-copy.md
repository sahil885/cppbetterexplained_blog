---
title: "Shallow Copy vs Deep Copy in C++ (With Examples)"
description: "Shallow copy vs deep copy in C++: what each one copies, why copying a raw pointer can crash your program, and how to write a deep copy or avoid needing one."
pubDatetime: 2026-10-11T00:00:00Z
author: "Sahil"
tags: ["C++", "OOP", "memory", "pointers"]
draft: false
featured: false
faqSchema:
  - question: "What is the difference between a shallow copy and a deep copy in C++?"
    answer: "A shallow copy copies a pointer's address, so the original and the copy share the same memory. A deep copy allocates new memory and copies the data into it, so each object has its own independent copy."
  - question: "Does C++ make a shallow or a deep copy by default?"
    answer: "The default copy constructor copies each member using that member's own copy operation. For a raw pointer that copies only the address, which is a shallow copy. For std::string and std::vector members it copies the contents, which is a deep copy."
  - question: "When do I need to write a deep copy constructor?"
    answer: "When your class owns memory through a raw pointer it allocated with new. You then also need a destructor and a copy assignment operator, which is the rule of three. If you store the data in a std::vector, std::string or smart pointer instead, you usually need none of them."
  - question: "Is copying a std::vector a deep copy?"
    answer: "Yes. Copying a vector copies every element into new memory. The exception is a vector of raw pointers: the pointers are copied, but the objects they point to are not, so both vectors end up pointing at the same objects."
---

# Shallow Copy vs Deep Copy in C++

**Short answer:** a **shallow copy** copies a pointer's *address*, so the original and the copy share the same memory. A **deep copy** allocates new memory and copies the *data*, so each object owns its own. C++ copies pointers shallowly by default — harmless for plain values and standard containers, but a crash waiting to happen for memory you manage yourself with `new` and `delete`.

| | Shallow copy | Deep copy |
|---|---|---|
| What gets copied | The pointer (an address) | The data the pointer points to |
| Memory | Shared between both objects | Each object has its own |
| Change one object... | ...and the other changes too | ...and the other is unaffected |
| Speed | Fast — copies a few bytes | Slower — copies all the data |
| C++ default for raw pointers? | Yes | No — you write it yourself |
| Main danger | Double free, dangling pointers | None, if written correctly |

---

## The Picture to Keep in Your Head

A pointer is like a **house address written on a slip of paper**.

- A **shallow copy** photocopies the slip. You now have two slips — but still only one house. Repaint the house using either slip, and both slips lead to a red house.
- A **deep copy** builds a second, identical house and writes *its* address on the new slip. Repaint one house and the other stays exactly as it was.

The trouble starts at demolition time. With a shallow copy, both slip-holders think they own the house — and both try to knock it down.

## A Shallow Copy in Action

Here's a class that keeps an array of scores on the heap. It has no copy constructor, so C++ generates one that copies each member as-is — including the pointer:

```cpp
#include <iostream>

class Scoreboard {
public:
    int* scores;   // points to an array on the heap
    int size;

    Scoreboard(int n) : scores(new int[n]{}), size(n) {}
};

int main() {
    Scoreboard a(3);
    Scoreboard b = a;   // default copy: b.scores gets a's ADDRESS

    b.scores[0] = 99;   // change b...

    std::cout << a.scores[0] << '\n';            // ...and a changes too: 99
    std::cout << (a.scores == b.scores) << '\n'; // 1 (same address)
}
```

Output:

```
99
1
```

We only changed `b`, but `a` changed too, because there is only one array. (This version also never frees its array. Fixing that is where the real trouble starts.)

## Why a Shallow Copy Crashes

Add the destructor the class obviously needs, and copying it becomes a time bomb:

```cpp
#include <iostream>

class Scoreboard {
public:
    int* scores;
    int size;

    Scoreboard(int n) : scores(new int[n]{}), size(n) {}
    ~Scoreboard() { delete[] scores; }   // free the array
};

int main() {
    Scoreboard a(3);
    Scoreboard b = a;   // shallow copy
    std::cout << "End of main\n";
}   // b's destructor frees the array, then a's frees it AGAIN
```

On Linux with GCC:

```
End of main
free(): double free detected in tcache 2
Aborted
```

Freeing the same memory twice is **undefined behaviour**. Here the program aborted; on another system it might crash elsewhere, corrupt data silently, or appear to work until one day it doesn't. A shallow copy also causes **dangling pointers**: if `a` is destroyed first, `b.scores` points to memory that no longer belongs to the program.

<div class="inline-cta"><strong>Pointers and memory still fuzzy?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> explains pointers, memory and OOP with pictures you can keep in your head, across 87 plain-English pages. Just $19.</div>

## A Deep Copy in Action

The fix is to take control of copying: allocate **new** memory and copy the values across. Because the class manages memory, it needs a copy constructor, a copy assignment operator and a destructor — the [rule of three](/posts/cpp-rule-of-three/):

```cpp
#include <algorithm>
#include <iostream>

class Scoreboard {
public:
    int* scores;
    int size;

    Scoreboard(int n) : scores(new int[n]{}), size(n) {}

    // Copy constructor: allocate NEW memory, then copy the values
    Scoreboard(const Scoreboard& other)
        : scores(new int[other.size]), size(other.size) {
        std::copy(other.scores, other.scores + size, scores);
    }

    // Copy assignment: same idea for a = b on an existing object
    Scoreboard& operator=(const Scoreboard& other) {
        if (this != &other) {
            int* fresh = new int[other.size];
            std::copy(other.scores, other.scores + other.size, fresh);
            delete[] scores;
            scores = fresh;
            size = other.size;
        }
        return *this;
    }

    ~Scoreboard() { delete[] scores; }
};

int main() {
    Scoreboard a(3);
    Scoreboard b = a;   // deep copy

    b.scores[0] = 99;

    std::cout << a.scores[0] << '\n';            // 0: a is untouched
    std::cout << (a.scores == b.scores) << '\n'; // 0 (different addresses)
}
```

Output:

```
0
0
```

Each object now owns its own array, so each destructor frees its own memory exactly once. For a line-by-line walkthrough of writing copy constructors, see [the C++ copy constructor](/posts/cpp-copy-constructor/).

## The Modern Way: Let std::vector Do the Deep Copy

You rarely need to write all of that. Standard containers already know how to deep copy themselves, so if you store the data in a `std::vector`, the compiler-generated copy is automatically a deep one:

```cpp
#include <iostream>
#include <vector>

class Scoreboard {
public:
    std::vector<int> scores;

    Scoreboard(int n) : scores(n) {}
    // No copy constructor, assignment or destructor needed
};

int main() {
    Scoreboard a(3);
    Scoreboard b = a;   // std::vector copies its elements: a deep copy

    b.scores[0] = 99;

    std::cout << a.scores[0] << '\n';   // 0
    std::cout << b.scores[0] << '\n';   // 99
}
```

Same behaviour, a third of the code, and no way to get it wrong. This is the **rule of zero**: build classes out of types that manage themselves, and you don't write any of the copying functions at all.

## Deep or Shallow? A Cheat Sheet for Common Types

The default copy of a class copies each member with *that member's* copy. So whether your class copies deeply depends on what's inside it:

| Member type | Copying it is... | Notes |
|---|---|---|
| `int`, `double`, `char`, `bool` | Deep | Just values — nothing shared |
| `std::string` | Deep | Copies the characters |
| `std::vector<int>`, `std::array`, `std::map` | Deep | Copies every element |
| Raw pointer `int*` | **Shallow** | Copies only the address |
| `std::vector<int*>` | **Shallow** for the pointed-to values | Copies the pointers, not what they point to |
| `std::shared_ptr` | Shallow, on purpose | Shared ownership, freed once — safe |
| `std::unique_ptr` | Can't be copied | Compile error — you must choose |

Two of these deserve a closer look.

**A vector of pointers copies the pointers.** The vector itself is deep-copied, but its elements are addresses, so the copies point at the same objects:

```cpp
#include <iostream>
#include <vector>

int main() {
    int x = 1, y = 2;

    std::vector<int*> original = {&x, &y};
    std::vector<int*> copy = original;   // copies the pointers, not x and y

    *copy[0] = 100;

    std::cout << x << '\n';            // 100: both vectors point at the same x
    std::cout << *original[0] << '\n'; // 100
}
```

**`shared_ptr` is a shallow copy you can trust.** Copying a [`shared_ptr`](/posts/smart-pointers-cpp/) shares the object deliberately, and it keeps count of the owners so the memory is freed exactly once:

```cpp
#include <iostream>
#include <memory>

int main() {
    auto a = std::make_shared<int>(5);
    auto b = a;   // shallow on purpose: both share one int

    *b = 42;

    std::cout << *a << '\n';           // 42
    std::cout << a.use_count() << '\n'; // 2 owners; freed once, when both are gone
}
```

**`unique_ptr` refuses to be copied.** A class with a `unique_ptr` member can't be copied at all — GCC reports `use of deleted function 'Profile::Profile(const Profile&)'`. That's a feature: it forces you to decide. If you want a deep copy, write it with `std::make_unique`:

```cpp
#include <iostream>
#include <memory>

struct Profile {
    std::unique_ptr<int> level = std::make_unique<int>(1);

    Profile() = default;

    // Deep copy: make a new int holding the same value
    Profile(const Profile& other)
        : level(std::make_unique<int>(*other.level)) {}
};

int main() {
    Profile a;
    Profile b = a;

    *b.level = 5;

    std::cout << *a.level << ' ' << *b.level << '\n';   // 1 5
}
```

## Where Move Fits In

There's a third option besides shallow and deep copy: a **move**. Moving takes the pointer from the original and leaves the original empty, so only one object owns the memory. It's as cheap as a shallow copy and as safe as a deep one — which is why C++ moves objects automatically when the original is about to disappear anyway. See [move semantics](/posts/cpp-move-semantics/) for how it works.

| | Shallow copy | Deep copy | Move |
|---|---|---|---|
| Cost | Cheap | Expensive | Cheap |
| Original afterwards | Shares memory with the copy | Unchanged | Empty |
| Safe with owned memory? | No | Yes | Yes |

## The Interview Answer

If you're asked "what's the difference between a shallow copy and a deep copy?":

> A shallow copy copies the pointer, so both objects share the same memory; a deep copy allocates new memory and copies the data, so each object is independent. C++'s default copy is shallow for raw pointers, which leads to double frees, so a class that owns raw memory needs a deep-copying copy constructor, copy assignment operator and destructor — the rule of three. In modern C++ you avoid that by using `std::vector`, `std::string` or smart pointers.

---

## Take Your C++ Further

Shallow and deep copies only make sense once pointers and memory click. The **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** explains pointers, memory and OOP in plain English, with pictures you can keep in your head. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ Copy Constructor](/posts/cpp-copy-constructor/) — how to write one, step by step.
- [The Rule of Three in C++](/posts/cpp-rule-of-three/) — why owning memory needs three functions.
- [C++ Move Semantics](/posts/cpp-move-semantics/) — the cheap alternative to copying.
- [C++ Smart Pointers](/posts/smart-pointers-cpp/) — `unique_ptr` and `shared_ptr` explained.
- [Pointers in C++](/posts/pointers-in-cpp/) — the foundation for all of this.
