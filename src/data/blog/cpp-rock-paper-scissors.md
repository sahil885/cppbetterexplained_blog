---
title: "Rock Paper Scissors in C++: Build the Game Step by Step"
description: "Build a rock paper scissors game in C++ from scratch. Learn enums, random computer moves, input validation, and a scoring loop in one beginner project."
pubDatetime: 2026-08-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "project", "game", "tutorial"]
faqSchema:
  - question: "How do you make a rock paper scissors game in C++?"
    answer: "Read the player's choice, generate a random computer choice with the random header, compare the two to decide the winner, and wrap the whole thing in a loop that tracks the score. An enum keeps the three moves readable instead of using bare numbers."
  - question: "How does the computer pick a random move in C++?"
    answer: "Create a std::mt19937 generator seeded from std::random_device, then use std::uniform_int_distribution with the range 0 to 2. Each call returns one of three values that map to rock, paper, and scissors."
  - question: "How do I stop my C++ game from looping forever on bad input?"
    answer: "When std::cin fails to read a number it sets an error flag and leaves the bad text in the buffer, so every later read fails instantly. Call cin.clear to reset the flag and cin.ignore to discard the leftover characters before asking again."
draft: false
featured: false
---

# Rock Paper Scissors in C++: Build the Game Step by Step

Rock paper scissors is the perfect second project after a number guessing game. It's small enough to finish in one sitting, but it makes you handle four real problems: representing choices meaningfully, generating randomness properly, validating input, and structuring a game loop.

We'll build it in pieces and assemble the full program at the end.

---

## Step 1: Represent the Moves

You could use `1`, `2`, and `3` for the moves. Don't — six months later `if (a == 2)` means nothing to anyone. Use an [enum class](/posts/cpp-enum-class-vs-enum/):

```cpp
enum class Move { Rock = 0, Paper = 1, Scissors = 2 };
```

Now the comparison logic reads like the actual game rules. The explicit values `0`, `1`, `2` are there because we'll convert to and from the random number generator's output, and pinning them down makes that conversion safe.

A small helper to print a move:

```cpp
#include <string>

std::string moveName(Move m) {
    switch (m) {
        case Move::Rock:     return "Rock";
        case Move::Paper:    return "Paper";
        case Move::Scissors: return "Scissors";
    }
    return "Unknown";
}
```

---

## Step 2: Decide the Winner

The naive approach is nine `if` statements. There's a much shorter way, built on the fact that each move beats exactly the one before it in the cycle rock → paper → scissors → rock:

```cpp
// Returns: 0 = tie, 1 = player wins, 2 = computer wins
int decideWinner(Move player, Move computer) {
    if (player == computer) return 0;

    int p = static_cast<int>(player);
    int c = static_cast<int>(computer);

    // player wins when their move is exactly one step "above" the computer's,
    // wrapping around with modulo so Scissors(2) beats Paper(1) and Rock(0)
    // loses to Paper(1)
    return ((p - c + 3) % 3 == 1) ? 1 : 2;
}
```

Why `+ 3`? Because `p - c` can be `-2`, and in C++ the [modulo operator](/posts/cpp-modulo-operator/) on a negative number gives a negative result. Adding 3 before taking `% 3` keeps the value in the range 0–2. This is worth remembering — it comes up any time you wrap an index around.

If the modulo trick feels like showing off, a plain version is perfectly fine:

```cpp
int decideWinnerSimple(Move player, Move computer) {
    if (player == computer) return 0;
    if ((player == Move::Rock     && computer == Move::Scissors) ||
        (player == Move::Paper    && computer == Move::Rock)     ||
        (player == Move::Scissors && computer == Move::Paper)) {
        return 1;
    }
    return 2;
}
```

Clear beats clever when someone else has to maintain it.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Step 3: The Computer's Move

Use `<random>`, not `rand()`:

```cpp
#include <random>

Move randomMove() {
    static std::random_device rd;
    static std::mt19937 gen(rd());
    static std::uniform_int_distribution<int> dist(0, 2);

    return static_cast<Move>(dist(gen));
}
```

All three objects are `static`, so they're created once on the first call and reused. Recreating and reseeding the generator on every call is a common mistake — it can produce the same value repeatedly, because the seed barely changes between rapid calls.

`std::uniform_int_distribution(0, 2)` gives each of the three values genuinely equal probability. The old `rand() % 3` approach introduces a slight bias, because `RAND_MAX` usually isn't evenly divisible by 3. See [random numbers in C++](/posts/cpp-random-numbers/) for the details.

---

## Step 4: Input That Survives Bad Typing

If the player types `banana` when you asked for a number, `std::cin` enters a failure state and every subsequent read fails immediately — giving you an infinite loop of prompts. Handle it:

