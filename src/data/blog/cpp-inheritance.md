---
title: "C++ Inheritance Explained: Base Classes, Derived Classes, and How It Works"
description: "Learn C++ inheritance from scratch. Understand base and derived classes, access specifiers, and how to reuse code with real beginner-friendly examples."
pubDatetime: 2026-05-28T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "OOP", "tutorial"]
faqSchema:
  - question: "What is inheritance in C++?"
    answer: "Inheritance lets a new class (called the derived or child class) automatically get the data members and methods of an existing class (the base or parent class). It promotes code reuse — you write common behaviour once and extend it rather than duplicate it."
  - question: "What is the difference between public, protected, and private inheritance in C++?"
    answer: "Public inheritance is the most common: public members of the base stay public in the derived class. Protected inheritance makes those members protected. Private inheritance makes them all private. For most beginner use cases, always use public inheritance."
  - question: "Can a derived class override a function from the base class in C++?"
    answer: "Yes. If you declare the function virtual in the base class, the derived class can override it. The correct version is then called at runtime based on the actual object type, which is the foundation of polymorphism."
draft: false
featured: false
---

# C++ Inheritance Explained: Base Classes, Derived Classes, and How It Works

In real life, a `Car` is a `Vehicle`. A `Dog` is an `Animal`. A `Manager` is an `Employee`. These "is-a" relationships are exactly what inheritance models in C++ — letting you build a new class on top of an existing one instead of starting from scratch every time.

---

## The Basic Syntax

To make one class inherit from another, you use a colon followed by an access specifier and the base class name:

```cpp
class DerivedClass : public BaseClass {
    // ...
};
```

Here's a complete example:

```cpp
#include <iostream>
#include <string>

class Animal {
public:
    std::string name;

    void eat() {
        std::cout << name << " is eating.\n";
    }
};

class Dog : public Animal {
public:
    void bark() {
        std::cout << name << " says: Woof!\n";
    }
};

int main() {
    Dog d;
    d.name = "Rex";
    d.eat();   // inherited from Animal
    d.bark();  // defined in Dog
    return 0;
}
```

Output:
```
Rex is eating.
Rex says: Woof!
```

`Dog` automatically gets the `name` member and the `eat()` method from `Animal`. You didn't have to rewrite them.

---

## Constructor Chaining

When you create a derived object, the **base class constructor runs first**, then the derived class constructor. You pass arguments to the base constructor using an initializer list:

```cpp
#include <iostream>
#include <string>

class Employee {
public:
    std::string name;
    int id;

    Employee(std::string n, int i) : name(n), id(i) {}

    void display() {
        std::cout << "Employee: " << name << " (ID: " << id << ")\n";
    }
};

class Manager : public Employee {
public:
    std::string department;

    Manager(std::string n, int i, std::string dept)
        : Employee(n, i), department(dept) {}

    void displayManager() {
        display();
        std::cout << "Department: " << department << "\n";
    }
};

int main() {
    Manager m("Alice", 101, "Engineering");
    m.displayManager();
    return 0;
}
```

Output:
```
Employee: Alice (ID: 101)
Department: Engineering
```

`Manager` calls `Employee(n, i)` in its initializer list to set up the base portion of the object.

---

## Access Specifiers: What Gets Inherited?

Three access levels control what a derived class can see:

| Base member | `public` inheritance | `protected` inheritance | `private` inheritance |
|---|---|---|---|
| `public` | public | protected | private |
| `protected` | protected | protected | private |
| `private` | not accessible | not accessible | not accessible |

For most beginner code, use `public` inheritance. The key practical rule is: **private members of the base class are never directly accessible in the derived class**, even though they exist inside the object.

```cpp
class Base {
private:
    int secret = 42;    // derived cannot access this directly
protected:
    int shared = 10;    // derived can access this
public:
    int open = 99;      // anyone can access this
};

class Derived : public Base {
public:
    void show() {
        // std::cout << secret;  // error — private
        std::cout << shared;     // fine — protected
        std::cout << open;       // fine — public
    }
};
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Overriding Methods

A derived class can replace a base class method with its own version. Use the `virtual` keyword in the base and `override` in the derived class:

```cpp
#include <iostream>

class Shape {
public:
    virtual void draw() {
        std::cout << "Drawing a generic shape.\n";
    }
};

class Circle : public Shape {
public:
    void draw() override {
        std::cout << "Drawing a circle.\n";
    }
};

class Square : public Shape {
public:
    void draw() override {
        std::cout << "Drawing a square.\n";
    }
};

int main() {
    Shape* s1 = new Circle();
    Shape* s2 = new Square();

    s1->draw();   // Drawing a circle.
    s2->draw();   // Drawing a square.

    delete s1;
    delete s2;
    return 0;
}
```

This is **runtime polymorphism** — the right version of `draw()` is called based on the actual object type, not the pointer type. For a deeper look at this mechanism, see the [virtual functions article](/posts/virtual-functions-polymorphism-cpp/).

---

## Types of Inheritance

C++ supports several forms of inheritance:

- **Single inheritance** — one base class (the examples above)
- **Multilevel inheritance** — `C` inherits from `B`, which inherits from `A`
- **Multiple inheritance** — one class inherits from two base classes

Multiple inheritance is powerful but can create complexity (the "diamond problem"). Beginners should start with single and multilevel inheritance.

```cpp
// Multilevel example
class A { public: void hello() { std::cout << "Hello from A\n"; } };
class B : public A {};
class C : public B {};

int main() {
    C obj;
    obj.hello();  // inherited all the way from A
    return 0;
}
```

---

## Related Articles

- [OOP in C++: Inheritance, Encapsulation, and Polymorphism Explained](/posts/oop-in-cpp/)
- [C++ Classes and Objects: A Beginner's Guide to OOP](/posts/cpp-classes-and-objects/)
- [Virtual Functions and Polymorphism in C++ Explained](/posts/virtual-functions-polymorphism-cpp/)
- [C++ Constructors and Destructors Explained](/posts/cpp-constructors-destructors/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
