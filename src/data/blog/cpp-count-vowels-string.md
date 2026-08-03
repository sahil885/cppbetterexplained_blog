---
title: "C++ Program to Count Vowels in a String (3 Ways)"
description: "Write a C++ program to count vowels in a string. Learn the loop approach, a switch version, and the STL one-liner with count_if, plus handling uppercase."
pubDatetime: 2026-08-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "strings", "practice", "tutorial"]
faqSchema:
  - question: "How do I count vowels in a string in C++?"
    answer: "Loop over each character of the string, convert it to lowercase with std::tolower, and increment a counter when the character is one of a, e, i, o, or u. Reading the string with std::getline lets the program handle full sentences with spaces."
  - question: "How do I count both uppercase and lowercase vowels?"
    answer: "Normalise each character before testing it by calling std::tolower from the cctype header. Cast the character to unsigned char first, because passing a negative char value to tolower is undefined behaviour."
  - question: "Can I count vowels without writing a loop in C++?"
    answer: "Yes. std::count_if from the algorithm header takes the string's begin and end iterators plus a lambda that returns true for vowels, and returns how many characters matched. It is a single expression and reads clearly."
draft: false
featured: false
---

# C++ Program to Count Vowels in a String (3 Ways)

Counting vowels is a classic first string exercise, and it's a good one — it forces you to deal with three things at once: iterating a string, comparing characters, and handling case. Let's build it three ways, from the most explicit to the most idiomatic.

---

## Method 1: The Straightforward Loop

```cpp
#include <iostream>
#include <string>
#include <cctype>

int main() {
    std::string text;

    std::cout << "Enter a sentence: ";
    std::getline(std::cin, text);

    int vowels = 0;

    for (char c : text) {
        char lower = static_cast<char>(std::tolower(static_cast<unsigned char>(c)));

        if (lower == 'a' || lower == 'e' || lower == 'i' ||
            lower == 'o' || lower == 'u') {
            ++vowels;
        }
    }

    std::cout << "Vowels: " << vowels << "\n";
    return 0;
}
```

Sample run:

```
Enter a sentence: Better Explained
Vowels: 6
```

Three decisions worth explaining.

**`std::getline` instead of `std::cin >>`.** The `>>` operator stops at the first space, so `"Better Explained"` would only give you `"Better"`. `getline` reads the whole line — see [getline for string input](/posts/cpp-getline-string-input/).

**The range-based for loop.** `for (char c : text)` visits every character without you managing an index. Cleaner than `for (size_t i = 0; i < text.length(); ++i)` and impossible to get the bounds wrong. More in [range-based for loops](/posts/cpp-range-based-for-loop/).

**The double cast around `tolower`.** This looks like paranoia and isn't. `std::tolower` takes an `int` that must be representable as `unsigned char`. On systems where `char` is signed, a character like `é` in extended input arrives as a negative number, and passing that to `tolower` is undefined behaviour. Casting to `unsigned char` first makes it safe; casting the result back to `char` avoids a narrowing warning.

---

## Method 2: Using a switch

When you're comparing one variable against a list of fixed values, a [switch statement](/posts/cpp-switch-statement/) often reads better:

```cpp
#include <iostream>
#include <string>
#include <cctype>

int countVowels(const std::string& text) {
    int vowels = 0;

    for (char c : text) {
        switch (std::tolower(static_cast<unsigned char>(c))) {
            case 'a':
            case 'e':
            case 'i':
            case 'o':
            case 'u':
                ++vowels;
                break;
            default:
                break;
        }
    }

    return vowels;
}

int main() {
    std::cout << countVowels("Programming in C++") << "\n";   // 4
    return 0;
}
```

The stacked `case` labels with no `break` between them are deliberate fall-through: any of the five lands on the same `++vowels`. This is the one situation where fall-through is idiomatic rather than a bug.

Note the parameter is `const std::string&`. Taking it by reference avoids copying the whole string on every call, and `const` promises the function won't modify it — see [pass by value vs reference](/posts/cpp-pass-by-value-reference/).

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Method 3: The STL Version

Once you know [lambdas](/posts/cpp-lambda-functions/), the whole thing collapses into one expression:

```cpp
#include <iostream>
#include <string>
#include <algorithm>
#include <cctype>

int main() {
    std::string text = "The Standard Template Library";

    auto count = std::count_if(text.begin(), text.end(), [](char c) {
        return std::string("aeiou").find(
            static_cast<char>(std::tolower(static_cast<unsigned char>(c)))
        ) != std::string::npos;
    });

    std::cout << "Vowels: " << count << "\n";   // Vowels: 8
    return 0;
}
```

`std::count_if` walks the range and returns how many elements made the lambda return `true`. The lambda uses `std::string::find`, which returns `std::string::npos` when the character isn't in `"aeiou"` — so `!= npos` means "it is a vowel."

This is shorter, but it isn't automatically better. The explicit loop in Method 1 is easier for a beginner to read, and the compiler generates similar code for both. Use the STL version when it makes the *intent* clearer, not to save lines.

---

## Counting Consonants and Other Characters Too

A more useful version reports the full breakdown:

```cpp
#include <iostream>
#include <string>
#include <cctype>

int main() {
    std::string text;
    std::cout << "Enter a sentence: ";
    std::getline(std::cin, text);

    int vowels = 0, consonants = 0, digits = 0, others = 0;

    for (char c : text) {
        unsigned char uc = static_cast<unsigned char>(c);

        if (std::isalpha(uc)) {
            char lower = static_cast<char>(std::tolower(uc));
            if (lower == 'a' || lower == 'e' || lower == 'i' ||
                lower == 'o' || lower == 'u') {
                ++vowels;
            } else {
                ++consonants;
            }
        } else if (std::isdigit(uc)) {
            ++digits;
        } else {
            ++others;
        }
    }

    std::cout << "Vowels:     " << vowels     << "\n";
    std::cout << "Consonants: " << consonants << "\n";
    std::cout << "Digits:     " << digits     << "\n";
    std::cout << "Other:      " << others     << "\n";

    return 0;
}
```

Sample run:

```
Enter a sentence: C++ 17 is great
Vowels:     3
Consonants: 5
Digits:     2
Other:      5
```

The key structural change is checking `std::isalpha` **first**. Without it, spaces, punctuation, and digits would all get counted as consonants — the most common bug in beginner versions of this program.

---

## What About 'y'?

English treats `y` as a vowel in *rhythm* and a consonant in *yellow*, and no simple rule separates them. Interview versions of this problem almost always exclude `y`. If a spec requires it, add `'y'` to the list and document the choice.

---

## Related Articles

- [C++ String Handling](/posts/cpp-string-handling/)
- [C++ getline: Read a Full Line of Input](/posts/cpp-getline-string-input/)
- [C++ Switch Statement](/posts/cpp-switch-statement/)
- [C++ Lambda Functions](/posts/cpp-lambda-functions/)
- [C++ Uppercase and Lowercase Conversion](/posts/cpp-uppercase-lowercase/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
