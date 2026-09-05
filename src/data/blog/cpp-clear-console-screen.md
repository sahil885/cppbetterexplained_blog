---
title: "How to Clear the Console Screen in C++ (Every Method Explained)"
description: "Learn how to clear the console screen in C++ on Windows, Linux and macOS. Compare system(cls), ANSI escape codes, and the old conio.h clrscr approach."
pubDatetime: 2026-09-05T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "console", "tutorial"]
faqSchema:
  - question: "How do you clear the console screen in C++?"
    answer: "The simplest way is to call system(\"cls\") on Windows or system(\"clear\") on Linux and macOS, after including <cstdlib>. A more portable option is to print the ANSI escape sequence \"\\033[2J\\033[H\", which works in any terminal that understands ANSI codes."
  - question: "Why does clrscr() not work in C++?"
    answer: "clrscr() lives in conio.h, which is not part of standard C++. It only shipped with old Borland and Turbo C++ compilers, so modern compilers like g++, clang and MSVC will report that the header or the function does not exist."
  - question: "Is system(\"cls\") bad practice in C++?"
    answer: "It works, but it launches an entire operating system shell just to blank the screen, which is slow and platform specific. For a small learning project it is fine. For anything you ship, prefer ANSI escape codes or a terminal library like ncurses."
draft: false
featured: false
---

# How to Clear the Console Screen in C++

Once you start writing menu-driven programs or little terminal games, your output quickly turns into a wall of old text. The obvious fix is to wipe the screen before drawing the next frame — but C++ has no `std::clear_screen()`. Clearing the console is a job for the terminal, not for the language.

That single fact explains every quirk you're about to see.

---

## Method 1: The `system()` Call

This is the version you'll find in most tutorials, and it's the easiest to understand:

```cpp
#include <iostream>
#include <cstdlib>   // needed for system()

int main() {
    std::cout << "This text will disappear in a moment...\n";

    system("cls");     // Windows
    // system("clear"); // Linux and macOS

    std::cout << "Fresh screen!\n";
    return 0;
}
```

`system()` hands a string to your operating system's command shell and asks it to run that command. `cls` is the Windows command for "clear screen"; `clear` is the Unix equivalent.

The catch is right there in the comment: **the command name is different per platform**, and calling the wrong one just prints an error like `'cls' is not recognized`. You can paper over that with a preprocessor check:

```cpp
#include <cstdlib>

void clearScreen() {
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}
```

`_WIN32` is defined automatically by compilers targeting Windows, so the right branch is chosen at compile time. If you're new to `#ifdef`, our guide to [preprocessor directives](/posts/cpp-preprocessor-directives/) explains what's happening.

---

## Why `system()` Is Slower Than You'd Guess

Calling `system()` isn't a function call in the ordinary sense. Your program asks the OS to **spawn a whole new process** — a command interpreter — wait for it to finish, and then continue. That's thousands of times more expensive than printing a few characters.

For a menu that refreshes when the user presses a key, nobody will notice. For a game loop redrawing 30 times a second, you'll see visible flicker and stutter. That's the real reason experienced C++ programmers wince at `system("cls")`, not snobbery.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Method 2: ANSI Escape Codes (The Portable One)

Terminals have understood special character sequences for decades. Print the right sequence and the terminal itself clears the screen — no new process, no OS-specific command:

```cpp
#include <iostream>

void clearScreen() {
    std::cout << "\033[2J\033[H" << std::flush;
}

int main() {
    std::cout << "Old output that we want gone.\n";
    clearScreen();
    std::cout << "Clean slate.\n";
    return 0;
}
```

Breaking the magic string apart:

- `\033` is the **escape character** (decimal 27). It tells the terminal "what follows is a command, not text."
- `[2J` means "erase the entire screen."
- `[H` means "move the cursor to the top-left corner."

You need both. `[2J` alone blanks the text but leaves the cursor wherever it was, so your next `std::cout` starts printing halfway down an empty screen.

