---
title: "How to Fix 'terminate called after throwing an instance of' in C++"
description: "Fix 'terminate called after throwing an instance of' in C++: what std::out_of_range, std::invalid_argument and what() mean, the usual causes, and try/catch."
pubDatetime: 2026-11-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "debugging"]
draft: false
featured: false
hideMidOptin: true
faqSchema:
  - question: "What does 'terminate called after throwing an instance of' mean?"
    answer: "Your program threw an exception and nothing caught it, so C++ called std::terminate, which stops the program. The type in quotes, such as std::out_of_range, tells you what kind of problem happened, and the what() line underneath gives the details."
  - question: "What does std::out_of_range mean in this message?"
    answer: "You asked for a position that doesn't exist. The usual causes are vector.at() with an index past the end, substr() with a start position past the end of the string, and std::stoi with a number too big for an int."
  - question: "What does 'what(): stoi' mean?"
    answer: "std::stoi couldn't convert your text to an int. With std::invalid_argument, the text doesn't start with a number. With std::out_of_range, the number is too big to fit in an int. Wrap the call in try and catch both exceptions."
  - question: "How do I stop the program from being terminated?"
    answer: "Either check the value before the call that throws, or put the call inside a try block and catch the exception type the message names, for example catch (const std::out_of_range& e). catch (const std::exception& e) catches every standard exception, and e.what() gives its message."
---

# How to Fix "terminate called after throwing an instance of" in C++

**Short answer:** your program **threw an exception**, and no `catch` block caught it, so C++ stopped the program. The message tells you the exception's type and a short reason:

```
terminate called after throwing an instance of 'std::out_of_range'
  what():  vector::_M_range_check: __n (which is 5) >= this->size() (which is 3)
```

Look up the type in quotes below to find the line that threw it. Then either fix the value that caused it, or catch the exception with `try` and `catch`.

| The type in quotes | Usual cause |
|---|---|
| `std::out_of_range` | `.at()` with an index past the end, `substr()` starting past the end, or `std::stoi` with a number too big for an `int` |
| `std::invalid_argument` | `std::stoi` given text that isn't a number |
| `std::length_error` | A vector created with a negative size |
| `std::runtime_error` | A `throw` in your code that nothing catches |
| `char const*` | `throw "some message";` with nothing to catch it |

<!-- optin-quick error="terminate called after throwing an instance of" -->

---

## How to Read the Message

The first line names the **type** of exception. The second line, `what():`, is the message stored inside it. On Linux, the terminal then adds `Aborted` (or `Aborted (core dumped)`), because an uncaught exception ends the program through `abort()`.

Other systems show the same information differently:

- **macOS (Xcode, Clang):** one line, such as `libc++abi: terminating due to uncaught exception of type std::out_of_range: vector`.
- **Visual Studio, Debug build:** a message box saying `abort() has been called`, with **Abort**, **Retry** and **Ignore** buttons. **Retry** opens the debugger. [Microsoft's documentation for abort](https://learn.microsoft.com/en-us/cpp/c-runtime-library/reference/abort) describes this box.
- **Visual Studio, Release build:** the program may close without any message. Its exit code is `-1073740791` (`0xC0000409`).

## Cause 1: An Index Past the End With .at()

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {90, 85, 77};
    std::cout << scores.at(5) << '\n';
}
```

```
terminate called after throwing an instance of 'std::out_of_range'
  what():  vector::_M_range_check: __n (which is 5) >= this->size() (which is 3)
```

The `what()` line spells it out: you asked for index 5, but the vector only has 3 elements (indexes 0 to 2). `.at()` checks every index and throws `std::out_of_range` when it's too big. Square brackets, `scores[5]`, don't throw: depending on your compiler you get a garbage value, a crash, or a "vector subscript out of range" box. See [vector subscript out of range](/posts/cpp-vector-subscript-out-of-range/) for that version.

**Fix:** check the index before you use it:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {90, 85, 77};
    std::size_t index = 5;
    if (index < scores.size()) {
        std::cout << scores.at(index) << '\n';
    } else {
        std::cout << "No score at position " << index << '\n';
    }
}
```

```
No score at position 5
```

The same thing happens with strings. `word.substr(10)` on `"hello"` throws:

```
terminate called after throwing an instance of 'std::out_of_range'
  what():  basic_string::substr: __pos (which is 10) > this->size() (which is 5)
```

Check `start <= word.size()` before calling `substr`. More in [how to get a substring](/posts/cpp-substring/).

## Cause 2: std::stoi With Text That Isn't a Number

```cpp
#include <iostream>
#include <string>

int main() {
    std::string input = "abc";
    int number = std::stoi(input);
    std::cout << number << '\n';
}
```

```
terminate called after throwing an instance of 'std::invalid_argument'
  what():  stoi
```

`what(): stoi` names the function that failed. `std::invalid_argument` means the text doesn't start with a number. A number that's too big for an `int`, such as `"99999999999"`, throws a different type:

```
terminate called after throwing an instance of 'std::out_of_range'
  what():  stoi
```

(On macOS the reasons are spelled out: `stoi: no conversion` and `stoi: out of range`.)

