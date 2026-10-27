---
title: "How to Fix Expected '}' at End of Input in C++"
description: "Fix expected '}' at end of input in C++: find the unclosed brace in a function, loop, if, class or header file. With GCC, Clang and Visual Studio messages."
pubDatetime: 2026-10-27T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "debugging"]
draft: false
featured: false
hideMidOptin: true
faqSchema:
  - question: "What does expected '}' at end of input mean?"
    answer: "A { in your file never got its matching }. The compiler read to the end of the file still waiting for it. The error is reported on the last line, but the missing brace is earlier, usually at the end of a function, loop or if block."
  - question: "How do I find the missing brace?"
    answer: "Read the note under the error. GCC and Clang say note: to match this '{' and give the line and column of the brace that was never closed. Then check each block inside it; formatting the file in your editor makes the block that never ends stand out."
  - question: "What is the Visual Studio version of this error?"
    answer: "Visual Studio reports fatal error C1075: '{': no matching token found, and the line number it gives is the line of the { that was never closed. Clang says expected '}' with the same note as GCC."
  - question: "What does expected declaration before '}' token mean?"
    answer: "It's the opposite problem: there's one } too many, so the compiler finds a closing brace where it expected a new declaration. Delete the extra }. Clang calls this an extraneous closing brace."
---

# How to Fix "expected '}' at end of input" in C++

**Short answer:** a `{` in your file never got its closing `}`, and the compiler reached the end of the file still waiting for it. The error points at the last line, but the missing brace is earlier, usually at the end of a function, loop or `if` block. The **note** under the error points to the `{` that was never closed.

| Compiler | What you see |
|---|---|
| GCC (g++, MinGW, Code::Blocks) | `expected '}' at end of input`, then `note: to match this '{'` |
| Clang (Xcode, macOS) | `expected '}'`, then `note: to match this '{'` |
| Visual Studio | `fatal error C1075: '{': no matching token found` |

<!-- optin-quick error="expected '}' at end of input" -->

---

## How to Read the Error

Here's the smallest example, with the last `}` missing:

```cpp
#include <iostream>

int main() {
    std::cout << "Hello\n";
    return 0;
```

```
GCC:    main.cpp:5:14: error: expected '}' at end of input
        main.cpp:3:12: note: to match this '{'
Clang:  main.cpp:5:14: error: expected '}'
        main.cpp:3:12: note: to match this '{'
MSVC:   main.cpp(3): fatal error C1075: '{': no matching token found
```

Two lines matter:

- **The error** is on the last line of the file (line 5), because that's where the compiler gave up waiting.
- **The note** points to the `{` that was never closed: line 3, column 12, the brace after `main()`. Visual Studio reports that line directly.

**Fix:** add the closing `}` after `return 0;`.

## Cause 1: A Missing } Inside a Function

Usually the missing brace belongs to a loop or an `if`, not to the function itself:

```cpp
#include <iostream>

int main() {
    for (int i = 0; i < 3; ++i) {
        std::cout << i << '\n';

    std::cout << "Done\n";
    return 0;
}
```

```
GCC:    main.cpp:9:2: error: expected '}' at end of input
        main.cpp:3:12: note: to match this '{'
Clang:  main.cpp:9:2: error: expected '}'
        main.cpp:3:12: note: to match this '{'
MSVC:   main.cpp(3): fatal error C1075: '{': no matching token found
```

The note points at `main`'s brace on line 3, even though the missing `}` belongs to the loop. The compiler pairs each `}` with the most recent unclosed `{`, so the `}` on the last line closed the **loop**, and `main` was left open.

So treat the note as a starting point. Begin at the brace it names and check each block inside it. The indentation gives this one away: the loop body should end after line 5, but nothing closes it.

**Fix:** close the loop where its body ends:

```cpp
    for (int i = 0; i < 3; ++i) {
        std::cout << i << '\n';
    }
```

## Cause 2: A Missing } Before else

When the missing brace is just before an `else`, GCC gives a more specific message:

```cpp
#include <iostream>

int main() {
    int x = 5;
    if (x > 3) {
        std::cout << "big\n";
    else {
        std::cout << "small\n";
    }
    return 0;
}
```

```
GCC:    main.cpp:7:5: error: expected '}' before 'else'
        main.cpp:5:16: note: to match this '{'
Clang:  main.cpp:7:5: error: expected expression
        main.cpp:11:2: error: expected '}'
        main.cpp:3:12: note: to match this '{'
MSVC:   main.cpp(7): error C2181: illegal else without matching if
        main.cpp(3): fatal error C1075: '{': no matching token found
```

GCC is the most helpful here: its note points straight at the `if` block's brace on line 5.

**Fix:** close the `if` block before the `else`: `} else {`. More in the [conditionals tutorial](/posts/cpp-conditionals-tutorial/).

## Cause 3: A Function That Runs Into the Next One

If a function is missing its last `}`, the next function ends up inside it:

```cpp
#include <iostream>

void greet() {
    std::cout << "Hello\n";

int main() {
    greet();
    return 0;
}
```

