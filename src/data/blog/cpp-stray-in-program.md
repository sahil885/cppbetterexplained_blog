---
title: "How to Fix stray '\\342' in program Errors in C++"
description: "stray '\\342' in program means your code has curly quotes, a dash or a hidden space pasted from somewhere else. How to find and fix it on GCC, Clang and MSVC."
pubDatetime: 2026-10-18T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "debugging"]
draft: false
featured: false
hideMidOptin: true
faqSchema:
  - question: "What does stray '\\342' in program mean?"
    answer: "Your source file contains a character the compiler doesn't accept, almost always a curly quote, a long dash or an invisible space copied from a website, PDF or word processor. 342 is the first byte of those characters in UTF-8, written in octal."
  - question: "Why does newer GCC say extended character is not valid in an identifier instead?"
    answer: "GCC 10 and later report the same problem differently: they show the character itself instead of its bytes. The fix is identical. Replace the curly quote, dash or special space with the plain character from your keyboard."
  - question: "How do I find the character that's causing the error?"
    answer: "Go to the line and column in the error message and retype that part of the line. VS Code highlights invisible and look-alike Unicode characters by default, and on Linux, macOS or Git Bash you can search the file for non-ASCII characters with grep."
  - question: "How do I stop this error happening?"
    answer: "Type quotes and dashes yourself instead of pasting them, and copy code only from code blocks, which use plain characters. Word processors, PDFs and some chat apps swap straight quotes for curly ones automatically."
---

# How to Fix "stray '\342' in program" in C++

**Short answer:** your code contains a character that looks normal but isn't plain text: a **curly quote** (“ ” ‘ ’), a **long dash** (–), or an **invisible non-breaking space**. It almost always comes from pasting code out of a website, PDF, Word document or chat app. Retype the quotes and dashes from your keyboard, and the error disappears.

Different compilers describe the same problem very differently:

| Compiler | What you see |
|---|---|
| Older GCC (for example GCC 8) | `stray '\342' in program`, `stray '\302' in program` |
| GCC 10 and later | `extended character “ is not valid in an identifier` |
| Clang (Xcode, macOS) | `unexpected character <U+201C>` |
| Visual Studio | `C3873` or `C3872: 'U+201c': this character is not allowed ...` |

<!-- optin-quick hook="Hit this one? Copy-paste mistakes like it catch out a lot of beginners." -->

---

## What \342 Means

Characters like “ aren't on a standard keyboard, so files store them as several bytes in **UTF-8**. Older GCC versions report each unexpected byte separately, in **octal**. That's why one curly quote produces three errors at once:

| Character | Looks like | Older GCC reports |
|---|---|---|
| Left curly quote | “ | `stray '\342'`, `stray '\200'`, `stray '\234'` |
| Right curly quote | ” | `stray '\342'`, `stray '\200'`, `stray '\235'` |
| En dash | – | `stray '\342'`, `stray '\200'`, `stray '\223'` |
| Non-breaking space | (invisible) | `stray '\302'`, `stray '\240'` |

So `\342` almost always means a curly quote or a dash, and `\302` means a non-breaking space. Newer GCC names the character instead of listing its bytes, but the cause is exactly the same.

## Cause 1: Curly Quotes Around a String

The most common one. Many websites, word processors and messaging apps turn " into “ and ” automatically:

```cpp
#include <iostream>

int main() {
    std::cout << “Hello”;
}
```

```
GCC 8:   error: stray '\342' in program
GCC 11:  error: extended character “ is not valid in an identifier
Clang:   error: unexpected character <U+201C>
MSVC:    error C3873: 'U+201c': this character is not allowed as a first character of an identifier
```

**Fix:** delete both quotes and type them again from your keyboard:

```cpp
#include <iostream>

int main() {
    std::cout << "Hello";
}
```

The same goes for single quotes in a character: `‘A’` must be `'A'`.

<!-- book-cta topic="fundamentals" placement="mid_article" -->

## Cause 2: A Dash Instead of a Minus Sign

Word processors also turn a hyphen into a longer dash (–), which isn't the minus operator:

```cpp
#include <iostream>

int main() {
    int lives = 10 – 3;
    std::cout << lives;
}
```

```
GCC 8:   error: stray '\342' in program
GCC 11:  error: extended character – is not valid in an identifier
Clang:   error: unexpected character <U+2013>
MSVC:    error C3873: 'U+2013': this character is not allowed as a first character of an identifier
```

**Fix:** retype the minus sign: `int lives = 10 - 3;`

## Cause 3: An Invisible Non-Breaking Space

The sneakiest version, because you can't see it. Web pages often use a non-breaking space instead of a normal one, and it comes along when you copy the code:

```cpp
#include <iostream>

int main() {
    int total = 5;
    std::cout << total;
}
```

That code looks perfectly fine on screen, but the space between `int` and `total` is a non-breaking space.

```
GCC 8:   error: stray '\302' in program
GCC 11:  error: extended character   is not valid in an identifier
MSVC:    error C3872: 'U+a0': this character is not allowed in an identifier
Clang:   warning: treating Unicode character as whitespace
```

Notice the GCC 11 message shows a "blank" character — that's the non-breaking space itself. Clang accepts it with a warning, so the same file can build with Clang and fail with GCC or Visual Studio.

**Fix:** delete the space and type a normal one. If you can't tell which space it is, retype the whole line.

## How to Find the Character

1. **Go to the exact spot.** The error gives a line and a column, such as `main.cpp:4:18`. The character is right there.
2. **Let your editor show you.** VS Code highlights invisible and look-alike Unicode characters by default, with a box around them. Hover over one to see what it is.
3. **Search the whole file.** On Linux, macOS or Git Bash on Windows, this lists every line containing a non-ASCII character:

```
grep -nP '[^\x00-\x7F]' main.cpp
```

4. **When in doubt, retype the line.** It's often faster than hunting for the character.

Characters inside comments and inside string contents (`"café"`) are fine. The compiler only objects when one appears in the code itself.

## How to Stop It Happening

- **Copy code from code blocks**, not from the paragraphs around them. Code blocks keep plain quotes and spaces.
- **Don't paste code through Word, Google Docs, PDFs or chat apps.** They often convert quotes and dashes, and some add non-breaking spaces.
- **Type it yourself when you're learning.** It avoids this error entirely, and you'll remember the code better.

## Quick Reference

| Error | Usual culprit | Fix |
|---|---|---|
| `stray '\342'` / `extended character “ ”` | Curly double quotes | Retype `"` |
| `stray '\342'` / `extended character ‘ ’` | Curly single quotes | Retype `'` |
| `stray '\342'` / `extended character –` | En or em dash | Retype `-` |
| `stray '\302' '\240'` | Non-breaking space | Delete it and type a normal space |
| `unexpected character <U+...>` (Clang) | Any of the above | Find the character at that column |

For other common messages, see [C++ error messages explained](/posts/cpp-error-messages/).

---

## Take Your C++ Further

<!-- book-cta topic="fundamentals" placement="end_cta" -->

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the most common errors and what they mean.
- [How to Fix Expected ';' Errors](/posts/cpp-expected-semicolon/) — another error that points at the wrong place.
- [How to Fix 'does not name a type'](/posts/cpp-does-not-name-a-type/) — when the compiler doesn't recognise a name.
- [Online C++ Compilers](/posts/cpp-online-compiler/) — test pasted code in your browser.
- [C++ Hello World Explained](/posts/cpp-hello-world-explained/) — your first program, typed by hand.
