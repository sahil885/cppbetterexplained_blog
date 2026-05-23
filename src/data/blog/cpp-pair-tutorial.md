---
title: "C++ std::pair Explained: Store Two Values Together for Beginners"
description: "Learn how std::pair works in C++ — create pairs, access first and second, use make_pair, and see practical examples with maps and functions."
pubDatetime: 2026-05-23T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "STL", "tutorial"]
faqSchema:
  - question: "What is std::pair in C++?"
    answer: "std::pair is a simple container that holds exactly two values, which can be of different types. You access them as .first and .second. It's defined in the <utility> header and is widely used with maps and algorithms."
  - question: "How do I create a std::pair in C++?"
    answer: "You can use std::make_pair(a, b), brace initialization std::pair<int,string>{1, \"hello\"}, or since C++17 just pair{1, \"hello\"} with type deduction. All three create the same result."
  - question: "When should I use std::pair vs a struct in C++?"
    answer: "Use pair for quick, throwaway groupings — especially when working with maps or returning two values from a function. Use a struct when the relationship between the two values needs a name, or when you'll use it in many places."
draft: false
featured: false
---

# C++ std::pair Explained: Store Two Values Together

Sometimes you need to group two related values — a name and a score, an x and y coordinate, a key and a result. `std::pair` is the standard C++ way to do exactly that, without defining a whole new struct.

---

## What Is std::pair?

`std::pair` is a simple template container that holds exactly two values of potentially different types. You access them through `.first` and `.second`. It lives in the `<utility>` header (which is often included indirectly by other headers like `<map>`).

```cpp
#include <iostream>
#include <utility>

int main() {
    std::pair<std::string, int> player = {"Alice", 95};

    std::cout << "Name: " << player.first << "\n";  // Alice
    std::cout << "Score: " << player.second << "\n"; // 95
    return 0;
}
```

---

## Creating Pairs

There are three common ways to create a pair:

```cpp
#include <iostream>
#include <utility>

int main() {
    // Method 1: direct construction
    std::pair<int, double> p1(1, 3.14);

    // Method 2: make_pair (deduces types automatically)
    auto p2 = std::make_pair(1, 3.14);

    // Method 3: brace initialization (C++11 and later)
    std::pair<int, double> p3 = {1, 3.14};

    std::cout << p1.first << ", " << p1.second << "\n"; // 1, 3.14
    return 0;
}
```

`make_pair` is the most common style since you don't have to write out the types.

---

## Pairs Are Commonly Used with Maps

Every element in a `std::map` is a `std::pair<const Key, Value>`. This is why you see `.first` and `.second` used when iterating over a map:

```cpp
#include <iostream>
#include <map>

int main() {
    std::map<std::string, int> scores = {
        {"Alice", 95},
        {"Bob", 87},
        {"Carol", 92}
    };

    for (const auto& entry : scores) {
        // entry is a std::pair<const std::string, int>
        std::cout << entry.first << ": " << entry.second << "\n";
    }
    return 0;
}
```

Output:
```
Alice: 95
Bob: 87
Carol: 92
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Returning Two Values from a Function

Before C++17 structured bindings, `pair` was the go-to way to return two values from a function without defining a struct:

```cpp
#include <iostream>
#include <utility>
#include <string>

// Returns both a grade and whether it's passing
std::pair<char, bool> getGrade(int score) {
    if (score >= 90) return {'A', true};
    if (score >= 80) return {'B', true};
    if (score >= 70) return {'C', true};
    return {'F', false};
}

int main() {
    auto result = getGrade(85);
    std::cout << "Grade: " << result.first << "\n";   // B
    std::cout << "Passing: " << result.second << "\n"; // 1 (true)
    return 0;
}
```

---

## C++17: Structured Bindings for Cleaner Pair Access

In C++17, you can unpack a pair into named variables using structured bindings, which is much more readable than `.first` and `.second`:

```cpp
#include <iostream>
#include <map>

int main() {
    std::map<std::string, int> scores = {{"Alice", 95}, {"Bob", 87}};

    for (const auto& [name, score] : scores) {
        std::cout << name << " scored " << score << "\n";
    }
    return 0;
}
```

This is the modern preferred style when iterating maps or unpacking pairs.

---

## Comparing Pairs

Pairs support comparison operators. They compare `first` first, then `second` as a tiebreaker:

```cpp
#include <iostream>
#include <utility>

int main() {
    std::pair<int, int> a = {1, 5};
    std::pair<int, int> b = {1, 3};
    std::pair<int, int> c = {2, 0};

    std::cout << (a > b) << "\n"; // 1 (true) — same first, 5 > 3
    std::cout << (a < c) << "\n"; // 1 (true) — 1 < 2
    return 0;
}
```

This makes pairs naturally sortable, which is why they're popular as keys in sorted containers or as entries in a vector you want to sort.

---

## Practical Example: Sorting by Score

Here's a complete example that uses a vector of pairs to sort students by score:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <utility>

int main() {
    std::vector<std::pair<int, std::string>> students = {
        {87, "Bob"},
        {95, "Alice"},
        {72, "Carol"}
    };

    // Sort by score (first element) in descending order
    std::sort(students.begin(), students.end(),
        [](const auto& a, const auto& b) {
            return a.first > b.first;
        });

    for (const auto& [score, name] : students) {
        std::cout << name << ": " << score << "\n";
    }
    // Alice: 95
    // Bob: 87
    // Carol: 72
    return 0;
}
```

---

## pair vs struct: Which Should You Use?

| | `std::pair` | `struct` |
|---|---|---|
| Setup needed | None | Define the struct |
| Readability | `.first`/`.second` can be unclear | Named fields are self-documenting |
| Reusability | Use anywhere for two values | Better for reuse across files |
| STL compatibility | Works natively with maps, algorithms | Works too, but more boilerplate |

Use `pair` for quick internal groupings — especially map entries and return values. Define a struct when the code will be read by others and the names of the two values matter for clarity.

---

## Related Articles

- [C++ map and unordered_map Tutorial for Beginners](/posts/cpp-map-unordered-map/)
- [C++ STL Containers Overview: vector, map, set, and More](/posts/stl-containers-cpp/)
- [C++ Lambda Functions: Syntax, Captures, and Practical Examples](/posts/cpp-lambda-functions/)
- [C++ Auto Keyword Explained: Type Deduction for Beginners](/posts/cpp-auto-keyword/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
