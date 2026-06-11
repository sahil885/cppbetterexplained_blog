---
title: "How to Compare Strings in C++: ==, compare(), and strcmp Explained"
description: "Learn how to compare strings in C++ with ==, compare(), and strcmp. Understand case-insensitive comparison and common pitfalls, with working code examples."
pubDatetime: 2026-06-10T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "strings", "tutorial"]
faqSchema:
  - question: "How do you compare two strings in C++?"
    answer: "For std::string, just use the == operator: if (a == b). It compares the actual character content. The relational operators <, >, <=, and >= also work and compare strings alphabetically."
  - question: "Why does == not work for comparing C-style strings (char arrays)?"
    answer: "With char arrays, == compares the memory addresses of the arrays, not their contents, so two identical strings stored at different addresses compare as unequal. Use strcmp(a, b) == 0 instead, or switch to std::string."
  - question: "How do you compare strings case-insensitively in C++?"
    answer: "The standard library has no built-in case-insensitive comparison. The common approach is to convert both strings to lowercase with std::tolower, then compare normally with ==."
draft: false
featured: false
---

# How to Compare Strings in C++: ==, compare(), and strcmp Explained

Comparing strings sounds trivial — until `==` mysteriously returns false for two strings that print identically, or your sorted list puts "Zebra" before "apple". This guide covers the right way to compare `std::string`, the C-string trap, and case-insensitive comparison.

---

## Comparing std::string with == (the normal way)

For `std::string`, the comparison operators do exactly what you'd hope — they compare character content:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string password = "secret123";
    std::string input;

    std::cout << "Enter password: ";
    std::cin >> input;

    if (input == password) {
        std::cout << "Access granted\n";
    } else {
        std::cout << "Access denied\n";
    }

    return 0;
}
```

`!=`, `<`, `>`, `<=`, and `>=` all work too. The ordering operators compare *lexicographically* — character by character using each character's numeric value. That's why ordering is alphabetical for same-case letters, but `"Zebra" < "apple"` is true: capital `'Z'` (90) is less than lowercase `'a'` (97) in ASCII. Keep that in mind when sorting — see [std::sort explained](/posts/cpp-sort-algorithm/).

---

## The C-string trap: == compares addresses, not content

This is the bug that bites every beginner who mixes C and C++ styles:

```cpp
#include <iostream>
#include <cstring>

int main() {
    char a[] = "hello";
    char b[] = "hello";

    if (a == b) {
        std::cout << "equal\n";
    } else {
        std::cout << "NOT equal\n";   // this prints!
    }

    if (std::strcmp(a, b) == 0) {
        std::cout << "strcmp says: equal\n";  // correct
    }

    return 0;
}
```

Why? `a` and `b` are arrays, and in a comparison they decay to pointers — so `a == b` asks "do these live at the same address?", not "do they contain the same text?". `strcmp` compares contents and returns 0 when they match. Better yet, use `std::string` and avoid the trap entirely — our [string vs char array guide](/posts/cpp-string-vs-char-array/) explains when each makes sense.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The compare() method: three-way comparison

`std::string` also has a `compare()` method that returns a negative number, zero, or a positive number — like `strcmp`:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string a = "apple";
    std::string b = "banana";

    int result = a.compare(b);

    if (result < 0) {
        std::cout << a << " comes before " << b << '\n';
    } else if (result > 0) {
        std::cout << a << " comes after " << b << '\n';
    } else {
        std::cout << "identical\n";
    }

    return 0;
}
```

In everyday code, `==` and `<` are clearer. `compare()` earns its keep when you need all three outcomes (before/equal/after) from a single pass, or when comparing substrings: `a.compare(0, 3, b, 0, 3)` compares the first three characters of each without creating temporary strings.

---

## Case-insensitive comparison

C++ has no built-in case-insensitive compare, so the standard recipe is: lowercase both, then compare.

```cpp
#include <iostream>
#include <string>
#include <algorithm>
#include <cctype>

std::string toLower(std::string s) {
    std::transform(s.begin(), s.end(), s.begin(),
                   [](unsigned char c) { return std::tolower(c); });
    return s;
}

int main() {
    std::string a = "Hello";
    std::string b = "HELLO";

    if (toLower(a) == toLower(b)) {
        std::cout << "Same word (ignoring case)\n";
    }

    return 0;
}
```

Note the `unsigned char` in the lambda — `std::tolower` has undefined behavior for negative char values, which can occur with accented characters. The cast keeps it safe. Curious about the lambda syntax? See [lambda functions explained](/posts/cpp-lambda-functions/).

---

## Which should you use?

Use `==` with `std::string` for everyday equality, `<` for alphabetical ordering, `compare()` when you need before/equal/after in one call or substring comparison, and `strcmp` only when stuck with C-style strings. And when you only need to know if one string *contains* another, that's a different tool: [check if a string contains a substring](/posts/cpp-string-contains-substring/).

---

## Related Articles

- [C++ String Handling: std::string, string_view, and Performance Tips](/posts/cpp-string-handling/)
- [C++ string vs char Array: Which Should You Use?](/posts/cpp-string-vs-char-array/)
- [C++ Check if String Contains Substring](/posts/cpp-string-contains-substring/)
- [C++ std::sort Explained: How to Sort Vectors and Arrays for Beginners](/posts/cpp-sort-algorithm/)
- [C++ Conditionals Tutorial: if, else, and switch Explained](/posts/cpp-conditionals-tutorial/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
