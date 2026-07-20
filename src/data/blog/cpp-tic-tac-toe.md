---
title: "Tic Tac Toe in C++: Build a Complete Two-Player Game"
description: "Build a playable tic tac toe game in C++ from scratch. Learn how to draw the board, take player input, check for a winner, and handle draws with clean code."
pubDatetime: 2026-07-20T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "project", "arrays", "tutorial"]
faqSchema:
  - question: "How do you represent a tic tac toe board in C++?"
    answer: "The simplest approach is a 3x3 array of chars, declared as char board[3][3]. Each cell holds a space for empty, or X or O for a taken square. A 2D array maps directly onto the grid, so row and column indices match what the player sees."
  - question: "How do you check for a winner in tic tac toe?"
    answer: "Check all eight winning lines: three rows, three columns, and two diagonals. For each line, confirm the first cell is not empty and all three cells match. If any line matches, that symbol has won."
  - question: "How do you detect a draw in tic tac toe?"
    answer: "A draw happens when the board is full and nobody has won. The easiest way is to count moves — after nine valid moves with no winner, the game is a draw. Always check for a winner before checking for a draw."
draft: false
featured: false
---

# Tic Tac Toe in C++: Build a Complete Two-Player Game

Tic tac toe is the ideal first game project. It's small enough to finish in one sitting, but it forces you to use 2D arrays, loops, functions, and input validation together — which is exactly the jump from "I know the syntax" to "I can build something."

We'll build it piece by piece, then assemble the whole thing.

---

## Step 1: Representing the Board

A tic tac toe grid is 3 rows by 3 columns, so a [2D array](/posts/cpp-2d-array/) of `char` maps onto it perfectly:

```cpp
char board[3][3] = {
    {' ', ' ', ' '},
    {' ', ' ', ' '},
    {' ', ' ', ' '}
};
```

A space means empty; `'X'` and `'O'` mean taken. Using `char` rather than `int` means the value you store is the value you print — no translation step.

---

## Step 2: Drawing the Board

Players need to see the grid *and* know how to refer to a square. We'll number the cells 1–9:

```cpp
#include <iostream>

void drawBoard(const char board[3][3]) {
    std::cout << "\n";
    for (int row = 0; row < 3; row++) {
        std::cout << " ";
        for (int col = 0; col < 3; col++) {
            std::cout << board[row][col];
            if (col < 2) std::cout << " | ";
        }
        std::cout << "\n";
        if (row < 2) std::cout << "---+---+---\n";
    }
    std::cout << "\n";
}

int main() {
    char board[3][3] = {
        {'X', 'O', 'X'},
        {' ', 'O', ' '},
        {' ', ' ', 'O'}
    };
    drawBoard(board);
    return 0;
}
```

Output:
```
 X | O | X
---+---+---
   | O |  
---+---+---
   |   | O

```

The `if (col < 2)` and `if (row < 2)` checks stop us drawing a separator after the last column or row.

Note the parameter type: `const char board[3][3]`. The `const` says this function only reads the board, which the compiler will enforce.

---

## Step 3: Converting a Move to Coordinates

Players think "square 5." The array thinks `board[1][1]`. The conversion is simple integer maths:

```cpp
int row = (move - 1) / 3;
int col = (move - 1) % 3;
```

Subtract 1 to shift from 1-based to 0-based, then integer division gives the row and the [modulo](/posts/cpp-modulo-operator/) gives the column:

| Move | (move−1)/3 | (move−1)%3 | Cell |
|------|-----------|-----------|------|
| 1 | 0 | 0 | `[0][0]` |
| 5 | 1 | 1 | `[1][1]` |
| 9 | 2 | 2 | `[2][2]` |

---

## Step 4: Checking for a Winner

There are exactly eight ways to win — three rows, three columns, two diagonals:

```cpp
char checkWinner(const char board[3][3]) {
    // Rows
    for (int i = 0; i < 3; i++) {
        if (board[i][0] != ' ' &&
            board[i][0] == board[i][1] &&
            board[i][1] == board[i][2]) {
            return board[i][0];
        }
    }

    // Columns
    for (int i = 0; i < 3; i++) {
        if (board[0][i] != ' ' &&
            board[0][i] == board[1][i] &&
            board[1][i] == board[2][i]) {
            return board[0][i];
        }
    }

    // Diagonals
    if (board[0][0] != ' ' &&
        board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
        return board[0][0];
    }
    if (board[0][2] != ' ' &&
        board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
        return board[0][2];
    }

    return ' ';   // no winner yet
}
```

The `!= ' '` check on the first cell is essential. Without it, three empty squares in a row would count as a win — and the game would end immediately, declaring `' '` the winner.

Returning `char` is a neat trick here: the function tells you *both* whether someone won and *who*, in one value.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Step 5: Validating Input

Never trust what a player types. Three things can go wrong: a non-number, a number outside 1–9, and a square that's already taken.

```cpp
bool isValidMove(const char board[3][3], int move) {
    if (move < 1 || move > 9) return false;

    int row = (move - 1) / 3;
    int col = (move - 1) % 3;
    return board[row][col] == ' ';
}
```

Handling non-numeric input needs a little more care, because a failed `std::cin >>` leaves the bad text sitting in the buffer forever:

