---
title: "Sum of Digits in C++: Add Up the Digits of a Number"
description: "Find the sum of digits of a number in C++ using a while loop and modulo. Includes a recursive version and the digital-root trick, explained for beginners."
pubDatetime: 2026-07-13T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "loops", "tutorial"]
faqSchema:
  - question: "How do you find the sum of digits of a number in C++?"
    answer: "Use a while loop: take the last digit with number % 10, add it to a running sum, then remove the digit with number /= 10. Repeat until the number is 0. For 1234 this gives 1 + 2 + 3 + 4 = 10."
  - question: "How do you sum digits recursively in C++?"
    answer: "Write a function that returns 0 when the number is 0, and otherwise returns number % 10 plus a recursive call on number / 10. Each call peels off one digit and adds it, until the base case stops the recursion."
  - question: "What is the digital root of a number?"
    answer: "The digital root is what you get when you keep summing the digits until only one digit remains. For 1234 you get 10, then 1 + 0 = 1, so the digital root is 1. It equals 1 + (n - 1) % 9 for positive numbers."
draft: false
featured: false
---

# Sum of Digits in C++

Adding up the digits of a number — turning `1234` into `1 + 2 + 3 + 4 = 10` — is a classic beginner problem. It uses the same digit-peeling loop as reversing a number, so it's a perfect next step for practicing the modulo and division combo.

---

## The Idea: Peel and Add

To sum the digits, you visit each digit from right to left using two operators:

- `number % 10` gives the **last digit**.
- `number / 10` **removes** that digit.

Instead of building a reversed number, you simply add each digit to a running total. Here's the core loop:

```cpp
#include <iostream>

int main() {
    int number = 1234;
    int sum = 0;

    while (number != 0) {
        sum += number % 10;   // add the last digit
        number /= 10;         // drop the last digit
    }

    std::cout << "Sum of digits: " << sum << "\n";  // 10
    return 0;
}
```

Trace it: `sum` grows `0 -> 4 -> 7 -> 9 -> 10`, while `number` shrinks `1234 -> 123 -> 12 -> 1 -> 0`. When `number` reaches `0`, every digit has been added.

---

## Reading the Number from the User

In practice you'll want the number from input. Handling a possible negative sign keeps it robust — take the absolute value first so the modulo behaves as expected:

```cpp
#include <iostream>
#include <cstdlib>   // std::abs

int main() {
    int number;
    std::cout << "Enter a number: ";
    std::cin >> number;

    number = std::abs(number);
    int sum = 0;
    while (number != 0) {
        sum += number % 10;
        number /= 10;
    }

    std::cout << "Sum of digits: " << sum << "\n";
    return 0;
}
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Recursive Version

The same problem has an elegant recursive solution. The idea: the sum of digits of a number is its last digit **plus** the sum of digits of everything else. The recursion stops when the number reaches `0`:

```cpp
#include <iostream>

int sumOfDigits(int n) {
    if (n == 0) return 0;                 // base case
    return n % 10 + sumOfDigits(n / 10);  // last digit + the rest
}

int main() {
    std::cout << sumOfDigits(1234) << "\n";  // 10
    return 0;
}
```

Each call handles one digit and passes the shrunken number down. `sumOfDigits(1234)` becomes `4 + sumOfDigits(123)`, which becomes `4 + 3 + sumOfDigits(12)`, and so on until `sumOfDigits(0)` returns `0`. This mirrors the loop exactly — it's just expressed as function calls instead of iterations.

---

## Bonus: The Digital Root

If you keep summing the digits until a single digit remains, you get the **digital root**. For `1234`: `1 + 2 + 3 + 4 = 10`, then `1 + 0 = 1`. You can compute it by looping the digit-sum until the number drops below 10:

```cpp
#include <iostream>

int main() {
    int number = 1234;
    while (number >= 10) {
        int sum = 0;
        int temp = number;
        while (temp != 0) {
            sum += temp % 10;
            temp /= 10;
        }
        number = sum;    // feed the sum back in
    }
    std::cout << "Digital root: " << number << "\n";  // 1
    return 0;
}
```

This nests the digit-sum loop inside an outer loop that keeps feeding the result back until one digit is left. It's a neat demonstration of how a small building block composes into something bigger.

---

## Related Articles

- [Reverse a Number in C++](/posts/cpp-reverse-number/) — the same digit-peeling loop
- [C++ Modulo Operator (%)](/posts/cpp-modulo-operator/) — how you grab the last digit
- [C++ Recursion Tutorial](/posts/cpp-recursion-tutorial/) — the base case and recursive step
- [Integer Division in C++](/posts/cpp-integer-division/) — why number / 10 drops a digit
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — while loops explained

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
