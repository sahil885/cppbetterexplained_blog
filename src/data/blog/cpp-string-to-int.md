---
title: "How to Convert String to int in C++: stoi, atoi, and stringstream"
description: "Learn how to convert a string to int in C++ using stoi, atoi, and stringstream. Includes error handling, examples, and when to use each method."
pubDatetime: 2026-05-23T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "strings", "tutorial"]
faqSchema:
  - question: "How do I convert a string to an int in C++?"
    answer: "The easiest way is std::stoi(str), which converts a std::string to an int and throws an exception if the string is not a valid number. For C-style strings use atoi(), though it lacks error handling."
  - question: "What is the difference between stoi and atoi in C++?"
    answer: "stoi works with std::string and throws std::invalid_argument or std::out_of_range on bad input. atoi works with C-style char arrays and returns 0 on failure without throwing — making errors silent."
  - question: "What happens if stoi can't convert the string?"
    answer: "stoi throws std::invalid_argument if the string doesn't start with a digit, and std::out_of_range if the number is too large to fit in an int. Wrap it in a try/catch block to handle these cases."
draft: false
featured: false
---

# How to Convert String to int in C++

If you've ever read a number from user input or a file, you've run into this problem: the number comes in as a `std::string`, but you need an `int` to do math with it. C++ gives you three main ways to make that conversion — `stoi`, `atoi`, and `stringstream` — and each has its place.

---

## Method 1: stoi (Recommended for Modern C++)

`stoi` stands for "string to integer." It's part of the `<string>` header and is the cleanest option for converting a `std::string` to an `int`.

```cpp
#include <iostream>
#include <string>

int main() {
    std::string s = "42";
    int n = std::stoi(s);
    std::cout << n + 1 << "\n"; // prints 43
    return 0;
}
```

`stoi` also handles leading whitespace and an optional sign:

```cpp
std::string s = "  -17";
int n = std::stoi(s); // n = -17
```

### Error handling with stoi

`stoi` throws exceptions on bad input, which lets you catch problems instead of silently getting wrong answers:

```cpp
#include <iostream>
#include <string>
#include <stdexcept>

int main() {
    std::string s = "hello";
    try {
        int n = std::stoi(s);
        std::cout << n << "\n";
    } catch (const std::invalid_argument& e) {
        std::cout << "Not a valid number: " << e.what() << "\n";
    } catch (const std::out_of_range& e) {
        std::cout << "Number too large for int: " << e.what() << "\n";
    }
    return 0;
}
```

This prints: `Not a valid number: stoi`

`stoi` also has a second parameter that tells you how many characters were consumed, which is useful for parsing:

```cpp
std::string s = "123abc";
size_t pos;
int n = std::stoi(s, &pos); // n = 123, pos = 3
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Method 2: atoi (For C-Style Strings)

`atoi` is the older C-style function from `<cstdlib>`. It converts a `const char*` (not a `std::string`) to an `int`.

```cpp
#include <iostream>
#include <cstdlib>

int main() {
    const char* s = "99";
    int n = atoi(s);
    std::cout << n << "\n"; // prints 99
    return 0;
}
```

To use `atoi` with a `std::string`, call `.c_str()` to get the underlying C-string:

```cpp
#include <iostream>
#include <string>
#include <cstdlib>

int main() {
    std::string s = "99";
    int n = atoi(s.c_str());
    std::cout << n << "\n"; // prints 99
    return 0;
}
```

**The big warning with atoi:** if the string is not a valid number, it returns `0` — silently. There's no exception, no error message. This makes bugs very hard to find:

```cpp
int n = atoi("hello"); // n = 0, no error
int m = atoi("");      // m = 0, no error
```

Prefer `stoi` for new code. Use `atoi` only when working with C APIs that hand you `char*`.

---

## Method 3: stringstream

`std::stringstream` from `<sstream>` treats a string like a stream you can read from. This approach works for converting any type, not just strings to ints.

```cpp
#include <iostream>
#include <string>
#include <sstream>

int main() {
    std::string s = "55";
    std::istringstream ss(s);
    int n;
    ss >> n;
    std::cout << n << "\n"; // prints 55
    return 0;
}
```

You can also check whether the conversion succeeded:

```cpp
std::string s = "abc";
std::istringstream ss(s);
int n;
if (ss >> n) {
    std::cout << "Converted: " << n << "\n";
} else {
    std::cout << "Conversion failed\n";
}
```

`stringstream` is more verbose than `stoi`, but it's very flexible — you can chain multiple extractions from a single string, or convert to `double`, `long`, etc. with no extra syntax.

---

## Which Method Should You Use?

| Method | Works with | Error handling | Best for |
|---|---|---|---|
| `stoi` | `std::string` | Throws exceptions | Most cases in modern C++ |
| `atoi` | `const char*` | Returns 0 silently | Legacy/C code |
| `stringstream` | `std::string` | Returns false on fail | Multiple conversions, any type |

For beginner programs, use `stoi` and wrap it in a try/catch when working with user input. It's the safest and most readable option.

---

## Complete Example: Safe User Input to int

Here's a complete program that reads a number from the user, handles bad input, and keeps asking until it gets a valid integer:

```cpp
#include <iostream>
#include <string>
#include <stdexcept>

int getInt(const std::string& prompt) {
    while (true) {
        std::cout << prompt;
        std::string line;
        std::getline(std::cin, line);
        try {
            size_t pos;
            int n = std::stoi(line, &pos);
            if (pos == line.size()) { // whole string was a number
                return n;
            }
            std::cout << "Please enter a whole number.\n";
        } catch (...) {
            std::cout << "Please enter a whole number.\n";
        }
    }
}

int main() {
    int age = getInt("Enter your age: ");
    std::cout << "In 10 years you'll be " << age + 10 << ".\n";
    return 0;
}
```

This is a pattern you'll use constantly when writing interactive C++ programs.

---

## Related Articles

- [C++ int to String Conversion: to_string, stringstream, and More](/posts/cpp-int-to-string/)
- [C++ String Handling: Everything a Beginner Needs to Know](/posts/cpp-string-handling/)
- [C++ User Input with cin: Reading from the Keyboard](/posts/cpp-cin-user-input/)
- [C++ Error Messages Explained: What They Mean and How to Fix Them](/posts/cpp-error-messages/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
