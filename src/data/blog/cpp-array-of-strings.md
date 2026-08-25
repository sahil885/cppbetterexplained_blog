---
title: "Array of Strings in C++: 4 Ways to Store a List of Text"
description: "Learn how to make an array of strings in C++ using std::string, vector, char arrays, and 2D char arrays, with working code and which one you should use."
pubDatetime: 2026-08-25T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "strings", "arrays", "tutorial"]
faqSchema:
  - question: "How do you declare an array of strings in C++?"
    answer: "The simplest way is a std::string array, written as std::string names[3] = {\"Ana\", \"Ben\", \"Cara\"};. You need to include the string header first. If the number of names can change while the program runs, use a std::vector<std::string> instead of a fixed array."
  - question: "What is the difference between string array and vector of strings?"
    answer: "A std::string array has a fixed size decided when you write the code, so you cannot add or remove entries later. A std::vector<std::string> can grow and shrink at runtime with push_back and erase, and it always knows its own size through the size member function."
  - question: "How do you loop through an array of strings in C++?"
    answer: "The cleanest way is a range-based for loop such as for (const std::string& name : names). Using const and a reference avoids copying each string, which matters because copying a string allocates memory. A classic index loop with i works too when you need the position."
draft: false
featured: false
---

# Array of Strings in C++: 4 Ways to Store a List of Text

Storing a list of names, menu options, or words is one of the first things you need in a real program. C++ gives you four different ways to do it — and picking the wrong one is a common source of confusing errors for beginners.

Here they are, from the one you should almost always use to the ones you should recognise but avoid.

---

## Option 1: std::string Array (Fixed Size)

If you know exactly how many strings you need and that count never changes, a plain array of `std::string` is the simplest tool:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string days[7] = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};

    for (const std::string& day : days)
        std::cout << day << " ";
    std::cout << "\n";

    std::cout << "Third day: " << days[2] << "\n";
    std::cout << "Length of first: " << days[0].length() << "\n";

    return 0;
}
```

Output:

```
Mon Tue Wed Thu Fri Sat Sun
Third day: Wed
Length of first: 3
```

Two details worth copying into your own code:

- **`#include <string>`** is required. Forgetting it is the number one cause of "`string` was not declared in this scope."
- **`const std::string&`** in the loop. Writing `std::string day` instead would copy every string on every iteration, and each copy allocates memory. The reference reads the original; `const` promises you will not modify it.

You can also let the compiler count for you by leaving the size out: `std::string days[] = {...};`.

---

## Option 2: std::vector<std::string> (Use This One)

The moment the list can change size — read from a file, built from user input, filtered — you need a [vector](/posts/cpp-vector-tutorial/):

```cpp
#include <iostream>
#include <string>
#include <vector>

int main() {
    std::vector<std::string> names = {"Ana", "Ben", "Cara"};

    names.push_back("Dev");            // add to the end
    names.erase(names.begin() + 1);    // remove "Ben"

    std::cout << "Count: " << names.size() << "\n";

    for (size_t i = 0; i < names.size(); i++)
        std::cout << i << ": " << names[i] << "\n";

    return 0;
}
```

Output:

```
Count: 3
0: Ana
1: Cara
2: Dev
```

This is the right default for almost every program. The vector knows its own size, grows automatically, frees its own memory, and passes into functions without decaying into a pointer the way a raw array does.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Option 3: Array of C-Style Strings (const char*)

You will see this in older code and in C libraries. Each element is a pointer to a string literal:

```cpp
#include <iostream>

int main() {
    const char* colors[] = {"red", "green", "blue"};
    int count = sizeof(colors) / sizeof(colors[0]);

    for (int i = 0; i < count; i++)
        std::cout << colors[i] << "\n";

    return 0;
}
```

It works, and it is genuinely lightweight — no allocation at all, since the literals live in the program's read-only data. But it comes with traps:

- You cannot modify the text. The literals are read-only, and writing through the pointer is undefined behaviour.
- You have to compute the count yourself with that `sizeof` division.
- Comparing with `==` compares **pointers**, not text. `colors[0] == "red"` may be false even though the characters match. You need `strcmp` — or, better, convert to `std::string`, where `==` does what you expect. That distinction is covered fully in [string vs char array](/posts/cpp-string-vs-char-array/).

Use this only when a C API forces you to.

---

## Option 4: 2D char Array (Avoid Unless Required)

The oldest approach: a fixed grid where each row holds one word.

```cpp
#include <iostream>

int main() {
    char words[3][10] = {"apple", "fig", "cherry"};

    for (int i = 0; i < 3; i++)
        std::cout << words[i] << "\n";

    return 0;
}
```

Every row is exactly 10 characters wide whether the word needs it or not, so `"fig"` wastes six bytes and any word longer than nine characters plus its terminating `'\0'` simply will not fit — silently corrupting memory in some compilers, refusing to build in others.

The only reason to know this form is that you will meet it in embedded code and old textbooks. In modern C++ it is strictly worse than the alternatives.

---

## Which One Should You Use?

| Approach | Resizable | Safe | Use when |
|----------|-----------|------|----------|
| `std::vector<std::string>` | Yes | Yes | **Almost always** |
| `std::string arr[N]` | No | Yes | Fixed list known at compile time |
| `const char* arr[]` | No | Risky | A C API requires it |
| `char arr[N][M]` | No | Risky | Embedded / legacy code only |

The short version: **use `std::vector<std::string>`**. Drop down to a fixed `std::string` array when the list is genuinely constant, like the days of the week. Treat the other two as things you read, not things you write.

---

## A Practical Example: Sorting and Searching Names

Once your strings are in a vector, the whole Standard Library opens up:

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

int main() {
    std::vector<std::string> names = {"Cara", "Ana", "Dev", "Ben"};

    std::sort(names.begin(), names.end());   // alphabetical

    for (const std::string& name : names)
        std::cout << name << " ";
    std::cout << "\n";

    auto it = std::find(names.begin(), names.end(), "Dev");
    if (it != names.end())
        std::cout << "Found Dev at index " << (it - names.begin()) << "\n";
    else
        std::cout << "Dev not found\n";

    return 0;
}
```

Output:

```
Ana Ben Cara Dev
Found Dev at index 3
```

`std::sort` works on strings out of the box because `std::string` defines `<` as dictionary order. Note that this is *ASCII* dictionary order, so uppercase letters sort before all lowercase ones — `"Zoe"` comes before `"ana"`.

---

## Related Articles

- [String Handling in C++](/posts/cpp-string-handling/)
- [C++ Vectors: A Complete Beginner's Guide](/posts/cpp-vector-tutorial/)
- [std::string vs char array in C++](/posts/cpp-string-vs-char-array/)
- [C++ Arrays Tutorial](/posts/cpp-arrays-tutorial/)
- [Range-Based For Loops in C++](/posts/cpp-range-based-for-loop/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
