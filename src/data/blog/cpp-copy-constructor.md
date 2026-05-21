---
title: "C++ Copy Constructor: Deep Copy vs Shallow Copy Explained"
description: "Understand C++ copy constructors, the difference between deep and shallow copy, the rule of three, and when to write your own. Clear examples for beginners."
pubDatetime: 2026-05-21T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "OOP", "tutorial"]
faqSchema:
  - question: "What is a copy constructor in C++?"
    answer: "A copy constructor is a special constructor that creates a new object as a copy of an existing one. It's called when you initialize an object from another object of the same type, pass an object by value, or return an object from a function."
  - question: "What is the difference between shallow copy and deep copy in C++?"
    answer: "A shallow copy duplicates the object's data members directly — if one of those members is a pointer, both copies point to the same memory. A deep copy allocates new memory and copies the pointed-to data, so each object owns its own independent copy."
  - question: "When do I need to write my own copy constructor in C++?"
    answer: "You need a custom copy constructor whenever your class manages a resource directly — like a raw pointer to heap memory, a file handle, or a network connection. If your class only has value-type members (int, string, vector), the compiler-generated copy constructor is usually correct."
draft: false
featured: false
---

# C++ Copy Constructor: Deep Copy vs Shallow Copy Explained

When you write `MyClass b = a;` in C++, what exactly happens? The copy constructor is called — it's a special constructor whose job is to create a new object that's a copy of an existing one. Most of the time the compiler generates one for you, but when your class manages raw memory, you need to write your own or risk some very subtle bugs.

---

## The Default Copy Constructor

If you don't define a copy constructor, the compiler generates one that does a **member-wise copy**: it copies each data member one by one.

```cpp
#include <iostream>
#include <string>

class Book {
public:
    std::string title;
    int pages;

    Book(std::string t, int p) : title(t), pages(p) {}
};

int main() {
    Book original("Clean Code", 431);
    Book copy = original;  // compiler-generated copy constructor

    std::cout << copy.title << " (" << copy.pages << " pages)\n";
    return 0;
}
```

This works perfectly because `std::string` and `int` both copy correctly. The problem appears when your class holds raw pointers.

---

## The Shallow Copy Problem

Here's a class that stores a name on the heap using a raw pointer:

```cpp
#include <iostream>
#include <cstring>

class Player {
public:
    char* name;

    Player(const char* n) {
        name = new char[strlen(n) + 1];
        strcpy(name, n);
    }

    ~Player() {
        delete[] name;
    }
};

int main() {
    Player p1("Alice");
    Player p2 = p1;  // shallow copy — both point to SAME memory!

    // When main() ends, ~Player() is called for both p1 and p2
    // Both try to delete[] the same memory — double free crash!
    return 0;
}
```

The compiler copies the `name` pointer — the address — not the data it points to. Now `p1.name` and `p2.name` point to the same block of heap memory. When either object is destroyed, the memory is freed; when the second destructor runs, it tries to free already-freed memory. This is undefined behaviour and often causes a crash.

---

## Writing a Deep Copy Constructor

A deep copy allocates new memory and copies the contents:

```cpp
#include <iostream>
#include <cstring>

class Player {
public:
    char* name;

    // Regular constructor
    Player(const char* n) {
        name = new char[strlen(n) + 1];
        strcpy(name, n);
    }

    // Copy constructor — deep copy
    Player(const Player& other) {
        name = new char[strlen(other.name) + 1];
        strcpy(name, other.name);
        std::cout << "Copy constructor called\n";
    }

    // Destructor
    ~Player() {
        delete[] name;
    }

    void printName() const {
        std::cout << "Name: " << name << "\n";
    }
};

int main() {
    Player p1("Alice");
    Player p2 = p1;  // calls our copy constructor

    p1.printName();  // Alice
    p2.printName();  // Alice — independent copy

    // Safely modify p2 without affecting p1
    strcpy(p2.name, "Bob");
    p1.printName();  // Still Alice
    p2.printName();  // Bob

    return 0;
}
```

Now each `Player` owns its own allocation. The two objects are completely independent.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Rule of Three

If your class needs a custom copy constructor, it almost certainly also needs a custom **destructor** and **copy assignment operator**. This is known as the Rule of Three:

```cpp
class Player {
public:
    char* name;

    // 1. Constructor
    Player(const char* n) {
        name = new char[strlen(n) + 1];
        strcpy(name, n);
    }

    // 2. Copy constructor (deep copy)
    Player(const Player& other) {
        name = new char[strlen(other.name) + 1];
        strcpy(name, other.name);
    }

    // 3. Copy assignment operator (deep copy)
    Player& operator=(const Player& other) {
        if (this == &other) return *this;  // handle self-assignment
        delete[] name;
        name = new char[strlen(other.name) + 1];
        strcpy(name, other.name);
        return *this;
    }

    // 4. Destructor
    ~Player() {
        delete[] name;
    }
};
```

The copy assignment operator handles `p1 = p2;` (when both already exist), while the copy constructor handles `Player p2 = p1;` (creation from copy).

---

## The Modern Solution: Use std::string or std::vector

In practice, you can avoid writing copy constructors entirely by using standard library types that already handle memory correctly:

```cpp
#include <iostream>
#include <string>

class Player {
public:
    std::string name;  // std::string manages its own memory

    Player(std::string n) : name(std::move(n)) {}
};

int main() {
    Player p1("Alice");
    Player p2 = p1;  // compiler-generated copy just works!

    std::cout << p1.name << "\n";  // Alice
    std::cout << p2.name << "\n";  // Alice — independent copy
    return 0;
}
```

`std::string` has its own correct copy constructor, so the compiler-generated copy constructor for `Player` does the right thing automatically.

---

## Related Articles

- [C++ Classes and Objects: A Beginner's Guide to OOP](/posts/cpp-classes-and-objects/)
- [Memory Management in C++: Heap vs Stack, new/delete, and Memory Leaks](/posts/memory-management-cpp/)
- [Smart Pointers in Modern C++: unique_ptr, shared_ptr, and weak_ptr](/posts/smart-pointers-cpp/)
- [C++ Move Semantics Explained: rvalue References, std::move, and Performance](/posts/cpp-move-semantics/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
