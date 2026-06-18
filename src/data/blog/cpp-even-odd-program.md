---
title: "C++ Even or Odd Program: Check Any Number (3 Ways)"
description: "Write a C++ program to check if a number is even or odd, three ways: the modulo method, with user input from cin, and a clean one-line ternary version."
pubDatetime: 2026-06-18T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "project", "tutorial"]
faqSchema:
  - question: "How do you check if a number is even or odd in C++?"
    answer: "Use the modulo operator: if (number % 2 == 0) the number is even, otherwise it is odd. This works because even numbers divide by 2 with no remainder."
  - question: "How do you check even or odd with user input in C++?"
    answer: "Read the number with std::cin into an int variable, then test number % 2 == 0. If true, print that it is even; if false, print that it is odd."
  - question: "Is there a faster way to check even or odd than modulo?"
    answer: "Yes, the bitwise test (number & 1) == 0 is true for even numbers. It checks the last bit directly. For beginners, the modulo version is clearer and just as good."
draft: false
featured: false
---

# C++ Even or Odd Program

Checking whether a number is even or odd is one of the first real programs every C++ beginner writes. It's small, but it teaches the modulo operator, conditionals, and reading input — three skills you'll use forever. Let's build it three ways.

---

## Method 1: The Modulo Check

An even number divides by 2 with nothing left over. The modulo operator `%` gives the remainder, so `number % 2 == 0` means "even":

```cpp
#include <iostream>

int main() {
    int number = 7;
    if (number % 2 == 0)
        std::cout << number << " is even\n";
    else
        std::cout << number << " is odd\n";
    return 0;
}
```

`7 % 2` is `1` (odd), so this prints "7 is odd." Change `number` to `8` and the remainder becomes `0`, so it prints "even." That `% 2 == 0` test is the heart of the whole program.

---

## Method 2: Ask the User

A program is more useful when it works on any number the user types. Read it with `std::cin`:

```cpp
#include <iostream>

int main() {
    int number;
    std::cout << "Enter a number: ";
    std::cin >> number;

    if (number % 2 == 0)
        std::cout << number << " is even\n";
    else
        std::cout << number << " is odd\n";
    return 0;
}
```

`std::cin >> number` waits for the user to type a value and stores it. Everything else is the same — the logic doesn't care where the number came from.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Method 3: The One-Line Ternary

Once the idea is clear, you can collapse the `if/else` into a single line with the ternary operator:

```cpp
#include <iostream>
#include <string>

int main() {
    int number = 13;
    std::string result = (number % 2 == 0) ? "even" : "odd";
    std::cout << number << " is " << result << "\n";
    return 0;
}
```

The ternary picks `"even"` when the test is true and `"odd"` when it's false. It's the same logic, just more compact — handy once you're comfortable with the pattern.

---

## Reusing It with a Function

If you check even/odd in several places, wrap it in a function so you write the logic once:

```cpp
#include <iostream>

bool isEven(int n) {
    return n % 2 == 0;
}

int main() {
    for (int i = 1; i <= 5; ++i)
        std::cout << i << ": " << (isEven(i) ? "even" : "odd") << "\n";
    return 0;
}
```

`isEven` returns a `bool` you can use anywhere a condition is expected. This is a great early example of why functions make code cleaner and easier to read.

---

## Bonus: The Bitwise Shortcut

Experienced programmers sometimes use `& 1` to test the last bit, which is `0` for even numbers:

```cpp
#include <iostream>

int main() {
    int number = 42;
    // The last bit is 0 for even numbers, 1 for odd
    if ((number & 1) == 0)
        std::cout << "even\n";
    else
        std::cout << "odd\n";
    return 0;
}
```

This is slightly faster, but `% 2` is just as efficient on modern compilers and far easier to read. Stick with modulo unless you have a specific reason not to.

---

## Related Articles

- [C++ Modulo Operator (%)](/posts/cpp-modulo-operator/) — the operator behind this program
- [C++ Conditionals Tutorial](/posts/cpp-conditionals-tutorial/) — if, else, and comparisons
- [C++ cin User Input](/posts/cpp-cin-user-input/) — reading values from the keyboard
- [C++ Ternary Operator](/posts/cpp-ternary-operator/) — the one-line if/else
- [C++ Prime Number Program](/posts/cpp-prime-number-program/) — another classic beginner build

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
