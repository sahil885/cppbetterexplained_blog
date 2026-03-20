---
title: "Blackjack C++ Using Classes - Full Implementation with Source Code"
description: "Learn how to implement Blackjack in C++ using classes. Full source code covering Card, Deck, Hand, Player, House and Game classes with object-oriented design."
pubDatetime: 2024-09-30T00:00:00Z
author: "Sahil"
tags: ["C++", "OOP", "classes", "blackjack", "beginner", "project", "game"]
draft: false
featured: true
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/TUXanmeigqE" title="Blackjack C++ Using Classes" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Implementing Blackjack in C++ using classes can be a big task. Since the game involves players, a deck of cards, and the house, we need to break the code down into smaller, manageable parts. This is where we use the power of C++'s object-oriented abilities to implement classes.

Before writing any code, it helps to get a visual overview of how the classes relate to each other. Without this, it is easy to lose track of what goes where.

## How to Implement Blackjack in C++ Using Classes

The code is organised into header and implementation files. In C++, we can share data across files by importing header files where needed. The full project consists of the following classes:

- `Card` — represents a single playing card
- `Hand` — represents a collection of cards
- `GenericPlayer` — base class for both Player and House
- `Player` — the human player
- `House` — the dealer
- `Deck` — the full 52-card deck
- `Game` — controls the overall game loop

---

## Card Header File

The `Card` class defines the rank and suit enumerations and provides methods to get the card's value and flip it face up or down.

```cpp
#ifndef CARD_H
#define CARD_H

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <ctime>
using namespace std;

class Card {
public:
    enum rank {ACE = 1, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN, KING};
    enum suit {CLUBS, DIAMONDS, HEARTS, SPADES};

    friend ostream& operator << (ostream& os, const Card& aCard);
    Card(rank r = ACE, suit s = SPADES, bool ifu = true);

    // Returns the value of a card
    int GetValue() const;

    // Flips a card; if face up, becomes face down and vice versa
    void Flip();

private:
    rank m_Rank;
    suit m_Suit;
    bool m_IsFaceUp;
};

#endif
```

## Card Implementation File

```cpp
#include "card.h"

Card::Card(rank r, suit s, bool ifu): m_Rank(r), m_Suit(s), m_IsFaceUp(ifu) {}

int Card::GetValue() const {
    // If a card is face down, its value is 0
    int value = 0;
    if (m_IsFaceUp) {
        value = m_Rank;
        // Value is 10 for face cards
        if (value > 10) value = 10;
    }
    return value;
}

void Card::Flip() {
    m_IsFaceUp = !(m_IsFaceUp);
}
```

---

## Hand Header and Implementation

The `Hand` class manages a collection of card pointers and calculates the total value, treating aces as 1 or 11 intelligently.

```cpp
#ifndef HAND_H
#define HAND_H

#include "card.h"

class Hand {
public:
    Hand();
    virtual ~Hand();

    void Add(Card* pCard);
    void Clear();
    int GetTotal() const;

protected:
    vector<Card*> m_Cards;
};

#endif
```

```cpp
#include "hand.h"

Hand::Hand() {
    m_Cards.reserve(7);
}

Hand::~Hand() {
    Clear();
}

void Hand::Add(Card* pCard) {
    m_Cards.push_back(pCard);
}

void Hand::Clear() {
    vector<Card*>::iterator iter = m_Cards.begin();
    for (iter = m_Cards.begin(); iter != m_Cards.end(); ++iter) {
        delete *iter;
        *iter = 0;
    }
    m_Cards.clear();
}

int Hand::GetTotal() const {
    if (m_Cards.empty()) return 0;
    if (m_Cards[0]->GetValue() == 0) return 0;

    int total = 0;
    vector<Card*>::const_iterator iter;
    for (iter = m_Cards.begin(); iter != m_Cards.end(); ++iter)
        total += (*iter)->GetValue();

    bool containsAce = false;
    for (iter = m_Cards.begin(); iter != m_Cards.end(); ++iter)
        if ((*iter)->GetValue() == Card::ACE) containsAce = true;

    if (containsAce && total <= 11)
        total += 10;

    return total;
}
```

---

## GenericPlayer Header and Implementation

`GenericPlayer` is the base class for both `Player` and `House`. It handles bust detection and announces when a player busts.

```cpp
#ifndef GENERICPLAYERCLASS_H
#define GENERICPLAYERCLASS_H

#include "card.h"
#include "hand.h"

class GenericPlayer : public Hand {
    friend ostream& operator << (ostream& os, const GenericPlayer& aGenericPlayer);
public:
    GenericPlayer(const string& name = "");
    virtual ~GenericPlayer();

    virtual bool IsHitting() const = 0;
    bool IsBusted() const;
    void Bust() const;

protected:
    string m_Name;
};

#endif
```

