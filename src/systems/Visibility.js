class Visibility {
  constructor() {
    this._maskCanvas = null;
    this._ctx = null;
  }

  _ensureCanvas(w, h) {
    if (!this._maskCanvas || this._maskCanvas.width !== w || this._maskCanvas.height !== h) {
      this._maskCanvas = document.createElement('canvas');
      this._maskCanvas.width = w;
      this._maskCanvas.height = h;
      this._ctx = this._maskCanvas.getContext('2d');
    }
  }

  // Apply fog of war over the entire canvas
  // playerScreenX/Y: player center in screen space
  apply(p, playerScreenX, playerScreenY, viewW, viewH) {
    this._ensureCanvas(viewW, viewH);
    const ctx = this._ctx;

    ctx.clearRect(0, 0, viewW, viewH);

    // Fill with dark fog
    ctx.fillStyle = 'rgba(10, 8, 18, 0.97)';
    ctx.fillRect(0, 0, viewW, viewH);

    // Cut out vision radius using destination-out
    ctx.globalCompositeOperation = 'destination-out';
    const grad = ctx.createRadialGradient(
      playerScreenX, playerScreenY, C.VISION_RADIUS * 0.3,
      playerScreenX, playerScreenY, C.VISION_RADIUS + C.VISION_SOFTNESS
    );
    grad.addColorStop(0, 'rgba(0,0,0,1)');
    grad.addColorStop(0.6, 'rgba(0,0,0,0.95)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(playerScreenX, playerScreenY, C.VISION_RADIUS + C.VISION_SOFTNESS, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';

    // Draw mask onto p5 canvas
    p.drawingContext.drawImage(this._maskCanvas, 0, 0);
  }
}
