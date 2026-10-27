---
title: "How to Fix 'no match for operator<<' in C++"
description: "Fix 'no match for operator<<' in C++: printing a vector, a struct or an enum class, a wrong operator<< signature, and cout >> mix-ups. GCC, Clang and MSVC."
pubDatetime: 2026-10-27T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "debugging"]
draft: false
featured: false
hideMidOptin: true
faqSchema:
  - question: "What does 'no match for operator<<' mean in C++?"
    answer: "You used << with a type that has no output operator. std::cout can print built-in types such as int and double, and library types such as std::string, but not a std::vector, your own struct or class, or an enum class. Print the parts one at a time, or write an operator<< for your type."
  - question: "How do I print a vector with cout?"
    answer: "Loop over it and print each element, for example for (int s : scores) std::cout << s << ' ';. The standard library has no operator<< for std::vector. With C++23 and a recent compiler, std::println(\"{}\", scores) from the <print> header also works."
  - question: "Why does my own operator<< still give 'no match'?"
    answer: "Check its signature. It should be a free function or a friend that takes the stream first and the object second, std::ostream& operator<<(std::ostream& out, const Point& p), and returns the stream. Written as a member function, it only works as p << std::cout. Without const on the second parameter, it can't print const objects or temporaries."
  - question: "What is the Clang or Visual Studio version of this error?"
    answer: "Clang says invalid operands to binary expression, followed by the two types. Visual Studio reports C2679: binary '<<': no operator found which takes a right-hand operand of type, or C2676 and C2678 when cout and cin are mixed up."
---

# How to Fix "no match for 'operator<<'" in C++

**Short answer:** you tried to print something C++ doesn't know how to print. `std::cout <<` works for built-in types such as `int` and `double`, and for library types such as `std::string`, but not for a `std::vector`, your own `struct` or `class`, or an `enum class`. Print the parts one at a time, or write an `operator<<` for your type.

| Compiler | What you see |
|---|---|
| GCC (g++, MinGW, Code::Blocks) | `no match for 'operator<<' (operand types are 'std::ostream' ... and 'Point')` |
| Clang (Xcode, macOS) | `invalid operands to binary expression ('ostream' ... and 'Point')` |
| Visual Studio | `C2679: binary '<<': no operator found which takes a right-hand operand of type 'Point'` |

<!-- optin-quick error="no match for operator&lt;&lt;" -->

---

## How to Read the Error

The message names the types on both sides of the `<<`:

```
error: no match for 'operator<<' (operand types are 'std::ostream' {aka 'std::basic_ostream<char>'} and 'Point')
```

The first type, `std::ostream`, is `std::cout`. The **second type is the thing C++ can't print**, here a `Point`. It tells you which of the causes below you're looking at.

Under the error, GCC and Clang list a long run of "candidates": every `operator<<` they tried, for `int`, `char`, `const char*` and so on. You can skip that list. None of them fit, which is exactly what the error is saying.

## Cause 1: Printing a Vector

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {90, 85, 77};
    std::cout << scores << '\n';
}
```

```
GCC:    error: no match for 'operator<<' (operand types are 'std::ostream' {aka 'std::basic_ostream<char>'} and 'std::vector<int>')
Clang:  error: invalid operands to binary expression ('ostream' (aka 'basic_ostream<char>') and 'std::vector<int>')
MSVC:   error C2679: binary '<<': no operator found which takes a right-hand operand of type 'std::vector<int,std::allocator<int>>' (or there is no acceptable conversion)
```

The standard library doesn't give `std::vector` an `operator<<`, so you print the elements yourself.

**Fix:** loop over the vector and print each element:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {90, 85, 77};
    for (int s : scores) {
        std::cout << s << ' ';
    }
    std::cout << '\n';
}
```

```
90 85 77
```

With C++23, `std::println` from `<print>` can print a whole vector: `std::println("{}", scores);` prints `[90, 85, 77]`. It needs a recent compiler. In our tests it worked with GCC 15, Clang 21 and the latest MSVC with `/std:c++latest`, but GCC 14 rejected it. For more options, see [how to print a vector](/posts/cpp-print-vector/).

## Cause 2: Printing Your Own Struct or Class

