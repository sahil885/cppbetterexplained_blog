---
title: "push_back vs emplace_back in C++: What's the Real Difference?"
description: "Understand push_back vs emplace_back in C++ with working examples. See exactly when emplace_back avoids a copy, when it does not, and which one to use."
pubDatetime: 2026-08-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "vector", "stl", "tutorial"]
faqSchema:
  - question: "What is the difference between push_back and emplace_back in C++?"
    answer: "push_back takes an already-built object and copies or moves it into the vector. emplace_back takes the constructor arguments instead and builds the object directly inside the vector's storage, skipping the temporary object entirely."
  - question: "Is emplace_back always faster than push_back?"
    answer: "No. When you pass an object that already exists, emplace_back does the same copy or move that push_back does. The speedup only appears when push_back would have created a temporary object just to hand it over, which mostly happens with class types that take constructor arguments."
  - question: "Should I always use emplace_back instead of push_back?"
    answer: "Not automatically. push_back states your intent more clearly when you already have an object, and it rejects unintended conversions because emplace_back can call explicit constructors. Use emplace_back when you are constructing an element from its arguments in place."
draft: false
featured: false
---

# push_back vs emplace_back in C++: What's the Real Difference?

Every C++ beginner hits this moment: you've been using `push_back` for months, someone reviews your code and says "use `emplace_back`, it's faster," and you're left wondering whether you've been doing it wrong the whole time.

You haven't. But the difference is real, and it's worth understanding exactly — because "always use emplace_back" is not the right takeaway.

---

## The One-Sentence Version

`push_back` takes an **object**. `emplace_back` takes the **arguments to build an object**.

```cpp
std::vector<std::string> names;

names.push_back(std::string("Sahil"));  // build a string, then hand it over
names.emplace_back("Sahil");            // hand over the argument, build in place
```

The first line creates a temporary `std::string`, then moves it into the vector, then destroys the temporary. The second line constructs the string directly in the vector's memory. One fewer object gets created and destroyed.

---

## Seeing It Happen

Talking about copies is abstract. Let's make a class that announces every time it's constructed, copied, or moved:

```cpp
#include <iostream>
#include <vector>
#include <string>

class Player {
public:
    Player(std::string name, int score)
        : name_(std::move(name)), score_(score) {
        std::cout << "  constructed " << name_ << "\n";
    }

    Player(const Player& other)
        : name_(other.name_), score_(other.score_) {
        std::cout << "  COPIED " << name_ << "\n";
    }

    Player(Player&& other) noexcept
        : name_(std::move(other.name_)), score_(other.score_) {
        std::cout << "  MOVED " << name_ << "\n";
    }

private:
    std::string name_;
    int score_;
};

int main() {
    std::vector<Player> players;
    players.reserve(4);  // avoid reallocation muddying the output

    std::cout << "push_back:\n";
    players.push_back(Player("Alice", 10));

    std::cout << "emplace_back:\n";
    players.emplace_back("Bob", 20);

    return 0;
}
```

Output:

```
push_back:
  constructed Alice
  MOVED Alice
emplace_back:
  constructed Bob
```

There it is. `push_back` built a `Player` on the stack and then moved it into the vector — two operations. `emplace_back` built it once, in its final home.

Notice the `reserve(4)` call. Without it, a vector that runs out of capacity moves all existing elements to new storage, which would flood the output with unrelated moves. See [reserve vs resize](/posts/cpp-vector-reserve-vs-resize/) for why that matters for performance too.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## When emplace_back Saves You Nothing

Here's the part the "always use emplace_back" advice gets wrong. Change the calls to pass an existing object:

```cpp
Player existing("Carol", 30);

players.push_back(existing);     // COPIED Carol
players.emplace_back(existing);  // COPIED Carol
```

Identical. `emplace_back` forwards whatever you give it to a constructor — and when you give it a `Player`, the constructor it calls *is* the copy constructor. There is no magic that avoids a copy of an object that already exists.

The same applies to `int`, `double`, and other trivial types:

```cpp
std::vector<int> numbers;
numbers.push_back(42);     // copies 4 bytes
numbers.emplace_back(42);  // copies 4 bytes
```

Nothing is saved because there was nothing to save. If someone tells you switching a `vector<int>` from `push_back` to `emplace_back` is a performance win, they're mistaken.

---

## The Trap: emplace_back Accepts Too Much

`push_back` will refuse a conversion marked `explicit`. `emplace_back` calls the constructor directly, so it happily uses explicit constructors:

```cpp
#include <vector>
#include <fstream>

std::vector<std::ofstream> files;

// files.push_back("log.txt");     // does NOT compile — explicit constructor
files.emplace_back("log.txt");     // compiles, opens a file
```

That's convenient when you mean it and a silent bug when you don't. A classic version of the problem:

```cpp
std::vector<std::vector<int>> grid;

grid.emplace_back(10);  // a vector of 10 zeros — probably not what you wanted
```

You may have meant "add a vector containing the number 10." You got a vector of ten zeros, because `std::vector`'s size constructor matched your argument. `push_back` would have rejected this outright.

---

## The Practical Rule

| Situation | Use |
|-----------|-----|
| You already have an object | `push_back` |
| You have a `std::move`d object | `push_back` |
| Building from constructor arguments | `emplace_back` |
| `vector<int>`, `vector<double>`, etc. | Either — no difference |

The rule that holds up: **use `emplace_back` when you're constructing, `push_back` when you're inserting.** That reads clearly to whoever maintains the code next, and it happens to be the fast choice in both cases.

And if the object you're inserting is expensive and you don't need it afterwards, `push_back(std::move(obj))` gets you a move instead of a copy — see [move semantics](/posts/cpp-move-semantics/) for how that works.

---

## Related Articles

- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/)
- [C++ Move Semantics Explained](/posts/cpp-move-semantics/)
- [vector reserve vs resize](/posts/cpp-vector-reserve-vs-resize/)
- [C++ Copy Constructor Explained](/posts/cpp-copy-constructor/)
- [STL Containers in C++](/posts/stl-containers-cpp/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
