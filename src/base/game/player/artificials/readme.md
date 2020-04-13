
# 🤖 Artificial Player Implementations

```txt
@ src/base/game/player/artificials
```

This is a folder for all implementations of the abstract `ArtificialPlayer` class.

Each implementation must:

- Set their constructor visibility to `protected`.
- Use the exact same constructor signature as that of the superclass.
- Declare an enum entry in [`Player.Operator`](../Player.ts).
  - Map that entry to their constructor function in the dictionary [`ArtificialPlayers.__Constructors`](../../PostInit.ts).
