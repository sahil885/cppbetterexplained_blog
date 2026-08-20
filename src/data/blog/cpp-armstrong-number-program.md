---
title: "Armstrong Number Program in C++: Check and Print Armstrong Numbers"
description: "Write an Armstrong number program in C++ with full working code. Learn the digit-extraction loop, handle any number of digits, and print all in a range."
pubDatetime: 2026-08-20T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "programs", "tutorial"]
faqSchema:
  - question: "What is an Armstrong number?"
    answer: "An Armstrong number equals the sum of its own digits each raised to the power of the number of digits. For example 153 has three digits and 1 cubed plus 5 cubed plus 3 cubed equals 153. They are also called narcissistic numbers."
  - question: "How do you check an Armstrong number in C++?"
    answer: "Count the digits first, then loop through the number extracting each digit with modulo 10 and removing it with integer division by 10. Raise each digit to the digit-count power, add it to a running total, and compare that total to the original number."
  - question: "What are the Armstrong numbers between 1 and 1000?"
    answer: "They are 1, 2, 3, 4, 5, 6, 7, 8, 9, 153, 370, 371, and 407. Every single-digit number is trivially an Armstrong number because any digit raised to the power of one equals itself."
draft: false
featured: false
---

# Armstrong Number Program in C++: Check and Print Armstrong Numbers

An **Armstrong number** is a number that equals the sum of its digits, each raised to the power of how many digits there are.

The classic example is 153:

```
153 has 3 digits
1³ + 5³ + 3³ = 1 + 125 + 27 = 153  ✓
```

It's a favourite exercise because it forces you to practise the single most useful trick in beginner C++: pulling a number apart digit by digit.

---

## The Core Technique: Extracting Digits

Before the Armstrong logic, get comfortable with this pattern. Two operators do all the work:

- **`% 10`** gives you the last digit.
- **`/ 10`** removes the last digit (integer division truncates).

```cpp
#include <iostream>

int main() {
    int number = 153;

    while (number > 0) {
        int digit = number % 10;    // 3, then 5, then 1
        std::cout << digit << " ";
        number /= 10;               // 15, then 1, then 0
    }
    std::cout << "\n";
}
```

```
3 5 1
```

Digits come out backwards, which is fine — addition doesn't care about order. The loop ends naturally when `number` hits `0`.

---

## Checking a Three-Digit Armstrong Number

For exactly three digits you can cube each one directly:

```cpp
#include <iostream>

int main() {
    int number;
    std::cout << "Enter a three-digit number: ";
    std::cin >> number;

    int original = number;
    int sum = 0;

    while (number > 0) {
        int digit = number % 10;
        sum += digit * digit * digit;
        number /= 10;
    }

    if (sum == original) {
        std::cout << original << " is an Armstrong number\n";
    } else {
        std::cout << original << " is not an Armstrong number\n";
    }
}
```

Notice `int original = number;` on the first line. The loop **destroys** `number` — by the end it's `0` — so you must save a copy before comparing. Forgetting this is the single most common bug in this program: the comparison becomes `sum == 0` and always fails.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The General Version: Any Number of Digits

Cubing only works for three-digit numbers. The real definition uses the digit *count* as the exponent, so `9474` needs each digit raised to the fourth power:

```
9⁴ + 4⁴ + 7⁴ + 4⁴ = 6561 + 256 + 2401 + 256 = 9474  ✓
```

That means two passes: one to count digits, one to sum the powers.

```cpp
#include <iostream>

int countDigits(int n) {
    if (n == 0) return 1;
    int count = 0;
    while (n > 0) {
        ++count;
        n /= 10;
    }
    return count;
}

int intPower(int base, int exponent) {
    int result = 1;
    for (int i = 0; i < exponent; ++i) {
        result *= base;
    }
    return result;
}

bool isArmstrong(int number) {
    int digits = countDigits(number);
    int sum = 0;
    int n = number;

    while (n > 0) {
        int digit = n % 10;
        sum += intPower(digit, digits);
        n /= 10;
    }

    return sum == number;
}

int main() {
    std::cout << std::boolalpha;
    std::cout << "153  -> " << isArmstrong(153)  << "\n";
    std::cout << "9474 -> " << isArmstrong(9474) << "\n";
    std::cout << "154  -> " << isArmstrong(154)  << "\n";
}
```

```
153  -> true
9474 -> true
154  -> false
```

**Why write `intPower` instead of using `std::pow`?** `std::pow` returns a `double`, and doubles can't represent every integer exactly. `std::pow(5, 3)` may come back as `124.99999999999999`, and assigning that to an `int` truncates to `124` — so a correct Armstrong number gets rejected. An integer loop has no rounding, so it's both safer and faster here. See [C++ exponents](/posts/cpp-exponent-power/) for more on this trap.

---

## Printing All Armstrong Numbers in a Range

With `isArmstrong` as a function, this is four lines:

```cpp
#include <iostream>

// ...countDigits, intPower, isArmstrong from above...

int main() {
    std::cout << "Armstrong numbers from 1 to 10000:\n";

    for (int i = 1; i <= 10000; ++i) {
        if (isArmstrong(i)) {
            std::cout << i << " ";
        }
    }
    std::cout << "\n";
}
```

```
Armstrong numbers from 1 to 10000:
1 2 3 4 5 6 7 8 9 153 370 371 407 1634 8208 9474
```

This is the real payoff of writing `isArmstrong` as a separate function rather than stuffing everything into `main`. The checking logic is written once and the range loop reads like plain English.

(The single digits all qualify because any digit to the power of one is itself. Some definitions exclude them; the mathematics doesn't.)

---

## Watch Out for Overflow

Try this on a large number and it breaks quietly. A 10-digit number raises each digit to the 10th power — `9¹⁰` is about 3.49 billion, which already exceeds the roughly 2.1 billion maximum of a 32-bit `int`.

The fix is to widen the accumulator and the power function:

```cpp
long long intPower(long long base, int exponent) {
    long long result = 1;
    for (int i = 0; i < exponent; ++i) result *= base;
    return result;
}
```

Use `long long` for `sum` too. Signed integer overflow is undefined behaviour, not a wrap-around you can rely on, so it's worth fixing rather than ignoring.

---

## Related Articles

- [C++ Program to Find the Sum of Digits](/posts/cpp-sum-of-digits/)
- [C++ Palindrome Program](/posts/cpp-palindrome-program/)
- [C++ Prime Number Program](/posts/cpp-prime-number-program/)
- [C++ Exponents: Why ^ Isn't Power and How to Use pow()](/posts/cpp-exponent-power/)
- [C++ Loops Tutorial: for, while, and do-while Explained](/posts/cpp-loops-tutorial/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
