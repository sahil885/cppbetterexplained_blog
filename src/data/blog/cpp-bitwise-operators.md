---
title: "C++ Bitwise Operators Explained: AND, OR, XOR, Shift, and NOT for Beginners"
description: "Learn C++ bitwise operators with working code examples. Covers &, |, ^, ~, <<, >> with practical use cases and bit manipulation patterns for beginners."
pubDatetime: 2026-06-01T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "operators", "tutorial"]
faqSchema:
  - question: "What are bitwise operators in C++?"
    answer: "Bitwise operators in C++ work directly on the binary representation of integers. The six operators are & (AND), | (OR), ^ (XOR), ~ (NOT), << (left shift), and >> (right shift). They're used in systems programming, graphics, networking, and anywhere you need efficient manipulation of individual bits."
  - question: "What is the difference between & and && in C++?"
    answer: "& is the bitwise AND operator — it compares bits of two integers and returns a new integer. && is the logical AND operator — it compares two boolean expressions and returns true or false. Use & for bit manipulation, && for conditionals like if (a > 0 && b > 0)."
  - question: "What is left shift << used for in C++?"
    answer: "The left shift operator << moves all bits of a number to the left by a given count, filling in zeros on the right. Shifting left by n is equivalent to multiplying by 2^n. For example, 1 << 3 equals 8. It's commonly used to set specific bits and to perform fast multiplication by powers of two."
draft: false
featured: false
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/M9LnMQEkh70" title="C++ Bitwise Operators Explained: AND, OR, XOR, Shift, and NOT for Beginners" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
# C++ Bitwise Operators Explained: AND, OR, XOR, Shift, and NOT

Every integer in your computer is stored as a sequence of bits — 0s and 1s. Bitwise operators let you work directly at that level, manipulating individual bits instead of whole numbers.

This sounds low-level, but you'll encounter bitwise operations regularly: reading hardware flags, implementing permissions systems, optimizing code, working with graphics or networking. Understanding them unlocks a whole layer of how computers actually work.

---

## The Binary Foundation

Before diving into operators, a quick refresher. The number `13` in binary is `1101`:

```
Bit position: 3  2  1  0
Binary:        1  1  0  1
Value:         8  4  0  1  = 13
```

Bitwise operators compare or shift these individual bit positions.

---

## Bitwise AND: `&`

AND compares two numbers bit by bit. The result bit is `1` only if **both** corresponding bits are `1`.

```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 12;   // binary: 1100
    int b = 10;   // binary: 1010

    int result = a & b;  // binary: 1000 = 8

    cout << result << endl;  // 8
    return 0;
}
```

Bit-by-bit:
```
  1 1 0 0   (12)
& 1 0 1 0   (10)
---------
  1 0 0 0   (8)
```

**Common use:** checking whether a specific bit is set.

```cpp
int flags = 0b1011;  // some status flags

// Is bit 1 set?
if (flags & 0b0010) {
    cout << "Bit 1 is set" << endl;
}
```

---

## Bitwise OR: `|`

OR compares two numbers bit by bit. The result bit is `1` if **either** bit is `1`.

```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 12;   // binary: 1100
    int b = 10;   // binary: 1010

    int result = a | b;  // binary: 1110 = 14

    cout << result << endl;  // 14
    return 0;
}
```

**Common use:** turning a specific bit on (setting a flag).

```cpp
int permissions = 0b0000;

// Turn on the "read" bit (bit 2) and "execute" bit (bit 0)
permissions = permissions | 0b0101;

cout << permissions << endl;  // 5
```

---

## Bitwise XOR: `^`

XOR (exclusive OR) returns `1` when the bits are **different**, and `0` when they're the same.

```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 12;   // binary: 1100
    int b = 10;   // binary: 1010

    int result = a ^ b;  // binary: 0110 = 6

    cout << result << endl;  // 6
    return 0;
}
```

**Fun trick:** XOR a number with itself always gives 0. XOR with the same value twice returns the original.

```cpp
int x = 42;
cout << (x ^ x) << endl;  // 0
cout << (x ^ 5 ^ 5) << endl;  // 42 — the 5s cancel out
```

This makes XOR useful for simple encryption, swapping variables without a temp, and finding the unique element in an array.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Bitwise NOT: `~`

NOT flips every bit in the number. If a bit is `1` it becomes `0`, and vice versa.

```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 12;       // binary: ...0000 1100
    int result = ~a;  // binary: ...1111 0011 = -13

    cout << result << endl;  // -13
    return 0;
}
```

The result is `-13`, not `3`, because of how negative numbers are stored (two's complement). `~x` is always equal to `-(x + 1)`.

---

## Left Shift: `<<`

Left shift moves all bits to the left by a given number of positions. New bits on the right are filled with `0`.

```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 1;

    cout << (a << 0) << endl;  // 1   = 1 * 2^0
    cout << (a << 1) << endl;  // 2   = 1 * 2^1
    cout << (a << 2) << endl;  // 4   = 1 * 2^2
    cout << (a << 3) << endl;  // 8   = 1 * 2^3
    cout << (a << 4) << endl;  // 16  = 1 * 2^4

    return 0;
}
```

Left shift by `n` is equivalent to multiplying by `2^n`. This is faster than multiplication for powers of two.

**Setting a specific bit:**
```cpp
// Set bit 4 (the 5th bit from the right)
int mask = 1 << 4;  // binary: 0001 0000 = 16
```

---

## Right Shift: `>>`

Right shift moves all bits to the right. For positive numbers, it's equivalent to integer division by `2^n`.

```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 64;

    cout << (a >> 1) << endl;  // 32 = 64 / 2
    cout << (a >> 2) << endl;  // 16 = 64 / 4
    cout << (a >> 3) << endl;  // 8  = 64 / 8

    return 0;
}
```

---

## Practical Example: Permission Flags

A common real-world use is representing multiple on/off flags in a single integer. Here's a simple file permission system:

```cpp
#include <iostream>
using namespace std;

const int READ    = 1 << 0;  // 001
const int WRITE   = 1 << 1;  // 010
const int EXECUTE = 1 << 2;  // 100

void checkPermissions(int perms) {
    if (perms & READ)    cout << "Can read" << endl;
    if (perms & WRITE)   cout << "Can write" << endl;
    if (perms & EXECUTE) cout << "Can execute" << endl;
}

int main() {
    int userPerms = READ | WRITE;  // 011 = 3
    checkPermissions(userPerms);

    // Remove write permission
    userPerms = userPerms & ~WRITE;
    cout << "After removing write:" << endl;
    checkPermissions(userPerms);

    return 0;
}
```

Output:
```
Can read
Can write
After removing write:
Can read
```

---

## Quick Reference

| Operator | Symbol | Result bit is 1 when...      |
|----------|--------|------------------------------|
| AND      | `&`    | Both bits are 1              |
| OR       | `\|`   | At least one bit is 1        |
| XOR      | `^`    | Bits are different           |
| NOT      | `~`    | Bit was 0 (flip)             |
| Left shift  | `<<` | Multiplies by 2^n           |
| Right shift | `>>` | Divides by 2^n              |

---

## Related Articles

- [C++ Variables and Data Types](/posts/cpp-variables-data-types/)
- [C++ Conditionals Tutorial: if, else, and switch Explained](/posts/cpp-conditionals-tutorial/)
- [C++ Operators and Expressions](/posts/cpp-variables-data-types/)
- [C++ enum Tutorial: Named Constants Explained](/posts/cpp-enum-tutorial/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
