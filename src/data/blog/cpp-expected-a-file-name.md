---
title: "How to Fix 'expected a file name' in C++ (#include Errors)"
description: "Fix 'expected a file name' and 'expected \"FILENAME\" or <FILENAME>' in C++: #include needs angle brackets or double quotes around the header's name."
pubDatetime: 2026-11-27T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "visual-studio"]
draft: false
featured: false
hideMidOptin: true
faqSchema:
  - question: "What does 'expected a file name' mean in C++?"
    answer: "The #include line doesn't have a properly wrapped file name. C++ needs the header's name inside angle brackets, #include <iostream>, or double quotes, #include \"player.h\". Writing #include iostream, using single quotes, or leaving a bracket or quote unclosed all cause it."
  - question: "When do I use < > and when do I use \" \" with #include?"
    answer: "Use angle brackets for the standard library and other installed libraries, such as #include <iostream> and #include <vector>. Use double quotes for header files you wrote yourself that sit in your project, such as #include \"player.h\"."
  - question: "What is the GCC version of 'expected a file name'?"
    answer: "GCC says '#include' expects \"FILENAME\" or <FILENAME>, and Clang says expected \"FILENAME\" or <FILENAME>. Visual Studio's build reports C2006 with the same wording, usually followed by C1083: Cannot open include file."
  - question: "Why does the error stop all the other errors?"
    answer: "Without its headers the rest of the file can't be checked, so the compiler stops there. Visual Studio's editor calls this a catastrophic error. Fix the #include line first and the rest of the file will be checked normally again."
---

# How to Fix "expected a file name" in C++ (#include Errors)

**Short answer:** the `#include` line doesn't wrap the header's name the way C++ expects. Standard headers go in **angle brackets**, `#include <iostream>`, and your own headers go in **double quotes**, `#include "player.h"`. Bare names, single quotes, and an unclosed `<` or `"` all give this error.

| Where | What you see |
|---|---|
| Visual Studio editor (red squiggle) | `expected a file name` |
| Visual Studio build | `C2006: '#include': expected "FILENAME" or <FILENAME>` |
| GCC (g++, MinGW, Code::Blocks) | `'#include' expects "FILENAME" or <FILENAME>` |
| Clang (Xcode, macOS) | `expected "FILENAME" or <FILENAME>` |

<!-- optin-quick error="expected a file name" -->

---

## Cause 1: No Brackets Around the Name

```cpp
#include iostream

int main() {
}
```

```
Visual Studio editor:  expected a file name
MSVC build:            error C2006: '#include': expected "FILENAME" or <FILENAME>
                       fatal error C1083: Cannot open include file: '': No such file or directory
GCC:                   error: '#include' expects "FILENAME" or <FILENAME>
Clang:                 error: expected "FILENAME" or <FILENAME>
```

The editor marks it as a *catastrophic* error, because nothing after a broken `#include` can be checked. **Fix:** `#include <iostream>`.

## Cause 2: Single Quotes Instead of Double Quotes

```cpp
#include 'iostream'

int main() {
}
```

```
Visual Studio editor:  expected a file name
MSVC build:            error C2015: too many characters in constant
                       error C2006: '#include': expected "FILENAME" or <FILENAME>
GCC:                   error: '#include' expects "FILENAME" or <FILENAME>
Clang:                 error: expected "FILENAME" or <FILENAME>
```

In C++, single quotes are only for one character, like `'A'`. That's why Visual Studio complains about "too many characters". **Fix:** `#include <iostream>`, or double quotes for your own files.

## Cause 3: An Unclosed < or Mixed-Up Quotes

```cpp
#include <iostream

int main() {
}
```

```
Visual Studio editor:  expected a file name
MSVC build:            error C2013: expected a '>'
GCC:                   error: missing terminating '>' character
Clang:                 error: expected '>'
                       note: to match this '<'
```

Mixing the two styles fails the same way: `#include "iostream>` gives `expected a file name` in the editor and `missing terminating " character` from GCC and Clang. **Fix:** close the name with the same style you opened it with.

<!-- book-cta topic="compiling" placement="mid_article" -->

## Cause 4: Nothing After #include

```cpp
#include

int main() {
}
```

```
Visual Studio editor:  expected a file name
MSVC build:            error C2006: '#include': expected "FILENAME" or <FILENAME>
GCC:                   error: '#include' expects "FILENAME" or <FILENAME>
Clang:                 error: expected "FILENAME" or <FILENAME>
```

This usually happens when the header's name was deleted by accident. Put it back, or delete the empty line.

## < > or " ": Which One?

| Use | For | Example |
|---|---|---|
| `< >` | The standard library and installed libraries | `#include <iostream>`, `#include <vector>` |
| `" "` | Header files in your own project | `#include "player.h"` |

Double quotes tell the compiler to look first in the folder of the file doing the including, then in the usual library folders. Angle brackets go straight to the library folders. See [header files explained](/posts/cpp-header-files/) for how this works.

## If the File Name Is Right but It Still Fails

Once the brackets are right, a different error may appear: `cannot open source file "iostream"` in Visual Studio Code, or `No such file or directory` from g++. That means the brackets are fine but the file can't be found: your compiler isn't set up, or the header name is misspelled. See [how to fix #include errors in VS Code](/posts/cpp-vscode-include-errors/).

## Quick Reference

| You wrote | Fix |
|---|---|
| `#include iostream` | `#include <iostream>` |
| `#include 'iostream'` | `#include <iostream>` |
| `#include <iostream` | `#include <iostream>` |
| `#include "iostream>` | `#include <iostream>` |
| `#include player.h` | `#include "player.h"` |

For other common messages, see [C++ error messages explained](/posts/cpp-error-messages/).

---

## Take Your C++ Further

<!-- book-cta topic="compiling" placement="end_cta" -->

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the most common errors and what they mean.
- [C++ Header Files Explained](/posts/cpp-header-files/) — #include, guards, and what goes where.
- [How to Fix '#include errors detected' in VS Code](/posts/cpp-vscode-include-errors/) — when the header can't be found.
- [C++ Preprocessor Directives](/posts/cpp-preprocessor-directives/) — what #include and #define really do.
- [Breakdown of a Simple C++ Program](/posts/breakdown-simple-cpp-program/) — what each line of a first program does.