```
GCC:    main.cpp:6:12: error: a function-definition is not allowed here before '{' token
        main.cpp:9:2: error: expected '}' at end of input
        main.cpp:3:14: note: to match this '{'
Clang:  main.cpp:6:12: error: function definition is not allowed here
        main.cpp:9:2: error: expected '}'
        main.cpp:3:14: note: to match this '{'
MSVC:   main.cpp(6): error C2601: 'main': local function definitions are illegal
        main.cpp(3): note: this line contains a '{' which has not yet been matched
        main.cpp(3): fatal error C1075: '{': no matching token found
```

C++ doesn't allow one function to be defined inside another, so the first error is about `main`, not about the missing brace. Whenever you see "function-definition is not allowed here", check the function **above** it for a missing `}`.

**Fix:** add the `}` at the end of `greet()`.

<!-- book-cta topic="fundamentals" placement="mid_article" -->

## Cause 4: A Class Missing Its Closing Brace

```cpp
#include <iostream>

class Counter {
public:
    void add() { ++count; }
private:
    int count = 0;

int main() {
    Counter c;
    c.add();
}
```

```
GCC:    main.cpp:12:2: error: expected '}' at end of input
        main.cpp:3:15: note: to match this '{'
        main.cpp:12:2: error: expected unqualified-id at end of input
Clang:  main.cpp:12:2: error: expected '}'
        main.cpp:3:15: note: to match this '{'
        main.cpp:12:2: error: expected ';' after class
MSVC:   main.cpp(3): fatal error C1075: '{': no matching token found
```

Without its closing brace, the class swallows `main`. **Fix:** close the class with `};` before `main`. A class needs the semicolon after its brace as well; see [expected ';' errors](/posts/cpp-expected-semicolon/) for why.

## Cause 5: A Missing } in a Header File

If the missing brace is in a header, the error shows up in the file that includes it. Here `shapes.h` forgets to close its namespace:

```cpp
// shapes.h
namespace shapes {

int area(int w, int h) {
    return w * h;
}
```

```cpp
// main.cpp
#include <iostream>
#include "shapes.h"

int main() {
    std::cout << shapes::area(3, 4) << '\n';
}
```

```
GCC:    main.cpp:6:2: error: expected '}' at end of input
        In file included from main.cpp:2:
        shapes.h:1:18: note: to match this '{'
Clang:  main.cpp:6:2: error: expected '}'
        shapes.h:1:18: note: to match this '{'
MSVC:   shapes.h(1): fatal error C1075: '{': no matching token found
```

The note sends you to the header, so fix the brace there.

If the broken header is included **before** `<iostream>`, it's much worse. The unclosed namespace swallows the standard library headers too, and you get a flood of strange errors from files like `cwchar`. In our test, GCC printed over 300 errors and Clang gave up after 20. If you ever see hundreds of errors inside standard headers, check your own headers for a missing brace first. See [header files in C++](/posts/cpp-header-files/).

## How to Find the Missing Brace Fast

1. **Read the note, not just the error.** GCC and Clang's "to match this '{'", or the line number in Visual Studio's C1075, tells you which block was left open.
2. **Let your editor format the file.** Use Format Document: Shift+Alt+F in VS Code on Windows, or Ctrl+K, Ctrl+D in Visual Studio. Everything after the missing brace ends up indented one level too deep, which shows you where the block should have ended.
3. **Click next to a brace.** Most editors highlight the matching brace, so you can check each `{` in turn.
4. **Type both braces at once.** When you open a block, type `{` and `}` together, then fill in the middle. Many editors do this for you.

## The Opposite Problem: One } Too Many

```cpp
#include <iostream>

int main() {
    std::cout << "Hi\n";
}
}
```

```
GCC:    main.cpp:6:1: error: expected declaration before '}' token
Clang:  main.cpp:6:1: error: extraneous closing brace ('}')
MSVC:   main.cpp(6): error C2059: syntax error: '}'
        main.cpp(6): error C2143: syntax error: missing ';' before '}'
```

**Fix:** delete the extra `}` on the line the error points to.

## Quick Reference

| Message | Usual cause |
|---|---|
| `expected '}' at end of input` (GCC), `expected '}'` (Clang) | A `{` with no matching `}`; the note shows which one |
| `C1075: '{': no matching token found` (Visual Studio) | The same; the line number is the unclosed `{` |
| `expected '}' before 'else'` | Missing `}` at the end of an `if` block |
| `a function-definition is not allowed here` | The function above is missing its `}` |
| `expected declaration before '}' token` | One `}` too many |
| Hundreds of errors inside standard headers | A header with a missing `}`, included before them |

For other common messages, see [C++ error messages explained](/posts/cpp-error-messages/).

---

## Take Your C++ Further

<!-- book-cta topic="fundamentals" placement="end_cta" -->

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the most common errors and what they mean.
- [How to Fix Expected ';' Errors](/posts/cpp-expected-semicolon/) — the other punctuation error every beginner hits.
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — where each function starts and ends.
- [Header Files in C++](/posts/cpp-header-files/) — how includes are pasted into your code.
- [C++ Conditionals Tutorial](/posts/cpp-conditionals-tutorial/) — braces in if and else blocks.
