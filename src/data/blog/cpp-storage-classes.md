---
title: "Storage Classes in C++: static, extern, thread_local, and mutable"
description: "Understand storage classes in C++ with working examples. Learn how static, extern, thread_local, and mutable control a variable's lifetime, scope, and linkage."
pubDatetime: 2026-08-20T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "fundamentals", "tutorial"]
faqSchema:
  - question: "What are storage classes in C++?"
    answer: "Storage class specifiers control how long a variable lives, where it is visible, and whether other translation units can link to it. Modern C++ has four: static, extern, thread_local, and mutable. The old auto and register specifiers no longer act as storage classes."
  - question: "What is the difference between static and extern in C++?"
    answer: "At file scope, static gives a variable internal linkage so it is private to that source file. extern declares that a variable is defined in another source file, letting the linker connect the two. They are opposites: static hides, extern shares."
  - question: "Is auto still a storage class in C++?"
    answer: "No. In C++98 auto meant automatic storage duration, which was the default and therefore useless. C++11 repurposed the keyword entirely for type deduction, so writing auto x = 5; now means deduce the type, not set a storage class."
draft: false
featured: false
---

# Storage Classes in C++: `static`, `extern`, `thread_local`, and `mutable`

Every variable in your program answers three questions: *when is it created and destroyed?*, *who can see it?*, and *can the linker match it across files?* Storage class specifiers are how you change the default answers.

There are only four in modern C++, and most beginner confusion comes from `static`, which unhelpfully means two different things depending on where you write it.

---

## The Default: Automatic Storage

If you write no specifier at all, a local variable has **automatic storage duration**:

```cpp
#include <iostream>

void counter() {
    int count = 0;      // created on entry, destroyed on exit
    count++;
    std::cout << count << " ";
}

int main() {
    counter();
    counter();
    counter();          // prints: 1 1 1
}
```

`count` is born when the function starts and dies when it returns, every single time. That's why the output is `1 1 1` and not `1 2 3`.

> **Note on `auto`:** In C++98, `auto` was the keyword for exactly this default — which made it pointless to type. C++11 recycled it for type deduction, so `auto x = 5;` now means "figure out the type," not "give this automatic storage."

---

## `static` Inside a Function: Persistent Locals

Add `static` to that same local and its lifetime stretches to the whole program, while its *visibility* stays inside the function:

```cpp
#include <iostream>

void counter() {
    static int count = 0;   // initialised once, on first call
    count++;
    std::cout << count << " ";
}

int main() {
    counter();
    counter();
    counter();              // prints: 1 2 3
}
```

The initialiser runs exactly once, on the first call. After that the variable persists, holding its value between calls — but no other function can touch it, because the name is still local. It's a private, permanent scratchpad.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## `static` at File Scope: Internal Linkage

Write `static` on a *global* variable or function and it means something different — it makes the name private to that `.cpp` file:

```cpp
// logger.cpp
static int messageCount = 0;      // only logger.cpp can see this

static void writeToDisk() { }     // only logger.cpp can call this
```

Another source file can now declare its own `messageCount` without a clash, because the linker never sees these names at all. This is how you keep implementation details out of the global namespace.

(An unnamed namespace does the same job and is generally preferred in modern C++, but `static` still works and you'll see it everywhere.)

---

## `extern`: Sharing One Variable Across Files

`extern` is the mirror image of file-scope `static`. It says "this exists, but it's defined somewhere else — linker, go find it."

You **define** it in exactly one source file:

```cpp
// config.cpp
int maxUsers = 100;               // the one real definition
```

And **declare** it in a header everyone includes:

```cpp
// config.h
#pragma once
extern int maxUsers;              // declaration only, no storage
```

```cpp
// main.cpp
#include <iostream>
#include "config.h"

int main() {
    std::cout << "Max users: " << maxUsers << "\n";
}
```

Compile both together and it links:

```
g++ main.cpp config.cpp -o app
```

The rule to remember: **`extern` declares, no `extern` defines.** Drop the `extern` in the header and every including file creates its own `maxUsers`, and you're back to a multiple-definition linker error.

---

## `thread_local`: One Copy Per Thread

`thread_local` gives each thread its own independent copy of a variable, created when the thread starts and destroyed when it ends:

```cpp
#include <iostream>
#include <thread>

thread_local int localId = 0;

void work(int id) {
    localId = id;                 // touches only this thread's copy
    std::cout << "Thread " << localId << "\n";
}

int main() {
    std::thread t1(work, 1);
    std::thread t2(work, 2);
    t1.join();
    t2.join();
}
```

Both threads write to `localId` and neither interferes with the other — no mutex needed, because there is no shared state. It's useful for per-thread caches, random number generator state, and error codes.

---

## `mutable`: The Escape Hatch for `const`

`mutable` is the odd one out — it applies only to non-static class members, and it lets them change even through a `const` object:

```cpp
#include <iostream>
#include <string>
#include <utility>

class Document {
    std::string text;
    mutable int readCount = 0;    // changeable even in const methods

public:
    Document(std::string t) : text(std::move(t)) {}

    const std::string& read() const {
        ++readCount;              // legal only because of mutable
        return text;
    }

    int reads() const { return readCount; }
};

int main() {
    const Document doc("hello");
    doc.read();
    doc.read();
    std::cout << doc.reads() << "\n";   // 2
}
```

`read()` is `const` because it doesn't change what the document *means* — but it does update bookkeeping. `mutable` is for exactly that: caches, hit counters, and lazily computed values that don't affect the object's logical state.

---

## Quick Reference

| Specifier | Lifetime | Visibility | Typical use |
| --- | --- | --- | --- |
| *(none)* | function call | local block | ordinary locals |
| `static` (local) | whole program | that function | counters, one-time setup |
| `static` (file scope) | whole program | that `.cpp` file | private helpers |
| `extern` | whole program | every file that declares it | shared config |
| `thread_local` | thread lifetime | per thread | per-thread state |
| `mutable` | with the object | class member | caches in `const` methods |

---

## Related Articles

- [C++ static Keyword Explained](/posts/cpp-static-keyword/)
- [C++ Variable Scope Explained](/posts/cpp-variable-scope/)
- [C++ const Keyword Explained](/posts/cpp-const-keyword/)
- [C++ Header Files Explained](/posts/cpp-header-files/)
- [C++ auto Keyword Explained: Type Deduction for Beginners](/posts/cpp-auto-keyword/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
