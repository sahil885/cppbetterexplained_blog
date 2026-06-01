---
title: "C++ Abstract Classes Explained: Pure Virtual Functions and Interfaces for Beginners"
description: "Learn C++ abstract classes and pure virtual functions. Understand how to define interfaces, enforce overrides, and use polymorphism properly in OOP."
pubDatetime: 2026-06-01T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "OOP", "tutorial"]
faqSchema:
  - question: "What is an abstract class in C++?"
    answer: "An abstract class in C++ is a class that has at least one pure virtual function (declared with = 0). You cannot create objects of an abstract class directly — it exists only to be subclassed. Concrete subclasses must override all pure virtual functions, or they become abstract too."
  - question: "What is the difference between a virtual function and a pure virtual function in C++?"
    answer: "A virtual function has a body in the base class and can be optionally overridden. A pure virtual function (declared as virtual void foo() = 0) has no body in the base class and MUST be overridden in any concrete subclass. A class with at least one pure virtual function is abstract and cannot be instantiated."
  - question: "Can an abstract class have a constructor in C++?"
    answer: "Yes. Abstract classes can have constructors, data members, and even implemented methods — they just cannot be instantiated directly. Constructors of an abstract base class are called when a derived class object is created. This is useful for initializing shared data members."
draft: false
featured: false
---

# C++ Abstract Classes: Pure Virtual Functions and Interfaces

An abstract class is a class you're not allowed to create objects from directly. It exists purely to serve as a blueprint that other classes must follow.

The idea: when you have a concept like "Shape" that's too general to be meaningful on its own, you make it abstract. You can't draw a "Shape" — but you can draw a Circle, Rectangle, or Triangle that all follow the Shape contract.

---

## Pure Virtual Functions: The Key Ingredient

A **pure virtual function** is declared with `= 0` at the end:

```cpp
virtual void draw() = 0;
```

This tells the compiler: "every subclass must implement this." Any class containing at least one pure virtual function is automatically an abstract class.

```cpp
#include <iostream>
using namespace std;

class Shape {
public:
    // Pure virtual function — subclasses must implement this
    virtual double area() = 0;

    // Regular function — shared by all shapes
    void describe() {
        cout << "I am a shape with area: " << area() << endl;
    }
};

int main() {
    // Shape s;  // ERROR: cannot instantiate abstract class
    return 0;
}
```

Trying to create a `Shape` directly causes a compile error. You must subclass it.

---

## Implementing an Abstract Class

Subclasses provide the concrete implementations:

```cpp
#include <iostream>
#include <cmath>
using namespace std;

class Shape {
public:
    virtual double area() = 0;
    virtual void draw() = 0;

    void describe() {
        cout << "Area: " << area() << endl;
    }
};

class Circle : public Shape {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}

    double area() override {
        return 3.14159 * radius * radius;
    }

    void draw() override {
        cout << "Drawing a circle with radius " << radius << endl;
    }
};

class Rectangle : public Shape {
private:
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}

    double area() override {
        return width * height;
    }

    void draw() override {
        cout << "Drawing a " << width << "x" << height << " rectangle" << endl;
    }
};

int main() {
    Circle c(5.0);
    Rectangle r(4.0, 6.0);

    c.draw();
    c.describe();

    r.draw();
    r.describe();

    return 0;
}
```

Output:
```
Drawing a circle with radius 5
Area: 78.5397
Drawing a 4x6 rectangle
Area: 24
```

---

## Why This Is Powerful: Polymorphism

The real benefit shows up when you use base class pointers. You can write code that works with any shape without knowing the specific type:

```cpp
#include <iostream>
#include <vector>
using namespace std;

// ... (Shape, Circle, Rectangle from above)

int main() {
    vector<Shape*> shapes;
    shapes.push_back(new Circle(3.0));
    shapes.push_back(new Rectangle(4.0, 5.0));
    shapes.push_back(new Circle(7.0));

    // Works for every shape, regardless of type
    for (Shape* s : shapes) {
        s->draw();
        cout << "Area: " << s->area() << endl;
    }

    // Clean up
    for (Shape* s : shapes) delete s;

    return 0;
}
```

The `draw()` and `area()` calls resolve to the right implementation at runtime — this is **polymorphism**. Your loop doesn't need to know whether it's a Circle or Rectangle.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Abstract Classes vs Interfaces

C++ doesn't have a dedicated `interface` keyword like Java or C#. An "interface" in C++ is just an abstract class where every method is pure virtual:

```cpp
// This is as close to an interface as C++ gets
class Printable {
public:
    virtual void print() = 0;
    virtual ~Printable() = default;
};

class Serializable {
public:
    virtual string serialize() = 0;
    virtual ~Serializable() = default;
};

// A class can implement multiple "interfaces"
class Document : public Printable, public Serializable {
private:
    string content;
public:
    Document(string c) : content(c) {}

    void print() override {
        cout << content << endl;
    }

    string serialize() override {
        return "{\"content\": \"" + content + "\"}";
    }
};
```

---

## The Virtual Destructor Rule

Whenever you have a base class with virtual functions, **always declare a virtual destructor**:

```cpp
class Shape {
public:
    virtual double area() = 0;
    virtual ~Shape() = default;  // Virtual destructor!
};
```

Without it, deleting a derived class object through a base pointer causes undefined behaviour — the derived class destructor won't be called.

---

## Partially Abstract Classes

A class can mix pure virtual functions with concrete ones. Concrete methods provide default behaviour; pure virtual methods force customization:

```cpp
class Animal {
public:
    // Must override
    virtual string sound() = 0;

    // Shared behaviour — no need to override
    void breathe() {
        cout << "Inhale... exhale..." << endl;
    }

    void introduce() {
        cout << "I am an animal. I say: " << sound() << endl;
    }
};

class Dog : public Animal {
public:
    string sound() override { return "Woof"; }
};
```

`Dog` only needs to implement `sound()` — it inherits `breathe()` and `introduce()` for free.

---

## Related Articles

- [Virtual Functions and Polymorphism in C++](/posts/virtual-functions-polymorphism-cpp/)
- [C++ Inheritance Explained](/posts/cpp-inheritance/)
- [C++ Classes and Objects: A Beginner's Guide](/posts/cpp-classes-and-objects/)
- [OOP in C++: The Four Pillars Explained](/posts/oop-in-cpp/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
