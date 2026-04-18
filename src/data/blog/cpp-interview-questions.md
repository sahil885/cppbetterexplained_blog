---
title: "Top 50 C++ Interview Questions and Answers (Beginner to Advanced)"
description: "Prepare for your C++ technical interview with 50 real questions and detailed answers covering fundamentals, OOP, memory, STL, and advanced topics."
pubDatetime: 2025-04-05T00:00:00Z
author: "Sahil"
tags: ["C++", "interview", "career", "OOP", "STL", "advanced"]
draft: false
featured: true
faqSchema:
  - question: "What are the basic data types in C++?"
    answer: "C++ has built-in types including: char (1 byte), short (2 bytes), int (4 bytes), long long (8 bytes), float (4 bytes), double (8 bytes), and bool (1 byte). Use sizeof(type) to verify sizes on your specific platform."
  - question: "What is the difference between const and constexpr in C++?"
    answer: "const creates a runtime constant — the value can't be changed but may be determined at runtime. constexpr creates a compile-time constant — the value must be known at compile time and can be used in template parameters and array sizes."
  - question: "What is a class in C++ and how does it differ from a struct?"
    answer: "A class is a blueprint for creating objects that bundles data (member variables) and functions (methods) together. The key difference from struct is default access: class members are private by default, while struct members are public by default."
  - question: "What are constructors and destructors in C++?"
    answer: "A constructor is called automatically when an object is created — it initializes member variables. A destructor is called when the object is destroyed — it cleans up resources. Destructors are especially important when the class manages dynamic memory."
  - question: "What is polymorphism in C++?"
    answer: "Polymorphism means 'many forms'. Compile-time polymorphism (function overloading, templates) is resolved at compile time. Runtime polymorphism (virtual functions) lets a base class pointer call the correct derived class method at runtime via the vtable mechanism."
  - question: "What are virtual functions in C++ and why do we need them?"
    answer: "A virtual function is declared with the 'virtual' keyword and enables runtime polymorphism. When called through a base class pointer or reference, a virtual function dispatches to the most-derived override. Without virtual, the base class version is always called — this is known as static dispatch."
  - question: "What is a memory leak in C++ and how do you prevent it?"
    answer: "A memory leak occurs when heap memory is allocated with 'new' but never freed with 'delete', causing the program to gradually consume more memory. Prevention: use smart pointers (unique_ptr, shared_ptr), follow RAII, and always pair every 'new' with a 'delete' in manual memory management."
  - question: "What are smart pointers in C++? Name the types."
    answer: "Smart pointers automatically manage heap memory using RAII. The three main types are: unique_ptr (exclusive ownership, automatically deletes on scope exit), shared_ptr (shared ownership with reference counting), and weak_ptr (non-owning observer that breaks circular references)."
  - question: "What is RAII in C++?"
    answer: "RAII (Resource Acquisition Is Initialization) is an idiom where resources (memory, file handles, locks) are tied to object lifetimes. Resources are acquired in the constructor and released in the destructor. This ensures cleanup happens automatically even when exceptions are thrown."
  - question: "What is the Standard Template Library (STL) in C++?"
    answer: "The STL is a collection of generic data structures and algorithms in the C++ standard library. Key components: containers (vector, list, map, set, unordered_map), iterators (for traversing containers), and algorithms (sort, find, transform). The STL uses templates to work with any data type."
  - question: "What is the difference between stack and heap memory in C++?"
    answer: "Stack memory is automatically managed, fast, and limited in size. Variables on the stack are created/destroyed as functions are called/returned. Heap memory is manually managed (using new/delete or smart pointers), larger, but slower. Heap allocations persist until explicitly freed."
  - question: "What is inheritance in C++ and what are its types?"
    answer: "Inheritance lets a class (derived) acquire properties and methods from another class (base). Types: public inheritance (is-a relationship, base public/protected members keep their access), protected inheritance (external access becomes protected), and private inheritance (all base members become private in derived)."
  - question: "What is function overloading in C++?"
    answer: "Function overloading allows multiple functions with the same name but different parameter lists (different types, number, or order of parameters). The compiler selects the correct version based on the arguments at the call site. Return type alone is not sufficient to overload a function."
  - question: "What are C++ templates and how do they work?"
    answer: "Templates enable generic programming by letting you write code that works with any data type. Function templates generate a function for each type it's called with. Class templates create a class for each type. The STL is built entirely on templates. The compiler instantiates templates at compile time."
  - question: "What is the difference between deep copy and shallow copy in C++?"
    answer: "A shallow copy copies the pointer address, so both the original and copy point to the same heap memory — modifying one affects the other and can cause double-free errors. A deep copy allocates new memory and copies the actual data, so each object owns independent memory."
---

# Top 50 C++ Interview Questions and Answers (Beginner to Advanced)

Technical interviews can feel like a gauntlet. You're nervous, the interviewer is watching, and suddenly you can't remember what a virtual function is.