```cpp
#include <iostream>
#include <limits>

int readChoice() {
    int choice = 0;

    while (true) {
        std::cout << "1 = Rock, 2 = Paper, 3 = Scissors, 0 = Quit: ";

        if (std::cin >> choice && choice >= 0 && choice <= 3) {
            return choice;
        }

        std::cin.clear();   // reset the error flag
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cout << "Please enter 0, 1, 2, or 3.\n";
    }
}
```

`clear()` resets the stream's error state; `ignore(...)` throws away everything up to and including the newline, so the bad input doesn't get re-read. Both are needed — one without the other doesn't work. [cin.ignore and clearing the buffer](/posts/cpp-cin-ignore-clear-buffer/) covers exactly why.

---

## The Complete Program

```cpp
#include <iostream>
#include <string>
#include <random>
#include <limits>

enum class Move { Rock = 0, Paper = 1, Scissors = 2 };

std::string moveName(Move m) {
    switch (m) {
        case Move::Rock:     return "Rock";
        case Move::Paper:    return "Paper";
        case Move::Scissors: return "Scissors";
    }
    return "Unknown";
}

Move randomMove() {
    static std::random_device rd;
    static std::mt19937 gen(rd());
    static std::uniform_int_distribution<int> dist(0, 2);
    return static_cast<Move>(dist(gen));
}

int decideWinner(Move player, Move computer) {
    if (player == computer) return 0;
    int p = static_cast<int>(player);
    int c = static_cast<int>(computer);
    return ((p - c + 3) % 3 == 1) ? 1 : 2;
}

int readChoice() {
    int choice = 0;
    while (true) {
        std::cout << "1 = Rock, 2 = Paper, 3 = Scissors, 0 = Quit: ";
        if (std::cin >> choice && choice >= 0 && choice <= 3) {
            return choice;
        }
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cout << "Please enter 0, 1, 2, or 3.\n";
    }
}

int main() {
    int playerScore = 0;
    int computerScore = 0;
    int ties = 0;

    std::cout << "=== Rock Paper Scissors ===\n\n";

    while (true) {
        int choice = readChoice();
        if (choice == 0) break;

        Move player = static_cast<Move>(choice - 1);
        Move computer = randomMove();

        std::cout << "You chose " << moveName(player)
                  << ", computer chose " << moveName(computer) << ". ";

        int result = decideWinner(player, computer);

        if (result == 0) {
            std::cout << "Tie!\n";
            ++ties;
        } else if (result == 1) {
            std::cout << "You win!\n";
            ++playerScore;
        } else {
            std::cout << "Computer wins.\n";
            ++computerScore;
        }

        std::cout << "Score - You: " << playerScore
                  << " | Computer: " << computerScore
                  << " | Ties: " << ties << "\n\n";
    }

    std::cout << "\nFinal score - You: " << playerScore
              << ", Computer: " << computerScore
              << ", Ties: " << ties << "\n";

    if (playerScore > computerScore)      std::cout << "You came out ahead!\n";
    else if (computerScore > playerScore) std::cout << "The computer wins overall.\n";
    else                                  std::cout << "Dead even.\n";

    return 0;
}
```

Compile and run:

```
g++ -std=c++17 -Wall rps.cpp -o rps
./rps
```

Sample session:

```
=== Rock Paper Scissors ===

1 = Rock, 2 = Paper, 3 = Scissors, 0 = Quit: 1
You chose Rock, computer chose Scissors. You win!
Score - You: 1 | Computer: 0 | Ties: 0

1 = Rock, 2 = Paper, 3 = Scissors, 0 = Quit: 2
You chose Paper, computer chose Scissors. Computer wins.
Score - You: 1 | Computer: 1 | Ties: 0
```

Notice that `choice - 1` converts the menu number to the enum value. That's why pinning `Rock = 0` mattered back in step 1 — the mapping is now obvious rather than accidental.

---

## Extensions Worth Trying

Once it runs, these each teach something new:

1. **Best of five.** Stop when either score reaches 3. Needs a loop condition instead of `while (true)`.
2. **Letters instead of numbers.** Accept `r`, `p`, `s` — practice with [character input and string comparison](/posts/cpp-compare-strings/).
3. **Rock Paper Scissors Lizard Spock.** Five moves, and the modulo trick still works: a move beats the two before it in the cycle.
4. **Move history.** Store every round in a [vector](/posts/cpp-vector-tutorial/) and print a summary at the end.
5. **A computer that adapts.** Count what the player throws most and counter it. Suddenly it's an AI project.

---

## Related Articles

- [C++ Number Guessing Game](/posts/cpp-number-guessing-game/)
- [C++ Tic Tac Toe Game](/posts/cpp-tic-tac-toe/)
- [Random Numbers in C++](/posts/cpp-random-numbers/)
- [enum class vs enum in C++](/posts/cpp-enum-class-vs-enum/)
- [C++ cin.ignore and Clearing the Input Buffer](/posts/cpp-cin-ignore-clear-buffer/)
- [C++ Beginner Projects](/posts/cpp-beginner-projects/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
