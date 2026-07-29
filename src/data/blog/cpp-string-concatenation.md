---
title: "C++ String Concatenation: 5 Ways to Join Strings"
description: "C++ string concatenation made simple: use +, +=, append(), stringstream, or C++20 format to join strings. Learn which method to pick and the char array gotcha."
pubDatetime: 2026-07-29T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "strings", "tutorial"]
faqSchema:
  - question: "How do you concatenate strings in C++?"
    answer: "The easiest way is the + operator with std::string: string full = first + last. You can also use += to append in place, the append() method, or a stringstream when combining many pieces. All work on std::string objects."
  - question: "Can you use + to concatenate two char arrays in C++?"
    answer: "No. Adding two C-style char arrays with + adds pointers, not text, which is a bug. Convert at least one to std::string first, or use strcat for C strings. With std::string the + operator works as expected."
  - question: "What is the fastest way to concatenate many strings in C++?"
    answer: "For many pieces, repeatedly using += or a std::ostringstream is efficient because they avoid creating a new string on every step. Calling reserve() first to pre-size the string also helps when you know the final length."
draft: false
featured: false
---

# C++ String Concatenation: 5 Ways to Join Strings

Joining two strings into one — "Hello" plus "World" giving "Hello World" — is called concatenation, and C++ gives you several ways to do it. The good news: with `std::string`, it's as easy as using `+`. This guide covers five methods and, just as importantly, the one mistake beginners always make.

---

## Method 1: The + Operator

The simplest and most readable approach. It creates a brand-new string from the two pieces:

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string first = "Hello";
    string second = "World";
    string result = first + " " + second;

    cout << result << "\n";   // Hello World
    return 0;
}
```

You can chain as many `+` operations as you like. Each `+` produces a new `string`, which is perfectly fine for a handful of pieces.

---

## Method 2: The += Operator (Append in Place)

When you want to grow an existing string rather than build a new one, use `+=`:

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string message = "Score: ";
    message += "100";
    message += " points";

    cout << message << "\n";   // Score: 100 points
    return 0;
}
```

`+=` is efficient because it adds onto the string you already have instead of allocating a fresh one every time — useful inside loops that assemble a result piece by piece.

---

## Method 3: The append() Method

`append()` does the same job as `+=` but reads a little more explicitly, and it can do extra tricks like appending only part of another string:

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "Data";
    s.append("base");            // "Database"
    s.append(3, '!');            // add '!' three times -> "Database!!!"

    cout << s << "\n";
    return 0;
}
```

The `append(3, '!')` form — "add this character N times" — is something `+` can't do as cleanly.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Method 4: stringstream for Mixed Data

When you're combining strings **with numbers**, `+` won't work directly because you can't add an `int` to a `string`. A `stringstream` handles the conversion for you:

```cpp
#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    int level = 7;
    double score = 98.5;

    stringstream ss;
    ss << "Level " << level << " - Score " << score;

    string result = ss.str();
    cout << result << "\n";   // Level 7 - Score 98.5
    return 0;
}
```

This is the cleanest way to build a string out of a mix of text and numeric values.

---

## Method 5: std::format (C++20)

If you're on a modern compiler with C++20, `std::format` gives you clean, Python-style formatting:

```cpp
#include <iostream>
#include <format>   // C++20
using namespace std;

int main() {
    string name = "Sahil";
    int age = 25;

    string msg = format("{} is {} years old", name, age);
    cout << msg << "\n";      // Sahil is 25 years old
    return 0;
}
```

The `{}` placeholders are filled in order. It's the most readable option when it's available to you.

---

## The Trap: Concatenating char Arrays

Here's the mistake nearly every beginner makes. You **cannot** join two C-style string literals with `+`:

```cpp
// WRONG — this adds two pointers, not the text
// string s = "Hello" + "World";   // compile error

// RIGHT — make at least one a std::string first
string s = string("Hello") + "World";   // "HelloWorld"

// Also fine — a string variable plus a literal
string greeting = "Hello";
string full = greeting + "World";        // "HelloWorld"
```

The reason: string literals are `const char*` pointers, and `+` on two pointers is meaningless. As long as one side is a `std::string`, the string version of `+` kicks in and does what you expect. **The fix is simply to work with `std::string`, not raw char arrays.**

---

## Which Method Should You Use?

| Situation | Best method |
|-----------|-------------|
| Joining a few strings | `+` operator |
| Building up a string in a loop | `+=` or `append()` |
| Repeating a character | `append(n, ch)` |
| Mixing strings and numbers | `stringstream` |
| C++20 available, readability first | `std::format` |

For everyday code, `+` and `+=` cover almost everything. Reach for `stringstream` the moment numbers enter the picture.

---

## Related Articles

- [C++ String Handling](/posts/cpp-string-handling/) — the full std::string toolkit
- [C++ stringstream](/posts/cpp-stringstream/) — parsing and building strings in depth
- [C++ int to string](/posts/cpp-int-to-string/) — converting numbers before you join them
- [C++ String vs char Array](/posts/cpp-string-vs-char-array/) — why the + trap happens
- [C++ Compare Strings](/posts/cpp-compare-strings/) — the other everyday string operation

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
