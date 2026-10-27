---
title: "How to Fix C4996 'This function or variable may be unsafe' in Visual Studio"
description: "Fix C4996 'This function or variable may be unsafe' in Visual Studio: why scanf, strcpy and fopen are flagged, the C++ fixes, and _CRT_SECURE_NO_WARNINGS."
pubDatetime: 2026-10-27T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "visual-studio"]
draft: false
featured: false
hideMidOptin: true
faqSchema:
  - question: "What does C4996 'This function or variable may be unsafe' mean?"
    answer: "Visual Studio is warning you about an older C function, such as scanf, strcpy or fopen, that Microsoft has deprecated because a safer version exists. Many of these functions can write past the end of an array if they're used carelessly. GCC and Clang don't report it, because the functions are standard C."
  - question: "Why is C4996 an error instead of a warning?"
    answer: "Your project has SDL checks turned on, which compiles with /sdl. Microsoft's documentation lists C4996 among the warnings that /sdl turns into errors. You'll find the setting under Configuration Properties > C/C++ > General > SDL checks."
  - question: "Where do I put _CRT_SECURE_NO_WARNINGS?"
    answer: "Put #define _CRT_SECURE_NO_WARNINGS on the first line of the file, before every #include. A #define after an #include is too late and doesn't stop the error. To set it for the whole project, add it under Configuration Properties > C/C++ > Preprocessor > Preprocessor Definitions."
  - question: "How do I fix C4996 for getch?"
    answer: "Use _getch instead. For getch and other POSIX names, the message says the name is deprecated, not the function. _CRT_SECURE_NO_WARNINGS doesn't silence that version; the macro for it is _CRT_NONSTDC_NO_WARNINGS."
---

# How to Fix C4996 "This function or variable may be unsafe" in Visual Studio

**Short answer:** Visual Studio flags older C functions such as `scanf`, `strcpy` and `fopen`. Many of them can write past the end of an array if they're used carelessly. C4996 is a warning, but with **SDL checks** on, it becomes an error and your program won't build. In C++, the best fix is to use `std::cin`, `std::string` and `std::ifstream` instead. To keep the C function, use the `_s` version it suggests, or put `#define _CRT_SECURE_NO_WARNINGS` above all your `#include` lines.

| You see | What it means |
|---|---|
| `error C4996: 'scanf': This function or variable may be unsafe...` | SDL checks are on, so the warning is treated as an error |
| `warning C4996: 'scanf': This function or variable may be unsafe...` | The same message as a warning; the program still builds |
| Nothing, with GCC or Clang | These functions are standard C, and those compilers don't flag them |

<!-- optin-quick error="This function or variable may be unsafe" -->

---

## What the Message Says

Here's the full message from a Visual Studio build:

```
error C4996: 'scanf': This function or variable may be unsafe. Consider using scanf_s instead. To disable deprecation, use _CRT_SECURE_NO_WARNINGS. See online help for details.
```

It names the function, suggests a replacement (`scanf_s`), and tells you how to switch the message off.

Microsoft's documentation explains that most of the flagged functions can read or write a buffer without checking its size, so a careless call can run past the end of an array. That's why safer `_s` versions exist. The message comes from Microsoft's libraries, not from the C++ standard. GCC and Clang compile the same code without a word.

## Why It's an Error, Not a Warning

C4996 is officially a level 3 warning. You get `error C4996` instead when your project has **SDL checks** turned on, which compiles with `/sdl`. Microsoft's documentation lists C4996 among the warnings `/sdl` turns into errors.

To see the setting: **Project** > **Properties** > **Configuration Properties** > **C/C++** > **General** > **SDL checks**.

Turning SDL checks off only turns the error back into a warning, and `/sdl` adds other safety checks you'd lose too. Fixing the code is the better choice.

## Fix 1: Use the C++ Way (Best)

For the functions beginners meet most often, C++ has a replacement that Visual Studio doesn't flag.

**scanf → std::cin**

```cpp
#include <cstdio>

int main() {
    int age;
    scanf("%d", &age);
    printf("You are %d\n", age);
}
```

```
MSVC:   error C4996: 'scanf': This function or variable may be unsafe. Consider using scanf_s instead. To disable deprecation, use _CRT_SECURE_NO_WARNINGS. See online help for details.
```

```cpp
#include <iostream>

int main() {
    int age;
    std::cin >> age;
    std::cout << "You are " << age << '\n';
}
```

**strcpy → std::string**

```cpp
#include <cstring>
#include <iostream>

int main() {
    char name[20];
    strcpy(name, "Sam");
    std::cout << name << '\n';
}
```

```
MSVC:   error C4996: 'strcpy': This function or variable may be unsafe. Consider using strcpy_s instead. To disable deprecation, use _CRT_SECURE_NO_WARNINGS. See online help for details.
```

`name` has room for 19 characters plus the `'\0'` that ends the text. `strcpy` doesn't check that. Copy in a longer name and it writes past the end of the array, into whatever memory comes next. That's the danger the warning is about. A `std::string` grows to fit:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string name = "Sam";
    std::cout << name << '\n';
}
```

See [string vs char array](/posts/cpp-string-vs-char-array/) for the full comparison.

**fopen → std::ifstream**

```cpp
#include <cstdio>

