---
title: "C++ Constructor Initializer Lists Explained for Beginners"
description: "Learn how C++ constructor initializer lists work, why they're faster than assignment in the constructor body, and when you must use them. With clear examples."
pubDatetime: 2026-05-21T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "OOP", "tutorial"]
faqSchema:
  - question: "What is a constructor initializer list in C++?"
    answer: "A constructor initializer list is the part of a constructor that comes after a colon (:) and before the body. It directly initializes member variables before the constructor body runs. Example: `Rectangle(int w, int h) : width(w), height(h) {}`"
  - question: "Why should I use an initializer list instead of assigning in the constructor body?"
    answer: "With an initializer list, members are constructed directly with the right value. Without one, members are default-constructed first and then assigned in the body — which is two operations instead of one. For const members and reference members, an initializer list isn't just better — it's the only option."
  - question: "When must I use a constructor initializer list in C++?"
    answer: "You must use an initializer list when initializing const member variables, reference members, or member objects whose class has no default constructor. The constructor body cannot assign to const or reference members — only the initializer list can initialize them."
draft: false
featured: false
---

# C++ Constructor Initializer Lists Explained for Beginners

When you write a constructor in C++, you have two places to set up member variables: the initializer list (before the body) or assignment inside the body. Most beginners use the body because it looks familiar. But C++ has a better way — and in some cases, a required way.

---

## The Syntax

An initializer list comes after the constructor's parameter list, separated by a colon. Each member is listed with its initial value in parentheses:

```cpp
#include <iostream>
#include <string>

class Rectangle {
public:
    int width;
    int height;

    // Initializer list — width and height are initialized directly
    Rectangle(int w, int h) : width(w), height(h) {}

    int area() const { return width * height; }
};

int main() {
    Rectangle r(5, 3);
    std::cout << "Area: " << r.area() << "\n";  // 15
    return 0;
}
```

The `: width(w), height(h)` part is the initializer list. Members are initialized in the order they're declared in the class, not in the order they appear in the initializer list.

---

## Initializer List vs Assignment in the Body

Here's what happens without an initializer list:

```cpp
class Player {
public:
    std::string name;
    int score;

    // WITHOUT initializer list
    Player(std::string n, int s) {
        // name is default-constructed (empty string), THEN assigned
        name = n;
        // score is default-initialized (undefined), THEN assigned
        score = s;
    }
};
```

And with an initializer list:

```cpp
class Player {
public:
    std::string name;
    int score;

    // WITH initializer list
    Player(std::string n, int s) : name(n), score(s) {}
    // name is constructed directly with n — no default then assign
};
```

For `int` and `double`, the difference is negligible. For `std::string` and other class types, the initializer list avoids a wasted default construction plus an assignment — it constructs the object once, correctly, from the start.

---

## When You MUST Use an Initializer List

Some members cannot be assigned in the constructor body — they can only be initialized. The initializer list is the only option in these three cases.

### 1. const Member Variables

```cpp
#include <iostream>

class Circle {
public:
    const double PI;
    double radius;

    Circle(double r) : PI(3.14159), radius(r) {}
    // You CANNOT write: PI = 3.14159; inside the body — it won't compile
    
    double area() const { return PI * radius * radius; }
};

int main() {
    Circle c(5.0);
    std::cout << "Area: " << c.area() << "\n";
    return 0;
}
```

### 2. Reference Member Variables

```cpp
#include <iostream>

class Logger {
public:
    std::ostream& output;  // reference member

    Logger(std::ostream& out) : output(out) {}
    // References must be bound at initialization — you can't assign them later

    void log(const std::string& msg) {
        output << "[LOG] " << msg << "\n";
    }
};

int main() {
    Logger logger(std::cout);
    logger.log("Application started");
    return 0;
}
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

### 3. Member Objects With No Default Constructor

```cpp
#include <iostream>

class Engine {
public:
    int horsepower;
    Engine(int hp) : horsepower(hp) {}
    // No default constructor — Engine() would fail to compile
};

class Car {
public:
    Engine engine;  // Engine has no default constructor
    std::string model;

    Car(std::string m, int hp) : model(m), engine(hp) {}
    // Without the initializer list, the compiler tries Engine() — which doesn't exist
};

int main() {
    Car myCar("Mustang", 450);
    std::cout << myCar.model << " — " << myCar.engine.horsepower << " hp\n";
    return 0;
}
```

---

## Initialization Order

Members are always initialized in the order they're declared in the class, regardless of the order in the initializer list. This can cause subtle bugs if one member depends on another:

```cpp
class Box {
public:
    int width;
    int area;  // declared second

    // BUG: area is initialized before width (declaration order),
    // so width is uninitialized when area uses it!
    Box(int w) : area(w * width), width(w) {}
};
```

The fix: either reorder the class declarations, or compute `area` in the constructor body after `width` is definitely initialized.

---

## Summary

Use an initializer list whenever you can — it's more efficient and it's the only option for `const` members, references, and objects with no default constructor. The syntax takes a minute to get used to, but once it clicks, you'll use it in every class you write.

---

## Related Articles

- [C++ Classes and Objects: A Beginner's Guide to OOP](/posts/cpp-classes-and-objects/)
- [C++ Constructors and Destructors Explained](/posts/cpp-constructors-destructors/)
- [C++ Const vs Constexpr: What's the Difference?](/posts/cpp-const-vs-constexpr/)
- [OOP in C++: Inheritance, Encapsulation, and Polymorphism Explained](/posts/oop-in-cpp/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
