---
title: "C++ Command Line Arguments: How to Use argc and argv Explained"
description: "Learn how to read command line arguments in C++ using argc and argv. Parse user input at startup with practical, beginner-friendly examples and tips."
pubDatetime: 2026-05-28T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "functions", "tutorial"]
faqSchema:
  - question: "What are argc and argv in C++?"
    answer: "argc (argument count) is an integer holding how many arguments were passed to the program, including the program name itself. argv (argument vector) is an array of C-strings (char*) containing each argument. Together they let your program read input provided on the command line at startup."
  - question: "How do you convert a command line argument to an integer in C++?"
    answer: "Use std::stoi() from the <string> header: int n = std::stoi(argv[1]). Always check that argv[1] exists first (argc > 1) before accessing it to avoid undefined behaviour."
  - question: "What is argv[0] in C++?"
    answer: "argv[0] is always the name (or path) of the program itself. So if you run ./myapp hello, then argc is 2, argv[0] is \"./myapp\", and argv[1] is \"hello\"."
draft: false
featured: false
---

# C++ Command Line Arguments: How to Use argc and argv

When you run a program like `./convert input.txt output.txt` or `./game --difficulty hard`, those extra words after the program name are **command line arguments**. C++ makes them available to your `main` function through two special parameters: `argc` and `argv`.

---

## The Extended main() Signature

The standard `main` you've seen has no parameters:

```cpp
int main() { }
```

To receive command line arguments, use this signature instead:

```cpp
int main(int argc, char* argv[]) { }
```

- `argc` — the **argument count**, an integer. Always at least `1` (the program name counts).
- `argv` — the **argument vector**, an array of C-strings. `argv[0]` is the program name; `argv[1]` is the first user-supplied argument, and so on.

---

## Your First argc/argv Program

```cpp
#include <iostream>

int main(int argc, char* argv[]) {
    std::cout << "Number of arguments: " << argc << "\n";

    for (int i = 0; i < argc; i++) {
        std::cout << "argv[" << i << "] = " << argv[i] << "\n";
    }

    return 0;
}
```

Compile and run:
```bash
g++ args.cpp -o args
./args hello world 42
```

Output:
```
Number of arguments: 4
argv[0] = ./args
argv[1] = hello
argv[2] = world
argv[3] = 42
```

`argc` is `4` because the program name is counted. The first *user* argument is always at index `1`.

---

## Checking for Required Arguments

Always validate that the expected arguments exist before using them:

```cpp
#include <iostream>

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: " << argv[0] << " <your-name>\n";
        return 1;
    }

    std::cout << "Hello, " << argv[1] << "!\n";
    return 0;
}
```

If run without a name argument:
```
Usage: ./greet <your-name>
```

Printing usage instructions to `std::cerr` (not `std::cout`) is the C++ convention for error messages — it goes to the standard error stream.

---

## Converting Arguments to Numbers

All command line arguments arrive as C-strings (text). Use `std::stoi()` or `std::stod()` to convert them:

```cpp
#include <iostream>
#include <string>

int main(int argc, char* argv[]) {
    if (argc < 3) {
        std::cerr << "Usage: " << argv[0] << " <num1> <num2>\n";
        return 1;
    }

    int a = std::stoi(argv[1]);
    int b = std::stoi(argv[2]);

    std::cout << a << " + " << b << " = " << (a + b) << "\n";
    return 0;
}
```

Run:
```bash
./add 15 27
```
Output:
```
15 + 27 = 42
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Practical Example: A Mini File Info Tool

Here's a more realistic program that accepts a filename and an optional flag:

```cpp
#include <iostream>
#include <string>

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: " << argv[0] << " <filename> [--verbose]\n";
        return 1;
    }

    std::string filename = argv[1];
    bool verbose = false;

    // Check for optional --verbose flag
    for (int i = 2; i < argc; i++) {
        if (std::string(argv[i]) == "--verbose") {
            verbose = true;
        }
    }

    std::cout << "Processing: " << filename << "\n";
    if (verbose) {
        std::cout << "(Verbose mode on — would print extra details here)\n";
    }

    return 0;
}
```

Run:
```bash
./tool data.csv --verbose
```
Output:
```
Processing: data.csv
(Verbose mode on — would print extra details here)
```

This pattern — iterating over `argv` looking for flags — is how many real-world command line tools work before they bring in a proper argument-parsing library.

---

## argv and Strings

`argv` holds `char*` (C-style strings), not `std::string`. To compare or manipulate them easily, convert with `std::string(argv[i])`:

```cpp
std::string flag = std::string(argv[i]);
if (flag == "--help") { /* ... */ }
```

For more complex argument parsing in larger projects, look into libraries like `getopt` or `cxxopts`, but for most beginner programs the simple loop shown above is perfectly sufficient.

---

## Related Articles

- [C++ Functions Tutorial: How to Write and Use Functions](/posts/cpp-functions-tutorial/)
- [C++ String Handling: std::string, string_view, and Performance Tips](/posts/cpp-string-handling/)
- [C++ int to string Conversion: Every Method Explained](/posts/cpp-int-to-string/)
- [How to Convert String to int in C++: stoi, atoi, and stringstream](/posts/cpp-string-to-int/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
