---
title: "How to Fix 'g++ is not recognized' on Windows"
description: "Fix 'g++' is not recognized as an internal or external command on Windows: check the compiler is installed, add the right bin folder to PATH, then restart."
pubDatetime: 2026-10-17T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "setup", "errors"]
draft: false
featured: false
hideMidOptin: true
faqSchema:
  - question: "What does 'g++' is not recognized as an internal or external command mean?"
    answer: "Windows searched every folder on your PATH for g++.exe and did not find it. Either no C++ compiler is installed, or the folder that contains g++.exe has not been added to PATH."
  - question: "I added g++ to PATH but it still says not recognized. Why?"
    answer: "Most often the terminal or VS Code was already open when you changed PATH, so close and reopen them. Otherwise the PATH entry points at the wrong folder: it must be the exact bin folder that contains g++.exe."
  - question: "Does VS Code come with a C++ compiler?"
    answer: "No. VS Code is an editor. You need to install a compiler such as MinGW-w64 separately and add its bin folder to PATH before g++ works in VS Code's terminal."
  - question: "How do I check if g++ is installed on Windows?"
    answer: "Run where g++ in Command Prompt, or where.exe g++ in PowerShell. If it prints a path, g++ is installed and on your PATH. Then run g++ --version to confirm it works."
---

# How to Fix "'g++' is not recognized as an internal or external command"

**Short answer:** Windows can't find `g++.exe`. Either no compiler is installed, or the folder containing `g++.exe` isn't on your **PATH**. Install a compiler, add its `bin` folder to PATH, then **close and reopen your terminal and VS Code**. That last step is the one most people miss.

In Command Prompt the error looks like this:

```
'g++' is not recognized as an internal or external command,
operable program or batch file.
```

In PowerShell — the default terminal inside VS Code on Windows — it's longer, but it means exactly the same thing:

```
g++ : The term 'g++' is not recognized as the name of a cmdlet, function, script file, or operable program.
```

<!-- optin-quick error="'g++' is not recognized" -->

---

## Why This Happens: PATH in 30 Seconds

When you type `g++`, Windows doesn't search your whole computer. It checks a short list of folders called the **PATH**, looking for a program named `g++.exe`. If it isn't in any of those folders, you get this error.

Two things catch beginners out:

- **VS Code doesn't include a compiler.** It's an editor. Installing VS Code and its C/C++ extension doesn't give you `g++`.
- **Installing a compiler doesn't always add it to PATH.** With MSYS2 or WinLibs, adding the folder is a separate step you do yourself.

So the fix is always the same three steps: make sure `g++.exe` exists, put its folder on PATH, restart.

## Step 1: Check Whether g++ Is Installed at All

In **Command Prompt**:

```
where g++
```

In **PowerShell**, type `where.exe g++` instead — plain `where` means something different there.

