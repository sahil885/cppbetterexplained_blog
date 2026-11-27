---
title: "How to Fix 'too few arguments in function call' in C++"
description: "Fix 'too few arguments in function call' and 'too many arguments in function call' in C++: match the call to the function, or give a parameter a default value."
pubDatetime: 2026-11-27T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "visual-studio"]
draft: false
featured: false
hideMidOptin: true
faqSchema:
  - question: "What does 'too few arguments in function call' mean?"
    answer: "The function was written to take more values than you passed. If area is declared as int area(int width, int height), every call must pass two numbers. Add the missing argument, or give the parameter a default value if it should be optional."
  - question: "What does 'too many arguments in function call' mean?"
    answer: "You passed more values than the function has parameters. Remove the extra argument, or check that you're calling the function you think you are; a function with the same name might take fewer values than you remember."
  - question: "What is the GCC version of this error?"
    answer: "GCC says too few arguments to function 'int area(int, int)' or too many arguments to function, followed by a note showing where the function is declared. Visual Studio's build reports C2660: function does not take 1 arguments."
  - question: "How do I make an argument optional?"
    answer: "Give the parameter a default value in the function declaration: void greet(int times = 1). Calls can then leave it out, and greet() behaves like greet(1). Default values have to come at the end of the parameter list."
---

# How to Fix "too few arguments in function call" in C++

**Short answer:** the function was written to take a certain number of values, and your call passes a different number. Count the parameters in the function's first line, then count the arguments in your call; they must match. If an argument should be optional, give that parameter a **default value**.

| Where | Too few | Too many |
|---|---|---|
| Visual Studio editor (red squiggle) | `too few arguments in function call` | `too many arguments in function call` |
| Visual Studio build | `C2660: 'area': function does not take 1 arguments` | `C2660: 'area': function does not take 3 arguments` |
| GCC (g++, MinGW, Code::Blocks) | `too few arguments to function 'int area(int, int)'` | `too many arguments to function 'int area(int, int)'` |
| Clang (Xcode, macOS) | `no matching function for call to 'area'` | `no matching function for call to 'area'` |

<!-- optin-quick error="too few arguments in function call" -->

---

## Parameters vs Arguments

The **parameters** are the names in the function's first line: `int area(int width, int height)` has two, `width` and `height`. The **arguments** are the values you pass when you call it: `area(5, 3)` passes two. The counts have to match, because C++ needs a value for every parameter before the function can run.

## Too Few Arguments

```cpp
#include <iostream>

int area(int width, int height) {
    return width * height;
}

int main() {
    std::cout << area(5) << '\n';
}
```

```
Visual Studio editor:  too few arguments in function call
MSVC build:            error C2660: 'area': function does not take 1 arguments
GCC:                   error: too few arguments to function 'int area(int, int)'
                       note: declared here
Clang:                 error: no matching function for call to 'area'
                       note: candidate function not viable: requires 2 arguments, but 1 was provided
```

Clang's note says exactly what's wrong: two needed, one given. **Fix:** pass both:

```cpp
#include <iostream>

int area(int width, int height) {
    return width * height;
}

int main() {
    std::cout << area(5, 3) << '\n';
}
```

```
15
```

It happens with no arguments at all, too. A function declared as `void greet(int times)` can't be called as `greet()`; GCC then says `too few arguments to function 'void greet(int)'`.

## Too Many Arguments

```cpp
#include <iostream>

int area(int width, int height) {
    return width * height;
}

int main() {
    std::cout << area(5, 3, 2) << '\n';
}
```

```
Visual Studio editor:  too many arguments in function call
MSVC build:            error C2660: 'area': function does not take 3 arguments
GCC:                   error: too many arguments to function 'int area(int, int)'
Clang:                 error: no matching function for call to 'area'
                       note: candidate function not viable: requires 2 arguments, but 3 were provided
```

**Fix:** remove the extra value, or, if you really need a third one, add a third parameter to the function.

<!-- book-cta topic="fundamentals" placement="mid_article" -->

## Making an Argument Optional

If a value should usually be the same, give the parameter a **default value**. Calls can then leave it out:

```cpp
#include <iostream>

void greet(int times = 1) {
    for (int i = 0; i < times; i++) {
        std::cout << "Hi\n";
    }
}

int main() {
    greet();
    greet(2);
}
```

```
Hi
Hi
Hi
```

`greet()` uses the default and prints once; `greet(2)` prints twice. Default values must come last in the parameter list. More in [default arguments](/posts/cpp-default-arguments/).

## When the Count Looks Right

If you've counted and the call matches, check these:

- **You're editing a different version of the function.** If the declaration at the top of the file (or in a header) says `int area(int width, int height);` but you changed the definition below, the editor checks your call against the declaration. Keep them the same.
- **A class constructor.** `Player p("Sam");` fails if the constructor needs a name *and* a score. The editor's message for constructors is different (`no instance of constructor ... matches the argument list`), but the fix is the same.
- **An overloaded function.** If several versions share a name, GCC reports `no matching function for call to` instead. See [how to fix 'no matching function for call to'](/posts/cpp-no-matching-function-for-call/).

## Quick Reference

| Message | Fix |
|---|---|
| `too few arguments in function call` | Pass every value the function's parameters need |
| `too many arguments in function call` | Remove the extra value, or add a parameter |
| An argument that's usually the same | Give the parameter a default value, `int times = 1` |
| Count matches but the error stays | Check the declaration at the top of the file or in the header |

For other common messages, see [C++ error messages explained](/posts/cpp-error-messages/).

---

## Take Your C++ Further

<!-- book-cta topic="fundamentals" placement="end_cta" -->

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the most common errors and what they mean.
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — parameters, arguments and return values.
- [Default Arguments in C++](/posts/cpp-default-arguments/) — making parameters optional.
- [How to Fix 'no matching function for call to'](/posts/cpp-no-matching-function-for-call/) — when no version of a function fits.
- [Function Overloading in C++](/posts/cpp-function-overloading/) — several functions with the same name.