```cpp
if (!(std::cin >> move)) {
    if (std::cin.eof()) break;                            // stream closed — stop, don't spin
    std::cin.clear();                                     // reset the error flag
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');  // discard the junk
    std::cout << "Please enter a number.\n";
    continue;
}
```

The `eof()` check matters as much as the other two. At end of input, `clear()` resets the flag and the next read fails again immediately — without that guard the loop spins forever. Skip the `clear()` and `ignore()` and your program spins in an infinite loop — `std::cin` stays in a failed state and every subsequent read fails instantly. This is covered in more depth in [clearing the cin buffer](/posts/cpp-cin-ignore-clear-buffer/).

---

## Step 6: The Complete Game

Everything assembled into one working program:

```cpp
#include <iostream>
#include <limits>

void drawBoard(const char board[3][3]) {
    std::cout << "\n";
    for (int row = 0; row < 3; row++) {
        std::cout << " ";
        for (int col = 0; col < 3; col++) {
            std::cout << board[row][col];
            if (col < 2) std::cout << " | ";
        }
        std::cout << "\n";
        if (row < 2) std::cout << "---+---+---\n";
    }
    std::cout << "\n";
}

char checkWinner(const char board[3][3]) {
    for (int i = 0; i < 3; i++) {
        if (board[i][0] != ' ' && board[i][0] == board[i][1] && board[i][1] == board[i][2])
            return board[i][0];
        if (board[0][i] != ' ' && board[0][i] == board[1][i] && board[1][i] == board[2][i])
            return board[0][i];
    }
    if (board[0][0] != ' ' && board[0][0] == board[1][1] && board[1][1] == board[2][2])
        return board[0][0];
    if (board[0][2] != ' ' && board[0][2] == board[1][1] && board[1][1] == board[2][0])
        return board[0][2];
    return ' ';
}

bool isValidMove(const char board[3][3], int move) {
    if (move < 1 || move > 9) return false;
    return board[(move - 1) / 3][(move - 1) % 3] == ' ';
}

int main() {
    char board[3][3] = {
        {' ', ' ', ' '},
        {' ', ' ', ' '},
        {' ', ' ', ' '}
    };

    char currentPlayer = 'X';
    int movesMade = 0;

    std::cout << "=== Tic Tac Toe ===\n";
    std::cout << "Squares are numbered 1-9, left to right, top to bottom.\n";

    while (true) {
        drawBoard(board);

        int move = 0;
        std::cout << "Player " << currentPlayer << ", choose a square (1-9): ";

        if (!(std::cin >> move)) {
            if (std::cin.eof()) {          // input stream closed — stop cleanly
                std::cout << "\nInput ended. Goodbye!\n";
                break;
            }
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            std::cout << "That's not a number. Try again.\n";
            continue;
        }

        if (!isValidMove(board, move)) {
            std::cout << "Invalid move — pick an empty square from 1 to 9.\n";
            continue;
        }

        board[(move - 1) / 3][(move - 1) % 3] = currentPlayer;
        movesMade++;

        char winner = checkWinner(board);
        if (winner != ' ') {
            drawBoard(board);
            std::cout << "Player " << winner << " wins!\n";
            break;
        }

        if (movesMade == 9) {
            drawBoard(board);
            std::cout << "It's a draw!\n";
            break;
        }

        currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
    }

    return 0;
}
```

Sample session:
```
=== Tic Tac Toe ===
Squares are numbered 1-9, left to right, top to bottom.

   |   |  
---+---+---
   |   |  
---+---+---
   |   |  

Player X, choose a square (1-9): 5
...
 X | O | O
---+---+---
   | X |  
---+---+---
   |   | X

Player X wins!
```

---

## How the Pieces Fit Together

Three design decisions carry most of the weight:

**One job per function.** `drawBoard` draws, `checkWinner` checks, `isValidMove` validates. You can test and fix each one independently — and when a bug appears, you usually know which function to open.

**`continue` for invalid input.** When a move is rejected, `continue` jumps back to the top of the loop *without* switching players. The same player tries again, which is what you'd expect.

**Player switching with the [ternary operator](/posts/cpp-ternary-operator/).** `currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';` toggles between two values in one line. It runs last, after all the win and draw checks, so a winning move isn't followed by a pointless switch.

---

## Ideas to Extend It

Once it works, try these in roughly increasing difficulty:

1. **Play again?** Wrap the game loop in an outer loop and ask after each game.
2. **Score tracking.** Count wins per player across rounds.
3. **A simple computer opponent.** Pick a [random](/posts/cpp-random-numbers/) empty square.
4. **A smarter opponent.** Win if you can, block if the opponent is about to win, otherwise take the centre.
5. **Bigger boards.** Generalise to N×N with a win condition of N in a row.

Number 4 is the one that will teach you the most — it's your first real game AI, and it's only a handful of extra checks.

---

## Related Articles

- [C++ 2D Arrays](/posts/cpp-2d-array/) — the data structure behind the board
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — splitting a program into pieces
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — the game loop
- [How to Clear the cin Buffer](/posts/cpp-cin-ignore-clear-buffer/) — handling bad input properly
- [C++ Ternary Operator](/posts/cpp-ternary-operator/) — the one-line player switch
- [C++ Beginner Projects](/posts/cpp-beginner-projects/) — what to build next

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
