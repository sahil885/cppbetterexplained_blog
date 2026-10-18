---
title: "How to Fix 'no matching function for call to' in C++"
description: "Fix 'no matching function for call to' in C++: wrong arguments, missing constructors, push_back, getline and std::max. Real GCC, Clang and MSVC messages."
pubDatetime: 2026-10-18T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "debugging"]
draft: false
featured: false
hideMidOptin: true
faqSchema:
  - question: "What does 'no matching function for call to' mean in C++?"
    answer: "You called a function with arguments that don't fit any of its versions. It usually involves an overloaded function, a constructor or a standard library function. The candidate notes printed under the error list each version the compiler tried and why it didn't fit."
  - question: "How do I fix 'no matching function for call to' a constructor?"
    answer: "Pass the arguments one of the constructors expects, or add the constructor you're trying to use. If you write Point p; but Point only has a constructor taking two ints, either add a default constructor or create the object as Point p(0, 0);."
  - question: "Why does std::max give 'no matching function for call to'?"
    answer: "std::max needs both arguments to have the same type. Calling it with an int and a double fails because the compiler can't decide which type to use. Convert one argument so both match, or name the type explicitly when you call std::max."
  - question: "What is the Clang or Visual Studio version of this error?"
    answer: "Clang says no matching function for call, no matching constructor for initialization, or no matching member function for call. Visual Studio reports C2672, C2661 or C2665, or C2512 when a default constructor is missing."
---

# How to Fix "no matching function for call to" in C++

**Short answer:** you called a function with arguments that don't fit **any** of its versions. It almost always involves a function with several versions: an overloaded function, a constructor, or a standard library function like `push_back`, `getline` or `std::max`. The **candidate** notes printed under the error list every version the compiler tried and why each one didn't fit. Read those first.

| Compiler | What you see |
|---|---|
| GCC (g++, MinGW, Code::Blocks) | `no matching function for call to 'add(int)'` |
| Clang (Xcode, macOS) | `no matching function for call to 'add'` |
| Visual Studio | `C2661`, `C2665`, `C2672`, or `C2512` for constructors |

<!-- optin-quick error="no matching function for call to" -->

---

## How to Read the Error

The message comes in two parts:

1. **The first line** shows the call you made, with the types of your arguments: `no matching function for call to 'add(int)'`.
2. **The candidate notes** underneath list each version that exists, and why it didn't match: `candidate expects 2 arguments, 1 provided`.

Find the version you meant to call, and compare its parameters with what you passed. The mismatch is almost always visible right there.

A side note: GCC only says "no matching function" when there's more than one version to choose from. Call a function that has a single version with the wrong arguments, and you'll get `too few arguments to function` or `could not convert` instead. Same problem, plainer wording.

## Cause 1: Wrong Number of Arguments

```cpp
#include <iostream>

int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }

int main() {
    std::cout << add(5) << '\n';   // neither version takes one argument
}
```

```
GCC:    error: no matching function for call to 'add(int)'
        note:   candidate expects 2 arguments, 1 provided
Clang:  error: no matching function for call to 'add'
        note: candidate function not viable: requires 2 arguments, but 1 was provided
MSVC:   error C2661: 'add': no overloaded function takes 1 arguments
```

**Fix:** pass what one of the versions expects, such as `add(5, 3)`. See [function overloading](/posts/cpp-function-overloading/) for how C++ picks between versions.

## Cause 2: No Matching Constructor

The most common version of this error in object-oriented code:

```cpp
#include <iostream>

class Point {
public:
    Point(int x, int y) : x(x), y(y) {}
    int x, y;
};

int main() {
    Point origin;   // there is no constructor that takes no arguments
    std::cout << origin.x << '\n';
}
```

```
GCC:    error: no matching function for call to 'Point::Point()'
        note: candidate: 'Point::Point(int, int)'
Clang:  error: no matching constructor for initialization of 'Point'
MSVC:   error C2512: 'Point': no appropriate default constructor available
```

`Point origin;` asks for a constructor with **no** arguments. The moment you write any constructor yourself, C++ stops generating that default one for you.

**Fix:** pass the arguments the constructor needs — `Point origin(0, 0);` — or add a default constructor:

