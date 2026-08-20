---
title: "Binary to Decimal in C++: 3 Ways to Convert (With Full Code)"
description: "Convert binary to decimal in C++ three ways: a positional loop, std::stoi with base 2, and std::bitset. Full working code plus how to convert back again."
pubDatetime: 2026-08-20T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "programs", "tutorial"]
faqSchema:
  - question: "How do you convert binary to decimal in C++?"
    answer: "The simplest way is std::stoi with 2 as the base argument, which parses a binary string directly into an int. You can also walk the digits yourself, multiplying a running total by two and adding each bit, or use std::bitset and call to_ulong."
  - question: "Can I store a binary number in an int in C++?"
    answer: "Not as binary. An int stores a value, not a notation, so 1011 typed as an int literal is the decimal number one thousand and eleven. Store binary input as a std::string, or use the 0b1011 literal prefix which C++14 added for writing binary values in source code."
  - question: "What does std::stoi with base 2 do?"
    answer: "std::stoi(text, nullptr, 2) reads the string as a base-2 number and returns its decimal int value. It throws std::invalid_argument if the string is not valid binary and std::out_of_range if the value is too large for an int."
draft: false
featured: false
---

# Binary to Decimal in C++: 3 Ways to Convert (With Full Code)

Converting binary to decimal is a standard exercise, and it's one where the "do it by hand" version and the "use the library" version teach you different things. Both are worth knowing.

First, a point that trips people up before they write any code.

---

## Binary Isn't a Type — It's a Notation

A common first attempt:

```cpp
int binary = 1011;              // NOT the binary number 1011
std::cout << binary;            // prints 1011 — one thousand and eleven
```

An `int` holds a *value*. It has no idea whether you were thinking in base 2 or base 10. Typing `1011` gives you one thousand and eleven, full stop.

So binary input almost always arrives as a **`std::string`** — a sequence of `'0'` and `'1'` characters. That's what all three methods below take.

(For binary values written directly in source code, C++14 added the `0b` prefix: `int x = 0b1011;` really is 11. But that's for literals you type, not for input you read.)

---

## Method 1: The Positional Loop

Each binary digit is worth twice the one to its right. So `1011` is:

```
1×8  +  0×4  +  1×2  +  1×1  =  11
```

The neat way to compute this is left to right, doubling as you go — no powers needed:

```cpp
#include <iostream>
#include <string>

int binaryToDecimal(const std::string& binary) {
    int decimal = 0;

    for (char bit : binary) {
        decimal = decimal * 2 + (bit - '0');
    }

    return decimal;
}

int main() {
    std::cout << binaryToDecimal("1011")     << "\n";   // 11
    std::cout << binaryToDecimal("11111111") << "\n";   // 255
    std::cout << binaryToDecimal("10000")    << "\n";   // 16
}
```

Two lines carry the whole method.

`decimal = decimal * 2` shifts everything already accumulated one place left — exactly what adding a digit on the right does in any base.

`(bit - '0')` converts the *character* `'1'` to the *number* `1`. Character codes for digits are consecutive, so subtracting `'0'` gives the numeric value. Without it you'd be adding 49 for `'1'` and 48 for `'0'`.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Method 2: `std::stoi` with Base 2

`std::stoi` takes an optional base argument, and it handles this in one line:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string binary = "1011";

    int decimal = std::stoi(binary, nullptr, 2);

    std::cout << decimal << "\n";      // 11
}
```

The `nullptr` is the "how many characters did I consume" output parameter, which you rarely need. The `2` is the base — and `std::stoi` accepts anything from 2 to 36, so `16` gives you hex parsing for free.

Unlike the hand-written loop, this one **validates**. Feed it garbage and it throws:

```cpp
#include <iostream>
#include <string>
#include <stdexcept>

int main() {
    std::string input = "10201";       // 2 is not a binary digit

    try {
        int decimal = std::stoi(input, nullptr, 2);
        std::cout << decimal << "\n";
    } catch (const std::invalid_argument&) {
        std::cout << "Not a valid binary number\n";
    } catch (const std::out_of_range&) {
        std::cout << "Value too large for an int\n";
    }
}
```

Worth knowing: `std::stoi` stops at the first invalid character rather than rejecting the string outright, so `"101abc"` returns `5` without complaint. If you need strict validation, check the string yourself first or use the `pos` output parameter to confirm the whole string was consumed.

---

## Method 3: `std::bitset`

`std::bitset` is built for fixed-width binary and converts both directions:

```cpp
#include <iostream>
#include <bitset>
#include <string>

int main() {
    std::bitset<8> bits("1011");

    std::cout << bits.to_ulong() << "\n";   // 11
    std::cout << bits << "\n";              // 00001011
}
```

The `<8>` is the width, and it must be a compile-time constant — that's the catch. `std::bitset` is a great fit when you're working with a known-size field (a byte, a 32-bit register) and a poor fit for arbitrary-length user input.

It also throws `std::invalid_argument` on any character that isn't `'0'` or `'1'`, so it validates strictly, unlike `std::stoi`.

---

## Going the Other Way: Decimal to Binary

`std::bitset` is the shortest route:

```cpp
#include <iostream>
#include <bitset>

int main() {
    int decimal = 11;
    std::cout << std::bitset<8>(decimal) << "\n";   // 00001011
}
```

To do it manually — and without leading zeros — repeatedly divide by 2 and collect the remainders:

```cpp
#include <iostream>
#include <string>
#include <algorithm>

std::string decimalToBinary(int decimal) {
    if (decimal == 0) return "0";

    std::string binary;
    while (decimal > 0) {
        binary += static_cast<char>('0' + decimal % 2);
        decimal /= 2;
    }

    std::reverse(binary.begin(), binary.end());
    return binary;
}

int main() {
    std::cout << decimalToBinary(11)  << "\n";   // 1011
    std::cout << decimalToBinary(255) << "\n";   // 11111111
}
```

The remainders come out least-significant-bit first, which is why the `std::reverse` at the end is not optional. And the `if (decimal == 0)` guard matters: without it, the loop never runs and you return an empty string instead of `"0"`.

---

## Which Should You Use?

| Method | Best for | Validates input |
| --- | --- | --- |
| Positional loop | learning, no dependencies | no |
| `std::stoi(s, nullptr, 2)` | most real code | partially |
| `std::bitset<N>` | fixed-width fields, both directions | yes |

Write the loop once so you understand what the library is doing. Then use `std::stoi` in real programs — it's shorter, and it fails loudly instead of silently.

---

## Related Articles

- [C++ Bitwise Operators Explained](/posts/cpp-bitwise-operators/)
- [C++ String to int Conversion](/posts/cpp-string-to-int/)
- [C++ char to int Conversion: The Right Way (and the Trap)](/posts/cpp-char-to-int/)
- [C++ stringstream Tutorial: Parse and Build Strings Like a Pro](/posts/cpp-stringstream/)
- [C++ Loops Tutorial: for, while, and do-while Explained](/posts/cpp-loops-tutorial/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
