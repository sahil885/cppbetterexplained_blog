---
title: "C++ Constructors and Destructors Explained"
description: "Learn how C++ constructors and destructors work — default constructors, parameterized constructors, copy constructors, initializer lists, and when destructors are called. With practical examples."
pubDatetime: 2026-05-16T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "OOP", "classes", "tutorial"]
faqSchema:
  - question: "What is a constructor in C++?"
    answer: "A constructor is a special member function that is automatically called when an object is created. It has the same name as the class, no return type, and is used to initialize the object's data members. If you don't define one, the compiler generates a default constructor that does nothing."
  - question: "What is a destructor in C++ and when is it called?"
    answer: "A destructor is a special member function called automatically when an object is destroyed (goes out of scope, is deleted, or the program ends). It has the same name as the class preceded by a tilde (~), takes no parameters, and is used to release resources like heap memory, file handles, or network connections."
  - question: "What is an initializer list in C++?"
    answer: "An initializer list initializes member variables before the constructor body runs. Syntax: ClassName(args) : member1(value1), member2(value2) { }. This is more efficient than assigning values in the constructor body because members are initialized directly, not default-initialized and then assigned. It's also required for const members and references."
draft: false
featured: false
---

# C++ Constructors and Destructors Explained

Every time you create an object in C++, a constructor is called. Every time an object is destroyed, a destructor is called. Understanding how they work is fundamental to writing correct, efficient C++ code.

---

## What Is a Constructor?

A constructor is a special function that runs automatically when an object is created. It has the same name as the class and no return type:

```cpp
#include <iostream>
using namespace std;

class Dog {
public:
    string name;
    int age;

    // Constructor: same name as class, no return type
    Dog(string n, int a) {
        name = n;
        age = a;
        cout << name << " created!\n";
    }
};

int main() {
    Dog d("Rex", 3);   // Constructor called automatically
    cout << d.name << " is " << d.age << " years old\n";
    return 0;
}
```

Output:
```
Rex created!
Rex is 3 years old
```

---

## Types of Constructors

### Default Constructor

A constructor with no parameters. If you define no constructor at all, the compiler generates a default one (which does nothing). Once you define any constructor, the compiler stops generating one automatically.

```cpp
class Point {
public:
    double x, y;

    // Default constructor
    Point() {
        x = 0;
        y = 0;
    }
};

Point p;  // Calls default constructor — x=0, y=0
```

### Parameterized Constructor

Takes arguments to initialize the object with specific values:

```cpp
class Point {
public:
    double x, y;

    Point(double x, double y) {
        this->x = x;  // 'this->' distinguishes member from parameter
        this->y = y;
    }
};

Point p(3.0, 4.0);   // x=3, y=4
```

### Multiple Constructors (Overloading)

You can have multiple constructors with different parameter lists:

```cpp
class Rectangle {
public:
    double width, height;

    Rectangle() : width(1), height(1) {}               // 1x1 default
    Rectangle(double w, double h) : width(w), height(h) {}  // custom size
    Rectangle(double side) : width(side), height(side) {}   // square
};

Rectangle r1;          // 1x1
Rectangle r2(5, 3);   // 5x3
Rectangle r3(4);      // 4x4 square
```

---

## Initializer Lists

Instead of assigning values in the constructor body, use an **initializer list**:

```cpp
// Using assignment in body (less efficient)
class Circle {
    double radius;
    string color;
public:
    Circle(double r, string c) {
        radius = r;  // Default-initializes radius first, then assigns
        color = c;   // Same for color
    }
};

// Using initializer list (better)
class Circle {
    double radius;
    string color;
public:
    Circle(double r, string c) : radius(r), color(c) {
        // Members are directly initialized — no default-init then assign
    }
};
```

