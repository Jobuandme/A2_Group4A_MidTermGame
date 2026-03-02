const Physics = {
  // Resolves player against all platforms in level
  // Returns collision info: { bottom, top, left, right }
  resolve(player, platforms) {
    const info = { bottom: false, top: false, left: false, right: false };

    for (const plat of platforms) {
      if (!plat.overlaps(player.x, player.y, player.w, player.h)) continue;

      // Calculate overlap on each axis
      const overlapLeft  = (player.x + player.w) - plat.x;
      const overlapRight = (plat.x + plat.w)     - player.x;
      const overlapTop   = (player.y + player.h)  - plat.y;
      const overlapDown  = (plat.y + plat.h)      - player.y;

      const minX = Math.min(overlapLeft, overlapRight);
      const minY = Math.min(overlapTop, overlapDown);

      if (minX < minY) {
        // Horizontal collision
        if (overlapLeft < overlapRight) {
          player.x = plat.x - player.w;
          info.right = true;
        } else {
          player.x = plat.x + plat.w;
          info.left = true;
        }
        player.vx = 0;
      } else {
        // Vertical collision
        if (overlapTop < overlapDown) {
          player.y = plat.y - player.h;
          player.vy = Math.min(player.vy, 0);
          info.bottom = true;
        } else {
          player.y = plat.y + plat.h;
          player.vy = Math.max(player.vy, 0);
          info.top = true;
        }
      }
    }

    return info;
  }
};
