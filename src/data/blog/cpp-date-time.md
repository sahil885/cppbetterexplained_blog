---
title: "How to Get the Current Date and Time in C++"
description: "Learn how to get and format the current date and time in C++ using chrono and localtime. Includes working code, format codes, and timestamps for filenames."
pubDatetime: 2026-08-25T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "chrono", "standard-library", "tutorial"]
faqSchema:
  - question: "How do you get the current date and time in C++?"
    answer: "Call std::chrono::system_clock::now() to get the current time point, convert it with std::chrono::system_clock::to_time_t, and then format it with std::put_time and std::localtime. You need the chrono, ctime, and iomanip headers."
  - question: "What is the difference between localtime and gmtime?"
    answer: "localtime converts a time value into the local time zone as configured on the machine running the program, including any daylight saving adjustment. gmtime converts the same value into UTC, which is what you want for logs and timestamps that will be compared across different machines."
  - question: "How do you format a date in C++?"
    answer: "Pass a format string to std::put_time, using codes such as %Y for the four-digit year, %m for month, %d for day, %H for hour, %M for minute, and %S for second. For example %Y-%m-%d %H:%M:%S produces output like 2026-08-25 14:30:00."
draft: false
featured: false
---

# How to Get the Current Date and Time in C++

Printing today's date sounds like it should be one line. In C++ it takes three, because the language separates *measuring* time from *interpreting* it as a human calendar date — and once you see why, the API stops feeling awkward.

---

## The Short Answer

```cpp
#include <iostream>
#include <chrono>
#include <ctime>
#include <iomanip>

int main() {
    auto now = std::chrono::system_clock::now();
    std::time_t t = std::chrono::system_clock::to_time_t(now);

    std::cout << std::put_time(std::localtime(&t), "%Y-%m-%d %H:%M:%S") << "\n";

    return 0;
}
```

Output:

```
2026-08-25 14:30:07
```

Compile with `g++ -std=c++11 main.cpp`. That is the whole recipe — the rest of this article explains what each piece is doing so you can change it confidently.

---

## The Three Steps, Explained

**Step 1: `system_clock::now()`** returns a `time_point` — a count of ticks since an arbitrary starting instant called the epoch. It is a precise *number*, not a date. `system_clock` specifically is the clock tied to real-world wall time, which is why it is the right one here (`steady_clock`, covered in [measuring execution time](/posts/cpp-measure-execution-time/), is the one for stopwatches).

**Step 2: `to_time_t`** converts that time point into a `std::time_t`, the older C-style representation: seconds since 1 January 1970 UTC. This is the bridge into the C time functions, which is where the calendar formatting lives.

**Step 3: `std::localtime`** takes that count of seconds and breaks it apart into a `std::tm` struct with separate fields for year, month, day, hour, and so on — adjusted to your machine's time zone. `std::put_time` then renders that struct using a format string.

The separation exists because seconds-since-1970 is unambiguous and easy to compare, while "the 25th of August" depends on where you are standing. C++ makes you name that conversion explicitly.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Format Codes You Will Actually Use

`put_time` uses the same codes as C's `strftime`:

| Code | Meaning | Example |
|------|---------|---------|
| `%Y` | Year, 4 digits | 2026 |
| `%m` | Month, 01–12 | 08 |
| `%d` | Day, 01–31 | 25 |
| `%H` | Hour, 00–23 | 14 |
| `%M` | Minute, 00–59 | 30 |
| `%S` | Second, 00–59 | 07 |
| `%A` | Weekday name | Tuesday |
| `%B` | Month name | August |
| `%p` | AM or PM | PM |
| `%I` | Hour, 01–12 | 02 |

Mix them freely:

```cpp
#include <iostream>
#include <chrono>
#include <ctime>
#include <iomanip>

int main() {
    auto now = std::chrono::system_clock::now();
    std::time_t t = std::chrono::system_clock::to_time_t(now);
    std::tm* local = std::localtime(&t);

    std::cout << std::put_time(local, "%Y-%m-%d")              << "\n";
    std::cout << std::put_time(local, "%d/%m/%Y")              << "\n";
    std::cout << std::put_time(local, "%A, %B %d, %Y")         << "\n";
    std::cout << std::put_time(local, "%I:%M %p")              << "\n";

    return 0;
}
```

