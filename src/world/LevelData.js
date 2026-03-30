// Tile key:
// 0  = empty
// 1  = solid cave tile (ceiling, floor, side walls)
// 2  = spike pointing UP
// 3  = spike pointing DOWN
// 5  = player start
// 6  = level exit
// 7  = floating platform tile (sprite)
//
// Fruit tiles:
// 41 = purple fruit — adds 1 echolocation charge
// 42 = red fruit    — restores 1 HP
// 43 = green fruit  — refills stamina
// 44 = blue fruit   — no special effect (still counts toward exit)

const LEVELS = [
  {
    name: "Into the Deep",
    fruitsNeeded: 4,
    maxEcho: 5,
    cols: 36,
    rows: 18,
    map: [
      // Row 0: solid cave ceiling
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      // Row 1: second ceiling — bat starts here
      [1,1,5,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
      // Row 2: open dive space
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      // Row 3: first fruit layer — purple (echo) and green (stamina) up high
      [1,0,0,0,0,41,0,0,0,0,0,0,0,0,0,0,0,43,0,0,0,0,0,0,0,0,0,0,41,0,0,0,0,0,0,1],
      // Row 4: first floating platform layer
      [1,0,0,7,7,7,7,0,0,0,0,0,0,0,7,7,7,7,7,0,0,0,0,0,0,7,7,7,7,7,0,0,0,0,0,1],
      // Row 5: open
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      // Row 6: second fruit layer — red (heart) mid-level, blue (none) as filler
      [1,0,0,0,0,0,0,0,0,42,0,0,0,0,0,0,0,0,0,0,0,0,44,0,0,0,0,0,0,0,0,0,42,0,0,1],
      // Row 7: second floating platform layer
      [1,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0,0,0,7,7,7,7,0,0,0,0,0,0,0,7,7,7,7,0,1],
      // Row 8: open
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      // Row 9: tight floating platforms
      [1,0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,0,0,0,0,0,7,7,7,7,0,0,0,0,0,0,0,0,0,0,1],
      // Row 10: open
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      // Row 11: deep fruit — green stamina refill as reward for diving deep
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,43,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      // Row 12: exit on right wall
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1],
      // Row 13: cave platforms above spike floor
      [1,1,1,1,0,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,1,1,1],
      // Row 14: gap above spikes
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      // Row 15: upward spikes
      [1,0,2,2,2,0,0,0,2,2,0,2,2,2,0,0,2,2,2,0,0,0,2,2,0,0,2,2,2,0,0,2,2,0,0,1],
      // Row 16: gap before floor
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      // Row 17: solid floor
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ]
  }
];
