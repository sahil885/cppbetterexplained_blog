---
title: "Object Slicing in C++: Why Your Derived Class Loses Its Data"
description: "Learn what object slicing is in C++, why assigning a derived object to a base variable silently drops data, and the three reliable ways to prevent it."
pubDatetime: 2026-09-05T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "oop", "inheritance", "tutorial"]
faqSchema:
  - question: "What is object slicing in C++?"
    answer: "Object slicing happens when you assign or copy a derived class object into a base class variable. Only the base class portion is copied and the derived class members are discarded, or sliced off. The result behaves like a plain base object, so virtual functions call the base version."
  - question: "Why does object slicing happen in C++?"
    answer: "A base class variable is exactly the size of a base object. When you copy a larger derived object into it, there is physically no room for the extra members, so the base copy constructor copies only the base part and the rest is dropped."
  - question: "How do you prevent object slicing in C++?"
    answer: "Pass and store objects by reference or by pointer rather than by value, since a reference or pointer to a base can point at a full derived object. For containers, store smart pointers such as std::unique_ptr<Base> instead of Base values."
draft: false
featured: false
---

# Object Slicing in C++

You've built a clean inheritance hierarchy. Your `Dog` overrides `speak()`. You put a `Dog` in a function that takes an `Animal`, and it barks like a generic animal instead. No warning, no error — just the wrong behaviour.

That's object slicing, and it's one of the few C++ bugs where the compiler does exactly what you asked and it's still wrong.

---

## Seeing It Happen

```cpp
#include <iostream>
#include <string>

class Animal {
public:
    std::string name;
    Animal(std::string n) : name(n) {}
    virtual void speak() const { std::cout << name << " makes a sound.\n"; }
    virtual ~Animal() = default;
};

class Dog : public Animal {
public:
    std::string breed;
    Dog(std::string n, std::string b) : Animal(n), breed(b) {}
    void speak() const override { std::cout << name << " barks! (" << breed << ")\n"; }
};

int main() {
    Dog rex("Rex", "Beagle");
    rex.speak();              // Rex barks! (Beagle)

    Animal a = rex;           // ← the slice happens right here
    a.speak();                // Rex makes a sound.

    return 0;
}
```

`a` is an `Animal`. It has a `name` and nothing else. The `breed` member wasn't copied — there was nowhere to put it.

---

## Why the Compiler Allows This

Picture the memory layout. An `Animal` object holds one string. A `Dog` object holds an `Animal` *plus* another string:

```
Animal:  [ name ]
Dog:     [ name ][ breed ]
         ^^^^^^^^
         the Animal part
```

When you write `Animal a = rex;`, the compiler calls `Animal`'s copy constructor. Its parameter is `const Animal&`, and a `Dog&` binds to that happily — a Dog *is* an Animal. The constructor then copies every `Animal` member. It has no idea `breed` exists, and `a` is only big enough for the base part anyway.

So the code is well-formed and does something perfectly reasonable. It's just rarely what you meant.

---

## The Part That Surprises People: Virtual Functions Stop Working

Even though `speak()` is declared `virtual`, `a.speak()` calls the *base* version. Slicing doesn't just drop data — it drops the object's identity.

A polymorphic object carries a hidden pointer to its class's virtual table. When the base copy constructor runs, it builds a genuine `Animal`, so `a`'s vtable pointer points at `Animal`'s table. There is no `Dog` left to dispatch to. [Virtual functions and polymorphism](/posts/virtual-functions-polymorphism-cpp/) covers how that dispatch normally works.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Where It Bites in Real Code

### Passing by value

```cpp
void describe(Animal animal) {     // ✗ takes a copy — slices every derived argument
    animal.speak();
}

int main() {
    Dog rex("Rex", "Beagle");
    describe(rex);                 // "Rex makes a sound."
}
```

This is the most common form by far, and it's invisible at the call site — `describe(rex)` looks completely innocent.

### Storing in a container

```cpp
#include <vector>

std::vector<Animal> zoo;
zoo.push_back(Dog("Rex", "Beagle"));   // ✗ the Dog becomes a plain Animal
zoo.push_back(Dog("Bo", "Boxer"));     // ✗ same
```

A `std::vector<Animal>` stores `Animal` objects, each exactly `sizeof(Animal)` bytes. There is no way to fit a `Dog` in one. The container isn't broken — it's doing what its type says.

---

## Fix 1: Pass by Reference

One character solves the function case:

```cpp
void describe(const Animal& animal) {   // ✓ no copy, no slice
    animal.speak();
}

int main() {
    Dog rex("Rex", "Beagle");
    describe(rex);                      // "Rex barks! (Beagle)"
}
```

A reference is an alias for the object that already exists. Nothing is copied, so nothing is lost, and virtual dispatch finds the real `Dog`. Use `const Animal&` whenever you only need to read — see [pass by value vs pass by reference](/posts/cpp-pass-by-value-reference/).

## Fix 2: Store Pointers in Containers

```cpp
#include <vector>
#include <memory>

int main() {
    std::vector<std::unique_ptr<Animal>> zoo;
    zoo.push_back(std::make_unique<Dog>("Rex", "Beagle"));
    zoo.push_back(std::make_unique<Dog>("Bo", "Boxer"));

    for (const auto& animal : zoo) {
        animal->speak();      // ✓ each one barks correctly
    }
    return 0;
}
```

Every `unique_ptr` is the same size no matter what it points at, so the vector is happy and the real derived objects stay intact on the heap. `unique_ptr` also deletes them for you — which is why the base class above declares `virtual ~Animal()`. Without a virtual destructor, deleting a `Dog` through an `Animal*` is undefined behaviour; see [virtual destructors](/posts/cpp-virtual-destructor/) and [smart pointers](/posts/smart-pointers-cpp/).

## Fix 3: Ban the Copy Outright

If a base class only ever makes sense polymorphically, you can make slicing a compile error:

```cpp
class Animal {
public:
    virtual void speak() const = 0;
    virtual ~Animal() = default;

protected:
    Animal() = default;
    Animal(const Animal&) = default;              // copying allowed for derived
    Animal& operator=(const Animal&) = default;   // classes, but not from outside
};
```

Making the copy operations `protected` means derived classes can still copy their base part, but nobody outside can write `Animal a = rex;`. An [abstract class](/posts/cpp-abstract-class/) with a pure virtual function goes further — you simply can't create an `Animal` variable at all, so there's nothing to slice into.

---

## The Rule to Remember

> **Polymorphic types are used through references and pointers. Value semantics and inheritance don't mix.**

If you find yourself writing `Base b = derived;`, `void f(Base b)`, or `std::vector<Base>` where `Base` has virtual functions, stop and add an `&` or a `unique_ptr`. That habit alone eliminates the entire category of bug.

---

## Related Articles

- [Inheritance in C++ Explained](/posts/cpp-inheritance/)
- [Virtual Functions and Polymorphism in C++](/posts/virtual-functions-polymorphism-cpp/)
- [Virtual Destructors in C++](/posts/cpp-virtual-destructor/)
- [Pass by Value vs Pass by Reference](/posts/cpp-pass-by-value-reference/)
- [Smart Pointers in C++](/posts/smart-pointers-cpp/)
- [Abstract Classes in C++](/posts/cpp-abstract-class/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
