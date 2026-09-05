---
title: "C++ Temperature Conversion Program: Celsius, Fahrenheit and Kelvin"
description: "Build a C++ temperature converter step by step. Covers the Celsius to Fahrenheit formula, integer division traps, decimal formatting and a full menu program."
pubDatetime: 2026-09-05T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "project", "tutorial"]
faqSchema:
  - question: "What is the formula to convert Celsius to Fahrenheit in C++?"
    answer: "The formula is fahrenheit = celsius * 9.0 / 5.0 + 32.0. Write the numbers with decimal points so C++ performs floating-point division. Using 9 / 5 with plain integers evaluates to 1 and gives you a badly wrong answer."
  - question: "Why does my C++ temperature converter always print the wrong number?"
    answer: "Almost always it is integer division. If celsius, or the constants 9 and 5, are integers, then 9 / 5 is calculated as 1 before anything else happens. Declare your temperature variables as double and write the constants as 9.0 and 5.0."
  - question: "How do I show only two decimal places in a C++ temperature program?"
    answer: "Include <iomanip> and write std::cout << std::fixed << std::setprecision(2) before printing. std::fixed forces normal decimal notation and setprecision(2) fixes the number of digits after the decimal point."
draft: false
featured: false
---

# C++ Temperature Conversion Program

A temperature converter is the classic second program after Hello World — and it's a better teacher than it looks. It quietly forces you to confront integer division, floating-point types, output formatting and input validation, all inside about forty lines.

Let's build it properly.

---

## The Formulas

| Conversion | Formula |
|---|---|
| Celsius → Fahrenheit | `F = C × 9/5 + 32` |
| Fahrenheit → Celsius | `C = (F − 32) × 5/9` |
| Celsius → Kelvin | `K = C + 273.15` |
| Kelvin → Celsius | `C = K − 273.15` |

Two fixed points to sanity-check your code against: 0°C is 32°F, and 100°C is 212°F.

---

## The Simplest Version

```cpp
#include <iostream>

int main() {
    double celsius;

    std::cout << "Enter temperature in Celsius: ";
    std::cin >> celsius;

    double fahrenheit = celsius * 9.0 / 5.0 + 32.0;

    std::cout << celsius << "C = " << fahrenheit << "F\n";

    return 0;
}
```

Run it with `100` and you get `212`. Good.

---

## The Bug Almost Everyone Hits First

Change one thing — make the variable an `int` — and watch the whole program fall apart:

```cpp
int celsius = 100;
int fahrenheit = celsius * 9 / 5 + 32;   // = 212, still fine
int f2 = celsius * (9 / 5) + 32;         // = 132  ✗ WRONG
```

The difference is the parentheses. In `9 / 5`, both operands are integers, so C++ performs **integer division**: it computes 1.8 and then throws away the `.8`, leaving 1. Every temperature comes out wildly wrong, and nothing warns you.

In the first line the multiplication happens first (`100 * 9 = 900`, then `900 / 5 = 180`), so it survives by luck. Don't rely on luck. The fix is to make at least one operand a floating-point value:

```cpp
double fahrenheit = celsius * 9.0 / 5.0 + 32.0;   // ✓ always correct
```

That single decimal point is the difference between a working program and a mystifying one. [Integer division in C++](/posts/cpp-integer-division/) covers more places this bites, and [float vs double](/posts/cpp-float-vs-double/) explains why we use `double` rather than `float`.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Making the Output Readable

By default `std::cout` prints `37.7778` for body temperature — six significant digits, which looks like a machine talking. Two decimals is plenty:

```cpp
#include <iostream>
#include <iomanip>

int main() {
    double celsius = 37.0;
    double fahrenheit = celsius * 9.0 / 5.0 + 32.0;

    std::cout << std::fixed << std::setprecision(2);
    std::cout << celsius << " °C = " << fahrenheit << " °F\n";
    // 37.00 °C = 98.60 °F

    return 0;
}
```

`std::fixed` says "use plain decimal notation, not scientific," and `std::setprecision(2)` sets the digits after the point. Both are *sticky* — once set, they affect every later `cout` on that stream. See [formatting output with iomanip](/posts/cpp-iomanip-formatting/) for the full toolkit.

---

## Wrapping the Conversions in Functions

Formulas buried in `main()` get copy-pasted and mistyped. Give each one a name:

```cpp
double celsiusToFahrenheit(double c) { return c * 9.0 / 5.0 + 32.0; }
double fahrenheitToCelsius(double f) { return (f - 32.0) * 5.0 / 9.0; }
double celsiusToKelvin(double c)     { return c + 273.15; }
double kelvinToCelsius(double k)     { return k - 273.15; }
```