**Initializer lists are required for:**
- `const` member variables (can't be assigned after initialization)
- Reference member variables (must be bound at creation)
- Base class constructors

```cpp
class Point {
    const int id;    // const — can only be initialized, not assigned
    double x, y;
public:
    Point(int id, double x, double y) : id(id), x(x), y(y) {}
    // Without the initializer list for id, this would be a compile error
};
```

---

## What Is a Destructor?

A destructor runs automatically when an object is destroyed — when it goes out of scope, when you `delete` it, or when the program ends.

```cpp
class Dog {
public:
    string name;

    Dog(string n) : name(n) {
        cout << name << " created\n";
    }

    ~Dog() {  // Destructor: tilde + class name, no parameters
        cout << name << " destroyed\n";
    }
};

int main() {
    Dog d1("Rex");
    {
        Dog d2("Max");
    }  // d2 goes out of scope here — destructor called
    cout << "--- end of main ---\n";
    return 0;  // d1 goes out of scope — destructor called
}
```

Output:
```
Rex created
Max created
Max destroyed
--- end of main ---
Rex destroyed
```

Note: objects are destroyed in reverse order of creation (LIFO — last in, first out).

---

## Resource Management: Why Destructors Matter

The destructor is where you release resources — heap memory, file handles, network connections, locks:

```cpp
class FileWriter {
    FILE* file;
public:
    FileWriter(const char* filename) {
        file = fopen(filename, "w");
        if (!file) throw runtime_error("Cannot open file");
    }

    void write(const char* text) {
        fputs(text, file);
    }

    ~FileWriter() {
        if (file) {
            fclose(file);   // Always closed — even if an exception is thrown
            file = nullptr;
        }
    }
};

void saveData() {
    FileWriter fw("output.txt");  // File opened
    fw.write("Hello, world!");
    // fw goes out of scope here — file closed automatically
}
```

This pattern — acquiring a resource in the constructor and releasing it in the destructor — is called **RAII** (Resource Acquisition Is Initialization). It's how `std::vector`, `std::string`, and smart pointers work.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Copy Constructor

Called when an object is created from another object of the same type:

```cpp
class Box {
public:
    int* data;
    int size;

    Box(int n) : size(n), data(new int[n]) {
        cout << "Constructed\n";
    }

    // Copy constructor: deep copy
    Box(const Box& other) : size(other.size), data(new int[other.size]) {
        for (int i = 0; i < size; i++) data[i] = other.data[i];
        cout << "Copy constructed\n";
    }

    ~Box() {
        delete[] data;
        cout << "Destroyed\n";
    }
};

Box b1(5);         // Constructor
Box b2 = b1;       // Copy constructor
Box b3(b1);        // Also copy constructor
```

If you don't define a copy constructor, the compiler generates one that copies member-by-member (a "shallow copy"). For classes that own heap memory, shallow copy is dangerous — both objects point to the same memory, so one destructor frees what the other still uses.

---

## Constructor Delegation (C++11)

One constructor can call another constructor of the same class:

```cpp
class Timer {
    int hours, minutes, seconds;
public:
    Timer(int h, int m, int s) : hours(h), minutes(m), seconds(s) {}
    Timer(int totalSeconds) : Timer(totalSeconds/3600, (totalSeconds%3600)/60, totalSeconds%60) {}
    Timer() : Timer(0) {}  // Delegates to the int constructor
};

Timer t1(1, 30, 0);  // 1:30:00
Timer t2(5400);      // Also 1:30:00
Timer t3;            // 0:00:00
```

---

## Quick Reference

| Constructor type | When called |
|-----------------|-------------|
| Default | `MyClass obj;` |
| Parameterized | `MyClass obj(args);` |
| Copy | `MyClass b = a;` or `MyClass b(a);` |
| Move (C++11) | `MyClass b = std::move(a);` |

| Destructor | When called |
|------------|-------------|
| `~MyClass()` | Object goes out of scope, `delete` is called, program ends |

---

## Related Articles

- [C++ Classes and Objects](/posts/cpp-classes-and-objects/) — classes, members, and access control
- [OOP in C++](/posts/oop-in-cpp/) — inheritance and constructor chaining
- [C++ Stack vs Heap](/posts/cpp-stack-vs-heap/) — when constructors and destructors run
- [Smart Pointers in C++](/posts/smart-pointers-cpp/) — RAII applied to memory management

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
