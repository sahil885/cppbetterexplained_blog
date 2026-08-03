---
title: "Virtual Destructor in C++: Why You Need One and When"
description: "Learn why C++ needs virtual destructors. See the memory leak that happens without one, the one-line fix, and the simple rule for when to add one to a class."
pubDatetime: 2026-08-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "oop", "inheritance", "tutorial"]
faqSchema:
  - question: "Why do we need a virtual destructor in C++?"
    answer: "When you delete a derived object through a base class pointer and the base destructor is not virtual, only the base destructor runs. The derived destructor is skipped, so anything the derived class allocated leaks. Marking the base destructor virtual makes the correct destructor run."
  - question: "When should a class have a virtual destructor?"
    answer: "Add a virtual destructor whenever a class is meant to be inherited from and deleted through a base class pointer. A practical rule is that if a class has any virtual function, it should also have a virtual destructor."
  - question: "Does a virtual destructor slow down my program?"
    answer: "Only slightly. A class with any virtual function already carries a hidden pointer to its virtual table, so adding a virtual destructor to such a class costs nothing extra. Adding one to a class with no other virtual functions adds a pointer per object."
draft: false
featured: false
---

# Virtual Destructor in C++: Why You Need One and When

This is one of the few C++ mistakes that produces no compiler warning, no crash, and no visible symptom — just a program that quietly leaks memory until something goes wrong.

The fix is a single keyword. The hard part is knowing when you need it.

---

## The Bug, Demonstrated

Here's a base class and a derived class that allocates something:

```cpp
#include <iostream>

class Shape {
public:
    Shape() { std::cout << "Shape created\n"; }
    ~Shape() { std::cout << "Shape destroyed\n"; }   // NOT virtual
    virtual double area() const { return 0.0; }
};

class Circle : public Shape {
public:
    Circle(double r) : radius_(new double(r)) {
        std::cout << "Circle created\n";
    }
    ~Circle() {
        delete radius_;                   // cleans up the allocation
        std::cout << "Circle destroyed\n";
    }
    double area() const override { return 3.14159 * *radius_ * *radius_; }

private:
    double* radius_;
};

int main() {
    Shape* s = new Circle(5.0);
    std::cout << "Area: " << s->area() << "\n";
    delete s;
    return 0;
}
```

Output:

```
Shape created
Circle created
Area: 78.5397
Shape destroyed
```

Read that last part again. `Circle destroyed` never printed. The `delete radius_` line never ran. That `double` on the heap is leaked, and the program exited without a complaint.

---

## Why It Happens

`s` is declared as a `Shape*`. When you write `delete s`, the compiler has to decide which destructor to call.

For `area()` it made that decision **at runtime**, because `area()` is `virtual` — that's why it correctly printed the circle's area and not `0`. Virtual functions are resolved by looking at the object's actual type.

The destructor is not virtual, so the compiler resolves it **at compile time**, using the only thing it knows for certain: the static type of the pointer, which is `Shape`. It calls `~Shape()` and stops. `~Circle()` is never reached.

The C++ standard doesn't just call this a leak, incidentally — deleting a derived object through a base pointer with a non-virtual destructor is *undefined behaviour*. It usually manifests as a leak, but you have no guarantee of what it does.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Fix

Add one keyword to the base class:

```cpp
class Shape {
public:
    Shape() { std::cout << "Shape created\n"; }
    virtual ~Shape() { std::cout << "Shape destroyed\n"; }   // virtual
    virtual double area() const { return 0.0; }
};
```

Now the output is what you'd expect:

```
Shape created
Circle created
Area: 78.5397
Circle destroyed
Shape destroyed
```

Two things to note. The derived class doesn't need the `virtual` keyword — once a function is virtual in a base class, it stays virtual in every class below it. And destructors run **bottom-up**: `~Circle()` first, then `~Shape()`. That order matters, because the derived destructor may depend on base-class members that shouldn't be torn down yet.

---

## The Rule to Remember

> **If a class has any virtual function, give it a virtual destructor.**

That covers virtually every case in practice, because a class with virtual functions is by definition designed to be inherited from and used polymorphically.

The broader version: any class you intend to delete through a base pointer needs a virtual destructor. A class you never inherit from doesn't need one, and adding it to something like a small `Point` struct wastes memory — the object grows by the size of a pointer for the hidden virtual table.

If you want to make sure nobody inherits from your class in the first place, mark it `final`:

```cpp
class Point final {   // cannot be a base class, so no virtual destructor needed
    int x_, y_;
};
```

---

## Smart Pointers Don't All Save You

You might assume [smart pointers](/posts/smart-pointers-cpp/) handle this. It depends which one:

```cpp
#include <memory>

std::unique_ptr<Shape> a = std::make_unique<Circle>(5.0);  // needs virtual dtor
std::shared_ptr<Shape> b = std::make_shared<Circle>(5.0);  // works either way
```

`std::unique_ptr<Shape>` calls `delete` on a `Shape*` — same bug, same leak, no virtual destructor means no `~Circle()`.

`std::shared_ptr` is different. It captures a deleter when it's constructed, at which point the concrete type is still known, so it remembers how to destroy a `Circle` properly. That's a real difference, but don't lean on it: write the virtual destructor and stop thinking about it.

---

## Related Articles

- [Virtual Functions and Polymorphism in C++](/posts/virtual-functions-polymorphism-cpp/)
- [C++ Inheritance Explained](/posts/cpp-inheritance/)
- [Constructors and Destructors in C++](/posts/cpp-constructors-destructors/)
- [Smart Pointers in C++](/posts/smart-pointers-cpp/)
- [The Rule of Three in C++](/posts/cpp-rule-of-three/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