Now `celsiusToFahrenheit(100)` reads like what it does, and if the formula is ever wrong it's wrong in exactly one place. That's the real argument for [functions](/posts/cpp-functions-tutorial/) — not saving keystrokes, but having a single source of truth.

---

## The Complete Menu Program

Here's the whole thing, with a menu loop and input validation:

```cpp
#include <iostream>
#include <iomanip>
#include <limits>
#include <string>

double celsiusToFahrenheit(double c) { return c * 9.0 / 5.0 + 32.0; }
double fahrenheitToCelsius(double f) { return (f - 32.0) * 5.0 / 9.0; }
double celsiusToKelvin(double c)     { return c + 273.15; }
double kelvinToCelsius(double k)     { return k - 273.15; }

double readTemperature(const std::string& prompt) {
    double value;
    while (true) {
        std::cout << prompt;
        if (std::cin >> value) {
            return value;
        }
        if (std::cin.eof()) {          // input stream closed — give up cleanly
            return 0.0;
        }
        std::cout << "That isn't a number. Try again.\n";
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    }
}

int main() {
    std::cout << std::fixed << std::setprecision(2);
    int choice = 0;

    do {
        std::cout << "\n=== Temperature Converter ===\n"
                  << "1. Celsius    -> Fahrenheit\n"
                  << "2. Fahrenheit -> Celsius\n"
                  << "3. Celsius    -> Kelvin\n"
                  << "4. Kelvin     -> Celsius\n"
                  << "0. Quit\n"
                  << "Choice: ";

        if (!(std::cin >> choice)) {
            if (std::cin.eof()) break;   // Ctrl+D / Ctrl+Z ends the program
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            std::cout << "Please enter a number from the menu.\n";
            continue;
        }

        switch (choice) {
            case 1: {
                double c = readTemperature("Celsius: ");
                std::cout << c << " C = " << celsiusToFahrenheit(c) << " F\n";
                break;
            }
            case 2: {
                double f = readTemperature("Fahrenheit: ");
                std::cout << f << " F = " << fahrenheitToCelsius(f) << " C\n";
                break;
            }
            case 3: {
                double c = readTemperature("Celsius: ");
                std::cout << c << " C = " << celsiusToKelvin(c) << " K\n";
                break;
            }
            case 4: {
                double k = readTemperature("Kelvin: ");
                if (k < 0.0) {
                    std::cout << "Kelvin cannot be negative.\n";
                    break;
                }
                std::cout << k << " K = " << kelvinToCelsius(k) << " C\n";
                break;
            }
            case 0:
                std::cout << "Goodbye!\n";
                break;
            default:
                std::cout << "Unknown option.\n";
        }
    } while (choice != 0);

    return 0;
}
```

Three details worth noticing:

- **`readTemperature` loops until the input is valid.** If the user types `abc`, `std::cin >> value` fails, leaves the bad characters in the buffer, and every later read fails too — unless you `clear()` the error flags and `ignore()` the junk. That pair is explained in [clearing the cin buffer](/posts/cpp-cin-ignore-clear-buffer/).
- **The `eof()` checks are not optional.** If the input stream is closed (the user presses Ctrl+D on Linux or Ctrl+Z on Windows, or you pipe a file in), `std::cin` fails permanently. Without an EOF check, `clear()` and `ignore()` succeed, the read fails again, and your program spins forever at 100% CPU. Every retry loop that reads input needs this guard.
- **Each `case` uses braces `{ }`.** You need them whenever you declare a variable inside a case, or the compiler complains about jumping over an initialisation. See [the switch statement](/posts/cpp-switch-statement/).
- **The Kelvin check rejects negatives.** Absolute zero is the floor; a converter that happily accepts −50 K is telling the user something false.

---

## Ideas to Extend It

- Add Rankine (`R = F + 459.67`) as a fifth option
- Print a conversion table from −40°C to 100°C in steps of 10, using [nested loops](/posts/cpp-nested-loops/) and `setw` for alignment
- Warn when a Celsius input is below −273.15
- Read a list of temperatures from a file and write the converted values back out with [file handling](/posts/cpp-file-handling/)

---

## Related Articles

- [Integer Division in C++](/posts/cpp-integer-division/)
- [Formatting Output With iomanip](/posts/cpp-iomanip-formatting/)
- [The switch Statement in C++](/posts/cpp-switch-statement/)
- [Build a Menu-Driven Program in C++](/posts/cpp-menu-driven-program/)
- [C++ Beginner Projects to Build](/posts/cpp-beginner-projects/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
