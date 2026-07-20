---
title: "Friend Functions in C++: What They Are and When to Use Them"
description: "Learn what friend functions and friend classes do in C++, how they access private members, and when using one is the right call instead of a getter method."
pubDatetime: 2026-07-20T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "oop", "classes", "tutorial"]
faqSchema:
  - question: "What is a friend function in C++?"
    answer: "A friend function is a function that is not a member of a class but is granted access to its private and protected members. You declare it inside the class with the friend keyword. The function itself is defined outside the class like any ordinary function."
  - question: "Does friendship break encapsulation in C++?"
    answer: "Not really. A class chooses its own friends explicitly in its own definition, so the class still controls who gets access. It is more accurate to say a friend function is part of the class interface, just written with function syntax instead of member syntax."
  - question: "Is friendship inherited or mutual in C++?"
    answer: "Neither. If class A declares B a friend, B does not automatically declare A a friend, and classes derived from B are not friends of A. Friendship must be granted explicitly in every direction and for every class that needs it."
draft: false
featured: false
---

# Friend Functions in C++: What They Are and When to Use Them

Private members exist so that outside code can't touch them. A **friend function** is how a class makes a deliberate exception — it names a specific outside function and says "this one is allowed in."

It sounds like a loophole in encapsulation. It isn't, and the reason why is worth understanding.

---

## The Problem Friends Solve

Say you have a `Temperature` class and you want to print it with `std::cout`:

```cpp
Temperature t(23.5);
std::cout << t;   // we want this to work
```

To make that work, you need to overload `operator<<`. But here's the catch: the left operand is `std::cout`, not your object. That means the overload **cannot be a member function of `Temperature`** — member functions always take the object on the left.

So it has to be a free function. But a free function can't read `Temperature`'s private data. That's exactly the gap `friend` fills.

---

## Basic Syntax

```cpp
#include <iostream>

class Temperature {
private:
    double celsius;

public:
    Temperature(double c) : celsius(c) {}

    // Grant access — this is a declaration, not a member function
    friend std::ostream& operator<<(std::ostream& os, const Temperature& t);
};

// Defined outside the class, like a normal function.
// No "Temperature::" prefix — it is NOT a member.
std::ostream& operator<<(std::ostream& os, const Temperature& t) {
    os << t.celsius << "C";   // legal: we are a friend
    return os;
}

int main() {
    Temperature today(23.5);
    std::cout << "Today: " << today << "\n";
    return 0;
}
```

Output:
```
Today: 23.5C
```

Three things to notice:

- The `friend` declaration goes **inside** the class. It can appear in a `public`, `private`, or `protected` section — access specifiers don't affect it. Convention is to put it near the top or bottom.
- The definition outside has **no `Temperature::` prefix** and **no `friend` keyword**. Those only appear in the declaration.
- The function returns `std::ostream&` so that chaining works: `std::cout << a << b`.

---

## Friend Functions for Binary Operators

The other classic use is symmetric operators. Consider adding two vectors:

```cpp
#include <iostream>

class Vec2 {
private:
    double x, y;

public:
    Vec2(double x, double y) : x(x), y(y) {}

    friend Vec2 operator+(const Vec2& a, const Vec2& b);
    friend bool operator==(const Vec2& a, const Vec2& b);
    friend std::ostream& operator<<(std::ostream& os, const Vec2& v);
};

Vec2 operator+(const Vec2& a, const Vec2& b) {
    return Vec2(a.x + b.x, a.y + b.y);
}

bool operator==(const Vec2& a, const Vec2& b) {
    return a.x == b.x && a.y == b.y;
}

std::ostream& operator<<(std::ostream& os, const Vec2& v) {
    os << "(" << v.x << ", " << v.y << ")";
    return os;
}

int main() {
    Vec2 a(1.0, 2.0);
    Vec2 b(3.0, 4.0);

    std::cout << a << " + " << b << " = " << (a + b) << "\n";
    std::cout << "a == b? " << ((a == b) ? "yes" : "no") << "\n";

    return 0;
}
```

Output:
```
(1, 2) + (3, 4) = (4, 6)
a == b? no
```

You *could* write `operator+` as a member function. But then the two operands are treated asymmetrically — the left one is the object, the right one is a parameter. As a free friend function, both sides are plain parameters, which reads better and behaves more predictably with implicit conversions.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Friend Classes

You can also make an entire class a friend, granting all of its member functions access:

```cpp
#include <iostream>

class Engine {
private:
    int rpm;
    bool running;

    void ignite() { running = true; rpm = 800; }

public:
    Engine() : rpm(0), running(false) {}

    friend class Car;   // Car may touch Engine's privates
};

class Car {
private:
    Engine engine;

public:
    void start() {
        engine.ignite();          // reaching into a private method
        std::cout << "Engine started at " << engine.rpm << " rpm\n";
    }

    void status() const {
        std::cout << "Running: " << (engine.running ? "yes" : "no") << "\n";
    }
};

int main() {
    Car car;
    car.status();
    car.start();
    car.status();
    return 0;
}
```

Output:
```
Running: no
Engine started at 800 rpm
Running: yes
```

Friend classes are a bigger hammer than friend functions — you're granting access to *every* member function, present and future. Use them when two classes are genuinely two halves of one design (a container and its iterator is the textbook example), not just because it's convenient.

---

## The Three Rules of Friendship

Friendship in C++ is narrower than most people assume:

**It is not mutual.** If `Engine` declares `Car` a friend, `Car` does not automatically declare `Engine` a friend. Access flows one way only.

**It is not inherited.** If `Car` is a friend of `Engine`, a class `SportsCar` derived from `Car` is *not* a friend of `Engine`. Each class must be named explicitly.

**It is not transitive.** If `A` befriends `B` and `B` befriends `C`, then `C` has no access to `A`.

These restrictions are deliberate. They keep the set of code that can touch your private data small and explicitly listed in one place — the class definition.

---

## When You Should *Not* Use Friend

Reach for `friend` sparingly. Ask these questions first:

**Would a public getter work?** If the data is safe to expose read-only, a `const` getter is simpler and doesn't couple an external function to your internals.

**Should this be a member function instead?** If the left-hand operand is naturally your object, make it a member. Operators like `+=`, `[]`, `=`, and `()` must be members anyway.

**Are you using it to patch a design problem?** If two classes constantly need each other's privates, that's often a sign they should be one class, or that a third abstraction is missing.

The healthy use cases are narrow and well known: stream operators, symmetric binary operators, and tightly-paired class designs.

---

## Summary

| | Friend function | Member function | Public getter |
|---|---|---|---|
| Access to privates | Yes | Yes | Via the getter only |
| Left operand must be the object | No | Yes | N/A |
| Works for `operator<<` | **Yes** | No | Yes, but verbose |
| Coupling | Moderate | High (it *is* the class) | Low |

A friend function is an outside function that the class explicitly invites in. Because the invitation is written in the class itself, encapsulation stays intact — the class still decides who gets access.

---

## Related Articles

- [C++ Operator Overloading](/posts/cpp-operator-overloading/) — the main place friends show up
- [C++ Classes and Objects](/posts/cpp-classes-and-objects/) — public, private, and access control
- [struct vs class in C++](/posts/cpp-struct-vs-class/) — default access differences
- [OOP in C++](/posts/oop-in-cpp/) — encapsulation in context
- [C++ Constructors and Destructors](/posts/cpp-constructors-destructors/) — initializing the members friends can see

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