This guide covers 50 real C++ interview questions—the ones you'll actually encounter. Each question includes a clear, concise answer and practical code examples where helpful. Study these, understand the "why" behind each answer, and you'll walk into that interview confident.

## What to Expect in a C++ Technical Interview

C++ interviews typically cover:
1. **Fundamentals** — data types, syntax, scope, compilation
2. **Object-Oriented Programming** — classes, inheritance, polymorphism
3. **Memory Management** — pointers, smart pointers, memory leaks
4. **Standard Library** — STL containers, algorithms, iterators
5. **Advanced Topics** — templates, move semantics, multithreading
6. **Practical Coding** — you'll write code to solve problems

Interviewers are looking for three things:
- Do you understand the language deeply?
- Can you think through problems systematically?
- Can you write clean, correct code?

This list helps with #1. Practice #2 and #3 with LeetCode or HackerRank.

---

## Section 1: Fundamentals (Questions 1–12)

### 1. What are the basic data types in C++, and what are their typical sizes?

C++ has built-in types for different kinds of data. Sizes may vary by platform, but on modern 64-bit systems:

```cpp
char - 1 byte (stores single character)
short - 2 bytes
int - 4 bytes
long - typically 4 bytes (but may be 8 on 64-bit)
long long - 8 bytes
float - 4 bytes (single precision)
double - 8 bytes (double precision)
bool - 1 byte (though only needs 1 bit)
```

Use `sizeof(type)` to check exact sizes on your system. Choose types based on your needs—use `int` for general-purpose integers, `double` for floating-point math, and `bool` for true/false values.

### 2. What's the difference between `int`, `unsigned int`, and `const int`?

`int` stores signed integers (positive and negative): range approximately -2 billion to +2 billion.

`unsigned int` stores only non-negative integers (0 and positive): range 0 to approximately 4 billion. You gain more positive range but lose negative numbers.

`const int` creates an integer that cannot be modified after initialization. The `const` keyword is a promise to the compiler and reader that this value won't change.

```cpp
int x = 5;           // Can be changed
x = 10;              // OK

unsigned int y = 5;
y = 10;              // OK, but y cannot be negative

const int z = 5;
z = 10;              // ERROR: cannot modify const variable
```

### 3. What is scope in C++? Explain local, global, and static scope.

**Scope** determines where in the program a variable is accessible.

**Local scope**: Variables declared inside a function or block are accessible only within that block.

```cpp
void myFunction() {
    int x = 5;  // Local to myFunction
    // x is accessible here
}
// x is NOT accessible here
```

**Global scope**: Variables declared outside all functions are accessible everywhere.

```cpp
int globalVar = 10;  // Global scope

void myFunction() {
    std::cout << globalVar;  // Can access globalVar
}
```

**Static scope**: Gives a variable internal linkage (accessible only in this file) or extends its lifetime to the program's duration.

```cpp
static int counter = 0;  // File-local, not visible to other translation units
```

### 4. What is the difference between `const` and `constexpr`?

Both restrict modification but serve different purposes.

`const` creates a constant whose value is determined at runtime and doesn't change after initialization. The compiler doesn't promise it's compile-time constant.

`constexpr` explicitly declares that a value can be evaluated at compile-time. The compiler evaluates it during compilation if possible, resulting in zero runtime overhead.

```cpp
const int x = getValue();      // Value determined at runtime
constexpr int y = 5 * 10;      // Evaluated at compile-time (y = 50)
```

Use `constexpr` when you want compile-time evaluation for performance.

### 5. Explain the compilation process: source code to executable.

C++ code goes through several stages:

1. **Preprocessing** — The preprocessor handles `#include`, `#define`, and removes comments. Result: modified source code.

2. **Compilation** — The compiler converts the preprocessed code to assembly code, checking syntax and semantics.

3. **Assembly** — The assembler converts assembly to object code (.o or .obj files).

4. **Linking** — The linker combines multiple object files and resolves external references. Creates the final executable.

```
Source.cpp → [Preprocessor] → [Compiler] → [Assembler] → .obj
                                                           ↓
                                                    [Linker] → a.exe
Library.obj → (fed into linker)
```

Understanding this helps debug linking errors and understanding why circular includes cause problems.

### 6. What is the difference between declaration and definition?

A **declaration** tells the compiler that a name exists and what type it is. It allocates no memory for variables.

A **definition** is a declaration that allocates memory and, for variables, may assign initial values.

```cpp
extern int x;           // Declaration (extern keyword says "defined elsewhere")
int x = 5;              // Definition

void foo();             // Declaration (function declaration, no body)
void foo() { }          // Definition (includes the body)
```

For variables, you can declare multiple times but define only once. This is why header files use `extern` for global variables.

### 7. What is a header file, and why do we use `#include`?

A header file (.h or .hpp) contains declarations (function prototypes, class definitions, constants). The `#include` directive pastes the entire header into your source file.

```cpp
// mylib.h
#ifndef MYLIB_H
#define MYLIB_H

void greet(std::string name);

#endif
```