The `std::flush` matters too: output is buffered, and you want the escape sequence to reach the terminal *now* rather than whenever the buffer happens to fill. See [endl vs \n](/posts/cpp-endl-vs-newline/) for more on flushing.

**One Windows caveat:** ANSI codes work out of the box in Windows Terminal, PowerShell 7, VS Code's terminal and every Linux/macOS shell. The legacy `cmd.exe` console on older Windows 10 builds may print gibberish like `←[2J` instead. If you're targeting that, stick with `system("cls")`.

---

## Method 3: `clrscr()` — And Why It Fails

If you've copied code from an old textbook you may have seen:

```cpp
#include <conio.h>   // ✗ not standard C++

int main() {
    clrscr();        // ✗ will not compile on g++, clang or modern MSVC
    return 0;
}
```

`conio.h` was a **Borland/Turbo C++ extension** from the DOS era. It was never part of the C++ standard, and modern compilers don't ship it. If you see `fatal error: conio.h: No such file or directory`, this is why — and no amount of fiddling with include paths will fix it. Our guide to [common C++ error messages](/posts/cpp-error-messages/) covers more mysteries of this kind.

Delete it and use one of the two methods above.

---

## Putting It Together: A Refreshing Menu

Here's the pattern in the context where beginners actually need it:

```cpp
#include <iostream>
#include <cstdlib>
#include <limits>

void clearScreen() {
#ifdef _WIN32
    system("cls");
#else
    std::cout << "\033[2J\033[H" << std::flush;
#endif
}

int main() {
    int choice = 0;

    do {
        clearScreen();
        std::cout << "=== Main Menu ===\n";
        std::cout << "1. Say hello\n";
        std::cout << "2. Say goodbye\n";
        std::cout << "0. Quit\n";
        std::cout << "Choice: ";

        if (!(std::cin >> choice)) {              // user typed letters
            if (std::cin.eof()) break;            // input closed — don't spin forever
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            choice = -1;
        }

        if (choice == 1)      std::cout << "\nHello!\n";
        else if (choice == 2) std::cout << "\nGoodbye!\n";
        else if (choice != 0) std::cout << "\nUnknown option.\n";

        if (choice != 0) {
            std::cout << "Press Enter to continue...";
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            std::cin.get();
        }
    } while (choice != 0);

    return 0;
}
```

Notice the `Press Enter to continue...` pause. Without it the screen clears instantly and the user never sees the result of their choice — a classic beginner bug. The input-validation block comes from [clearing the cin buffer](/posts/cpp-cin-ignore-clear-buffer/), which you'll need any time a user might type a word where you expected a number.

The `if (std::cin.eof()) break;` line matters too. If the input stream closes — the user presses Ctrl+D on Linux or Ctrl+Z on Windows, or the program is fed a file that runs out — `std::cin` fails permanently, and a retry loop without an EOF check will spin at 100% CPU forever.

---

## Which One Should You Use?

| Situation | Use this |
|---|---|
| Learning, Windows only | `system("cls")` |
| Cross-platform school project | the `#ifdef` wrapper above |
| Game loop or fast redraw | ANSI escape codes |
| Full-screen terminal UI | a library like ncurses or PDCurses |
| Anything at all | **not** `conio.h` |

The honest summary: clearing the screen is a terminal feature that C++ borrows, so there is no single blessed answer. Pick the method that matches where your program will actually run.

---

## Related Articles

- [Build a Menu-Driven Program in C++](/posts/cpp-menu-driven-program/)
- [How to Clear the cin Buffer in C++](/posts/cpp-cin-ignore-clear-buffer/)
- [C++ Preprocessor Directives Explained](/posts/cpp-preprocessor-directives/)
- [endl vs \n in C++](/posts/cpp-endl-vs-newline/)
- [How to Add a Delay or Sleep in C++](/posts/cpp-sleep-delay-program/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
