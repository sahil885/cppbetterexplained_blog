---
title: "C++ const Keyword Explained: Variables, References, and Functions"
description: "Learn how the const keyword works in C++ for variables, references, function parameters, and member functions, with clear, beginner-friendly code examples."
pubDatetime: 2026-06-10T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "const", "tutorial"]
faqSchema:
  - question: "What does the const keyword do in C++?"
    answer: "The const keyword marks something as read-only. A const variable must be initialized when declared and cannot be changed afterward. The compiler enforces this — any attempt to modify a const value is a compile-time error."
  - question: "What is the difference between const and constexpr in C++?"
    answer: "const means the value cannot change after initialization, but it can be set at runtime. constexpr means the value must be known at compile time. Use constexpr for true compile-time constants and const for values fixed after they're computed."
  - question: "Why should I pass function parameters by const reference in C++?"
    answer: "Passing by const reference avoids copying large objects like strings or vectors while guaranteeing the function won't modify them. It gives you the speed of pass-by-reference with the safety of pass-by-value."
draft: false
featured: false
---

# C++ const Keyword Explained: Variables, References, and Functions

The `const` keyword is one of the simplest features in C++ and one of the most important. It tells the compiler "this value must never change" — and the compiler enforces that promise for you, catching whole categories of bugs before your program even runs.

---

## const variables: values that never change

Declare a variable `const` and it becomes read-only. You must initialize it immediately, and any later attempt to modify it is a compile error.

```cpp
#include <iostream>

int main() {
    const double TAX_RATE = 0.08;
    const int MAX_PLAYERS = 4;

    double price = 50.0;
    double total = price * (1 + TAX_RATE);

    std::cout << "Total: " << total << '\n';

    // TAX_RATE = 0.10;  // ERROR: assignment of read-only variable

    return 0;
}
```

This is better than a "magic number" scattered through your code because the value has a name, lives in one place, and cannot be accidentally overwritten. If you've read our guide to [variables and data types](/posts/cpp-variables-data-types/), think of `const` as a permanent lock you apply at creation time.

---

## const function parameters: fast AND safe

When you pass a large object like a `std::string` or `std::vector` to a function by value, C++ copies the whole thing. Passing by reference avoids the copy — but then the function *could* modify your original. `const` reference gives you both benefits:

```cpp
#include <iostream>
#include <string>

// No copy is made, and the function cannot modify the original
void printGreeting(const std::string& name) {
    std::cout << "Hello, " << name << "!\n";
    // name += "!";  // ERROR: name is read-only here
}

int main() {
    std::string user = "Sahil";
    printGreeting(user);
    return 0;
}
```

This is efficient because a reference is just an alias for the existing object — nothing gets copied — and it's safe because the compiler guarantees the function only reads. This pattern is so common it's the default way to pass strings, vectors, and class objects in C++. For the full picture, see [pass by value vs reference](/posts/cpp-pass-by-value-reference/).

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## const and pointers: two different things to lock

With pointers, `const` can apply to the *data* or to the *pointer itself*. The rule of thumb: read the declaration right to left.

```cpp
#include <iostream>

int main() {
    int a = 10;
    int b = 20;

    const int* p1 = &a;   // pointer to const int: data is locked
    // *p1 = 99;          // ERROR: can't change the value through p1
    p1 = &b;              // OK: the pointer itself can move

    int* const p2 = &a;   // const pointer to int: pointer is locked
    *p2 = 99;             // OK: can change the value
    // p2 = &b;           // ERROR: can't repoint p2

    std::cout << a << '\n';  // prints 99
    return 0;
}
```

If pointers are still fuzzy, our [beginner's guide to pointers](/posts/pointers-in-cpp/) builds the mental model step by step.

---

## const member functions: methods that promise not to modify

Inside a class, marking a method `const` promises it won't change any member variables. Only `const` methods can be called on a `const` object, so this matters more than it first appears:

```cpp
#include <iostream>
#include <string>

class BankAccount {
private:
    std::string owner;
    double balance;

public:
    BankAccount(std::string o, double b) : owner(o), balance(b) {}

    // Promises not to modify the object
    double getBalance() const {
        return balance;
    }

    void deposit(double amount) {
        balance += amount;  // modifies state, so NOT const
    }
};

void printBalance(const BankAccount& account) {
    // Only const methods are callable on a const reference
    std::cout << "Balance: " << account.getBalance() << '\n';
}

int main() {
    BankAccount acct("Sahil", 250.0);
    printBalance(acct);
    return 0;
}
```

Without `const` on `getBalance()`, the call inside `printBalance` would not compile — the compiler can't trust a non-const method with a read-only object. New to classes? Start with [classes and objects](/posts/cpp-classes-and-objects/).

---

## const vs constexpr

`const` means "cannot change after initialization" — but the value can come from runtime input. `constexpr` is stricter: the value must be computable at compile time.

```cpp
const int userChoice = getUserInput();   // OK: fixed after runtime init
constexpr int BOARD_SIZE = 8 * 8;        // OK: known at compile time
```

Use `constexpr` for true constants like array sizes and mathematical values, and `const` everywhere you want to lock a value after it's computed.

---

## Related Articles

- [C++ Variables and Data Types: A Complete Beginner's Guide](/posts/cpp-variables-data-types/)
- [C++ Pass by Value, Reference & Pointer: Complete Guide](/posts/cpp-pass-by-value-reference/)
- [How to Use Pointers in C++: A Complete Beginner's Guide](/posts/pointers-in-cpp/)
- [C++ Classes and Objects: A Beginner's Guide to OOP](/posts/cpp-classes-and-objects/)
- [C++ Reference vs Pointer: What's the Difference?](/posts/cpp-reference-vs-pointer/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
