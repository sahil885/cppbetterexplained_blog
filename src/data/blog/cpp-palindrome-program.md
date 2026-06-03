---
title: "C++ Palindrome Program: Check Strings and Numbers for Beginners"
description: "Learn to write a C++ palindrome program for strings and numbers. Use the two-pointer method, reverse comparison, and digit math with clear, working examples."
pubDatetime: 2026-06-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "strings", "tutorial"]
faqSchema:
  - question: "How do you check if a string is a palindrome in C++?"
    answer: "Compare characters from both ends moving inward. Use one index starting at the front and another at the back; if every matching pair is equal, the string is a palindrome. This two-pointer method avoids creating a reversed copy."
  - question: "How do you check if a number is a palindrome in C++?"
    answer: "Reverse the number using modulo and division to extract digits, then compare the reversed value to the original. If they match, the number reads the same forwards and backwards."
  - question: "Is an empty string a palindrome?"
    answer: "Yes. An empty string and any single character are trivially palindromes because there is nothing that fails the front-to-back comparison. Most palindrome functions return true for these cases naturally."
draft: false
featured: false
---

# C++ Palindrome Program: Strings and Numbers

A palindrome reads the same forwards and backwards — words like "level" and "radar", or numbers like 121 and 1331. Writing a palindrome checker is a great exercise because it teaches you to walk through data from both ends and think carefully about comparisons.

---

## The Two-Pointer Idea

The cleanest way to check a string is to compare the first character with the last, the second with the second-to-last, and so on. We use two indices: one starting at the front, one at the back. They move toward each other, and if any pair disagrees, the string is not a palindrome.

```cpp
#include <iostream>
#include <string>

bool isPalindrome(const std::string& s) {
    int left = 0;
    int right = s.length() - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;  // mismatch found
        left++;
        right--;
    }
    return true;  // all pairs matched
}

int main() {
    std::cout << std::boolalpha;
    std::cout << isPalindrome("radar") << "\n";  // true
    std::cout << isPalindrome("hello") << "\n";  // false
    return 0;
}
```

This is efficient because we only walk through half the string and never allocate a second copy. We pass the string by `const` reference (`const std::string&`) to avoid copying the whole thing into the function.

---

## Method 2: Reverse and Compare

A more beginner-obvious approach builds a reversed copy and checks whether it equals the original:

```cpp
#include <iostream>
#include <string>
#include <algorithm>

int main() {
    std::string word = "level";
    std::string reversed = word;
    std::reverse(reversed.begin(), reversed.end());

    if (word == reversed)
        std::cout << word << " is a palindrome.\n";
    else
        std::cout << word << " is not a palindrome.\n";
    return 0;
}
```

This is shorter to write thanks to `std::reverse` from `<algorithm>`, but it uses extra memory for the reversed copy. For most beginner programs that trade-off is perfectly fine.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Checking a Number Palindrome

Numbers need a different trick because you can't index digits directly. Instead, we rebuild the number in reverse using `% 10` to grab the last digit and `/ 10` to drop it:

```cpp
#include <iostream>

bool isPalindrome(int n) {
    if (n < 0) return false;       // negatives like -121 aren't palindromes
    int original = n;
    int reversed = 0;
    while (n > 0) {
        int digit = n % 10;        // last digit
        reversed = reversed * 10 + digit;
        n /= 10;                    // remove last digit
    }
    return original == reversed;
}

int main() {
    std::cout << std::boolalpha;
    std::cout << isPalindrome(121) << "\n";   // true
    std::cout << isPalindrome(123) << "\n";   // false
    return 0;
}
```

Each loop pass shifts `reversed` left by one decimal place and appends the next digit. When the original number is exhausted, we compare the two values.

---

## Common Pitfalls

Case sensitivity trips people up: `"Radar"` fails a naive check because `'R'` and `'r'` differ. Convert to one case first if you want case-insensitive matching. For numbers, remember that negatives can't be palindromes because of the minus sign. And always make sure your loop condition is `left < right`, not `left <= right`, so the exact middle character isn't compared with itself unnecessarily.

---

## Related Articles

- [C++ String Handling](/posts/cpp-string-handling/) — methods, length, and indexing
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — while and for loops explained
- [C++ Conditionals Tutorial](/posts/cpp-conditionals-tutorial/) — making decisions with if
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — writing reusable checks
- [C++ Sort Algorithm](/posts/cpp-sort-algorithm/) — more std::algorithm tools

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