```cpp
#include "genericPlayerClass.h"

GenericPlayer::GenericPlayer(const string& name): m_Name(name) {}
GenericPlayer::~GenericPlayer() {}

bool GenericPlayer::IsBusted() const {
    return (GetTotal() > 21);
}

void GenericPlayer::Bust() const {
    cout << m_Name << " busted.\n";
}
```

---

## Player Header and Implementation

The `Player` class extends `GenericPlayer` and prompts the user whether they want to hit.

```cpp
#ifndef PLAYER_H
#define PLAYER_H

#include "genericPlayerClass.h"

class Player : public GenericPlayer {
public:
    Player(const string& name = "");
    virtual ~Player();

    virtual bool IsHitting() const;
    void Win() const;
    void Lose() const;
    void Push() const;
};

#endif
```

```cpp
#include "player.h"

Player::Player(const string& name): GenericPlayer(name) {}
Player::~Player() {}

bool Player::IsHitting() const {
    cout << m_Name << ", do you want a hit (Y/N): ";
    char response;
    cin >> response;
    return (response == 'y' || response == 'Y');
}

void Player::Win() const { cout << m_Name << " wins.\n"; }
void Player::Lose() const { cout << m_Name << " loses.\n"; }
void Player::Push() const { cout << m_Name << " pushes.\n"; }
```

---

## House Header and Implementation

The `House` class represents the dealer. It always hits on 16 or less.

```cpp
#ifndef HOUSE_H
#define HOUSE_H

#include "genericPlayerClass.h"

class House : public GenericPlayer {
public:
    House(const string& name = "House");
    virtual ~House();

    virtual bool IsHitting() const;
    void FlipFirstCard();
};

#endif
```

```cpp
#include "house.h"

House::House(const string& name): GenericPlayer(name) {}
House::~House() {}

bool House::IsHitting() const {
    return (GetTotal() <= 16);
}

void House::FlipFirstCard() {
    if (!(m_Cards.empty()))
        m_Cards[0]->Flip();
    else
        cout << "No card to flip!\n";
}
```

---

## Deck Header and Implementation

The `Deck` class populates a standard 52-card deck, shuffles it, and deals cards to players.

```cpp
#ifndef DECK_H
#define DECK_H

#include "hand.h"
#include "genericPlayerClass.h"

class Deck : public Hand {
public:
    Deck();
    virtual ~Deck();

    void Populate();
    void Shuffle();
    void Deal(Hand& aHand);
    void AdditionalCards(GenericPlayer& aGenericPlayer);
};

#endif
```

```cpp
#include "deck.h"

Deck::Deck() {
    m_Cards.reserve(52);
    Populate();
}

Deck::~Deck() {}

void Deck::Populate() {
    Clear();
    for (int s = Card::CLUBS; s <= Card::SPADES; ++s)
        for (int r = Card::ACE; r <= Card::KING; ++r)
            Add(new Card(static_cast<Card::rank>(r), static_cast<Card::suit>(s)));
}

void Deck::Shuffle() {
    random_shuffle(m_Cards.begin(), m_Cards.end());
}

void Deck::Deal(Hand& aHand) {
    if (!m_Cards.empty()) {
        aHand.Add(m_Cards.back());
        m_Cards.pop_back();
    } else {
        cout << "Out of cards. Unable to deal";
    }
}

void Deck::AdditionalCards(GenericPlayer& aGenericPlayer) {
    cout << endl;
    while (!(aGenericPlayer.IsBusted()) && aGenericPlayer.IsHitting()) {
        Deal(aGenericPlayer);
        cout << aGenericPlayer << endl;
        if (aGenericPlayer.IsBusted()) aGenericPlayer.Bust();
    }
}
```

---

## Game Header and Implementation

The `Game` class ties everything together — it manages the deck, house, and all players through a full round of Blackjack.

```cpp
#ifndef GAME_H
#define GAME_H

#include "deck.h"
#include "house.h"
#include "player.h"

class Game {
public:
    Game(const vector<string>& names);
    ~Game();
    void Play();

private:
    Deck m_Deck;
    House m_House;
    vector<Player> m_Players;
};

#endif
```