int main() {
    FILE* file = fopen("scores.txt", "r");
    if (file) {
        fclose(file);
    }
}
```

```
MSVC:   error C4996: 'fopen': This function or variable may be unsafe. Consider using fopen_s instead. To disable deprecation, use _CRT_SECURE_NO_WARNINGS. See online help for details.
```

```cpp
#include <fstream>
#include <iostream>

int main() {
    std::ifstream file("scores.txt");
    if (!file) {
        std::cout << "Could not open scores.txt\n";
    }
}
```

More in [file handling in C++](/posts/cpp-file-handling/).

<!-- book-cta topic="memory" placement="mid_article" -->

## Fix 2: Use the _s Version

If you're writing C-style code on purpose, use the function the message suggests. The `_s` versions take extra information, usually the size of your buffer, so they can stop before running past the end:

```cpp
#include <cstring>
#include <iostream>

int main() {
    char name[20];
    strcpy_s(name, sizeof(name), "Sam");
    std::cout << name << '\n';
}
```

For numbers, `scanf_s("%d", &age);` works exactly like `scanf`. For text, it's different: with `%s`, `%c` or `%[`, Microsoft's documentation says you must pass the buffer size as an extra argument straight after the buffer, for example `scanf_s("%19s", name, (unsigned)sizeof(name));`.

The catch is that these functions come from Microsoft's runtime. GCC and Clang on Linux don't provide them, so this code won't build there: GCC says `'strcpy_s' was not declared in this scope`. If your code needs to build on other systems as well, prefer Fix 1.

## Fix 3: Turn the Warning Off

If you understand the risk and want to keep the original functions, for example to follow a C course or book, you can switch C4996 off.

**Define `_CRT_SECURE_NO_WARNINGS` before every #include:**

```cpp
#define _CRT_SECURE_NO_WARNINGS
#include <cstdio>

int main() {
    int age;
    scanf("%d", &age);
}
```

It has to come **first**. This version still gives C4996:

```cpp
#include <cstdio>
#define _CRT_SECURE_NO_WARNINGS

int main() {
    int age;
    scanf("%d", &age);
}
```

The header checks for the macro when it's included, so a `#define` after the `#include` comes too late.

**Or set it for the whole project:** **Project** > **Properties** > **Configuration Properties** > **C/C++** > **Preprocessor** > **Preprocessor Definitions**, and add `_CRT_SECURE_NO_WARNINGS`. Use this if your `.cpp` files begin with `#include "pch.h"`, or if you have several files to fix.

**Or disable warning 4996 itself:** add `#pragma warning(disable : 4996)` at the top of the file, or add `4996` under **C/C++** > **Advanced** > **Disable Specific Warnings**. This hides every C4996, including ones about other deprecated features you might want to see, so the macro is the more targeted option.

## The POSIX Version: getch and Friends

A second kind of C4996 has a different message:

```cpp
#include <conio.h>
#include <iostream>

int main() {
    std::cout << "Press any key to exit...";
    getch();
}
```

```
MSVC:   error C4996: 'getch': The POSIX name for this item is deprecated. Instead, use the ISO C and C++ conformant name: _getch. See online help for details.
```

This time only the **name** is deprecated, not the function. **Fix:** add the underscore and call `_getch()`. `_CRT_SECURE_NO_WARNINGS` doesn't silence this version; the macro for POSIX names is `_CRT_NONSTDC_NO_WARNINGS`.

`<conio.h>` is Windows-only. MinGW's GCC accepts `getch()` without complaint, but on Linux, GCC stops with `fatal error: conio.h: No such file or directory`.

## Common C4996 Functions

| Function | Suggested replacement | C++ alternative |
|---|---|---|
| `scanf` | `scanf_s` | `std::cin >> x` |
| `strcpy`, `strncpy` | `strcpy_s`, `strncpy_s` | `std::string` and `=` |
| `strcat` | `strcat_s` | `std::string` and `+=` |
| `sprintf` | `sprintf_s` | `std::to_string` or `std::ostringstream` |
| `fopen` | `fopen_s` | `std::ifstream`, `std::ofstream` |
| `strtok` | `strtok_s` | `std::istringstream` |
| `localtime`, `ctime` | `localtime_s`, `ctime_s` | |
| `getenv` | `_dupenv_s` | |
| `getch` | `_getch` | |

The suggested replacements are the ones Visual Studio's messages name. For splitting text without `strtok`, see [how to split a string](/posts/cpp-split-string/).

## Quick Reference

| The message says | Fix |
|---|---|
| `This function or variable may be unsafe` | Use the C++ alternative, the `_s` version, or `#define _CRT_SECURE_NO_WARNINGS` on the first line |
| `The POSIX name for this item is deprecated` | Add the underscore (`_getch`), or define `_CRT_NONSTDC_NO_WARNINGS` |
| `error C4996` rather than `warning C4996` | SDL checks are on; fix the code rather than turning them off |

For other common messages, see [C++ error messages explained](/posts/cpp-error-messages/).

---

## Take Your C++ Further

<!-- book-cta topic="memory" placement="end_cta" -->

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the most common errors and what they mean.
- [C++ string vs char Array](/posts/cpp-string-vs-char-array/) — why std::string avoids buffer overruns.
- [File Handling in C++](/posts/cpp-file-handling/) — reading and writing files with streams.
- [Getting User Input with cin](/posts/cpp-cin-user-input/) — the C++ replacement for scanf.
- [How to Split a String in C++](/posts/cpp-split-string/) — without strtok.
