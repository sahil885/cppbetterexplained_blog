---
title: "The Diamond Problem in C++: Multiple Inheritance and virtual Bases"
description: "Understand the diamond problem in C++ multiple inheritance, why the base class gets duplicated, and how virtual inheritance fixes ambiguous member access."
pubDatetime: 2026-08-20T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "oop", "tutorial"]
faqSchema:
  - question: "What is the diamond problem in C++?"
    answer: "The diamond problem happens when a class inherits from two classes that both inherit from the same base. The most derived object ends up with two copies of that base, so any reference to its members is ambiguous and the compiler rejects the code."
  - question: "How does virtual inheritance solve the diamond problem?"
    answer: "Declaring the middle classes with virtual public Base makes them share a single copy of the base subobject instead of each owning one. With only one copy present, member access is no longer ambiguous and the base constructor runs exactly once."
  - question: "Should beginners use multiple inheritance in C++?"
    answer: "Rarely for data-carrying classes, where it adds layout and construction complexity. It is common and safe for interfaces, meaning abstract classes with only pure virtual functions and no data members, since those carry no state to duplicate."
draft: false
featured: false
---

# The Diamond Problem in C++: Multiple Inheritance and `virtual` Bases

C++ lets a class inherit from more than one parent. That flexibility comes with one famous trap, and it has a shape: draw the class hierarchy and you get a diamond.

If you've ever seen `error: request for member 'x' is ambiguous` and had no idea why, this is almost certainly the cause.

---

## Setting Up the Diamond

Start with a base class and two classes that extend it:

```cpp
#include <iostream>

class Device {
public:
    int serialNumber = 0;
    void powerOn() { std::cout << "Powering on\n"; }
};

class Printer : public Device {
public:
    void print() { std::cout << "Printing\n"; }
};

class Scanner : public Device {
public:
    void scan() { std::cout << "Scanning\n"; }
};
```

Nothing wrong so far. Now build a device that does both:

```cpp
class Copier : public Printer, public Scanner {
};
```

The hierarchy is now a diamond — `Device` at the top, `Printer` and `Scanner` in the middle, `Copier` at the bottom:

```
        Device
       /      \
  Printer    Scanner
       \      /
        Copier
```

---

## Where It Breaks

Try to use the inherited members and the compiler stops you:

```cpp
int main() {
    Copier c;

    c.print();            // fine
    c.scan();             // fine

    c.powerOn();          // ERROR: request for member 'powerOn' is ambiguous
    c.serialNumber = 42;  // ERROR: request for member 'serialNumber' is ambiguous
}
```

The reason is memory layout. `Printer` contains a full `Device`. `Scanner` contains a full `Device`. `Copier` contains both — so a `Copier` object holds **two separate `Device` subobjects**, each with its own `serialNumber`.

When you write `c.serialNumber`, the compiler genuinely cannot tell which of the two you mean, so it refuses rather than guessing.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Bad Fix: Explicit Qualification

You *can* disambiguate by naming the path:

```cpp
int main() {
    Copier c;

    c.Printer::serialNumber = 42;
    c.Scanner::serialNumber = 99;

    std::cout << c.Printer::serialNumber << "\n";   // 42
    std::cout << c.Scanner::serialNumber << "\n";   // 99
}
```

It compiles, but look at what it admits: the copier has **two different serial numbers**. That's not a naming problem you worked around — it's a modelling error. A copier is one physical device and should have one serial number. Qualification silences the compiler while leaving the actual bug in place.

---

## The Real Fix: Virtual Inheritance

Tell the middle classes to *share* the base rather than each owning one. Add `virtual` to their inheritance:

```cpp
#include <iostream>

class Device {
public:
    int serialNumber = 0;
    void powerOn() { std::cout << "Powering on\n"; }
};

class Printer : virtual public Device {
public:
    void print() { std::cout << "Printing\n"; }
};

class Scanner : virtual public Device {
public:
    void scan() { std::cout << "Scanning\n"; }
};

class Copier : public Printer, public Scanner {
public:
    void copy() {
        scan();
        print();
    }
};

int main() {
    Copier c;

    c.powerOn();              // works — only one Device now
    c.serialNumber = 42;      // works — only one serialNumber

    std::cout << c.serialNumber << "\n";   // 42
    c.copy();
}
```

```
Powering on
42
Scanning
Printing
```

Now a `Copier` contains exactly one `Device` subobject, shared by both the `Printer` and `Scanner` parts. The ambiguity is gone because there's genuinely nothing left to be ambiguous about.

The key detail: **`virtual` goes on the middle classes, not on `Copier`.** `Printer` and `Scanner` are the ones that must agree to share. By the time you write `Copier`, it's too late.

---

## The Constructor Rule You'll Hit Next

Virtual inheritance changes who constructs the base. Normally each class constructs its own base — but there's only one shared `Device` here, so that can't work. Instead, the **most derived class** constructs the virtual base directly:

```cpp
#include <iostream>

class Device {
public:
    int serialNumber;
    Device(int sn) : serialNumber(sn) {
        std::cout << "Device(" << sn << ")\n";
    }
};

class Printer : virtual public Device {
public:
    Printer(int sn) : Device(sn) {}
};

class Scanner : virtual public Device {
public:
    Scanner(int sn) : Device(sn) {}
};

class Copier : public Printer, public Scanner {
public:
    Copier(int sn) : Device(sn), Printer(sn), Scanner(sn) {}
    //               ^^^^^^^^^^ required, and it is the one that runs
};

int main() {
    Copier c(1234);
    std::cout << c.serialNumber << "\n";
}
```

```
Device(1234)
1234
```

`Device(sn)` appears three times in the source, but the constructor runs **once**. The calls in `Printer` and `Scanner` are ignored when they're part of a `Copier`; only `Copier`'s own call takes effect. And if you omit `Device(sn)` from `Copier`'s initialiser list, the code won't compile unless `Device` has a default constructor.

This surprises people, so it's worth stating plainly: with virtual bases, the most derived class is always responsible for initialising them, no matter how deep the hierarchy.

---

## Should You Use Multiple Inheritance At All?

Virtual inheritance costs you something real — objects get an extra pointer to locate the shared base, member access is slightly slower, and construction rules get subtle. So:

**Avoid** multiple inheritance for classes carrying data. Prefer **composition**: give `Copier` a `Printer` member and a `Scanner` member instead of inheriting from both. It's simpler to reason about and there's no diamond to solve.

**It's fine** for interfaces — abstract classes with only pure virtual functions and no data members. Inheriting from `Drawable` and `Serializable` duplicates no state, so the diamond problem never bites. This is the pattern Java and C# formalised as `interface`, and it's the one case where multiple inheritance in C++ is uncontroversial.

---

## Related Articles

- [C++ Inheritance Explained](/posts/cpp-inheritance/)
- [Virtual Functions and Polymorphism in C++](/posts/virtual-functions-polymorphism-cpp/)
- [C++ Abstract Class and Pure Virtual Functions](/posts/cpp-abstract-class/)
- [C++ Virtual Destructor: Why You Need One](/posts/cpp-virtual-destructor/)
- [OOP in C++: The Four Pillars Explained](/posts/oop-in-cpp/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