If it prints a path, `g++` is installed *and* on PATH, so skip to [Step 4](#step-4-close-and-reopen-everything). If it prints `INFO: Could not find files for the given pattern(s).`, look for `g++.exe` in File Explorer in the usual places:

| If you installed... | g++.exe is usually in |
|---|---|
| MSYS2 (Microsoft's VS Code guide) | `C:\msys64\ucrt64\bin` |
| WinLibs (our [setup guide](/posts/cpp-setup-guide/)) | `C:\mingw64\bin` |
| Code::Blocks with MinGW | A `MinGW\bin` folder inside the Code::Blocks install folder |

- **Found it?** Note down the folder it's in and go to Step 3.
- **Not anywhere?** There's no compiler yet. Go to Step 2.

<div class="inline-cta"><strong>Just getting set up?</strong> Once your compiler works, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> takes you through the fundamentals — with pointers, memory and OOP explained properly — in 87 plain-English pages. Just $19.</div>

## Step 2: Install a Compiler (If You Don't Have One)

Either of these works well:

- **WinLibs** — a zip file, no installer. Our [setup guide](/posts/cpp-setup-guide/) walks through it. The zip contains a `mingw64` folder, so extract it straight to `C:\` to end up with `C:\mingw64\bin\g++.exe`.
- **MSYS2** — the option Microsoft's own VS Code guide uses. Install MSYS2, then in the MSYS2 terminal that opens, run:

```
pacman -S --needed base-devel mingw-w64-ucrt-x86_64-toolchain
```

Installing MSYS2 by itself does **not** give you `g++` — that `pacman` command is what installs the compiler.

## Step 3: Add the bin Folder to PATH

1. Press the Windows key, type **environment variables**, and open **Edit environment variables for your account**.
2. Under **User variables**, select **Path** and click **Edit**.
3. Click **New** and paste the folder that contains `g++.exe` — for example `C:\msys64\ucrt64\bin` or `C:\mingw64\bin`.
4. Click **OK**, then **OK** again.

Add the **folder**, not the file: `C:\mingw64\bin`, not `C:\mingw64\bin\g++.exe`.

## Step 4: Close and Reopen Everything

A program reads PATH once, when it starts. Any Command Prompt or PowerShell window that was already open still has the old PATH — and so does **VS Code**, including its built-in terminal.

Close every terminal window and quit VS Code completely (every window), then open them again. Microsoft's guide says the same: reopen your console windows before the new PATH is available.

## Step 5: Check It Worked

In a **new** terminal:

```
g++ --version
```

It should print the compiler's version and a copyright notice. Now compile something — see [how to run a .cpp file](/posts/how-to-run-cpp-file/).

## Still Not Working? The Usual Culprits

**The folder is nested one level deeper than you think.** Extract the WinLibs zip *into* a folder called `C:\mingw64` and you get `C:\mingw64\mingw64\bin`. Open the folder you added to PATH and check that `g++.exe` is really inside it.

**MSYS2's folders don't match.** MSYS2 has several `bin` folders. If you installed the `ucrt` toolchain (the command above), `g++.exe` is in `C:\msys64\ucrt64\bin` — not `C:\msys64\mingw64\bin`, and not `C:\msys64\usr\bin`.

**A typo in the path.** One wrong letter and Windows quietly finds nothing. Copy the path from File Explorer's address bar instead of typing it. WinLibs also recommends a location without spaces.

**VS Code was open the whole time.** Closing the terminal panel isn't enough — quit VS Code completely and reopen it.

**You're using Visual Studio, not VS Code.** Visual Studio has its own compiler, called `cl`, so you don't need `g++` at all. Build with **Ctrl+F5** inside Visual Studio. If you do want `cl` from a terminal, open **Developer Command Prompt for VS** from the Start menu.

## A Quick Fix for the Current Window Only

To test a folder before changing PATH for good, add it to the current terminal session. It lasts until you close the window.

Command Prompt:

```
set PATH=C:\msys64\ucrt64\bin;%PATH%
```

PowerShell:

```
$env:Path = "C:\msys64\ucrt64\bin;" + $env:Path
```

If `g++ --version` works after that, you've found the right folder — now add it permanently with Step 3.

## On Mac or Linux?

The error looks different, but the cause is the same: no compiler.

- **Mac:** run `xcode-select --install` to get Apple's command line tools. On a Mac, `g++` is actually Apple's Clang compiler under a familiar name, which is completely fine for learning.
- **Ubuntu and Debian:** the terminal suggests `sudo apt install g++`. Installing `build-essential` gets you `g++` plus `make`:

```
sudo apt install build-essential
```

## gcc, gdb and make

Getting the same error for `gcc`, `gdb` or `mingw32-make`? Same cause, same fix — they live in the same `bin` folder as `g++`. Once that folder is on PATH, all of them work.

## Quick Reference

| Problem | Fix |
|---|---|
| `where g++` finds nothing | Install a compiler (Step 2), or find its `bin` folder |
| MSYS2 installed but no `g++.exe` | Run the `pacman` toolchain command |
| Added to PATH, still not recognized | Close all terminals and VS Code, then reopen |
| Still not recognized after restarting | Check `g++.exe` is really inside the folder you added |
| Using Visual Studio | You don't need `g++` — its compiler is `cl` |
| Mac | `xcode-select --install` |
| Ubuntu / Debian | `sudo apt install build-essential` |

---

## Take Your C++ Further

Getting a compiler working is the hardest part of day one. Once it runs, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** takes you through the fundamentals in plain English, then the parts that trip beginners up most — pointers, memory and OOP. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [How to Set Up C++](/posts/cpp-setup-guide/) — install a compiler and run your first program.
- [How to Run a .cpp File](/posts/how-to-run-cpp-file/) — compile and run from the terminal, VS Code or Visual Studio.
- [Fix '#include errors detected' in VS Code](/posts/cpp-vscode-include-errors/) — when VS Code underlines your includes.
- [Online C++ Compilers](/posts/cpp-online-compiler/) — skip the install and code in your browser.
- [C++ Hello World Explained](/posts/cpp-hello-world-explained/) — your first program, line by line.