```cpp
// main.cpp
#include "mylib.h"  // Include declarations

int main() {
    greet("Alice");  // Compiler knows greet() exists and its signature
}
```

**Why?** Separation of interface and implementation. Multiple source files can use the same library without rewriting declarations. The `#ifndef` guard prevents multiple inclusion.

### 8. What are preprocessor directives? Give examples.

Preprocessor directives start with `#` and are processed before compilation.

```cpp
#include <iostream>           // Include standard library header
#include "myheader.h"         // Include local header

#define MAX 100              // Define a macro (text replacement)
#define SQUARE(x) ((x)*(x))  // Macro with arguments

#ifdef DEBUG                 // Conditional compilation
    std::cout << "Debug mode\n";
#endif

#pragma once                 // Prevents multiple inclusion (non-standard but widely supported)
```

### 9. Explain the difference between C and C++.

**C** is a procedural language. It focuses on functions and data structures. No built-in object orientation, no exceptions, simpler memory model.

**C++** extends C with object-oriented features: classes, inheritance, polymorphism, exceptions, templates, standard library containers. C++ is backward compatible with C (mostly).

```cpp
// C approach
struct Point {
    int x, y;
};

void printPoint(Point* p) {
    printf("(%d, %d)\n", p->x, p->y);
}
```

```cpp
// C++ approach (using OOP)
class Point {
public:
    void print() const {
        std::cout << "(" << x << ", " << y << ")\n";
    }
private:
    int x, y;
};
```

### 10. What is the `main()` function? Why must every program have one?

`main()` is the entry point of a C++ program. When you run an executable, the operating system calls `main()`.

```cpp
int main() {
    // Program code
    return 0;  // Return 0 to indicate success
}
```

The return value tells the operating system if the program succeeded (0) or failed (non-zero). Every program needs `main()` because without it, the OS doesn't know where to start execution.

### 11. What are the access modifiers in C++?

Access modifiers control visibility: `public`, `private`, `protected`.

- **public**: Accessible from anywhere
- **private**: Accessible only from within the class
- **protected**: Accessible from within the class and derived classes

```cpp
class MyClass {
public:
    int publicVar;      // Accessible everywhere

private:
    int privateVar;     // Only within MyClass

protected:
    int protectedVar;   // Within MyClass and derived classes
};
```

Default access in a class is `private`; in a struct, it's `public`.

### 12. What is a namespace? Why use them?

A namespace is a named scope for organizing code. It prevents naming conflicts and organizes related functionality.

```cpp
namespace math {
    int add(int a, int b) { return a + b; }
}

namespace string_utils {
    std::string add(std::string a, std::string b) { return a + b; }
}

int main() {
    math::add(2, 3);           // Calls math::add
    string_utils::add("a", "b"); // Calls string_utils::add
}
```

The `std::` namespace contains all standard library components. Use namespaces to organize your code and avoid conflicts in large projects.

---

