---
title: "C++ Struct vs Class: What's the Difference?"
description: "Learn the difference between struct and class in C++. This guide explains access control defaults, when to use each, and the single real difference — with clear examples."
pubDatetime: 2026-05-16T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "OOP", "structs", "tutorial"]
faqSchema:
  - question: "What is the difference between struct and class in C++?"
    answer: "In C++, the only technical difference between struct and class is the default access control: struct members are public by default, class members are private by default. Everything else — constructors, methods, inheritance, templates — works identically in both."
  - question: "When should I use struct vs class in C++?"
    answer: "The C++ community convention is: use struct for plain data containers (simple groups of related fields, no invariants to maintain), and use class for objects with behaviour and encapsulation (where the internal state should be protected). This is a convention, not a rule enforced by the compiler."
  - question: "Can a C++ struct have methods and constructors?"
    answer: "Yes. A C++ struct can have methods, constructors, destructors, inheritance, and everything a class can have. The only difference is that struct members default to public while class members default to private."
draft: false
featured: false
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/wxmh9oMzQd4" title="C++ Struct vs Class: What's the Difference?" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
# C++ Struct vs Class: What's the Difference?

If you're coming from C, you know `struct` as a simple data container. In C++, the distinction between `struct` and `class` is much smaller than most beginners expect.

The technical difference is exactly one thing.

---

## The One Real Difference: Default Access

```cpp
struct MyStruct {
    int x;   // public by default
    int y;
};

class MyClass {
    int x;   // private by default
    int y;
};
```

That's it. The only difference is what access level members get when you don't specify one.

Everything else — constructors, methods, inheritance, templates, friend declarations — works identically in both.

---

## Both Can Have Everything a Class Has

A struct with methods, a constructor, and encapsulation:

```cpp
struct Point {
    double x, y;

    Point(double x, double y) : x(x), y(y) {}

    double distance(const Point& other) const {
        double dx = x - other.x;
        double dy = y - other.y;
        return sqrt(dx*dx + dy*dy);
    }

    void print() const {
        cout << "(" << x << ", " << y << ")" << endl;
    }
};

Point a(0, 0);
Point b(3, 4);
cout << a.distance(b) << endl;  // 5
```

This is perfectly valid C++. The struct has a constructor, methods, and behaves exactly like a class.

---

## Inheritance Default Also Differs

The same rule applies to inheritance: struct uses `public` inheritance by default, class uses `private` inheritance by default.

```cpp
struct Base { int x = 10; };

struct DerivedStruct : Base {};   // public inheritance (default for struct)
class DerivedClass : Base {};     // private inheritance (default for class)

DerivedStruct s;
cout << s.x;   // Fine — x is accessible (public inheritance)

DerivedClass c;
// cout << c.x;  // Error — x is inaccessible (private inheritance)
```

In practice, you almost always want public inheritance, so you'll write `class Derived : public Base` explicitly anyway.

---

## The Convention: When to Use Each

Since the compiler doesn't enforce it, the C++ community follows a convention:

**Use `struct` for:**
- Plain data bundles (POD-like types)
- Simple groups of related values with no behaviour
- Interop with C code
- Types where all members are naturally public

```cpp
struct Color { int r, g, b; };         // Just data
struct Point { double x, y; };         // Just data
struct Config { bool verbose; int timeout; string logFile; };  // Settings bundle
```

**Use `class` for:**
- Types with invariants to maintain (internal state that must stay consistent)
- Types with meaningful encapsulation (private data, public interface)
- Objects that "do things" as well as hold data

```cpp
class BankAccount {
    double balance;  // Private — must never go negative
public:
    void deposit(double amount);
    bool withdraw(double amount);
    double getBalance() const;
};
```

This is a convention the compiler doesn't enforce — you can use either keyword for either purpose. But following the convention makes your intent clear to other programmers.

---

## Side-by-Side Comparison

```cpp
// As a struct (members public by default)
struct Rectangle {
    double width, height;

    double area() const { return width * height; }
};

Rectangle r;
r.width = 5;   // Fine — public
r.height = 3;
cout << r.area();  // 15
```

```cpp
// As a class (members private by default)
class Rectangle {
    double width, height;

public:
    Rectangle(double w, double h) : width(w), height(h) {}
    double area() const { return width * height; }
};

Rectangle r(5, 3);
// r.width = 5;  // Error — private
cout << r.area();  // 15
```

The class version protects `width` and `height` from external modification. The struct version exposes them freely.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Summary Table

| Feature | `struct` | `class` |
|---------|----------|---------|
| Default member access | `public` | `private` |
| Default inheritance | `public` | `private` |
| Can have constructors? | Yes | Yes |
| Can have methods? | Yes | Yes |
| Can have private members? | Yes (explicit) | Yes (default) |
| Can inherit? | Yes | Yes |
| Templates? | Yes | Yes |

---

## Common Misconception

Many beginners think C++ structs are "limited" like C structs — just plain data, no methods. That's not true. A C++ struct is a full-featured type identical to a class except for the default access level.

When to make the choice: ask yourself "should the data be public by default, or private by default?" If public (simple data bundle), use struct. If private (encapsulated object), use class.

---

## Related Articles

- [C++ Classes and Objects](/posts/cpp-classes-and-objects/) — full guide to classes and constructors
- [OOP in C++](/posts/oop-in-cpp/) — encapsulation, inheritance, and polymorphism
- [C++ Enum Tutorial](/posts/cpp-enum-tutorial/) — another type-definition mechanism
- [C++ Constructors and Destructors](/posts/cpp-constructors-destructors/) — object lifecycle

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
