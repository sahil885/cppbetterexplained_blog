---
title: "How to Make a C++ Program Wait: sleep_for and Delays Explained"
description: "Pause a C++ program with std::this_thread::sleep_for. Learn the portable C++11 way, why Sleep and usleep are not portable, and why busy-wait loops are bad."
pubDatetime: 2026-08-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "chrono", "tutorial"]
faqSchema:
  - question: "How do I make a C++ program wait for a few seconds?"
    answer: "Include the thread and chrono headers and call std::this_thread::sleep_for with a duration, such as std::chrono::seconds(2). This has worked on every platform since C++11 and needs no operating system specific code."
  - question: "What is the difference between sleep_for and sleep_until?"
    answer: "sleep_for pauses for a duration measured from now, such as 500 milliseconds. sleep_until pauses until a specific point in time, which avoids drift when you want an action to happen on a fixed schedule."
  - question: "Why should I avoid a busy-wait loop for delays?"
    answer: "A loop that spins until a timer expires keeps a CPU core at full load for the entire wait, wasting power and blocking other work. sleep_for tells the operating system to deschedule the thread so the core is free until the time is up."
draft: false
featured: false
---

# How to Make a C++ Program Wait: sleep_for and Delays Explained

You want a countdown timer, a typing animation, or a pause between menu screens. You search "C++ sleep" and get four different answers — `Sleep()`, `usleep()`, `sleep()`, and something involving `<chrono>` — half of which don't compile on your machine.

Here's the one that always works, plus why the others exist.

---

## The Portable Answer

Since C++11, this is standard and works everywhere:

```cpp
#include <iostream>
#include <thread>
#include <chrono>

int main() {
    std::cout << "Starting...\n";

    std::this_thread::sleep_for(std::chrono::seconds(2));

    std::cout << "Two seconds later.\n";
    return 0;
}
```

Two headers: `<thread>` for `std::this_thread`, `<chrono>` for the duration types. `sleep_for` takes any chrono duration:

```cpp
using namespace std::chrono;

std::this_thread::sleep_for(milliseconds(500));
std::this_thread::sleep_for(seconds(3));
std::this_thread::sleep_for(minutes(1));
std::this_thread::sleep_for(microseconds(250));
```

C++14 added literal suffixes, which read even better:

```cpp
using namespace std::chrono_literals;

std::this_thread::sleep_for(500ms);
std::this_thread::sleep_for(2s);
std::this_thread::sleep_for(1min);
```

Note that "sleep for 2 seconds" means **at least** 2 seconds. The operating system decides when to wake your thread, so you might get 2.001 seconds. No general-purpose OS gives you exact timing.

On some Linux setups you'll need to link the pthread library:

```
g++ -std=c++17 main.cpp -o main -pthread
```

---

## Why Not Sleep() or usleep()?

You'll see both in older tutorials:

```cpp
// Windows only
#include <windows.h>
Sleep(2000);          // milliseconds

// Unix-like only, and deprecated
#include <unistd.h>
usleep(2000000);      // microseconds
sleep(2);             // seconds
```

Each is tied to one platform. Compile the Windows version on Linux and you get `windows.h: No such file or directory`; compile the Unix version on MSVC and `unistd.h` doesn't exist. `usleep` was also removed from POSIX in 2008.

There's a subtler problem: `Sleep(2000)` takes milliseconds while `sleep(2)` takes seconds and `usleep(2000000)` takes microseconds — three functions with similar names and three different units. `std::chrono::seconds(2)` says the unit out loud and can't be misread.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Never Do This

Every so often someone suggests a "delay" like this:

```cpp
// Do not do this
#include <ctime>

void badDelay(int seconds) {
    std::clock_t start = std::clock();
    while ((std::clock() - start) / CLOCKS_PER_SEC < seconds) {
        // spin
    }
}
```

It appears to work. What it actually does is run a tight loop at 100% CPU for the entire duration. On a laptop that means the fan spinning up and battery draining to accomplish nothing.

`sleep_for` tells the OS scheduler "don't run this thread until time X." The core is genuinely free in the meantime — available for other programs, or idle enough to clock down. Always prefer it.

---

## A Practical Example: Countdown Timer

```cpp
#include <iostream>
#include <thread>
#include <chrono>

int main() {
    using namespace std::chrono_literals;

    for (int i = 5; i > 0; --i) {
        std::cout << i << "...\n" << std::flush;
        std::this_thread::sleep_for(1s);
    }

    std::cout << "Liftoff!\n";
    return 0;
}
```

`std::flush` matters here. Output is buffered, so without it the numbers may all appear at once when the program ends rather than one per second. `std::endl` also flushes, which is the one case where it earns its cost — see [endl vs \n](/posts/cpp-endl-vs-newline/).

A typing effect uses the same idea with a shorter delay:

```cpp
#include <iostream>
#include <string>
#include <thread>
#include <chrono>

void typeOut(const std::string& text, std::chrono::milliseconds perChar) {
    for (char c : text) {
        std::cout << c << std::flush;
        std::this_thread::sleep_for(perChar);
    }
    std::cout << "\n";
}

int main() {
    typeOut("Loading your game...", std::chrono::milliseconds(60));
    return 0;
}
```

---

## sleep_until: Avoiding Drift

Repeatedly calling `sleep_for(1s)` slowly falls behind, because each iteration also spends time doing work. After a hundred iterations you may be several seconds late.

`sleep_until` fixes this by targeting absolute times:

```cpp
#include <iostream>
#include <thread>
#include <chrono>

int main() {
    using namespace std::chrono;

    auto next = steady_clock::now();

    for (int i = 0; i < 5; ++i) {
        next += seconds(1);

        std::cout << "Tick " << i << "\n";
        // ... work that takes an unpredictable amount of time ...

        std::this_thread::sleep_until(next);
    }

    return 0;
}
```

Each target is computed from the previous target, not from "now," so the work time is absorbed by the sleep instead of added to it. Use `steady_clock` rather than `system_clock` — the steady clock never jumps backwards when the system time is adjusted.

The [chrono library](/posts/cpp-measure-execution-time/) uses the same types for measuring elapsed time.

---

## Waiting for a Keypress Instead

Sometimes what you actually want is "pause until the user is ready," not a fixed delay:

```cpp
#include <iostream>
#include <limits>

int main() {
    std::cout << "Press Enter to continue...";
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    std::cout << "\nContinuing.\n";
    return 0;
}
```

This is the portable version of the `system("pause")` you may have seen. Avoid `system()` — it's Windows-only, spawns a whole shell process, and is a security risk if any part of the command comes from user input.

---

## Quick Reference

| Goal | Use |
|------|-----|
| Pause for a duration | `std::this_thread::sleep_for(2s)` |
| Pause until a fixed instant | `std::this_thread::sleep_until(t)` |
| Repeat on a schedule | `sleep_until` with a running target |
| Wait for the user | `cin.ignore(...)` |
| Measure elapsed time | `std::chrono::steady_clock` |

---

## Related Articles

- [C++ Measure Execution Time with std::chrono](/posts/cpp-measure-execution-time/)
- [C++ endl vs newline](/posts/cpp-endl-vs-newline/)
- [Multithreading in C++](/posts/multithreading-cpp/)
- [C++ Concurrency: Threads and Mutex](/posts/cpp-concurrency-mutex/)
- [C++ cin.ignore and Clearing the Input Buffer](/posts/cpp-cin-ignore-clear-buffer/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