> **Want all 50 answers explained with depth and examples?** The [C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page) covers every question on this list — plus practice problems and tips for explaining your thinking to interviewers. **Just $19.** 👉 [Get the Ebook](https://start.cppbetterexplained.com/tw-sales-page)

---

## Section 2: Object-Oriented Programming (Questions 13–24)

### 13. What is a class? How does it differ from a struct?

A class is a blueprint for creating objects. It bundles data (member variables) and functions (methods) together.

```cpp
class Dog {
private:
    std::string name;
    int age;

public:
    void bark() { std::cout << "Woof!\n"; }
};
```

The only difference between `class` and `struct` in C++ is default access: classes default to `private`, structs to `public`. Functionally, they're identical. Use `class` for objects with behavior; use `struct` for simple data containers.

### 14. What are constructors and destructors?

A **constructor** is called when an object is created. It initializes member variables and allocates resources.

A **destructor** is called when an object is destroyed. It cleans up resources (especially important for dynamic memory).

```cpp
class Dog {
public:
    Dog(std::string name) : name(name) {  // Constructor
        std::cout << "Dog " << name << " created\n";
    }

    ~Dog() {  // Destructor
        std::cout << "Dog destroyed\n";
    }

private:
    std::string name;
};
```

The constructor uses member initializer list (`: name(name)`) to initialize members. Destructors are crucial for managing resources (RAII principle).

### 15. What is an initializer list? Why use it?

An initializer list (`: member1(value1), member2(value2)`) initializes member variables directly, avoiding unnecessary temporary objects.

```cpp
class Point {
public:
    Point(int x, int y) : x(x), y(y) { }  // Initializer list

private:
    int x, y;
};
```

Without the initializer list, members would be default-initialized first, then assigned. For complex types (like `std::string`), this creates temporary objects, wasting time. Initializer lists are more efficient and required for `const` and reference members.

### 16. What is inheritance? Give an example.

Inheritance allows a class (derived) to inherit properties and methods from another class (base). It enables code reuse and hierarchy.

```cpp
class Animal {  // Base class
public:
    virtual void speak() { std::cout << "Some sound\n"; }
};

class Dog : public Animal {  // Derived class
public:
    void speak() override { std::cout << "Woof!\n"; }  // Override
};
```

`Dog` inherits from `Animal`, meaning `Dog` has all of `Animal`'s public members and can override methods. The `public` keyword specifies inheritance type: `public` inheritance means "is-a" relationship.

### 17. What is the difference between public, private, and protected inheritance?

- **public inheritance**: Base class's public members remain public in derived class. Creates "is-a" relationship. This is the most common.
- **private inheritance**: Base class's public members become private in derived class. Used rarely, for "implemented in terms of."
- **protected inheritance**: Base class's public members become protected in derived class. Used for intermediate base classes.

```cpp
class Base { };

class DerivedPublic : public Base { };     // is-a
class DerivedPrivate : private Base { };   // implemented in terms of
class DerivedProtected : protected Base { }; // for internal hierarchies
```

Most of the time, use `public` inheritance.

### 18. What is polymorphism? Explain compile-time vs. runtime polymorphism.

**Polymorphism** means "many forms." A single interface can work with multiple types.

**Compile-time polymorphism** (static): The compiler determines which function to call. Example: function overloading and templates.

```cpp
void print(int x) { std::cout << x << "\n"; }
void print(std::string s) { std::cout << s << "\n"; }

print(5);      // Calls print(int)
print("hello"); // Calls print(std::string)
```

**Runtime polymorphism** (dynamic): Determined at runtime using virtual functions and inheritance.

```cpp
class Animal { public: virtual void speak() { } };
class Dog : public Animal { public: void speak() override { std::cout << "Woof\n"; } };

Animal* a = new Dog();
a->speak();  // Calls Dog::speak() at runtime
```

Use runtime polymorphism when behavior depends on object type. Use compile-time for flexibility without performance overhead.

### 19. What are virtual functions? Why do we need them?

A **virtual function** is a function that can be overridden by derived classes. The actual function called is determined at runtime based on the object's actual type, not the pointer type.

```cpp
class Animal {
public:
    virtual void speak() { std::cout << "Some sound\n"; }
};

class Dog : public Animal {
public:
    void speak() override { std::cout << "Woof\n"; }
};

int main() {
    Animal* a = new Dog();
    a->speak();  // Calls Dog::speak(), not Animal::speak()
}
```

Without `virtual`, calling a function through a base class pointer would call the base class version. Virtual functions enable polymorphic behavior: the same interface handles multiple types correctly.

### 20. What is a pure virtual function? What is an abstract class?

A **pure virtual function** has no implementation in the base class. It's declared with `= 0`.

```cpp
class Shape {
public:
    virtual void draw() = 0;  // Pure virtual: must be overridden
};
```

An **abstract class** contains at least one pure virtual function. You cannot instantiate an abstract class; you can only derive from it. The derived class must implement all pure virtual functions to become concrete.

```cpp
class Shape { public: virtual void draw() = 0; };  // Abstract
class Circle : public Shape { public: void draw() override { } };  // Concrete

Shape s;        // ERROR: cannot instantiate abstract class
Circle c;       // OK
```

Abstract classes define interfaces and force derived classes to implement specific behavior.

### 21. What is the difference between overloading and overriding?

**Overloading** (compile-time): Multiple functions with the same name but different parameters.

```cpp
void print(int x);
void print(std::string s);
void print(double d);
```

**Overriding** (runtime): A derived class provides a different implementation of a base class's virtual function.

```cpp
class Base { public: virtual void foo() { } };
class Derived : public Base { public: void foo() override { } };
```

Overloading is resolved at compile time based on argument types. Overriding is resolved at runtime based on the actual object type.

### 22. What is the `this` pointer?

`this` is a pointer to the current object. It allows a member function to refer to the object it's operating on and is implicitly available in all member functions.

```cpp
class Dog {
public:
    void setName(std::string name) {
        this->name = name;  // "this->name" is the member variable
    }

    Dog& getSelf() {
        return *this;  // Return reference to self
    }

private:
    std::string name;
};
```

It's useful for returning a reference to the current object (for chaining) or explicitly indicating you're accessing a member variable.

### 23. What are static members?

A **static member variable** is shared by all instances of the class. There's only one copy, no matter how many objects you create.

A **static member function** can access only static members and doesn't operate on a specific object.

```cpp
class Counter {
public:
    static void increment() { count++; }
    static int getCount() { return count; }

private:
    static int count;  // Shared by all Counter objects
};

int Counter::count = 0;  // Define and initialize static member

Counter c1, c2;
c1.increment();
c2.increment();
std::cout << Counter::getCount();  // Prints 2
```

Static members are useful for tracking global state or providing utility functions.

### 24. What is the difference between composition and inheritance?

**Inheritance** is an "is-a" relationship: `Dog is-a Animal`.

**Composition** is a "has-a" relationship: `Car has-a Engine`.

```cpp
// Inheritance (is-a)
class Animal { };
class Dog : public Animal { };

// Composition (has-a)
class Engine { };
class Car {
private:
    Engine engine;  // Car has-an Engine
};
```

Composition is often preferred over inheritance for flexibility. You can change components without inheritance hierarchy constraints. Inheritance should represent true "is-a" relationships; use composition for most other cases.

---

> **Preparing for an interview this week?** The [C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page) walks through all 50 questions with full explanations and coding examples — perfect for a last-minute deep dive. **$19.** 👉 [Grab it here](https://start.cppbetterexplained.com/tw-sales-page)

---

## Section 3: Memory Management (Questions 25–33)

### 25. Explain stack vs. heap memory.

**Stack**: Fast, automatic memory management. Variables have limited lifetime (function scope). Size is limited. Allocations are free (instant).

**Heap**: Slower, manual memory management (in raw C++). Large size. Allocations require explicit `new`, deallocation requires `delete`. Memory persists until freed.

```cpp
void myFunction() {
    int x = 5;          // Stack: automatically freed when myFunction returns
    int* p = new int(5); // Heap: must be freed with delete
    delete p;           // Clean up heap memory
}
```

Stack is appropriate for local variables with known sizes. Heap is for dynamic allocation or large objects.

### 26. What are the `new` and `delete` operators? How do they differ from `malloc` and `free`?

`new` and `delete` are C++ operators for dynamic memory allocation. They call constructors and destructors.

`malloc` and `free` are C-style memory allocation. They allocate raw memory without calling constructors/destructors.

```cpp
// C++ style (preferred)
MyClass* obj = new MyClass();  // Calls constructor
delete obj;                     // Calls destructor

// C style (avoid in C++)
MyClass* obj = (MyClass*)malloc(sizeof(MyClass));  // No constructor
free(obj);  // No destructor
```

Always use `new`/`delete` in C++ because they handle initialization and cleanup. `malloc`/`free` are dangerous with classes.

### 27. What is a memory leak? How do you prevent it?

A **memory leak** occurs when you allocate memory with `new` but never call `delete`, causing the memory to remain allocated even when no longer needed.

```cpp
void badFunction() {
    int* p = new int(5);
    // ... code ...
    return;  // LEAK: p is never deleted!
}
```

**Prevention:**
1. Always delete what you new.
2. Use smart pointers (preferred).
3. Use RAII (Resource Acquisition Is Initialization).

```cpp
// Smart pointer approach (preferred)
void goodFunction() {
    std::unique_ptr<int> p(new int(5));
    // ... code ...
    return;  // Automatically deleted
}
```

### 28. What are smart pointers? Name the types.

Smart pointers are objects that act like pointers but manage memory automatically. The main types are:

**`std::unique_ptr`**: Exclusive ownership. Only one unique_ptr can own an object.

```cpp
std::unique_ptr<Dog> d(new Dog());  // d owns the Dog
// Dog is automatically deleted when d goes out of scope
```

**`std::shared_ptr`**: Shared ownership. Multiple shared_ptrs can own the same object. Deleted when the last one goes out of scope.

```cpp
std::shared_ptr<Dog> d1(new Dog());
std::shared_ptr<Dog> d2 = d1;  // Both own the same Dog
// Dog deleted only when both d1 and d2 are gone
```

Prefer `unique_ptr` for simple cases; use `shared_ptr` when multiple owners are needed.

### 29. What is RAII (Resource Acquisition Is Initialization)?

RAII is a design pattern: resources (memory, files, locks) are acquired in the constructor and released in the destructor. As long as the object exists, the resource is valid. When the object is destroyed, the resource is automatically released.

```cpp
class FileHandler {
private:
    FILE* file;

public:
    FileHandler(const char* filename) {
        file = fopen(filename, "r");  // Acquire
    }

    ~FileHandler() {
        if (file) fclose(file);  // Release
    }
};

void processFile() {
    FileHandler fh("myfile.txt");  // File opens
    // ... use file ...
}  // File automatically closes (destructor called)
```

RAII ensures resources are cleaned up even if exceptions occur. It's the foundation of safe C++ programming.

### 30. What is the difference between shallow and deep copy?

A **shallow copy** copies only the pointers, not the data they point to. Multiple objects share the same data.

A **deep copy** copies the data itself, creating independent objects.

```cpp
class MyClass {
public:
    int* data;
    MyClass(int* d) : data(d) { }  // Shallow copy by default
};

int arr[5] = {1, 2, 3, 4, 5};
MyClass obj1(arr);
MyClass obj2 = obj1;  // Shallow copy: both point to the same arr
```

This is problematic because both objects point to the same data. If one modifies it, the other sees the change. Worse, if `arr` is freed, both objects have dangling pointers.

**Solution: Implement a deep copy.**

```cpp
MyClass(const MyClass& other) {  // Copy constructor
    data = new int[5];
    for (int i = 0; i < 5; i++) {
        data[i] = other.data[i];  // Copy the data
    }
}
```

### 31. What are the Rule of Three, Rule of Five, and Rule of Zero?

**Rule of Three**: If you define a destructor, copy constructor, or copy assignment operator, you should define all three.

```cpp
class MyClass {
public:
    ~MyClass() { delete[] data; }
    MyClass(const MyClass& other);           // Copy constructor
    MyClass& operator=(const MyClass& other); // Copy assignment
private:
    int* data;
};
```

**Rule of Five**: Add move constructor and move assignment operator to the three.

```cpp
MyClass(MyClass&& other) noexcept;  // Move constructor
MyClass& operator=(MyClass&& other) noexcept;  // Move assignment
```

**Rule of Zero**: Don't define any of them. Use standard containers and smart pointers instead. Let the compiler generate defaults.

Modern C++ favors the Rule of Zero: use `std::vector`, `std::unique_ptr`, and let the standard library handle memory.

### 32. What are memory addresses and how do you view them?

A memory address is a location in RAM, typically displayed in hexadecimal (e.g., `0x7fff5fbff8c0`). Use the `&` operator to get an address and `cout` to view it.

```cpp
int x = 5;
std::cout << &x << std::endl;  // Prints memory address of x
std::cout << std::hex << &x << std::endl;  // Hexadecimal format
```

Addresses are useful for understanding pointer behavior and debugging. The `&` operator shows where a variable is stored.

### 33. What is a dangling pointer? When does it occur?

A **dangling pointer** points to memory that has been freed. Dereferencing it causes undefined behavior (crash or corruption).

```cpp
int* createPointer() {
    int x = 5;
    return &x;  // DANGER: returning pointer to local variable
}

int main() {
    int* p = createPointer();
    std::cout << *p;  // CRASH: p points to freed memory
}
```

The local variable `x` is destroyed when `createPointer()` returns, but the pointer still points to that location.

**Prevention:**
1. Don't return pointers to local variables.
2. Check for null pointers before dereferencing.
3. Use smart pointers (they prevent this).

---

## Section 4: STL & Templates (Questions 34–41)

### 34. What is the Standard Template Library (STL)?

The STL is a library of templates providing containers, algorithms, and iterators. It's a core part of modern C++. Main components:

- **Containers**: `vector`, `map`, `set`, `queue`, `stack`, `list`
- **Algorithms**: `sort`, `find`, `copy`, `transform`
- **Iterators**: Objects that iterate through containers

```cpp
std::vector<int> v = {3, 1, 4, 1, 5};
std::sort(v.begin(), v.end());  // Sort the vector
for (int num : v) {
    std::cout << num << " ";  // Print sorted elements
}
```

The STL eliminates the need to write basic data structures. It's optimized and well-tested.

### 35. What is a `std::vector`? How is it different from an array?

A `std::vector` is a dynamic array. Unlike C++ arrays, vectors can grow and shrink at runtime.

```cpp
std::vector<int> v;  // Empty vector
v.push_back(5);      // Add element
v.push_back(10);
std::cout << v.size();  // Size is 2
std::cout << v[0];      // Access like array
```

Arrays are fixed-size and allocated on the stack (for small sizes) or manually on the heap. Vectors handle memory for you and provide useful methods like `push_back`, `pop_back`, `size`.

**Always use `std::vector` instead of raw arrays** in modern C++.

### 36. What are `std::map` and `std::set`? How do they differ?

**`std::map`** is a key-value container. Keys are unique; values can be duplicated. Ordered by key.

**`std::set`** stores unique values. No key-value pairs. Ordered.

```cpp
std::map<std::string, int> ages;
ages["Alice"] = 30;
ages["Bob"] = 25;
std::cout << ages["Alice"];  // Prints 30

std::set<int> numbers = {5, 2, 8, 2};  // {2, 5, 8}—no duplicates
for (int n : numbers) {
    std::cout << n << " ";  // Prints in sorted order
}
```

Both are ordered containers (implemented as balanced trees). Use `map` for key-value data; use `set` for unique values.

### 37. What are iterators? Name the types.

An **iterator** is an object that points to elements in a container, similar to a pointer. It enables algorithm-container interaction.

Types (from weakest to strongest):
1. **Input iterator**: Read-only, forward-only
2. **Output iterator**: Write-only, forward-only
3. **Forward iterator**: Read/write, forward-only (e.g., `std::forward_list`)
4. **Bidirectional iterator**: Read/write, forward and backward (e.g., `std::list`, `std::map`)
5. **Random-access iterator**: Full pointer semantics (e.g., `std::vector`, `std::array`)

```cpp
std::vector<int> v = {1, 2, 3};
std::vector<int>::iterator it = v.begin();
std::cout << *it;  // Prints 1
++it;
std::cout << *it;  // Prints 2
it += 2;  // Random access
```

Iterators enable writing algorithms that work with any container.

### 38. What is the difference between `begin()` and `front()`?

`begin()` returns an **iterator** to the first element. You must dereference it to access the value.

`front()` returns a **reference** to the first element directly.

```cpp
std::vector<int> v = {5, 10, 15};
std::cout << *v.begin();  // Prints 5 (iterator, must dereference)
std::cout << v.front();   // Prints 5 (direct reference)
```

Use `front()` when you want the value; use `begin()` when you want an iterator for algorithms.

### 39. What are templates? Explain function templates and class templates.

A **template** is a blueprint for generating code based on type parameters. It allows writing generic code that works with any type.

**Function template:**

```cpp
template <typename T>
T max(T a, T b) {
    return a > b ? a : b;
}

std::cout << max(5, 10);  // Works with int
std::cout << max(3.5, 2.1);  // Works with double
```

**Class template:**

```cpp
template <typename T>
class Container {
public:
    void add(T item) { items.push_back(item); }
private:
    std::vector<T> items;
};

Container<int> intContainer;
Container<std::string> stringContainer;
```

Templates enable writing once, using many times. The compiler generates type-specific versions as needed.

### 40. What is template specialization?

**Template specialization** allows providing custom implementations for specific types.

```cpp
template <typename T>
void print(T value) {
    std::cout << "Generic: " << value << "\n";
}

// Specialization for std::string
template <>
void print<std::string>(std::string value) {
    std::cout << "String: [" << value << "]\n";
}

print(5);            // Uses generic version
print("hello");      // Uses specialized version
```

This is useful when a generic implementation isn't optimal for certain types.

### 41. What are lambda functions?

A **lambda function** is an anonymous function defined inline. Syntax: `[captures](parameters) { body }`

```cpp
auto add = [](int a, int b) { return a + b; };
std::cout << add(3, 5);  // Prints 8

std::vector<int> v = {3, 1, 4, 1, 5};
std::sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;  // Sort descending
});
```

Lambdas are useful for passing custom logic to algorithms. The `[...]` part captures variables from the surrounding scope.

```cpp
int multiplier = 3;
auto multiply = [multiplier](int x) { return x * multiplier; };
std::cout << multiply(5);  // Prints 15
```

---

## Section 5: Advanced Topics (Questions 42–50)

### 42. What are move semantics and rvalue references?

**Move semantics** allows efficient transfer of resources instead of copying. An **rvalue reference** (`&&`) refers to a temporary object.

```cpp
std::string a = "hello";
std::string b = std::move(a);  // Move instead of copy
// a is now empty; b contains "hello"
```

Without move semantics, `b = a` would copy the entire string. With move semantics, the data is transferred.

**Rvalue references** are declared with `&&`:

```cpp
std::string&& temp = std::string("temporary");
// temp refers to the temporary string
```

Move semantics enable efficient passing of temporary objects and returning from functions without unnecessary copies.

### 43. What is std::move() and when should you use it?

`std::move()` casts an lvalue (persistent object) to an rvalue (temporary). It indicates "I'm done with this object; you can steal its resources."

```cpp
std::vector<int> v1 = {1, 2, 3};
std::vector<int> v2 = std::move(v1);
// v1 is now empty; v2 contains {1, 2, 3}
```

Use `std::move()` when returning objects from functions, passing to functions that accept rvalue references, or transferring ownership.

```cpp
std::unique_ptr<Dog> d1(new Dog());
std::unique_ptr<Dog> d2 = std::move(d1);  // Transfer ownership
// d1 is now null; d2 owns the Dog
```

### 44. What is the difference between lvalue and rvalue?

An **lvalue** is an object with a persistent address. You can take its address with `&`.

An **rvalue** is a temporary object. It exists briefly and you can't take its address.

```cpp
int x = 5;  // x is lvalue
int& ref = x;  // Can bind lvalue reference to x

int y = x + 5;  // (x + 5) is rvalue (temporary)
int& ref2 = x + 5;  // ERROR: cannot bind lvalue reference to rvalue

int&& rref = x + 5;  // OK: can bind rvalue reference to rvalue
```

Rvalue references enable move semantics and perfect forwarding.

### 45. What is undefined behavior? Give examples.

**Undefined behavior** is code whose results are unpredictable. The C++ standard makes no guarantees. Your program might crash, produce garbage, or appear to work fine.

Examples:

```cpp
int* p;  // Uninitialized pointer
std::cout << *p;  // UB: accessing uninitialized pointer

int arr[5];
std::cout << arr[10];  // UB: buffer overflow

int x = 1 / 0;  // UB: division by zero

std::string s = "hello";
s[100];  // UB: accessing out of bounds
```

**Prevention:**
1. Initialize all variables.
2. Check bounds.
3. Avoid dereferencing null pointers.
4. Use compiler warnings (`-Wall -Wextra`).

### 46. What are exceptions? How do you use `try`, `catch`, and `throw`?

Exceptions provide error handling. Code that might fail is wrapped in `try`; errors are handled in `catch`.

```cpp
try {
    int x = readUserInput();
    if (x < 0) {
        throw std::invalid_argument("Input must be positive");
    }
    std::cout << 100 / x;  // Might throw std::exception
}
catch (std::invalid_argument& e) {
    std::cout << "Error: " << e.what() << "\n";
}
catch (std::exception& e) {
    std::cout << "Unexpected error: " << e.what() << "\n";
}
```

`throw` raises an exception; `catch` handles it. Multiple `catch` blocks handle different exception types. Use exceptions for truly exceptional conditions, not normal control flow.

### 47. What are design patterns? Name a few.

**Design patterns** are reusable solutions to common problems. Key patterns:

**Singleton**: Ensures only one instance of a class exists.

```cpp
class Database {
public:
    static Database& getInstance() {
        static Database instance;
        return instance;
    }
private:
    Database() { }  // Private constructor
};
```

**Factory**: Creates objects without specifying exact classes.

```cpp
std::unique_ptr<Shape> createShape(std::string type) {
    if (type == "circle") return std::make_unique<Circle>();
    else if (type == "square") return std::make_unique<Square>();
}
```

**Observer**: Objects notify others of state changes.

Other common patterns: Decorator, Strategy, Command, Adapter.

### 48. What is const-correctness?

**Const-correctness** means using `const` to promise that data won't be modified. It improves safety and clarity.

```cpp
class Dog {
public:
    void speak() const {  // Promise: doesn't modify the Dog
        std::cout << "Woof\n";
    }

    void setAge(int age) {  // Promise: modifies the Dog
        this->age = age;
    }

    int getAge() const {  // Promise: doesn't modify; const return
        return age;
    }

private:
    int age;
};
```

Mark functions `const` if they don't modify the object. Mark parameters `const` if they won't be modified. The compiler enforces these promises.

### 49. What is the difference between `std::unique_ptr` and `std::shared_ptr`?

Both manage dynamic memory, but ownership differs.

**`std::unique_ptr`**: One owner only. When the owner is destroyed, the object is deleted.

```cpp
std::unique_ptr<Dog> d(new Dog());
// d owns the Dog exclusively
std::unique_ptr<Dog> d2 = std::move(d);  // Transfer ownership
// d is now null; d2 owns the Dog
```

**`std::shared_ptr`**: Multiple owners. Object is deleted when the last owner is destroyed.

```cpp
std::shared_ptr<Dog> d1(new Dog());
std::shared_ptr<Dog> d2 = d1;  // Both own the Dog
// Dog deleted only when both d1 and d2 are gone
```

**Rule:** Use `unique_ptr` unless multiple owners are necessary. It's simpler and cheaper.

### 50. What is multithreading in C++? How do you create threads?

**Multithreading** runs multiple functions concurrently. Use `std::thread`.

```cpp
#include <thread>

void printMessage(int id) {
    std::cout << "Hello from thread " << id << "\n";
}

int main() {
    std::thread t1(printMessage, 1);
    std::thread t2(printMessage, 2);

    t1.join();  // Wait for t1 to finish
    t2.join();  // Wait for t2 to finish

    return 0;
}
```

`std::thread` takes a function and arguments. `join()` blocks until the thread finishes. Threads enable concurrent execution but introduce complexity (race conditions, deadlocks). Use synchronization primitives (`std::mutex`, `std::lock_guard`) to protect shared data.

---

## Interview Tips

1. **Understand the Why**: Don't just memorize answers. Understand why each feature exists and when to use it.

2. **Practice Coding**: Write code by hand and on a whiteboard. Practice on LeetCode or HackerRank.

3. **Ask Clarifying Questions**: If a question is ambiguous, ask for clarification before answering.

4. **Explain Your Thinking**: Talk through your approach. Interviewers want to see your thought process.

5. **Handle Mistakes Gracefully**: If you make an error, acknowledge it and correct it. It shows maturity.

6. **Cover All Cases**: Think about edge cases (null pointers, empty containers, negative numbers) and mention them.

7. **Know Your Resources**: Be ready to discuss your experience with the STL, smart pointers, and modern C++ practices.

---

## Conclusion

These 50 questions cover the core of C++ knowledge. Study them, but don't stop here:

- **Code regularly**: Build projects to reinforce concepts.
- **Read others' code**: Understand different approaches and best practices.
- **Follow modern practices**: Use smart pointers, const-correctness, and the STL.
- **Understand performance**: Know when optimizations matter and when they don't.

**Want to go deeper on any of these topics? Our C++ interview prep ebook covers all 50 questions with full explanations, practice problems, and strategies for explaining your thinking to interviewers. Master not just the answers, but the concepts behind them.**

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [How to Use Pointers in C++: A Complete Beginner's Guide](/posts/pointers-in-cpp/) — master the memory management concepts that appear in every C++ interview.
- [Object-Oriented Programming in C++: Classes, Objects, and Constructors Explained](/posts/oop-in-cpp/) — deep dive into the OOP topics covered in Questions 13–24.
- [Smart Pointers in Modern C++: unique_ptr, shared_ptr, and weak_ptr Explained](/posts/smart-pointers-cpp/) — essential reading to nail the memory management questions.
- [C++ STL Containers Explained: Choosing the Right Container for Every Situation](/posts/stl-containers-cpp/) — covers the STL topics from Questions 34–41 in detail.
