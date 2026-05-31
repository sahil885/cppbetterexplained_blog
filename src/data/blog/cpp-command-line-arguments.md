---
title: "C++ Command Line Arguments: How to Use argc and argv"
description: "Learn how to use command line arguments in C++ with argc and argv. Covers parsing flags, converting arguments to numbers, validation, and practical examples."
pubDatetime: 2026-05-30T00:00:00Z
author: "Sahil"
tags: ["C++", "command-line", "beginner", "tutorial", "argc-argv"]
draft: false
featured: false
faqSchema:
  - question: "What are argc and argv in C++?"
    answer: "argc and argv are the parameters of main() that give your program access to command line arguments. argc (argument count) is an int holding the number of arguments passed, including the program name itself. argv (argument vector) is an array of C-strings (char*) holding the actual argument text. argv[0] is the program name, and argv[1] onward are the arguments the user typed."
  - question: "Why is argc always at least 1?"
    answer: "argc is at least 1 because the first element, argv[0], is always the name (or path) used to run the program. So even when the user passes no arguments, argc equals 1. Real user-supplied arguments start at argv[1], which is why you usually loop from index 1."
  - question: "How do I convert a command line argument to an integer in C++?"
    answer: "Command line arguments always arrive as text (C-strings), so you must convert them. The modern, safe way is std::stoi, which turns a std::string into an int and throws an exception on invalid input: int n = std::stoi(argv[1]); Wrap it in a try/catch to handle non-numeric input gracefully. For floating-point, use std::stod."
  - question: "How do I handle missing command line arguments in C++?"
    answer: "Always check argc before reading argv. If the user didn't pass enough arguments, argc will be smaller than you expect, and reading past the valid range causes undefined behavior. A common pattern is: if (argc < 2) { print usage message; return 1; } This validates input before you touch argv."
  - question: "What is the difference between argv as char* argv[] and char** argv?"
    answer: "They are two ways of writing the same thing. char* argv[] reads as 'an array of pointers to char,' and char** argv reads as 'a pointer to a pointer to char.' In a function parameter list, an array decays to a pointer, so both declarations are interchangeable for main(). Use whichever you find clearer."
---

# C++ Command Line Arguments: How to Use argc and argv

Most beginner C++ programs are self-contained: you run them, they ask for input with `cin`, and that's it. But real command line tools work differently — you pass them information _when you launch them_, like `grep "error" log.txt` or `g++ main.cpp -o app`. Those extra words after the program name are **command line arguments**, and C++ hands them to you through two parameters: `argc` and `argv`.

This guide explains exactly how they work, how to read them safely, and how to turn them into numbers and flags you can actually use.

## The Two Forms of main()

You've probably always written `main` like this:

```cpp
int main()
{
    // ...
}
```

To receive command line arguments, you use the other legal form of `main`:

```cpp
int main(int argc, char* argv[])
{
    // ...
}
```

Both are valid. The second simply asks the runtime to pass in the arguments. The names `argc` and `argv` are just convention — the types are what matter — but everyone uses them, so you should too.

## What argc and argv Actually Hold

- **`argc`** ("argument count") is an `int`. It's the number of arguments, _including the program's own name_.
- **`argv`** ("argument vector") is an array of C-style strings (`char*`). Each entry is one argument as text.

The crucial detail that trips up beginners: **`argv[0]` is the program name**, not the first real argument. The arguments the user typed start at `argv[1]`.

So if you run:

```text
./greet Alice 42
```

You get:

| Index     | Value     | What it is            |
| --------- | --------- | --------------------- |
| `argv[0]` | `./greet` | the program name/path |
| `argv[1]` | `Alice`   | first user argument   |
| `argv[2]` | `42`      | second user argument  |

And `argc` is `3` — three slots total. That's why `argc` is always at least `1`.

## Printing Every Argument

The simplest useful program just echoes back what it was given. You loop from `0` to `argc - 1`:

```cpp
#include <iostream>

int main(int argc, char* argv[])
{
    std::cout << "You passed " << argc - 1 << " argument(s).\n";

    for (int i = 0; i < argc; ++i)
    {
        std::cout << "argv[" << i << "] = " << argv[i] << "\n";
    }

    return 0;
}
```

