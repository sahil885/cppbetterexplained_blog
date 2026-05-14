---
title: "C++ Convert int to string (and string to int): Complete Guide"
description: "Learn how to convert between int and string in C++. Covers to_string(), stoi(), stol(), stod(), stringstream, and common mistakes with clear examples."
pubDatetime: 2026-05-14T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "strings", "tutorial"]
faqSchema:
  - question: "How do you convert int to string in C++?"
    answer: "Use std::to_string(). Example: int n = 42; string s = to_string(n); // s is \"42\". This works for int, long, double, and other numeric types. It requires C++11 or later."
  - question: "How do you convert string to int in C++?"
    answer: "Use std::stoi() (string to int). Example: string s = \"42\"; int n = stoi(s); // n is 42. If the string can't be converted, stoi() throws a std::invalid_argument exception. stol() converts to long, stod() to double."
  - question: "What is the difference between stoi and atoi in C++?"
    answer: "stoi() is the C++11 function that takes a std::string and throws exceptions on failure. atoi() is the older C function that takes a char* and returns 0 on failure without signalling an error. Prefer stoi() in modern C++ code."
draft: false
featured: false
---

# C++ Convert int to string (and string to int): Complete Guide

Type conversions between numbers and strings are something you'll do constantly in C++. You read a number from user input (which arrives as text), you build a filename with a number in it, you display a formatted message combining words and values. All of these require converting between `int` (or `double`) and `string`.

C++ has clean, modern functions for both directions. This tutorial covers all of them.

---

## int to string: to_string()

The simplest way to convert any numeric type to a string is `std::to_string()`, available since C++11:

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int n = 42;
    string s = to_string(n);
    cout << s << endl;         // "42"
    cout << s + " is the answer" << endl;  // "42 is the answer"
    return 0;
}
```

`to_string()` works with `int`, `long`, `long long`, `float`, `double`, and `long double`:

```cpp
double price = 9.99;
string label = "$" + to_string(price);
cout << label << endl;  // "$9.990000"
```

Notice the trailing zeros — `to_string()` with doubles gives 6 decimal places by default. If you need more control over formatting, use `stringstream` (covered below).

---

## string to int: stoi()

`stoi()` converts a `std::string` to an `int`. The name stands for **s**tring **to** **i**nt:

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "42";
    int n = stoi(s);
    cout << n + 1 << endl;  // 43
    return 0;
}
```

`stoi()` handles leading whitespace automatically:

```cpp
int n = stoi("  100  ");  // n = 100, whitespace ignored
```

It stops at the first non-numeric character:

```cpp
int n = stoi("42abc");  // n = 42, stops at 'a'
```

---

## The stoi Family

C++11 provides a set of related functions for different numeric types:

| Function | Converts to |
|----------|------------|
| `stoi(s)` | `int` |
| `stol(s)` | `long` |
| `stoll(s)` | `long long` |
| `stoul(s)` | `unsigned long` |
| `stoull(s)` | `unsigned long long` |
| `stof(s)` | `float` |
| `stod(s)` | `double` |
| `stold(s)` | `long double` |

```cpp
#include <string>
using namespace std;

string s1 = "12345678901234";  // Too big for int
long long big = stoll(s1);    // Use stoll for large numbers

string s2 = "3.14159";
double pi = stod(s2);          // Use stod for decimals
```

---

## Handling Errors with stoi

`stoi()` throws exceptions when conversion fails. You should handle them:

```cpp
#include <iostream>
#include <string>
#include <stdexcept>
using namespace std;

int main() {
    string input = "hello";

    try {
        int n = stoi(input);
        cout << n << endl;
    } catch (const invalid_argument& e) {
        cout << "Not a valid number: " << input << endl;
    } catch (const out_of_range& e) {
        cout << "Number too large for int" << endl;
    }

    return 0;
}
```

`invalid_argument` fires when the string doesn't contain a number at all. `out_of_range` fires when the number is too big to fit in the target type.

This is particularly important when reading user input — users don't always type what you expect.

---