```cpp
#include "game.h"

Game::Game(const vector<string>& names) {
    vector<string>::const_iterator pName;
    for (pName = names.begin(); pName != names.end(); ++pName)
        m_Players.push_back(Player(*pName));

    srand(time(0));
    m_Deck.Populate();
    m_Deck.Shuffle();
}

Game::~Game() {}

void Game::Play() {
    // Deal initial 2 cards to everyone
    vector<Player>::iterator pPlayer;
    for (int i = 0; i < 2; ++i) {
        for (pPlayer = m_Players.begin(); pPlayer != m_Players.end(); ++pPlayer)
            m_Deck.Deal(*pPlayer);
        m_Deck.Deal(m_House);
    }

    m_House.FlipFirstCard();

    for (pPlayer = m_Players.begin(); pPlayer != m_Players.end(); ++pPlayer)
        cout << *pPlayer << endl;
    cout << m_House << endl;

    for (pPlayer = m_Players.begin(); pPlayer != m_Players.end(); ++pPlayer)
        m_Deck.AdditionalCards(*pPlayer);

    m_House.FlipFirstCard();
    cout << endl << m_House;

    m_Deck.AdditionalCards(m_House);

    if (m_House.IsBusted()) {
        for (pPlayer = m_Players.begin(); pPlayer != m_Players.end(); ++pPlayer)
            if (!(pPlayer->IsBusted())) pPlayer->Win();
    } else {
        for (pPlayer = m_Players.begin(); pPlayer != m_Players.end(); ++pPlayer)
            if (!(pPlayer->IsBusted())) {
                if (pPlayer->GetTotal() > m_House.GetTotal()) pPlayer->Win();
                else if (pPlayer->GetTotal() < m_House.GetTotal()) pPlayer->Lose();
                else pPlayer->Push();
            }
    }

    for (pPlayer = m_Players.begin(); pPlayer != m_Players.end(); ++pPlayer)
        pPlayer->Clear();
    m_House.Clear();
}
```

---

## Putting It All Together — main.cpp

```cpp
#include "card.h"
#include "deck.h"
#include "game.h"
#include "genericPlayerClass.h"
#include "hand.h"
#include "house.h"
#include "player.h"

ostream& operator << (ostream& os, const Card& aCard);
ostream& operator << (ostream& os, const GenericPlayer& aGenericPlayer);

int main() {
    cout << "\t\tWELCOME TO BLACKJACK!\n\n";

    int numPlayers = 0;
    while (numPlayers < 1 || numPlayers > 7) {
        cout << "How many Players? (1-7): ";
        cin >> numPlayers;
    }

    vector<string> names;
    string name;
    for (int i = 0; i < numPlayers; ++i) {
        cout << "Enter player name: ";
        cin >> name;
        names.push_back(name);
    }
    cout << endl;

    Game aGame(names);
    char again = 'y';
    while (again != 'n' && again != 'N') {
        aGame.Play();
        cout << "\nDo you want to play again? (Y/N): ";
        cin >> again;
    }

    return 0;
}

ostream& operator <<(ostream& os, const Card& aCard) {
    const string RANKS[] = {"0", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"};
    const string SUITS[] = {"c", "d", "h", "s"};
    if (aCard.m_IsFaceUp)
        os << RANKS[aCard.m_Rank] << SUITS[aCard.m_Suit];
    else
        os << "XX";
    return os;
}

ostream& operator<<(ostream& os, const GenericPlayer& aGenericPlayer) {
    os << aGenericPlayer.m_Name << ":\t";
    vector<Card*>::const_iterator pCard;
    if (!aGenericPlayer.m_Cards.empty()) {
        for (pCard = aGenericPlayer.m_Cards.begin(); pCard != aGenericPlayer.m_Cards.end(); ++pCard)
            os << *(*pCard) << "\t";
        if (aGenericPlayer.GetTotal() != 0)
            cout << "(" << aGenericPlayer.GetTotal() << ")";
    } else {
        os << "<empty>";
    }
    return os;
}
```

---

## Summary

This Blackjack C++ implementation demonstrates how to structure a real-world project using object-oriented principles. By breaking the game into focused classes — `Card`, `Hand`, `GenericPlayer`, `Player`, `House`, `Deck`, and `Game` — the code stays organised, readable, and easy to extend.

Key concepts covered:
- Class inheritance (`Player` and `House` extending `GenericPlayer`)
- Virtual functions for polymorphic behaviour
- Operator overloading for clean console output
- Dynamic memory management with pointers
- STL vectors and iterators

---

**Want to master C++ projects like this?** [C++ Better Explained](https://start.cppbetterexplained.com/tw-sales-page) walks you through real-world C++ from the ground up — grab the book and start building today.
