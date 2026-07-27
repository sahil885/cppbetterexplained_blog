---
title: "C++ Structs Explained: How to Use struct with Examples"
description: "Learn how C++ structs work with clear examples. Covers struct syntax, member access, nested structs, arrays of structs, and struct vs class."
pubDatetime: 2026-04-28T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "tutorial", "structs", "basics"]
draft: false
featured: false
faqSchema:
  - question: "What is a struct in C++?"
    answer: "A struct in C++ is a user-defined type that groups related variables of different types under one name. For example, a Student struct might contain a name (string), age (int), and grade (double) as a single unit. Structs are like classes but with public members by default."
  - question: "What is the difference between struct and class in C++?"
    answer: "The only technical difference between struct and class in C++ is the default access level: struct members are public by default, class members are private by default. By convention, structs are used for simple data containers without complex behaviour, while classes are used for objects with methods and encapsulation."
  - question: "How do you access struct members in C++?"
    answer: "Use the dot operator (.) to access struct members on a variable: student.name, student.age. When you have a pointer to a struct, use the arrow operator (->) instead: studentPtr->name. These are equivalent to (*studentPtr).name."
  - question: "Can a struct have functions in C++?"
    answer: "Yes. In C++, structs can have member functions, constructors, and even inheritance — just like classes. The only difference from class is the default access specifier. In practice, structs with functions are sometimes used for simple value types in modern C++."
---

# C++ Structs Explained: How to Use struct with Examples

Before you learn classes, you should understand structs. A struct lets you group related data together into a single named type — and in C++, structs are more powerful than you might expect.

This article covers how structs work, how to use them, and how they relate to classes.

---

## What Is a Struct?

A struct (short for structure) is a user-defined type that bundles multiple variables together. Instead of managing separate variables for a student's name, age, and grade, you can group them into one `Student` struct.

```cpp
struct Student {
    string name;
    int age;
    double grade;
};
```

This defines a new type called `Student`. You can then create variables of that type:

```cpp
Student s1;
s1.name  = "Alice";
s1.age   = 20;
s1.grade = 92.5;
```

---

## Declaring and Initialising Structs

### Basic Declaration

```cpp
#include <iostream>
#include <string>
using namespace std;

struct Student {
    string name;
    int age;
    double grade;
};

int main() {
    Student s1;
    s1.name  = "Alice";
    s1.age   = 20;
    s1.grade = 92.5;

    cout << s1.name << " aged " << s1.age
         << " with grade " << s1.grade << endl;

    return 0;
}
```

**Output:**
```
Alice aged 20 with grade 92.5
```

### Aggregate Initialisation (Cleaner Syntax)

You can initialise all members at once using braces, in the order they are declared:

```cpp
Student s1 = {"Alice", 20, 92.5};
Student s2 = {"Bob", 22, 85.0};
```

Or with designated initialisers (C++20):

```cpp
Student s1 = {.name = "Alice", .age = 20, .grade = 92.5};
```

---

## Accessing Members with the Dot Operator

Use the `.` operator to access and modify struct members:

```cpp
Student s;
s.name = "Charlie";
s.age = 19;

cout << s.name << endl;  // Charlie
s.age++;                 // Increment age
cout << s.age << endl;   // 20
```

---

## Structs as Function Parameters

Pass structs to functions the same way as any other type. Use const reference to avoid copying:

```cpp
void printStudent(const Student& s) {
    cout << "Name: " << s.name << endl;
    cout << "Age:  " << s.age  << endl;
    cout << "Grade:" << s.grade << endl;
}

int main() {
    Student s1 = {"Alice", 20, 92.5};
    printStudent(s1);
    return 0;
}
```

---

## Arrays of Structs

You can create arrays (or vectors) of structs to store multiple records:

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

struct Student {
    string name;
    int age;
    double grade;
};

int main() {
    vector<Student> students = {
        {"Alice",   20, 92.5},
        {"Bob",     22, 85.0},
        {"Charlie", 19, 78.3}
    };

    for (const Student& s : students) {
        cout << s.name << ": " << s.grade << endl;
    }

    return 0;
}
```

**Output:**
```
Alice: 92.5
Bob: 85
Charlie: 78.3
```

---

## Structs with Member Functions

In C++, structs can have member functions — unlike in C:

```cpp
struct Rectangle {
    double width;
    double height;

    double area() {
        return width * height;
    }

    double perimeter() {
        return 2 * (width + height);
    }
};

int main() {
    Rectangle r = {5.0, 3.0};
    cout << "Area: "      << r.area()      << endl; // 15
    cout << "Perimeter: " << r.perimeter() << endl; // 16
    return 0;
}
```

---

## Nested Structs

Structs can contain other structs:

```cpp
struct Address {
    string street;
    string city;
    string country;
};

struct Person {
    string name;
    int age;
    Address address;  // Nested struct
};

int main() {
    Person p;
    p.name            = "Alice";
    p.age             = 30;
    p.address.street  = "123 Main St";
    p.address.city    = "Sydney";
    p.address.country = "Australia";

    cout << p.name << " lives in " << p.address.city << endl;
    return 0;
}
```

---

## Pointer to a Struct — The Arrow Operator

When you have a pointer to a struct, use `->` instead of `.` to access members:

```cpp
Student s = {"Alice", 20, 92.5};
Student* ptr = &s;

// These are equivalent:
cout << ptr->name  << endl;  // Arrow operator (cleaner)
cout << (*ptr).name << endl; // Dereference then dot
```

The arrow operator `->` is shorthand for dereference + dot. You will see it constantly when working with dynamically allocated objects or linked lists.

---

## Struct vs Class: What Is the Difference?

| Feature | struct | class |
|---------|--------|-------|
| Default access | `public` | `private` |
| Can have methods | ✅ Yes | ✅ Yes |
| Can have constructors | ✅ Yes | ✅ Yes |
| Can inherit | ✅ Yes | ✅ Yes |
| Convention | Simple data containers | Objects with behaviour |

In practice, use struct when you are grouping plain data (like a Point, a Colour, or a Config), and use class when you have behaviour, invariants, and encapsulation to protect.

---

## Practical Example: Simple Contact Book

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

struct Contact {
    string name;
    string phone;
    string email;
};

void printContact(const Contact& c) {
    cout << "Name:  " << c.name  << endl;
    cout << "Phone: " << c.phone << endl;
    cout << "Email: " << c.email << endl;
    cout << "---" << endl;
}

int main() {
    vector<Contact> contacts = {
        {"Alice Smith",  "0400-111-222", "alice@email.com"},
        {"Bob Jones",    "0400-333-444", "bob@email.com"},
        {"Charlie Brown","0400-555-666", "charlie@email.com"}
    };

    for (const Contact& c : contacts) {
        printContact(c);
    }

    return 0;
}
```

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles
- [Object-Oriented Programming in C++: Classes & Objects](/posts/oop-in-cpp/) — the natural step up from structs, introducing encapsulation and access control.
- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — the building blocks you group together inside structs.
- [C++ Vector Tutorial: Complete Guide to std::vector](/posts/cpp-vector-tutorial/) — use vectors to store collections of structs.
- [How to Use Pointers in C++](/posts/pointers-in-cpp/) — understand the arrow operator and pointer-to-struct patterns.
- [C++ Pass by Value, Reference & Pointer: Complete Guide](/posts/cpp-pass-by-value-reference/) — learn the best way to pass structs to functions.
- [C++ Cheat Sheet: Quick Reference for Syntax, STL, and OOP](/posts/cpp-cheat-sheet/) — quick reference for struct syntax alongside classes and OOP.
