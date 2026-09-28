---
title: "Getters and Setters in C++: How and When to Use Them"
description: "Write getters and setters in C++ for private class members. Covers const correctness, returning by reference, validation, and when to skip them."
pubDatetime: 2026-09-28T00:00:00Z
author: "Sahil"
tags: ["C++", "OOP", "classes", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "What are getters and setters in C++?"
    answer: "They are member functions that read and write a private data member. A getter returns the value, a setter assigns it. They let a class control access to its own data instead of exposing it publicly."
  - question: "Should a getter be const in C++?"
    answer: "Yes. Marking a getter const promises it will not modify the object, which lets you call it on const objects and const references. A getter that is not const cannot be used on a const object."
  - question: "Should getters return by value or by reference?"
    answer: "Return small types like int and double by value. Return large types such as std::string or std::vector by const reference to avoid copying, but never return a reference to a local variable."
  - question: "Do you always need getters and setters in C++?"
    answer: "No. If a type is a plain bundle of data with no invariants to protect, public members in a struct are clearer. Getters and setters earn their place when the setter validates input or the class must control how data changes."
---

# Getters and Setters in C++

**Short answer:** a getter reads a private member, a setter writes it. Make getters `const`.

```cpp
class Player {
    int health_ = 100;
public:
    int  health() const   { return health_; }   // getter
    void setHealth(int h) { health_ = h; }      // setter
};
```

---

## The Basic Pattern

```cpp
#include <iostream>
#include <string>

class Player {
private:
    std::string name_;
    int health_ = 100;

public:
    Player(std::string name) : name_(std::move(name)) {}

    // Getters — const, because they only read
    const std::string& name() const { return name_; }
    int health() const { return health_; }

    // Setters — validate, then assign
    void setHealth(int h) {
        if (h < 0)   h = 0;
        if (h > 100) h = 100;
        health_ = h;
    }
};

int main() {
    Player p("Ana");
    p.setHealth(150);
    std::cout << p.name() << ": " << p.health() << '\n';   // Ana: 100
}
```

That clamp in `setHealth` is the entire argument for setters. A public `int health;` would let any code write `p.health = 150` and put the object into a state it should never reach.

## Why Getters Must Be const

The `const` after the parameter list promises the function won't modify the object:

```cpp
int health() const { return health_; }
//            ^^^^^
```

Without it, this breaks:

```cpp
void printPlayer(const Player& p) {
    std::cout << p.health();   // error if health() is not const
}
```

Passing large objects by `const&` is standard practice, so a non-const getter makes your class awkward to use. See [the const keyword in C++](/posts/cpp-const-keyword/).

<div class="inline-cta"><strong>Learning C++ properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> explains classes, objects and OOP in plain English — 87 pages, just $19.</div>

## Return by Value or by Reference?

```cpp
int health() const { return health_; }                  // small — by value
const std::string& name() const { return name_; }       // large — by const ref
```

Copying an `int` is free. Copying a `std::string` allocates. The rule of thumb:

- **Small, cheap types** (`int`, `double`, `bool`, `char`, enums) → return by value.
- **Large types** (`std::string`, `std::vector`, your own classes) → return by `const&`.

Why `const&` and not plain `&`? A plain reference hands out write access and quietly destroys the encapsulation you built:

```cpp
std::string& name() { return name_; }   // dangerous
p.name() = "anything";                  // bypasses every check you wrote
```

**Never return a reference to a local:**

```cpp
const std::string& bad() const {
    std::string tmp = name_ + "!";
    return tmp;             // tmp dies here — dangling reference
}
```

## Setters That Actually Earn Their Keep

A setter that just assigns adds nothing over a public member. A setter that enforces a rule does:

```cpp
class BankAccount {
    double balance_ = 0.0;

public:
    double balance() const { return balance_; }

    bool deposit(double amount) {
        if (amount <= 0) return false;      // reject nonsense
        balance_ += amount;
        return true;
    }

    bool withdraw(double amount) {
        if (amount <= 0 || amount > balance_) return false;
        balance_ -= amount;
        return true;
    }
};
```

Note there's no `setBalance`. The class exposes the *operations that make sense* rather than raw write access — which is the real point of encapsulation. A `setBalance(double)` would let any caller invent money.

## When to Skip Them Entirely

If a type is just a bundle of values with no rules to enforce, getters and setters are noise:

```cpp
struct Point {
    double x = 0;
    double y = 0;
};

Point p;
p.x = 3.5;      // clear, and nothing is being protected
```

Writing `getX()`, `setX()`, `getY()`, `setY()` around this buys you nothing but typing. Use a [struct with public members](/posts/cpp-struct-vs-class/) when there are no invariants.

The test: **is there any value this member could hold that would make the object wrong?** If yes, you need a setter that guards it. If no, make it public.

## Naming Conventions

C++ has no single standard. Common styles:

```cpp
int  getHealth() const;  void setHealth(int);    // Java-influenced
int  health() const;     void setHealth(int);    // common modern C++
int  health() const;     void health(int);       // overloaded
```

The middle one is most common in modern C++ and the standard library leans that way (`vector::size()`, not `getSize()`). Pick one and hold to it across the codebase.

## Quick Reference

| Situation | Do this |
|---|---|
| Reading a member | `const` getter |
| Small type | Return by value |
| Large type | Return by `const&` |
| Member has validity rules | Setter that validates |
| No rules to enforce | Public member in a `struct` |
| Exposing an operation | Named method, not a raw setter |
| Never | Return non-const `&` to a private member |

---

## Take Your C++ Further

If you want classes, objects and OOP explained properly rather than pieced together, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers it in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ Classes and Objects](/posts/cpp-classes-and-objects/) — the foundation this builds on.
- [The const Keyword in C++](/posts/cpp-const-keyword/) — why const getters matter.
- [struct vs class in C++](/posts/cpp-struct-vs-class/) — when to skip encapsulation.
- [C++ this Pointer](/posts/cpp-this-pointer/) — what member functions operate on.
- [C++ Bank Account Program](/posts/cpp-bank-account-program/) — encapsulation in a real project.