Run it as `./program hello world` and you'll see `argv[0]` (the program name) followed by each argument. Notice we print `argc - 1` as the user-supplied count, since the program name doesn't count as a "real" argument.

If the `for` loop syntax feels rusty, the [C++ loops tutorial](/posts/cpp-loops-tutorial/) is a quick refresher.

## A Worked Example: Reading a Single Command

Here's a complete program that checks the first argument and responds to the commands `P`, `A`, or `L`. Copy it into Visual Studio (or any compiler) and experiment by passing different arguments — it's the quickest way to _feel_ how `argc` and `argv` behave.

```cpp
#include <iostream>
using namespace std;

int main(int argc, char* argv[])
{
    // The default case: no argument was passed, so argc is 1
    if (argc == 1)
    {
        cout << "This is testing out command line arguments\n";
    }

    // Exactly one argument was passed (argc is 2)
    if (argc == 2)
    {
        if (argv[1][0] == 'P')
        {
            cout << "The P command has been entered in\n";
        }
        else if (argv[1][0] == 'A')
        {
            cout << "The A command has been entered in\n";
        }
        else if (argv[1][0] == 'L')
        {
            cout << "The L command has been entered in\n";
        }
        else
        {
            // If none of the commands are P, A, or L
            cout << "None of the commands are P, A or L\n";
        }
    }

    return 0;
}
```

A few things worth noticing:

- When you run the program with **no** arguments, `argc` is `1`, so only the default message prints.
- `argv[1][0]` reads the **first character** of the first argument. Because `argv[1]` is a C-style string, you can index into it like an array — `[1]` picks the argument, `[0]` picks its first letter. If indexing into strings/arrays is new, the [C++ arrays tutorial](/posts/cpp-arrays-tutorial/) explains the idea.
- This checks one character only. For full words like `"Print"` you'd compare the whole argument — see the flags section below for the `std::string` approach.

## Always Validate Before You Read

Here's the single most important habit with command line arguments: **check `argc` before you touch `argv`**. If you read `argv[1]` when the user passed nothing, you're reading memory that doesn't belong to you — undefined behavior, and a likely crash.

```cpp
#include <iostream>

int main(int argc, char* argv[])
{
    if (argc < 2)
    {
        std::cerr << "Usage: " << argv[0] << " <name>\n";
        return 1;   // non-zero signals an error
    }

    std::cout << "Hello, " << argv[1] << "!\n";
    return 0;
}
```

Two good practices are bundled in here: printing a **usage message** that uses `argv[0]` (so it shows the real program name), and **returning a non-zero exit code** to signal failure. Writing errors to `std::cerr` rather than `std::cout` is also the conventional choice for diagnostics.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

## Converting Arguments to Numbers

Every argument arrives as **text**, even if it looks like a number. `argv[1]` being `"42"` is the three-character string, not the integer `42`. To do math, you must convert.

The modern, safe tool is `std::stoi` (string to int). It throws an exception if the text isn't a valid number, so you can catch bad input instead of getting silent garbage:

```cpp
#include <iostream>
#include <string>

int main(int argc, char* argv[])
{
    if (argc < 3)
    {
        std::cerr << "Usage: " << argv[0] << " <a> <b>\n";
        return 1;
    }

    try
    {
        int a = std::stoi(argv[1]);
        int b = std::stoi(argv[2]);
        std::cout << a << " + " << b << " = " << a + b << "\n";
    }
    catch (const std::exception& e)
    {
        std::cerr << "Both arguments must be whole numbers.\n";
        return 1;
    }

    return 0;
}
```

For decimals, use `std::stod` (string to double) the same way. There's a full breakdown of the conversion options — including `stoi`, `atoi`, and `stringstream`, and why `stoi` is usually best — in the [C++ string to int conversion guide](/posts/cpp-string-to-int/).

## Handling Flags and Options

Real tools accept _flags_ like `-v` or `--help`. Since each argument is just a string, you compare it against the options you support. The cleanest way is to wrap each `argv[i]` in a `std::string` so you can use `==`:

