---
title: "C++ Lambda Functions Explained: A Beginner's Guide"
description: "Learn C++ lambda expressions from scratch. This beginner guide covers lambda syntax, captures, parameters, return types, and practical use cases with clear examples."
pubDatetime: 2026-05-14T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "lambda", "tutorial"]
faqSchema:
  - question: "What is a lambda function in C++?"
    answer: "A lambda function is an anonymous (unnamed) function you define inline. Instead of writing a separate named function, you can write the logic right where you need it. Lambdas were introduced in C++11 and are especially useful with algorithms like std::sort and std::for_each."
  - question: "What does the [] mean in a C++ lambda?"
    answer: "The [] is the capture clause. It controls which variables from the surrounding scope the lambda can access. [] captures nothing, [=] captures everything by value, [&] captures everything by reference, and [x] captures only x by value."
  - question: "When should I use a lambda in C++?"
    answer: "Use lambdas when you need a short function in one specific place and defining a full named function would add clutter. They are most common with STL algorithms (sort, find_if, for_each) and callback-style code."
draft: false
featured: false
---

# C++ Lambda Functions Explained: A Beginner's Guide

Imagine you're sorting a list of students by grade. You need to tell `std::sort` how to compare two students. The traditional approach is to write a separate comparison function. That works, but you end up with a small helper function sitting far away from the sort call, and you have to scroll back and forth to understand the code.

Lambdas solve this by letting you write that comparison function right where it's needed — inline, as an anonymous (nameless) function. No scrolling required.

C++ lambdas were introduced in C++11 and have become one of the most useful modern features of the language. This tutorial explains how they work from scratch.

---

## Your First Lambda

Here's the simplest possible lambda:

```cpp
#include <iostream>
using namespace std;

int main() {
    auto greet = []() {
        cout << "Hello from a lambda!" << endl;
    };

    greet();  // Call it like a function
    return 0;
}
```

Breaking it down:
- `[]` — the **capture clause** (more on this shortly)
- `()` — the **parameter list** (empty here)
- `{ ... }` — the **function body**
- `auto greet = ...` — storing the lambda in a variable so we can call it

Output:
```
Hello from a lambda!
```

---

## Lambda Syntax

The full syntax of a C++ lambda:

```
[capture](parameters) -> return_type {
    body
}
```

Most of the time you don't need to write `-> return_type` — the compiler figures it out. So in practice it's usually:

```
[capture](parameters) {
    body
}
```

---

## Parameters and Return Values

Lambdas work just like regular functions — they accept parameters and return values:

```cpp
#include <iostream>
using namespace std;

int main() {
    auto add = [](int a, int b) {
        return a + b;
    };

    cout << add(3, 4) << endl;  // 7
    return 0;
}
```

The compiler deduces that `add` returns `int` because `a + b` is an `int`.

You can be explicit about the return type if needed:

```cpp
auto divide = [](double a, double b) -> double {
    return a / b;
};
```

---

## The Capture Clause []

This is where lambdas get interesting. The capture clause lets the lambda use variables from the surrounding code — the outer scope.

```cpp
#include <iostream>
using namespace std;

int main() {
    int multiplier = 5;

    auto times = [multiplier](int x) {
        return x * multiplier;  // Uses the outer variable
    };

    cout << times(3) << endl;  // 15
    return 0;
}
```

Without the capture, `multiplier` would be invisible inside the lambda body.

### Capture Options

| Syntax | Meaning |
|--------|---------|
| `[]` | Capture nothing |
| `[x]` | Capture `x` by value (copy) |
| `[&x]` | Capture `x` by reference |
| `[=]` | Capture all used variables by value |
| `[&]` | Capture all used variables by reference |
| `[=, &x]` | Everything by value, but `x` by reference |

**Capture by value** (`[x]`) copies the variable at the moment the lambda is created. The lambda gets its own private copy.

**Capture by reference** (`[&x]`) means the lambda uses the actual variable. Changes inside the lambda affect the original.

```cpp
int count = 0;

auto increment = [&count]() {
    count++;  // Modifies the original count
};

increment();
increment();
cout << count << endl;  // 2
```

---

## Lambdas with STL Algorithms

This is where lambdas shine. The C++ standard library has algorithms like `sort`, `find_if`, and `for_each` that accept a function to customise their behaviour. Lambdas are perfect here.

### Sorting

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {5, 2, 8, 1, 9, 3};

    // Sort ascending
    sort(nums.begin(), nums.end(), [](int a, int b) {
        return a < b;
    });

    for (int n : nums) cout << n << " ";
    cout << endl;  // 1 2 3 5 8 9
    return 0;
}
```

Without a lambda, you'd write a separate `bool compare(int a, int b)` function. With the lambda, the comparison logic sits right next to the sort.

### Filtering with find_if

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {3, 7, 2, 9, 4};
    int threshold = 6;

    auto it = find_if(nums.begin(), nums.end(), [threshold](int n) {
        return n > threshold;
    });

    if (it != nums.end()) {
        cout << "First number > " << threshold << ": " << *it << endl;  // 7
    }
    return 0;
}
```

### Iterating with for_each

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<string> words = {"hello", "world", "cpp"};

    for_each(words.begin(), words.end(), [](const string& word) {
        cout << word << " ";
    });
    cout << endl;  // hello world cpp
    return 0;
}
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Sorting Structs with Lambdas

Lambdas are incredibly useful when sorting collections of objects:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Student {
    string name;
    int grade;
};

int main() {
    vector<Student> students = {
        {"Alice", 88},
        {"Bob", 95},
        {"Charlie", 72}
    };

    // Sort by grade, highest first
    sort(students.begin(), students.end(), [](const Student& a, const Student& b) {
        return a.grade > b.grade;
    });

    for (const auto& s : students) {
        cout << s.name << ": " << s.grade << endl;
    }
    return 0;
}
```

Output:
```
Bob: 95
Alice: 88
Charlie: 72
```

No separate compare function needed. The sorting logic lives right where it's used.

---

## Lambdas as Function Parameters

You can write functions that accept lambdas as parameters using templates or `std::function`:

```cpp
#include <iostream>
#include <functional>
using namespace std;

void applyTwice(int x, function<int(int)> f) {
    cout << f(f(x)) << endl;
}

int main() {
    applyTwice(3, [](int n) { return n * 2; });  // 12
    applyTwice(5, [](int n) { return n + 10; }); // 25
    return 0;
}
```

`std::function<int(int)>` means "a callable that takes an `int` and returns an `int`". Any lambda matching that signature works.

---

## Immediately Invoked Lambdas

Sometimes you want to run a lambda right away without storing it in a variable:

```cpp
int result = [](int a, int b) { return a + b; }(10, 20);
cout << result << endl;  // 30
```

This looks unusual but is occasionally handy for complex initialisation logic.

---

## Common Mistakes

**Capturing by value when you need to modify the original**  
If you need the lambda to change a variable in the outer scope, capture by reference (`[&x]`), not by value (`[x]`).

**Dangling references**  
If you store a lambda that captures by reference, and the original variable goes out of scope, you have a dangling reference — undefined behaviour. Be careful with long-lived lambdas.

**Forgetting the capture clause entirely**  
If your lambda uses outer variables but `[]` is empty, you'll get a compilation error. The compiler will tell you exactly which variable wasn't captured.

---

## Related Articles

- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — understand regular functions first
- [C++ STL Containers](/posts/stl-containers-cpp/) — vectors, maps, and the containers you'll use lambdas with
- [C++ Templates Explained](/posts/cpp-templates-explained/) — another C++ feature that pairs well with lambdas
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — the alternative to for_each for iterating collections

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