```cpp
#include <iostream>

struct Point {
    int x;
    int y;
};

int main() {
    Point p{3, 4};
    std::cout << p << '\n';
}
```

```
GCC:    error: no match for 'operator<<' (operand types are 'std::ostream' {aka 'std::basic_ostream<char>'} and 'Point')
Clang:  error: invalid operands to binary expression ('ostream' (aka 'basic_ostream<char>') and 'Point')
MSVC:   error C2679: binary '<<': no operator found which takes a right-hand operand of type 'Point' (or there is no acceptable conversion)
```

C++ can't guess how a `Point` should look on screen. You tell it by writing an `operator<<`:

```cpp
#include <iostream>

struct Point {
    int x;
    int y;
};

std::ostream& operator<<(std::ostream& out, const Point& p) {
    return out << '(' << p.x << ", " << p.y << ')';
}

int main() {
    Point p{3, 4};
    std::cout << p << '\n';
}
```

```
(3, 4)
```

Three details matter:

1. It takes the **stream first** and your object second.
2. It takes your object by **`const` reference**.
3. It **returns the stream**, so you can keep chaining, as in `std::cout << p << '\n'`.

Causes 3 and 4 are what happens when the first two go wrong. For the full picture, see [operator overloading](/posts/cpp-operator-overloading/).

<!-- book-cta topic="oop" placement="mid_article" -->

## Cause 3: operator<< Written as a Member Function

Inside a class, it feels natural to write `operator<<` as a member function. It compiles, but `std::cout << p` still fails:

```cpp
#include <iostream>

class Point {
public:
    Point(int x, int y) : x(x), y(y) {}
    std::ostream& operator<<(std::ostream& out) const {
        return out << '(' << x << ", " << y << ')';
    }
private:
    int x, y;
};

int main() {
    Point p(3, 4);
    std::cout << p << '\n';
}
```

```
GCC:    error: no match for 'operator<<' (operand types are 'std::ostream' {aka 'std::basic_ostream<char>'} and 'Point')
Clang:  error: invalid operands to binary expression ('ostream' (aka 'basic_ostream<char>') and 'Point')
MSVC:   error C2679: binary '<<': no operator found which takes a right-hand operand of type 'Point' (or there is no acceptable conversion)
```

A member operator always has its own object on the **left**. This one handles `p << std::cout`, which really does compile and print `(3, 4)`, but nobody wants to write that. For `std::cout << p`, the stream must be on the left, so the operator can't be a member of `Point`.

**Fix:** make it a `friend`. It's written inside the class and can read the private members, but it isn't a member function:

```cpp
#include <iostream>

class Point {
public:
    Point(int x, int y) : x(x), y(y) {}
    friend std::ostream& operator<<(std::ostream& out, const Point& p) {
        return out << '(' << p.x << ", " << p.y << ')';
    }
private:
    int x, y;
};

int main() {
    Point p(3, 4);
    std::cout << p << '\n';
}
```

```
(3, 4)
```

See [friend functions](/posts/cpp-friend-function/) for how `friend` works.

## Cause 4: operator<< Without const

This version takes `Point&` instead of `const Point&`:

```cpp
#include <iostream>

struct Point {
    int x;
    int y;
};

std::ostream& operator<<(std::ostream& out, Point& p) {
    return out << '(' << p.x << ", " << p.y << ')';
}

int main() {
    const Point origin{0, 0};
    std::cout << origin << '\n';
}
```

```
GCC:    error: no match for 'operator<<' (operand types are 'std::ostream' {aka 'std::basic_ostream<char>'} and 'const Point')
        error: binding reference of type 'Point&' to 'const Point' discards qualifiers
Clang:  error: invalid operands to binary expression ('ostream' (aka 'basic_ostream<char>') and 'const Point')
        note: candidate function not viable: 2nd argument ('const Point') would lose const qualifier
MSVC:   error C2679: binary '<<': no operator found which takes a right-hand operand of type 'const Point' (or there is no acceptable conversion)
```

A plain `Point&` can't refer to a `const Point`, because nothing would stop the function changing it. Printing a temporary fails for a similar reason: `std::cout << Point{1, 2}` gives GCC's `cannot bind non-const lvalue reference of type 'Point&' to an rvalue of type 'Point'`.

