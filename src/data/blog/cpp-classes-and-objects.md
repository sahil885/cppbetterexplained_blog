---
title: "C++ Classes and Objects: A Beginner's Guide to OOP"
description: "Learn C++ classes and objects from scratch. This beginner's guide explains what classes are, how to write them, constructors, access modifiers, member functions, and inheritance with clear examples."
pubDatetime: 2026-04-18T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "classes", "OOP", "tutorial"]
draft: false
featured: false
---

# C++ Classes and Objects: A Beginner's Guide to OOP

When you start programming, you write procedures: do this, then do that, then compute this. That works for small programs. But as programs grow, you need a better way to organize your code and your data.

**Object-oriented programming (OOP)** is that better way. Instead of separate variables and separate functions floating around, OOP lets you bundle related data and behavior together into a single unit: a **class**.

Understanding classes is the point where C++ starts to feel like a real engineering tool rather than an advanced calculator. This guide explains classes and objects from scratch.

---

## The Core Idea

Think about a bank account. A bank account has:
- **Data**: account number, owner name, balance
- **Behavior**: deposit, withdraw, check balance

In a non-OOP approach, you'd have separate variables and separate functions:

```cpp
std::string accountOwner = "Alice";
double accountBalance = 1000.0;

void deposit(double& balance, double amount) { balance += amount; }
void withdraw(double& balance, double amount) { balance -= amount; }
```

This works, but as you add more accounts, the data and functions drift apart. There's no guarantee that `accountBalance` is always used with the right deposit function.

With a class, you bundle everything together:

```cpp
class BankAccount {
public:
    std::string owner;
    double balance;

    void deposit(double amount) { balance += amount; }
    void withdraw(double amount) { balance -= amount; }
};
```

Now the data and the functions that operate on it are in one place.

---

## Defining a Class

The syntax for a class:

```cpp
class ClassName {
public:
    // data members (variables)
    // member functions (methods)
};
```

A simple example:

```cpp
class Dog {
public:
    std::string name;
    std::string breed;
    int age;

    void bark() {
        std::cout << name << " says: Woof!" << std::endl;
    }

    void describe() {
        std::cout << name << " is a " << age << "-year-old " << breed << std::endl;
    }
};
```

---

## Creating Objects

A **class** is a blueprint. An **object** is an instance of that blueprint — a specific thing created from it.

```cpp
int main() {
    Dog myDog;           // create an object of type Dog
    myDog.name = "Rex";
    myDog.breed = "Labrador";
    myDog.age = 3;

    myDog.bark();        // Rex says: Woof!
    myDog.describe();    // Rex is a 3-year-old Labrador

    Dog anotherDog;
    anotherDog.name = "Buddy";
    anotherDog.breed = "Poodle";
    anotherDog.age = 5;

    anotherDog.bark();   // Buddy says: Woof!

    return 0;
}
```

You can create as many objects as you want from the same class. Each object has its own copy of the data members — `myDog.name` and `anotherDog.name` are completely separate variables.

---

## Access Modifiers: `public` and `private`

You've seen `public:` in every class so far. C++ has three access modifiers that control who can access the class members:

- `public` — accessible from anywhere (inside or outside the class)
- `private` — accessible only from within the class itself
- `protected` — accessible from within the class and derived classes (covered in inheritance)

By default, if you don't specify an access modifier, class members are `private`.

```cpp
class BankAccount {
private:
    double balance;         // can't be accessed directly from outside

public:
    std::string owner;      // can be accessed from outside

    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;  // can access private balance from inside
        }
    }

    void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
        }
    }

    double getBalance() {
        return balance;     // controlled access to private data
    }
};
```

Why make `balance` private? So outside code can't just set `balance = 1000000` directly. The only way to change the balance is through `deposit` and `withdraw`, which enforce the rules (no negative amounts, etc.).

This is called **encapsulation** — hiding the internal details and exposing only a controlled interface. It's one of the core principles of OOP.

---

## Constructors: Initializing Objects

In the examples so far, you had to set each field manually after creating the object. A **constructor** solves this — it's a special function that runs automatically when an object is created.

