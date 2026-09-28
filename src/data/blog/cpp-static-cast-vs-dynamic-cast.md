---
title: "static_cast vs dynamic_cast in C++: Which One to Use"
description: "static_cast is checked at compile time and costs nothing. dynamic_cast checks the real type at runtime and fails safely. When to use each."
pubDatetime: 2026-09-28T00:00:00Z
author: "Sahil"
tags: ["C++", "casting", "OOP", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "What is the difference between static_cast and dynamic_cast in C++?"
    answer: "static_cast is resolved at compile time and performs no runtime check, so it is free but unsafe if the real type is wrong. dynamic_cast checks the actual object type at runtime and returns nullptr, or throws for references, when the conversion is not valid."
  - question: "When should you use dynamic_cast in C++?"
    answer: "Use it when downcasting from a base pointer or reference to a derived type and you cannot be certain what the object really is. It requires the base class to have at least one virtual function."
  - question: "Why does dynamic_cast require a virtual function?"
    answer: "dynamic_cast reads runtime type information, which the compiler only stores for polymorphic types. A class becomes polymorphic when it has at least one virtual function, usually a virtual destructor."
  - question: "Is dynamic_cast slow in C++?"
    answer: "It costs more than static_cast because it inspects the type hierarchy at runtime, but the cost is small and only matters in hot loops. Correctness should come first; reach for static_cast only when you can guarantee the type."
---

# static_cast vs dynamic_cast in C++

**Short answer:** `static_cast` is checked by the compiler and costs nothing at runtime. `dynamic_cast` checks the *actual* object type while the program runs and fails safely if you're wrong.

```cpp
Derived* d1 = static_cast<Derived*>(basePtr);    // trust me, it's a Derived
Derived* d2 = dynamic_cast<Derived*>(basePtr);   // check — nullptr if not
```

---

## The Core Difference

```cpp
#include <iostream>

class Animal {
public:
    virtual ~Animal() = default;     // makes the class polymorphic
};

class Dog : public Animal {
public:
    void bark() { std::cout << "Woof\n"; }
};

class Cat : public Animal {
public:
    void meow() { std::cout << "Meow\n"; }
};

int main() {
    Animal* a = new Cat();           // a Cat, seen as an Animal

    Dog* d1 = static_cast<Dog*>(a);  // compiles, but a is NOT a Dog
    // d1->bark();                   // undefined behaviour — anything can happen

    Dog* d2 = dynamic_cast<Dog*>(a); // checks at runtime
    if (d2) d2->bark();
    else    std::cout << "Not a Dog\n";   // this runs

    delete a;
}
```

`static_cast` asks the compiler "is this conversion plausible?" The answer is yes — `Dog` does derive from `Animal` — so it compiles. But the object is really a `Cat`, and using `d1` is undefined behaviour.

`dynamic_cast` asks at runtime "is this object *actually* a Dog?" It isn't, so you get `nullptr` and a clean branch.

## dynamic_cast Needs a Virtual Function

```cpp
class Base { };                          // NOT polymorphic
class Derived : public Base { };

Base* b = new Derived();
Derived* d = dynamic_cast<Derived*>(b);  // compile error
```

The compiler only stores runtime type information for **polymorphic** classes — those with at least one virtual function. Adding a virtual destructor fixes it and is good practice anyway:

```cpp
class Base {
public:
    virtual ~Base() = default;           // now polymorphic
};
```

If you're deleting derived objects through a base pointer you need that virtual destructor regardless — see [virtual destructors in C++](/posts/cpp-virtual-destructor/).

<div class="inline-cta"><strong>Learning C++ properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers inheritance, polymorphism and casting in plain English — 87 pages, just $19.</div>

## Casting References Throws Instead

There is no null reference, so the reference form throws:

```cpp
#include <stdexcept>
#include <typeinfo>

try {
    Dog& d = dynamic_cast<Dog&>(*a);
    d.bark();
} catch (const std::bad_cast& e) {
    std::cout << "Bad cast: " << e.what() << '\n';
}
```

Pointer form → `nullptr` on failure. Reference form → throws `std::bad_cast`.

## What static_cast Is Actually For

Most `static_cast` uses have nothing to do with class hierarchies:

```cpp
double d = 3.9;
int i = static_cast<int>(d);              // 3 — numeric conversion

int a = 7, b = 2;
double r = static_cast<double>(a) / b;    // 3.5, not 3

enum Colour { Red, Green };
int c = static_cast<int>(Green);          // 1

void* raw = malloc(sizeof(int));
int* p = static_cast<int*>(raw);          // void* back to a typed pointer
```

That integer-division case is the one beginners hit most — see [C++ integer division](/posts/cpp-integer-division/).

## Upcasting Doesn't Need a Cast at All

Going **up** the hierarchy — derived to base — is always safe and implicit:

```cpp
Dog* d = new Dog();
Animal* a = d;                      // no cast needed
```

You only need a cast going **down**, and that's exactly where the choice matters.

## The Honest Advice

If you find yourself reaching for `dynamic_cast` often, the design is usually asking for a virtual function instead:

```cpp
// Instead of this
if (Dog* d = dynamic_cast<Dog*>(a))      d->bark();
else if (Cat* c = dynamic_cast<Cat*>(a)) c->meow();

// Prefer this
class Animal {
public:
    virtual ~Animal() = default;
    virtual void speak() = 0;
};
a->speak();                              // the object decides
```

That's the whole point of polymorphism — see [virtual functions and polymorphism](/posts/virtual-functions-polymorphism-cpp/). `dynamic_cast` is the escape hatch for when you genuinely can't restructure.

## Quick Reference

| | `static_cast` | `dynamic_cast` |
|---|---|---|
| Checked at | Compile time | Runtime |
| Runtime cost | None | Small |
| Fails by | Undefined behaviour | `nullptr` or `bad_cast` |
| Needs virtual function | No | Yes |
| Numeric conversions | Yes | No |
| Safe downcasting | No | Yes |
| Use when | Type is guaranteed | Type is uncertain |

---

## Take Your C++ Further

If you want inheritance, polymorphism and casting explained properly rather than pieced together, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers it in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ Type Casting Explained](/posts/cpp-type-casting/) — all four named casts.
- [Virtual Functions and Polymorphism](/posts/virtual-functions-polymorphism-cpp/) — the alternative to downcasting.
- [C++ Virtual Destructor](/posts/cpp-virtual-destructor/) — why your base class needs one.
- [C++ Inheritance](/posts/cpp-inheritance/) — base and derived classes.
- [C++ Integer Division](/posts/cpp-integer-division/) — the classic static_cast fix.
