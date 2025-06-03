# zipline-estimator

```text
INPUTS
   ↓
Compute raw ground Y for Tree 2 (baseY = axisY = 0 elevation)
Compute raw ground Y for Tree 1 = baseY + slopeDelta * px/ft
   ↓
Compute anchor Ys:
  anchorStartY = rawGroundStartY - cableDrop * px/ft
  anchorEndY   = rawGroundEndY (flat anchor)
   ↓
Compute midY with sag
   ↓
Compute vertical offset needed to raise everything so the lowest seat point clears the ground
   ↓
Apply offset to:
  - groundStartY
  - groundEndY
  - anchorStartY
  - anchorEndY
  - midY
   ↓
DRAW ELEMENTS
──────────────────────────────────────
| 1. Horizontal Elevation Axis       |
|    createLine(startX, axisY, endX, axisY)     ← elevation 0 |
|    createText(..., "Elevation = 0 ft")        ← label       |
|                                              |
| 2. Sloped Ground Line                        |
|    createLine(startX, groundStartY, endX, groundEndY)        |
|    createText(startX, groundStartY, "Ground Level - Tree 1") |
|    createText(endX, groundEndY, "Ground Level - Tree 2")     |
|                                              |
| 3. Cable & Anchors                           |
|    drawCable(...)                            |
|    createText(anchorStartY, "Start Anchor (X ft above End)") |
|    createText(anchorEndY, "End Anchor (0 ft above ground)")  |
|                                              |
| 4. Seat Assembly                              |
|    drawSeatAssembly(...)                     |
──────────────────────────────────────

```