A constructor has the same name as the class and no return type:

```cpp
class Dog {
public:
    std::string name;
    std::string breed;
    int age;

    // Constructor
    Dog(std::string dogName, std::string dogBreed, int dogAge) {
        name = dogName;
        breed = dogBreed;
        age = dogAge;
    }

    void bark() {
        std::cout << name << " says: Woof!" << std::endl;
    }
};
```

Now you can create objects and initialize them at the same time:

```cpp
Dog myDog("Rex", "Labrador", 3);
Dog anotherDog("Buddy", "Poodle", 5);

myDog.bark();       // Rex says: Woof!
anotherDog.bark();  // Buddy says: Woof!
```

### The Initializer List (Modern C++ Style)

A cleaner way to initialize member variables in a constructor is the **initializer list**, using `:` after the parameter list:

```cpp
Dog(std::string dogName, std::string dogBreed, int dogAge)
    : name(dogName), breed(dogBreed), age(dogAge) {
    // constructor body (can be empty if initialization is all that's needed)
}
```

This is the preferred style in modern C++ because it initializes members directly rather than default-constructing then assigning.

### Default Constructor

If you don't define any constructor, C++ provides a default constructor (no parameters, does nothing). Once you define a constructor with parameters, the default constructor is no longer automatically provided:

```cpp
Dog d;  // Error if you defined a parameterized constructor
        // and didn't also define a default constructor

// Fix: define a default constructor too
Dog() : name("Unknown"), breed("Unknown"), age(0) {}
```

---

## Destructors

A **destructor** runs automatically when an object is destroyed (goes out of scope or is explicitly deleted). It's used to release resources.

```cpp
class Dog {
public:
    std::string name;

    Dog(std::string n) : name(n) {
        std::cout << name << " created" << std::endl;
    }

    ~Dog() {  // destructor — tilde prefix, no parameters, no return type
        std::cout << name << " destroyed" << std::endl;
    }
};

int main() {
    Dog d1("Rex");
    {
        Dog d2("Buddy");
    }  // d2 goes out of scope here — destructor runs
    std::cout << "End of block" << std::endl;
    return 0;  // d1 goes out of scope here — destructor runs
}
```

Output:
```
Rex created
Buddy created
Buddy destroyed
End of block
Rex destroyed
```

For simple classes you don't need to define a destructor manually. It becomes essential when your class manually allocates memory (`new`) — the destructor is where you call `delete`.

---

## Getters and Setters

When data is private, you provide controlled access through **getter** (accessor) and **setter** (mutator) functions:

```cpp
class Student {
private:
    std::string name;
    double gpa;

public:
    Student(std::string n, double g) : name(n), gpa(g) {}

    // Getter
    std::string getName() const { return name; }
    double getGpa() const { return gpa; }

    // Setter with validation
    void setGpa(double newGpa) {
        if (newGpa >= 0.0 && newGpa <= 4.0) {
            gpa = newGpa;
        } else {
            std::cout << "Invalid GPA" << std::endl;
        }
    }
};

int main() {
    Student s("Alice", 3.8);
    std::cout << s.getName() << ": " << s.getGpa() << std::endl;

    s.setGpa(3.9);  // valid
    s.setGpa(5.0);  // invalid — prints "Invalid GPA"

    return 0;
}
```

The `const` after getter functions signals that they don't modify the object.

---

## Inheritance: One Class Extending Another

**Inheritance** allows a class to take on the properties and methods of another class, then add or override them.

```cpp
class Animal {
public:
    std::string name;

    Animal(std::string n) : name(n) {}

    void breathe() {
        std::cout << name << " breathes" << std::endl;
    }

    virtual void makeSound() {
        std::cout << name << " makes a sound" << std::endl;
    }
};

class Dog : public Animal {
public:
    Dog(std::string n) : Animal(n) {}  // call parent constructor

    void makeSound() override {
        std::cout << name << " says: Woof!" << std::endl;
    }
};

class Cat : public Animal {
public:
    Cat(std::string n) : Animal(n) {}

    void makeSound() override {
        std::cout << name << " says: Meow!" << std::endl;
    }
};
```

