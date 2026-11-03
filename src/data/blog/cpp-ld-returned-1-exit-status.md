---
title: "How to Fix 'collect2: error: ld returned 1 exit status' in C++"
description: "Fix 'collect2: error: ld returned 1 exit status' in g++: find the real linker error above it, then fix undefined references, a missing main, multiple definitions or a locked .exe."
pubDatetime: 2026-11-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "debugging"]
draft: false
featured: false
hideMidOptin: true
faqSchema:
  - question: "What does 'collect2: error: ld returned 1 exit status' mean?"
    answer: "It means the linker, ld, failed while g++ was turning your compiled code into a program. The line itself never says why. The real error is on the lines just above it, usually 'undefined reference to', 'multiple definition of' or 'cannot open output file'."
  - question: "How do I fix 'undefined reference to WinMain' with collect2?"
    answer: "MinGW couldn't find your main function. Check that it's spelled int main() in lowercase, that the file is saved, and that the file containing main is part of the build. MinGW names WinMain, but a normal console program only needs main."
  - question: "Why do I get 'Permission denied' and 'ld returned 1 exit status' on Windows?"
    answer: "The linker can't overwrite your .exe, usually because the program from the last build is still running. Close its console window or stop it in your IDE, then build again."
  - question: "What is the Visual Studio version of 'ld returned 1 exit status'?"
    answer: "Visual Studio's linker reports LNK errors instead. An undefined reference is LNK2019 'unresolved external symbol' followed by LNK1120, a multiple definition is LNK2005 followed by LNK1169, and a locked .exe is LNK1168 'cannot open file for writing'."
---

# How to Fix "collect2: error: ld returned 1 exit status" in C++

**Short answer:** this line isn't the real error. It's g++ telling you that the **linker** (`ld`) failed. The reason is always on the lines just above it. Read those and match them below: an `undefined reference`, a missing `main` (shown as `WinMain` on Windows), a `multiple definition`, or `Permission denied` because your program is still running.

| The line above says | What it means |
|---|---|
| `undefined reference to 'add(int, int)'` | A function was declared, but its body was never compiled into the program |
| `undefined reference to 'main'` or `'WinMain'` | There's no `int main()`, or the file with it wasn't built |
| `multiple definition of 'square(int)'` | The same function body was compiled twice, often from a header |
| `cannot open output file ... Permission denied` | The program is still running, or you can't write to that folder |

<!-- optin-quick error="collect2: error: ld returned 1 exit status" -->

---

## What collect2 and ld Are

g++ builds your program in two steps. First it **compiles** each `.cpp` file on its own into an object file. Then the **linker**, `ld`, joins those object files with the standard library to make the program, and checks that every function you call exists exactly once.

`collect2` is the helper g++ uses to run `ld`. When `ld` fails, it reports that `ld` returned 1, the standard way a program says "something went wrong". So the message tells you *which step* failed, not *why*.

Other tools say the same thing in different words:

| Tool | Last line when the linker fails |
|---|---|
| g++ on Linux | `collect2: error: ld returned 1 exit status` |
| g++ on Windows (MinGW, Code::Blocks, VS Code) | `collect2.exe: error: ld returned 1 exit status` |
| Clang | `clang++: error: linker command failed with exit code 1 (use -v to see invocation)` |
| Visual Studio | `fatal error LNK1120`, `LNK1169` or `LNK1168` |

## Cause 1: A Function Declared but Never Defined

```cpp
#include <iostream>

int add(int a, int b);

int main() {
    std::cout << add(2, 3) << '\n';
}
```

```
GCC:    /usr/bin/ld: /tmp/ccXXXXXX.o: in function `main':
        main.cpp:(.text+0x13): undefined reference to `add(int, int)'
        collect2: error: ld returned 1 exit status
MinGW:  ...\ld.exe: ...\ccXXXXXX.o: in function `main':
        main.cpp:6:(.text+0x18): undefined reference to `add(int, int)'
        collect2.exe: error: ld returned 1 exit status
MSVC:   error LNK2019: unresolved external symbol "int __cdecl add(int,int)" (?add@@YAHHH@Z) referenced in function main
        fatal error LNK1120: 1 unresolved externals
```