**Fix:** put the call inside `try`, and catch both types:

```cpp
#include <iostream>
#include <stdexcept>
#include <string>

int main() {
    std::string input = "abc";
    try {
        int number = std::stoi(input);
        std::cout << "You typed " << number << '\n';
    } catch (const std::invalid_argument&) {
        std::cout << "That's not a number\n";
    } catch (const std::out_of_range&) {
        std::cout << "That number is too big\n";
    }
}
```

```
That's not a number
```

With `"99999999999"`, the same program prints `That number is too big`. If you only catch `std::invalid_argument`, a number that's too big still ends the program, because nothing catches `std::out_of_range`. See [string to int](/posts/cpp-string-to-int/) and [input validation](/posts/cpp-input-validation/) for more ways to handle user input.

<!-- book-cta topic="fundamentals" placement="mid_article" -->

## Cause 3: A Vector With a Negative Size

```cpp
#include <iostream>
#include <vector>

int main() {
    int count = -1;
    std::vector<int> scores(count);
    std::cout << scores.size() << '\n';
}
```

```
terminate called after throwing an instance of 'std::length_error'
  what():  cannot create std::vector larger than max_size()
```

A vector's size can't be negative, so -1 is converted to a huge positive number, far bigger than any vector can be. This usually means a size calculated somewhere went wrong.

**Fix:** check the size first:

```cpp
#include <iostream>
#include <vector>

int main() {
    int count = -1;
    if (count < 0) {
        std::cout << "Count can't be negative\n";
        return 1;
    }
    std::vector<int> scores(count);
    std::cout << scores.size() << '\n';
}
```

```
Count can't be negative
```

## Cause 4: Your Own throw With No catch

```cpp
#include <iostream>
#include <stdexcept>

int divide(int a, int b) {
    if (b == 0) {
        throw std::runtime_error("division by zero");
    }
    return a / b;
}

int main() {
    std::cout << divide(10, 0) << '\n';
}
```

```
terminate called after throwing an instance of 'std::runtime_error'
  what():  division by zero
```

Throwing is how `divide` reports a problem it can't handle. But the caller has to catch it, or the program ends.

**Fix:** call it inside `try`, and catch the exception:

```cpp
#include <iostream>
#include <stdexcept>

int divide(int a, int b) {
    if (b == 0) {
        throw std::runtime_error("division by zero");
    }
    return a / b;
}

int main() {
    try {
        std::cout << divide(10, 0) << '\n';
    } catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << '\n';
    }
}
```

```
Error: division by zero
```

`catch (const std::exception& e)` catches every standard exception, including all the types in this article, and `e.what()` gives you its message. [Exception handling in C++](/posts/exception-handling-cpp/) covers `try`, `catch` and `throw` in more depth.

### Throwing a string: 'char const*'

If the function says `throw "division by zero";` instead, the message looks like this, with no `what():` line:

```
terminate called after throwing an instance of 'char const*'
```

A string in quotes isn't a `std::exception`, so `catch (const std::exception& e)` won't catch it. Throw `std::runtime_error("...")` instead, as above.

## "terminate called without an active exception"

This similar message has a different cause. The most common one for beginners is a `std::thread` that's never joined:

```cpp
#include <thread>

void work() {}

int main() {
    std::thread worker(work);
}
```

```
terminate called without an active exception
```

A thread object must be joined (or detached) before it's destroyed. **Fix:** add `worker.join();` at the end of `main`.

## Finding the Line That Threw

The message names the exception but not the line. To find the line:

- **GDB:** type `catch throw` before `run`. GDB stops when the exception is thrown, and `bt` lists the calls that led there, including the line in your code. See [debugging with GDB](/posts/debugging-cpp-gdb/).
- **Visual Studio:** run with the debugger (F5), or press **Retry** in the `abort() has been called` box. The debugger stops where the exception was thrown.

## Quick Reference

| The message says | Fix |
|---|---|
| `std::out_of_range` with `vector::_M_range_check` | Check `index < v.size()` before `v.at(index)` |
| `std::out_of_range` with `basic_string::substr` | Check `start <= s.size()` before `s.substr(start)` |
| `std::invalid_argument` or `std::out_of_range` with `stoi` | Wrap `std::stoi` in `try` and catch both |
| `std::length_error` | Make sure the vector's size isn't negative |
| `std::runtime_error` | Catch it with `catch (const std::exception& e)` |
| `char const*` | Throw `std::runtime_error` instead of a string |
| `without an active exception` | `join()` your `std::thread` |

For other common messages, see [C++ error messages explained](/posts/cpp-error-messages/).

---

## Take Your C++ Further

<!-- book-cta topic="fundamentals" placement="end_cta" -->

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the most common errors and what they mean.
- [Exception Handling in C++](/posts/exception-handling-cpp/) — `try`, `catch` and `throw`, step by step.
- [How to Fix 'vector subscript out of range'](/posts/cpp-vector-subscript-out-of-range/) — the same mistake with square brackets.
- [How to Convert String to int in C++](/posts/cpp-string-to-int/) — `stoi` and its alternatives.
- [C++ Input Validation](/posts/cpp-input-validation/) — handling bad `cin` input without crashing.