Using these classes:

```cpp
int main() {
    Dog d("Rex");
    Cat c("Whiskers");

    d.breathe();     // inherited from Animal: Rex breathes
    d.makeSound();   // overridden in Dog: Rex says: Woof!
    c.makeSound();   // overridden in Cat: Whiskers says: Meow!

    return 0;
}
```

The `virtual` keyword on `makeSound` in `Animal` and `override` in the derived classes enable **polymorphism** — the ability to call `makeSound()` on any `Animal` and get the right behavior:

```cpp
Animal* animals[] = {new Dog("Rex"), new Cat("Whiskers"), new Dog("Buddy")};
for (Animal* a : animals) {
    a->makeSound();  // calls the correct version for each type
}
```

Output:
```
Rex says: Woof!
Whiskers says: Meow!
Buddy says: Woof!
```

This is the power of polymorphism — you can write code that works with any type of `Animal`, and each animal does the right thing.

---

## A Complete Example: Simple Bank System

```cpp
#include <iostream>
#include <string>
#include <vector>

class Account {
protected:
    std::string owner;
    double balance;
    std::string accountNumber;

public:
    Account(std::string name, std::string number, double initialBalance)
        : owner(name), accountNumber(number), balance(initialBalance) {}

    virtual void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    virtual bool withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }

    double getBalance() const { return balance; }
    std::string getOwner() const { return owner; }

    virtual void printInfo() const {
        std::cout << "Account: " << accountNumber
                  << " | Owner: " << owner
                  << " | Balance: $" << balance << std::endl;
    }
};

class SavingsAccount : public Account {
    double interestRate;

public:
    SavingsAccount(std::string name, std::string number, double balance, double rate)
        : Account(name, number, balance), interestRate(rate) {}

    void applyInterest() {
        balance += balance * interestRate;
    }

    void printInfo() const override {
        std::cout << "Savings ";
        Account::printInfo();
        std::cout << "  Interest rate: " << (interestRate * 100) << "%" << std::endl;
    }
};

int main() {
    SavingsAccount savings("Alice", "SAV-001", 5000.0, 0.03);

    savings.printInfo();
    savings.deposit(500.0);
    savings.applyInterest();
    savings.printInfo();

    bool success = savings.withdraw(200.0);
    std::cout << "Withdrawal " << (success ? "succeeded" : "failed") << std::endl;
    savings.printInfo();

    return 0;
}
```

---

## Key OOP Principles in C++

**Encapsulation** — bundle data and behavior together, hide internal details with `private`.

**Inheritance** — derive new classes from existing ones, reusing and extending their code.

**Polymorphism** — use a base class pointer or reference to work with derived objects, calling the right method automatically.

**Abstraction** — expose a simple interface while hiding complexity (the `SavingsAccount` user doesn't need to know how `applyInterest` calculates — just that it does).

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

## Summary

A **class** is a blueprint that bundles data (member variables) and behavior (member functions) together. An **object** is an instance of a class. Key concepts:

- **Access modifiers** (`public`, `private`) control who can access class members
- **Constructors** initialize objects when they're created
- **Destructors** clean up resources when objects are destroyed
- **Getters/setters** provide controlled access to private data
- **Inheritance** lets one class extend another
- **Polymorphism** lets derived objects be used where base class objects are expected

Classes take time to fully absorb. Build something with them — a student grade system, a simple game, an inventory tracker — and they'll click.

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles
- [C++ Functions Tutorial: How to Write and Use Functions](/posts/cpp-functions-tutorial/) — member functions are the behavior side of classes; make sure you understand functions first.
- [C++ Move Semantics Explained: rvalue References, std::move, and Performance](/posts/cpp-move-semantics/) — once you understand classes, learn the Rule of Five and how to write efficient move constructors.
- [C++ Vector Tutorial: The Complete Guide to std::vector](/posts/cpp-vector-tutorial/) — classes commonly own vectors as members; learn how they work together.
- [OOP in C++: Inheritance, Encapsulation, and Polymorphism Explained](/posts/oop-in-cpp/) — the natural next step — applying classes to real object-oriented design.