**Fix:** take the object by `const` reference, as in Cause 2: `const Point& p`. Printing shouldn't change anything, so `const` is the right promise. See [const in C++](/posts/cpp-const-keyword/).

## Cause 5: Printing an enum class

```cpp
#include <iostream>

enum class Color { Red, Green, Blue };

int main() {
    Color c = Color::Green;
    std::cout << c << '\n';
}
```

```
GCC:    error: no match for 'operator<<' (operand types are 'std::ostream' {aka 'std::basic_ostream<char>'} and 'Color')
Clang:  error: invalid operands to binary expression ('ostream' (aka 'basic_ostream<char>') and 'Color')
MSVC:   error C2679: binary '<<': no operator found which takes a right-hand operand of type 'Color' (or there is no acceptable conversion)
```

A plain `enum` converts to `int` automatically, so it prints as a number. An `enum class` deliberately doesn't convert on its own.

**Fix:** convert it yourself:

```cpp
#include <iostream>

enum class Color { Red, Green, Blue };

int main() {
    Color c = Color::Green;
    std::cout << static_cast<int>(c) << '\n';
}
```

```
1
```

To print the name ("Green") instead of the number, see [how to convert an enum to a string](/posts/cpp-enum-to-string/). The difference between the two kinds of enum is in [enum vs enum class](/posts/cpp-enum-class-vs-enum/).

## Cause 6: The Arrows Point the Wrong Way

`<<` goes with `std::cout` and `>>` goes with `std::cin`. Swap them and every line gives its own "no match":

```cpp
#include <iostream>

int main() {
    int age;
    std::cout >> "Enter your age: ";
    std::cin << age;
}
```

```
GCC:    error: no match for 'operator>>' (operand types are 'std::ostream' {aka 'std::basic_ostream<char>'} and 'const char [17]')
        error: no match for 'operator<<' (operand types are 'std::istream' {aka 'std::basic_istream<char>'} and 'int')
Clang:  error: invalid operands to binary expression ('ostream' (aka 'basic_ostream<char>') and 'const char[17]')
        error: invalid operands to binary expression ('istream' (aka 'basic_istream<char>') and 'int')
MSVC:   error C2676: binary '>>': 'std::ostream' does not define this operator or a conversion to a type acceptable to the predefined operator
        error C2678: binary '<<': no operator found which takes a left-hand operand of type 'std::istream' (or there is no acceptable conversion)
```

Look at the first type in each message: `std::ostream` is `cout` and `std::istream` is `cin`. The arrows show which way the data flows. `std::cout << x` sends `x` out to the screen, and `std::cin >> x` sends what you type into `x`.

**Fix:** `std::cout << "Enter your age: ";` and `std::cin >> age;`. More in [getting user input with cin](/posts/cpp-cin-user-input/).

## Quick Reference

| The message mentions | Usual cause | Fix |
|---|---|---|
| `std::vector<...>` | Vectors have no `<<` | Loop over it, or `std::println` in C++23 |
| Your struct or class | You haven't written `operator<<` | `std::ostream& operator<<(std::ostream&, const T&)` |
| Your class, and you did write `operator<<` | It's a member function | Make it a `friend` |
| `const T`, or a temporary | The parameter is `T&`, not `const T&` | Add `const` |
| An `enum class` | No automatic conversion to `int` | `static_cast<int>(value)` |
| `std::ostream` with `>>`, or `std::istream` with `<<` | Arrows reversed | `cout <<` and `cin >>` |

For other common messages, see [C++ error messages explained](/posts/cpp-error-messages/).

---

## Take Your C++ Further

<!-- book-cta topic="oop" placement="end_cta" -->

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the most common errors and what they mean.
- [Operator Overloading in C++](/posts/cpp-operator-overloading/) — writing operators for your own types.
- [Friend Functions in C++](/posts/cpp-friend-function/) — why `operator<<` is usually a friend.
- [How to Print a Vector in C++](/posts/cpp-print-vector/) — loops, iterators and more.
- [How to Fix 'no matching function for call to'](/posts/cpp-no-matching-function-for-call/) — the same kind of error for function calls.
