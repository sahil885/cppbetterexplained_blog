---
title: "Leap Year Program in C++: Check if a Year Is a Leap Year"
description: "Write a leap year program in C++. Learn the divisible-by-4, 100, and 400 rule, see the clean one-line condition, and build a reusable isLeapYear function."
pubDatetime: 2026-07-13T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "conditionals", "tutorial"]
faqSchema:
  - question: "How do you check for a leap year in C++?"
    answer: "A year is a leap year if it is divisible by 4 and not by 100, unless it is also divisible by 400. In C++ this is one condition: (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0). Use the modulo operator % to test divisibility."
  - question: "Why is 1900 not a leap year but 2000 is?"
    answer: "Both are divisible by 4 and by 100. The rule says century years are skipped unless they are also divisible by 400. 1900 is not divisible by 400, so it is a common year, while 2000 is divisible by 400, so it is a leap year."
  - question: "What is the leap year condition in one line of C++?"
    answer: "bool isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0); This evaluates to true for leap years and false otherwise, capturing all three divisibility rules in a single boolean expression."
draft: false
featured: false
---

# Leap Year Program in C++

Checking whether a year is a leap year is a classic beginner exercise, and it's a great way to practice the modulo operator and boolean logic. The rules seem fiddly at first, but they collapse into a single clean condition.

---

## The Leap Year Rule

A leap year has 366 days instead of 365. The rule has three parts:

1. A year divisible by **4** is a leap year, **except**
2. a year divisible by **100** is **not** a leap year, **unless**
3. it is also divisible by **400**, in which case it **is** a leap year.

So 2024 is a leap year (divisible by 4), 1900 is **not** (divisible by 100 but not 400), and 2000 **is** (divisible by 400). We test "divisible by" with the modulo operator `%`, which gives the remainder: `year % 4 == 0` means "divides evenly by 4."

---

## The Straightforward Version with if/else

Let's translate the three rules directly into nested `if` statements so you can see the logic step by step:

```cpp
#include <iostream>

int main() {
    int year;
    std::cout << "Enter a year: ";
    std::cin >> year;

    bool leap;
    if (year % 4 != 0) {
        leap = false;                 // not divisible by 4 -> common year
    } else if (year % 100 != 0) {
        leap = true;                  // divisible by 4 but not 100 -> leap
    } else if (year % 400 != 0) {
        leap = false;                 // divisible by 100 but not 400 -> common
    } else {
        leap = true;                  // divisible by 400 -> leap
    }

    if (leap)
        std::cout << year << " is a leap year.\n";
    else
        std::cout << year << " is not a leap year.\n";
    return 0;
}
```

Reading it top to bottom mirrors the rules exactly, which makes it easy to trust.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The One-Line Condition

Once you understand the rules, you can express them as a single boolean expression. A year is a leap year when it's divisible by 4 **and** not by 100, **or** it's divisible by 400:

```cpp
#include <iostream>

int main() {
    int year;
    std::cout << "Enter a year: ";
    std::cin >> year;

    bool leap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);

    std::cout << year << (leap ? " is" : " is not") << " a leap year.\n";
    return 0;
}
```

The parentheses matter. The left side `(year % 4 == 0 && year % 100 != 0)` catches ordinary leap years like 2024. The right side `(year % 400 == 0)` rescues century years like 2000. Because they're joined by `||`, either one being true makes the whole thing true.

---

## A Reusable isLeapYear Function

If you need this check in more than one place, wrap it in a function that returns `bool`. This keeps your logic in one spot and reads almost like English:

```cpp
#include <iostream>

bool isLeapYear(int year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
}

int main() {
    int years[] = {1900, 2000, 2024, 2025};
    for (int y : years) {
        std::cout << y << ": " << (isLeapYear(y) ? "leap" : "common") << "\n";
    }
    return 0;
}
```

Output:

```
1900: common
2000: leap
2024: leap
2025: common
```

Wrapping the logic in `isLeapYear` is efficient because you write and test the rule once, then reuse it anywhere without copying the condition around.

---

## Common Mistakes

The most frequent bug is checking only `year % 4 == 0` and forgetting the century exceptions — that wrongly labels 1900 a leap year. The second is getting the `&&` / `||` grouping wrong; without the parentheses, operator precedence can change the meaning. When in doubt, test the tricky cases: 1900 (common), 2000 (leap), and any year divisible by 4 but not 100 (leap).

---

## Related Articles

- [C++ Conditionals Tutorial](/posts/cpp-conditionals-tutorial/) — if, else, and boolean logic
- [C++ Modulo Operator (%)](/posts/cpp-modulo-operator/) — how the divisibility test works
- [Even or Odd Program in C++](/posts/cpp-even-odd-program/) — the simplest modulo check
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — packaging logic like isLeapYear
- [C++ User Input with cin](/posts/cpp-cin-user-input/) — reading the year from the keyboard

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