Output:

```
2026-08-25
25/08/2026
Tuesday, August 25, 2026
02:30 PM
```

---

## Reading Individual Fields

If you need the year as a number rather than as text, pull it out of the `std::tm` struct directly — but two of its fields have surprising offsets:

```cpp
#include <iostream>
#include <chrono>
#include <ctime>

int main() {
    auto now = std::chrono::system_clock::now();
    std::time_t t = std::chrono::system_clock::to_time_t(now);
    std::tm* local = std::localtime(&t);

    int year  = local->tm_year + 1900;   // tm_year counts from 1900
    int month = local->tm_mon + 1;       // tm_mon is 0-based: 0 = January
    int day   = local->tm_mday;          // tm_mday is 1-based, no adjustment

    std::cout << "Year: "  << year  << "\n";
    std::cout << "Month: " << month << "\n";
    std::cout << "Day: "   << day   << "\n";

    return 0;
}
```

`tm_year + 1900` and `tm_mon + 1` are inherited from 1970s C and catch out nearly everyone the first time. `tm_mday`, inconsistently, is already 1-based. When in doubt, prefer `put_time` — it applies these adjustments for you.

---

## Local Time vs UTC

Swap one function to get UTC instead:

```cpp
std::cout << "Local: " << std::put_time(std::localtime(&t), "%Y-%m-%d %H:%M:%S") << "\n";
std::cout << "UTC:   " << std::put_time(std::gmtime(&t),    "%Y-%m-%d %H:%M:%S") << "\n";
```

Use **localtime** for anything a person reads on their own machine. Use **gmtime** for log files, database records, and anything that will be compared against timestamps from another computer — UTC has no time zones and no daylight saving jumps, so it never goes backwards by an hour.

One caution: `localtime` and `gmtime` return a pointer to a single shared internal buffer. Calling one overwrites the result of the other, and neither is thread-safe. If you need to keep a `tm`, copy it: `std::tm copy = *std::localtime(&t);`.

---

## A Practical Use: Timestamped Filenames

Building a log filename from the current time is the most common real reason to reach for this:

```cpp
#include <iostream>
#include <fstream>
#include <sstream>
#include <chrono>
#include <ctime>
#include <iomanip>

std::string timestamp() {
    auto now = std::chrono::system_clock::now();
    std::time_t t = std::chrono::system_clock::to_time_t(now);

    std::ostringstream oss;
    oss << std::put_time(std::localtime(&t), "%Y%m%d_%H%M%S");
    return oss.str();
}

int main() {
    std::string filename = "log_" + timestamp() + ".txt";
    std::cout << "Writing to " << filename << "\n";

    std::ofstream file(filename);
    if (file) {
        file << "Log started\n";
        file.close();
    }

    return 0;
}
```

Output:

```
Writing to log_20260825_143007.txt
```

The trick is [ostringstream](/posts/cpp-stringstream/): `put_time` writes to a stream, so send it to a string stream instead of `std::cout` and pull the text back out with `.str()`. The `%Y%m%d_%H%M%S` layout is deliberate — timestamps in that order sort alphabetically into chronological order, so your log files line up correctly in any file listing.

---

## What About C++20?

C++20 added `std::chrono::year_month_day` and calendar-aware formatting with `std::format`, which finally removes the detour through C:

```cpp
// C++20, with recent compiler support
auto today = std::chrono::floor<std::chrono::days>(std::chrono::system_clock::now());
std::cout << std::format("{:%Y-%m-%d}", today) << "\n";
```

It is cleaner, but compiler support for `<format>` arrived late and unevenly. The `put_time` approach above works everywhere from C++11 onward, which makes it the safer thing to learn first.

---

## Related Articles

- [How to Measure Execution Time in C++](/posts/cpp-measure-execution-time/)
- [How to Make a C++ Program Wait](/posts/cpp-sleep-delay-program/)
- [C++ Output Formatting with iomanip](/posts/cpp-iomanip-formatting/)
- [C++ stringstream Explained](/posts/cpp-stringstream/)
- [File Handling in C++](/posts/cpp-file-handling/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