## The Old Way: atoi() (Avoid in New Code)

Before C++11, `atoi()` (from `<cstdlib>`) was the standard approach:

```cpp
#include <cstdlib>
const char* s = "42";
int n = atoi(s);  // 42
```

The problem: when `atoi()` fails, it returns 0 — the same as successfully parsing `"0"`. You can't tell success from failure.

`stoi()` throws exceptions on failure, so you always know when something went wrong. Use `stoi()` in all new code.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Formatted Conversion: stringstream

When `to_string()` doesn't give you enough control — like limiting decimal places — use `stringstream`:

```cpp
#include <iostream>
#include <sstream>
#include <iomanip>
using namespace std;

int main() {
    double price = 9.5;

    ostringstream oss;
    oss << fixed << setprecision(2) << price;
    string formatted = oss.str();

    cout << "$" + formatted << endl;  // "$9.50"
    return 0;
}
```

`fixed` means don't use scientific notation. `setprecision(2)` means 2 decimal places. `oss.str()` extracts the string from the stream.

You can also build complex strings by streaming multiple values:

```cpp
ostringstream oss;
int id = 7;
string name = "Alice";
double score = 98.5;
oss << "Student #" << id << " (" << name << "): " << fixed << setprecision(1) << score;
cout << oss.str() << endl;
// Student #7 (Alice): 98.5
```

### Using stringstream to parse strings

`stringstream` works in reverse too — you can extract values from a string:

```cpp
#include <sstream>
using namespace std;

string data = "42 3.14 hello";
istringstream iss(data);

int n;
double d;
string word;

iss >> n >> d >> word;
// n = 42, d = 3.14, word = "hello"
```

This is handy for parsing structured text without reaching for a full parser.

---

## Practical Examples

### Building a filename with a number

```cpp
#include <string>
using namespace std;

int frameNumber = 15;
string filename = "frame_" + to_string(frameNumber) + ".png";
// "frame_15.png"
```

### Reading a number from user input

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string input;
    cout << "Enter a number: ";
    cin >> input;

    try {
        int n = stoi(input);
        cout << "Double it: " << n * 2 << endl;
    } catch (...) {
        cout << "That's not a number." << endl;
    }
    return 0;
}
```

### Splitting a comma-separated string of numbers

```cpp
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

int main() {
    string csv = "10,20,30,40,50";
    vector<int> numbers;

    stringstream ss(csv);
    string token;

    while (getline(ss, token, ',')) {
        numbers.push_back(stoi(token));
    }

    for (int n : numbers) cout << n << " ";
    cout << endl;  // 10 20 30 40 50
    return 0;
}
```

---

## Common Mistakes

**Using `+` to concatenate int and string directly**  
```cpp
int n = 5;
// string s = "Number: " + n;  // WRONG — undefined behaviour
string s = "Number: " + to_string(n);  // Correct
```

**Trusting atoi's return value**  
`atoi("hello")` returns 0. So does `atoi("0")`. You can't tell them apart. Use `stoi()` with exception handling.

**Forgetting that stoi stops at the first non-digit**  
`stoi("12.5")` returns 12 (it stops at the decimal point). Use `stod()` for floating-point strings.

**Overflow with stoi for large numbers**  
`stoi("99999999999")` throws `out_of_range` because the number doesn't fit in an `int`. Use `stoll()` for large values.

---

## Quick Reference

| Task | Code |
|------|------|
| int → string | `to_string(n)` |
| double → string (basic) | `to_string(d)` |
| double → string (formatted) | `ostringstream` + `setprecision` |
| string → int | `stoi(s)` |
| string → double | `stod(s)` |
| string → long long | `stoll(s)` |
| Parse multiple from string | `istringstream` |

---

## Related Articles

- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — the types you'll be converting between
- [C++ String Handling](/posts/cpp-string-handling/) — more string operations beyond conversion
- [C++ User Input with cin](/posts/cpp-cin-user-input/) — getting strings from the keyboard to convert
- [C++ Exception Handling](/posts/exception-handling-cpp/) — properly handling stoi failures

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
