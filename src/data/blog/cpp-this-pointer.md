---
title: "The this Pointer in C++: What It Is and When to Use It"
description: "Learn what the this pointer means in C++, why every member function has one, and when you actually need it — shadowed parameters and method chaining explained."
pubDatetime: 2026-07-20T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "oop", "classes", "tutorial"]
faqSchema:
  - question: "What is the this pointer in C++?"
    answer: "this is a hidden pointer available inside every non-static member function that points to the object the function was called on. When you write obj.setValue(5), inside setValue the expression this holds the address of obj."
  - question: "Do I need to write this-> before every member variable?"
    answer: "No. The compiler adds it automatically when a name is unambiguous, so this->count and count mean the same thing. You only need this-> when a parameter or local variable shadows a member name, or inside a template where the base class member is dependent."
  - question: "Why do setter functions return *this?"
    answer: "Returning *this returns a reference to the current object, which lets you chain calls like obj.setX(1).setY(2).setZ(3). Each call returns the same object so the next call can act on it. Return Type& rather than Type to avoid copying."
draft: false
featured: false
---

# The `this` Pointer in C++: What It Is and When to Use It

Every member function in C++ receives a secret extra argument you never wrote: a pointer to the object it was called on. That pointer is `this`.

Understanding it clears up a surprising amount of confusion about how classes actually work under the hood.

---

## The Hidden Argument

When you write this:

```cpp
Rectangle r;
r.setWidth(10);
```

The compiler effectively turns `setWidth` into a function that takes the object as its first parameter:

```
setWidth(&r, 10);
```

Inside the function, that first hidden parameter is called `this`. It's a pointer, so you reach members through `->`:

```cpp
#include <iostream>

class Counter {
private:
    int count;

public:
    Counter() : count(0) {}

    void increment() {
        this->count++;   // explicit
        // count++;      // identical — the compiler inserts this->
    }

    void printAddress() {
        std::cout << "This object lives at: " << this << "\n";
    }

    int getCount() const { return count; }
};

int main() {
    Counter a;
    Counter b;

    a.increment();
    a.increment();
    b.increment();

    std::cout << "a.count = " << a.getCount() << "\n";
    std::cout << "b.count = " << b.getCount() << "\n";

    a.printAddress();
    b.printAddress();

    return 0;
}
```

Output (addresses will differ on your machine):
```
a.count = 2
b.count = 1
This object lives at: 0x7ffd4c2a1b30
This object lives at: 0x7ffd4c2a1b34
```

This is the answer to a question most beginners have: *how does one copy of `increment()` know whether to update `a` or `b`?* There's only one `increment` function in your compiled program. It knows which object to modify because `this` is different on every call.

---

## When You Actually Need `this`

Most of the time you can leave it out — `count++` and `this->count++` compile to the same thing. But there are three situations where it earns its place.

### 1. A parameter shadows a member name

This is the most common reason beginners meet `this`:

```cpp
class Rectangle {
private:
    int width;
    int height;

public:
    void setSize(int width, int height) {
        this->width = width;     // member = parameter
        this->height = height;
    }
};
```

Without `this->`, the line `width = width` assigns the parameter to itself. The member never changes, the compiler is perfectly happy, and you get a silent bug.

The alternative is to not shadow at all — name the parameters `w` and `h`, or use a [constructor initializer list](/posts/cpp-constructors-destructors/). Both are fine. Using `this->` lets you keep the clearer parameter names, which is why it's so common in real code.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

### 2. Method chaining

If a setter returns `*this`, you can chain calls together:

```cpp
#include <iostream>
#include <string>

class Pizza {
private:
    std::string size;
    bool extraCheese;
    int toppings;

public:
    Pizza() : size("medium"), extraCheese(false), toppings(0) {}

    Pizza& setSize(const std::string& s) {
        size = s;
        return *this;          // return the object itself
    }

    Pizza& addCheese() {
        extraCheese = true;
        return *this;
    }

    Pizza& addTopping() {
        toppings++;
        return *this;
    }

    void describe() const {
        std::cout << size << " pizza, "
                  << toppings << " toppings"
                  << (extraCheese ? ", extra cheese" : "")
                  << "\n";
    }
};

int main() {
    Pizza order;
    order.setSize("large").addCheese().addTopping().addTopping();
    order.describe();
    return 0;
}
```

Output:
```
large pizza, 2 toppings, extra cheese
```

Note the return type: `Pizza&`, not `Pizza`. Returning by reference hands back the *actual* object. Returning by value would copy it, and every chained call would modify a temporary that gets thrown away — the original `order` would stay untouched.

Remember: `this` is a *pointer*, so `*this` dereferences it to get the object itself.

### 3. Passing the current object to something else

Sometimes an object needs to hand itself to a function or register itself with another object:

```cpp
#include <iostream>
#include <vector>

class Widget;   // forward declaration

class Manager {
private:
    std::vector<Widget*> widgets;
public:
    void add(Widget* w) {
        widgets.push_back(w);
        std::cout << "Registered. Total widgets: " << widgets.size() << "\n";
    }
};

class Widget {
public:
    void registerWith(Manager& m) {
        m.add(this);       // pass a pointer to myself
    }
};

int main() {
    Manager manager;
    Widget a, b;
    a.registerWith(manager);
    b.registerWith(manager);
    return 0;
}
```

Output:
```
Registered. Total widgets: 1
Registered. Total widgets: 2
```

---

## `this` in const Member Functions

Inside a `const` member function, `this` becomes a pointer to a `const` object. That's the mechanism behind const-correctness:

```cpp
class Account {
private:
    double balance;

public:
    Account(double b) : balance(b) {}

    double getBalance() const {
        // this has type: const Account*
        // balance = 100;   // ERROR — can't modify through a const pointer
        return balance;
    }

    void deposit(double amount) {
        // this has type: Account*
        balance += amount;   // fine
    }
};
```

Marking a function `const` isn't just documentation. It changes the type of `this`, and the compiler enforces it.

---

## Things `this` Cannot Do

**It doesn't exist in static member functions.** A [static function](/posts/cpp-static-keyword/) belongs to the class, not to any object, so there's no object for `this` to point at. Trying to use it is a compile error.

**You can't reassign it.** `this = somethingElse;` is illegal. It's effectively a `const` pointer.

**It's never null in well-formed code.** If you find yourself writing `if (this == nullptr)`, something has already gone wrong elsewhere — you called a member function on a null pointer, which is undefined behaviour.

---

## Summary

| Situation | Need `this->`? |
|-----------|----------------|
| Normal member access | No — implicit |
| Parameter shadows member | **Yes** |
| Returning object for chaining | **Yes** — `return *this;` |
| Passing object to another function | **Yes** — `this` or `*this` |
| Inside a static function | Not available |

`this` is a pointer to the object the current member function was called on. You mostly don't have to type it — but when parameter names collide or you want to chain calls, it's exactly the tool you need.

---

## Related Articles

- [C++ Classes and Objects](/posts/cpp-classes-and-objects/) — where member functions come from
- [C++ Constructors and Destructors](/posts/cpp-constructors-destructors/) — initializer lists as the alternative to `this->`
- [How to Use Pointers in C++](/posts/pointers-in-cpp/) — what a pointer actually is
- [The static Keyword in C++](/posts/cpp-static-keyword/) — why static functions have no `this`
- [The const Keyword in C++](/posts/cpp-const-keyword/) — const member functions explained
- [OOP in C++](/posts/oop-in-cpp/) — the bigger picture

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