```cpp
#include <iostream>
#include <string>

int main(int argc, char* argv[])
{
    bool verbose = false;
    std::string filename;

    for (int i = 1; i < argc; ++i)
    {
        std::string arg = argv[i];

        if (arg == "-v" || arg == "--verbose")
        {
            verbose = true;
        }
        else if (arg == "-h" || arg == "--help")
        {
            std::cout << "Usage: " << argv[0] << " [-v] <file>\n";
            return 0;
        }
        else
        {
            filename = arg;   // anything else is treated as the file
        }
    }

    if (verbose) std::cout << "Verbose mode on.\n";
    std::cout << "File: " << filename << "\n";
    return 0;
}
```

Why convert to `std::string`? Because comparing raw `char*` with `==` compares _pointers_, not text. Wrapping in `std::string` gives you real content comparison — a classic beginner trap. If strings in general feel shaky, see the [C++ string handling guide](/posts/cpp-string-handling/).

## A Common Pattern: Collect Arguments into a Vector

For anything beyond a couple of flags, it's tidy to copy the arguments into a `std::vector<std::string>` once, then work with that:

```cpp
#include <iostream>
#include <string>
#include <vector>

int main(int argc, char* argv[])
{
    std::vector<std::string> args(argv + 1, argv + argc);  // skip argv[0]

    for (const std::string& arg : args)
    {
        std::cout << "Got: " << arg << "\n";
    }

    return 0;
}
```

The line `std::vector<std::string> args(argv + 1, argv + argc)` builds the vector from the range starting just after the program name to the end — a neat one-liner that skips `argv[0]` automatically. From there you have all of `std::vector`'s conveniences. New to vectors? The [C++ vector tutorial](/posts/cpp-vector-tutorial/) covers them from scratch.

## How to Pass Arguments in Visual Studio

When you run a program from a terminal, you simply type the arguments after the executable name: `./myprogram P` (or `myprogram.exe P` on Windows). But inside an IDE there's no command line to type into, so you set the arguments in the project's settings. In Visual Studio:

1. In **Solution Explorer**, right-click your project and choose **Properties**.
2. Open **Configuration Properties** and select **Debugging**.
3. Find the **Command Arguments** field — this is where you type the arguments your program should receive.
4. Enter the value you want to test (for the example above, a single letter like `P`), then click **OK**.
5. Close the properties window and run the program with **Ctrl + F5** (Start Without Debugging).
6. The program now runs as if you'd launched it with those command line arguments.

For other environments: in **VS Code**, add an `"args"` array to your `launch.json`; in **CLion**, use the **Program arguments** field in the run configuration; and from any **terminal**, just type the arguments after the executable.

If you haven't set up a compiler or IDE yet, start with the [C++ setup guide](/posts/cpp-setup-guide/).

## Common Mistakes to Avoid

- **Forgetting `argv[0]` is the program name.** User arguments start at index `1`, not `0`.
- **Reading `argv` without checking `argc`.** Always validate the count first to avoid out-of-bounds access.
- **Comparing `char*` with `==`.** That compares addresses. Convert to `std::string` for text comparison.
- **Assuming arguments are numbers.** They're always text; convert with `std::stoi` / `std::stod` and handle conversion errors.
- **Ignoring the exit code.** Return non-zero on failure so scripts and other tools can detect that something went wrong.

## Summary

Command line arguments let your C++ programs take input at launch through `main(int argc, char* argv[])`. Remember the essentials: `argc` counts the arguments (program name included), `argv` holds them as text, `argv[0]` is the program name, and real input starts at `argv[1]`. Always check `argc` before reading, convert text to numbers with `std::stoi`/`std::stod`, and compare flags using `std::string`. With those habits, you can build proper command line tools instead of programs that only talk through `cin`.

Want every C++ concept explained this clearly, in order, from the ground up?

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

## Related Guides

- [C++ Functions Tutorial: How to Write and Use Functions](/posts/cpp-functions-tutorial/) — `main` is a function too; understand parameters and return values.
- [C++ User Input with cin: Reading from the Keyboard](/posts/cpp-cin-user-input/) — the other main way programs take input.
- [C++ String to int Conversion: stoi, atoi, and stringstream](/posts/cpp-string-to-int/) — turn argument text into numbers safely.
- [C++ Vector Tutorial: The Complete Guide to std::vector](/posts/cpp-vector-tutorial/) — store and process a collection of arguments.
- [Learn C++ from Scratch: The Complete Beginner Roadmap](/learn-cpp/) — the full structured learning path.