```cpp
#include <iostream>

class Point {
public:
    Point() : x(0), y(0) {}               // add a default constructor...
    Point(int x, int y) : x(x), y(y) {}
    int x, y;
};

int main() {
    Point origin;        // ...and this works
    Point p(3, 4);
    std::cout << origin.x << ' ' << p.y << '\n';
}
```

More in [constructors and destructors](/posts/cpp-constructors-destructors/).

<!-- book-cta topic="fundamentals" placement="mid_article" -->

## Cause 3: The Wrong Type for push_back

```cpp
#include <vector>

int main() {
    std::vector<int> scores;
    scores.push_back("ninety");   // a string, but the vector holds ints
}
```

```
GCC:    error: no matching function for call to 'push_back(const char [7])'
Clang:  error: no matching member function for call to 'push_back'
        note: candidate function not viable: no known conversion from 'const char[7]' to 'const value_type' (aka 'const int') for 1st argument
MSVC:   error C2665: 'std::vector<int,std::allocator<int>>::push_back': no overloaded function could convert all the argument types
```

`const char [7]` is the type of the text `"ninety"`. The vector only accepts `int`s.

**Fix:** push the right type — `scores.push_back(90);` — or use a `std::vector<std::string>` if you really want to store text.

## Cause 4: getline Into a Number

A classic when reading input:

```cpp
#include <iostream>
#include <string>

int main() {
    int age;
    std::getline(std::cin, age);   // getline reads into a std::string
}
```

```
GCC:    error: no matching function for call to 'getline(std::istream&, int&)'
Clang:  error: no matching function for call to 'getline'
MSVC:   error C2672: 'std::getline': no matching overloaded function found
```

`std::getline` reads a whole line of **text**, so it needs a `std::string`.

**Fix:** read into a string, then convert it — or use `std::cin >> age;` if you only want the number:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string line;
    std::getline(std::cin, line);    // read the whole line as text...
    int age = std::stoi(line);       // ...then convert it
    std::cout << age + 1 << '\n';
}
```

See [getline vs cin](/posts/cpp-getline-vs-cin/) for when to use each.

## Cause 5: Mixed Types in std::max and std::min

```cpp
#include <algorithm>
#include <iostream>

int main() {
    int a = 5;
    double b = 2.5;
    std::cout << std::max(a, b) << '\n';   // int and double
}
```

```
GCC:    error: no matching function for call to 'max(int&, double&)'
        note:   deduced conflicting types for parameter 'const _Tp' ('int' and 'double')
Clang:  error: no matching function for call to 'max'
        note: candidate template ignored: deduced conflicting types for parameter '_Tp' ('int' vs. 'double')
MSVC:   error C2672: 'std::max': no matching overloaded function found
```

`std::max` compares two values **of the same type**. Given an `int` and a `double`, it can't decide which type to use, so neither version matches.

**Fix:** tell it the type:

```cpp
#include <algorithm>
#include <iostream>

int main() {
    int a = 5;
    double b = 2.5;
    std::cout << std::max<double>(a, b) << '\n';   // tell max which type to use
}
```

Or make both arguments the same type first, for example with `static_cast<double>(a)`.

## Quick Reference

| You see | Usual cause | Fix |
|---|---|---|
| `candidate expects 2 arguments, 1 provided` | Wrong number of arguments | Pass what one version expects |
| `no matching function for call to 'X::X()'` | No default constructor | Pass arguments, or add `X()` |
| `push_back(const char [N])` | Wrong element type | Push the vector's element type |
| `getline(std::istream&, int&)` | `getline` into a number | Read a `std::string`, then convert |
| `deduced conflicting types` | Mixed types in a template | Name the type, or convert one argument |

For other common messages, see [C++ error messages explained](/posts/cpp-error-messages/).

---

## Take Your C++ Further

<!-- book-cta topic="fundamentals" placement="end_cta" -->

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the most common errors and what they mean.
- [Function Overloading in C++](/posts/cpp-function-overloading/) — how C++ picks between versions.
- [Constructors and Destructors](/posts/cpp-constructors-destructors/) — writing the constructors you need.
- [How to Fix 'expected primary-expression before'](/posts/cpp-expected-primary-expression/) — another common function-call mistake.
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — what a vector can and can't hold.
