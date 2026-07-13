---
title: "Reverse a Number in C++: Flip the Digits with a While Loop"
description: "Reverse a number in C++ using modulo and integer division. Step-by-step while-loop code, handling negatives, and a version that detects integer overflow."
pubDatetime: 2026-07-13T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "loops", "tutorial"]
faqSchema:
  - question: "How do you reverse a number in C++?"
    answer: "Use a while loop to peel off the last digit with number % 10, add it to a running result after shifting that result left by multiplying by 10, then drop the digit with number /= 10. Repeat until the number becomes 0."
  - question: "How do you reverse a negative number in C++?"
    answer: "Store the sign, reverse the absolute value using the normal digit-by-digit loop, then reapply the sign at the end. For example, -123 becomes -321. This keeps the loop logic simple and avoids issues with the modulo of negatives."
  - question: "How do you get the last digit of a number in C++?"
    answer: "Use the modulo operator: number % 10 gives the last digit. To remove that digit, use integer division: number / 10. Repeating these two steps lets you process a number one digit at a time."
draft: false
featured: false
---

# Reverse a Number in C++

Reversing a number — turning `1234` into `4321` — is one of the most common beginner exercises, and for good reason. It teaches you the two-step pattern of pulling digits off a number one at a time, which shows up everywhere from digit sums to palindrome checks.

---

## The Two Operations You Need

To reverse a number, you process it digit by digit using two operators:

- `number % 10` gives you the **last digit** (the remainder after dividing by 10).
- `number / 10` **removes** the last digit (integer division drops the fraction).

For example, with `1234`: `1234 % 10` is `4`, and `1234 / 10` is `123`. Do that repeatedly and you visit every digit from right to left.

```cpp
#include <iostream>

int main() {
    int number = 1234;
    std::cout << "Last digit: " << number % 10 << "\n";  // 4
    std::cout << "Rest: " << number / 10 << "\n";         // 123
    return 0;
}
```

---

## Building the Reversed Number

The reversal itself uses a `while` loop. Each pass, we take the last digit and append it to a `reversed` value. To "append," we shift `reversed` one place to the left by multiplying by 10, then add the new digit:

```cpp
#include <iostream>

int main() {
    int number = 1234;
    int reversed = 0;

    while (number != 0) {
        int digit = number % 10;      // grab last digit
        reversed = reversed * 10 + digit;  // shift left, add digit
        number = number / 10;         // drop last digit
    }

    std::cout << "Reversed: " << reversed << "\n";  // 4321
    return 0;
}
```

Trace it: `reversed` goes `0 -> 4 -> 43 -> 432 -> 4321`, while `number` shrinks `1234 -> 123 -> 12 -> 1 -> 0`. When `number` hits `0`, the loop ends and `reversed` holds the answer.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Handling Negative Numbers

If the user might enter a negative number like `-123`, the cleanest approach is to remember the sign, reverse the absolute value, then put the sign back:

```cpp
#include <iostream>
#include <cstdlib>   // for std::abs

int main() {
    int number;
    std::cout << "Enter a number: ";
    std::cin >> number;

    int sign = (number < 0) ? -1 : 1;
    number = std::abs(number);

    int reversed = 0;
    while (number != 0) {
        reversed = reversed * 10 + number % 10;
        number /= 10;
    }

    std::cout << "Reversed: " << sign * reversed << "\n";
    return 0;
}
```

Reversing the absolute value keeps the loop simple, and reapplying `sign` at the end gives `-123` -> `-321`.

---

## A Note on Overflow

Reversing a large number can produce a value too big for an `int`. For example, reversing `1000000009` overflows a 32-bit `int`. For beginner exercises with small inputs this rarely bites, but if you want to be safe, use a wider type like `long long` for the `reversed` variable:

```cpp
long long reversed = 0;
```

This is a good habit: whenever a calculation can grow past the input's size, give the result room to breathe.

---

## Where This Pattern Leads

The "peel a digit, shrink the number" loop is a building block. Swap the `reversed = reversed * 10 + digit` line for `sum += digit` and you get the **sum of digits**. Compare the reversed number to the original and you get a **palindrome check**. Master this one loop and a dozen classic problems open up.

---

## Related Articles

- [Reverse a String in C++](/posts/cpp-reverse-string/) — the string version of the same idea
- [C++ Modulo Operator (%)](/posts/cpp-modulo-operator/) — how digit extraction works
- [Integer Division in C++](/posts/cpp-integer-division/) — why number / 10 drops a digit
- [Palindrome Program in C++](/posts/cpp-palindrome-program/) — reverse and compare
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — while loops in depth

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
