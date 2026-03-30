// Tile key:
// 0 = empty
// 1 = solid cave tile (ceiling, floor, side walls) — drawn with plain fill
// 2 = spike pointing UP   — procedural, 1 tile wide
// 3 = spike pointing DOWN — procedural, 1 tile wide
// 4 = fruit collectible
// 5 = player start
// 6 = level exit
// 7 = floating platform tile — drawn with left/mid/right sprites

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
      // Row 1: second ceiling layer with hanging gaps — bat starts here (tile 5)
      [1,1,5,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
      // Row 2: open dive space
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      // Row 3: first fruits
      [1,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,1],
      // Row 4: first floating platform layer (sprite tiles)
      [1,0,0,7,7,7,7,0,0,0,0,0,0,0,7,7,7,7,7,0,0,0,0,0,0,7,7,7,7,7,0,0,0,0,0,1],
      // Row 5: open
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      // Row 6: more fruits
      [1,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,4,0,0,1],
      // Row 7: second floating platform layer (sprite tiles)
      [1,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0,0,0,7,7,7,7,0,0,0,0,0,0,0,7,7,7,7,0,1],
      // Row 8: open
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      // Row 9: tight floating platforms
      [1,0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,0,0,0,0,0,7,7,7,7,0,0,0,0,0,0,0,0,0,0,1],
      // Row 10: open
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      // Row 11: last fruit, deep
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      // Row 12: exit sits on right side wall
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1],
      // Row 13: solid cave platforms above spike floor (cave style, not sprite)
      [1,1,1,1,0,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,1,1,1],
      // Row 14: gap above spikes
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      // Row 15: upward spikes along the floor
      [1,0,2,2,2,0,0,0,2,2,0,2,2,2,0,0,2,2,2,0,0,0,2,2,0,0,2,2,2,0,0,2,2,0,0,1],
      // Row 16: gap before floor
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      // Row 17: solid cave floor
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ]
  }
];