The line `int add(int a, int b);` promises that `add` exists, so the compiler is happy. But there's no body anywhere, so the linker has nothing to connect the call to.

**Fix:** write the function's body:

```cpp
#include <iostream>

int add(int a, int b);

int main() {
    std::cout << add(2, 3) << '\n';
}

int add(int a, int b) {
    return a + b;
}
```

```
5
```

A spelling difference between the declaration and the body causes the same error, because to the linker they're two different functions. [Undefined reference errors](/posts/undefined-reference-linker-errors-cpp/) covers more causes, such as missing libraries and templates.

## Cause 2: A .cpp File That Wasn't Compiled

Say your project has three files:

```cpp
// util.h
#pragma once

int square(int x);
int cube(int x);
```

```cpp
// util.cpp
#include "util.h"

int square(int x) {
    return x * x;
}

int cube(int x) {
    return square(x) * x;
}
```

```cpp
// main.cpp
#include <iostream>
#include "util.h"

int main() {
    std::cout << square(3) << ' ' << cube(3) << '\n';
}
```

Build only `main.cpp` and the bodies in `util.cpp` never reach the linker:

```
g++ main.cpp -o app
```

```
/usr/bin/ld: /tmp/ccXXXXXX.o: in function `main':
main.cpp:(.text+0x13): undefined reference to `square(int)'
/usr/bin/ld: main.cpp:(.text+0x3e): undefined reference to `cube(int)'
collect2: error: ld returned 1 exit status
```

**Fix:** list every `.cpp` file:

```
g++ main.cpp util.cpp -o app
```

```
9 27
```

In VS Code this catches a lot of people. The build task it creates compiles only the file you have open (`${file}` in `tasks.json`). [VS Code's own guide](https://code.visualstudio.com/docs/cpp/config-mingw) shows how to replace it with `${workspaceFolder}/*.cpp` to build every `.cpp` file in the folder. See [how to run a .cpp file](/posts/how-to-run-cpp-file/) for building from the command line.

<!-- book-cta topic="compiling" placement="mid_article" -->

## Cause 3: No main Function (or "undefined reference to WinMain")

```cpp
#include <iostream>

int Main() {
    std::cout << "Hello\n";
    return 0;
}
```

```
GCC:    /usr/bin/ld: .../Scrt1.o: in function `_start':
        (.text+0x1b): undefined reference to `main'
        collect2: error: ld returned 1 exit status
MinGW:  ...\ld.exe: ...\libmingw32.a(lib64_libmingw32_a-crtexewin.o):crtexewin.c:(.text+0x119): undefined reference to `WinMain'
        collect2.exe: error: ld returned 1 exit status
MSVC:   MSVCRT.lib(exe_main.obj) : error LNK2019: unresolved external symbol main referenced in function "int __cdecl __scrt_common_main_seh(void)" (?__scrt_common_main_seh@@YAHXZ)
        fatal error LNK1120: 1 unresolved externals
```

Every program starts at a function called exactly `main`, all lowercase. `Main` is a different name, so the linker can't find a starting point. On Windows, MinGW names `WinMain` in the message instead, but the cause is the same: it couldn't find your `main`.

**Fix:** spell it `int main()`. If the spelling is already right, check two more things:

- **The file is saved.** Building a new file before you save it compiles an empty file, which has no `main`.
- **The file with `main` is part of the build.** In a project with several files, make sure it's the one being compiled.

## Cause 4: A Function Body in a Header

Now suppose `util.h` contains a function's body instead of just its declaration:

```cpp
// util.h
#pragma once

int square(int x) {
    return x * x;
}

int cube(int x);
```

```cpp
// util.cpp
#include "util.h"

int cube(int x) {
    return square(x) * x;
}
```

`main.cpp` is the same as in Cause 2. Building both files fails:

```
g++ main.cpp util.cpp -o app
```

```
/usr/bin/ld: /tmp/ccXXXXXX.o: in function `square(int)':
util.cpp:(.text+0x0): multiple definition of `square(int)'; /tmp/ccXXXXXX.o:main.cpp:(.text+0x0): first defined here
collect2: error: ld returned 1 exit status
```

`#include` pastes the header into each `.cpp` file that includes it. Both `main.cpp` and `util.cpp` include `util.h`, so `square` gets compiled twice, and the linker finds two bodies with the same name. `#pragma once` doesn't help here: it only stops a header from being pasted twice into the *same* `.cpp` file.

**Fix:** either keep only the declaration in the header and put the body in `util.cpp` (the project from Cause 2), or mark the function `inline`:

```cpp
// util.h
#pragma once

inline int square(int x) {
    return x * x;
}

int cube(int x);
```

```
9 27
```

`inline` tells the linker that identical copies of this function are allowed. More in [inline functions](/posts/cpp-inline-functions/) and [header files](/posts/cpp-header-files/).

Visual Studio reports this as LNK2005 (`already defined in` an object file), followed by LNK1169.

### The same error from #include "util.cpp"

Including a `.cpp` file instead of the header does the same thing to every function in it:

```cpp
#include <iostream>
#include "util.cpp"

int main() {
    std::cout << square(3) << ' ' << cube(3) << '\n';
}
```

```
/usr/bin/ld: /tmp/ccXXXXXX.o: in function `square(int)':
util.cpp:(.text+0x0): multiple definition of `square(int)'; /tmp/ccXXXXXX.o:main.cpp:(.text+0x0): first defined here
/usr/bin/ld: /tmp/ccXXXXXX.o: in function `cube(int)':
util.cpp:(.text+0x13): multiple definition of `cube(int)'; /tmp/ccXXXXXX.o:main.cpp:(.text+0x13): first defined here
collect2: error: ld returned 1 exit status
```

**Fix:** include the header (`#include "util.h"`) and compile `util.cpp` separately.

## Cause 5: "Permission denied" Because the Program Is Still Running

```
...\ld.exe: cannot open output file app.exe: Permission denied
collect2.exe: error: ld returned 1 exit status
```

The linker needs to write a new `app.exe`. On Windows, a program that's running locks its `.exe` file, so if the console window from your last run is still open, the linker can't replace it.

**Fix:** close the program's window, or stop it from your IDE, then build again.

If nothing is running, something else may be holding the file. Microsoft's notes for Visual Studio's version of this error, [LNK1168](https://learn.microsoft.com/en-us/cpp/error-messages/tool-errors/linker-tools-error-lnk1168) (`cannot open ... for writing`), list antivirus scanners and search indexing as common causes. On Linux and macOS, `Permission denied` usually means you can't write to that folder, so build somewhere you own.

## Quick Reference

| The line above `collect2` | Fix |
|---|---|
| `undefined reference to 'yourFunction(...)'` | Write the function's body, or add its `.cpp` file to the build |
| `undefined reference to 'main'` | Spell it `int main()`, save the file, build the right file |
| `undefined reference to 'WinMain'` | Same as `main`: MinGW couldn't find your `main` |
| `multiple definition of '...'` | Move the body out of the header, or make it `inline`; never `#include` a `.cpp` file |
| `cannot open output file ...: Permission denied` | Close the running program, then build again |

For other common messages, see [C++ error messages explained](/posts/cpp-error-messages/).

---

## Take Your C++ Further

<!-- book-cta topic="compiling" placement="end_cta" -->

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the most common errors and what they mean.
- [C++ Undefined Reference Error](/posts/undefined-reference-linker-errors-cpp/) — every cause of the most common linker error.
- [C++ Header Files Explained](/posts/cpp-header-files/) — what belongs in a header, and include guards.
- [Inline Functions in C++](/posts/cpp-inline-functions/) — what the `inline` keyword really does.
- [How to Open and Run a .cpp File](/posts/how-to-run-cpp-file/) — building on Windows, Mac and Linux.
