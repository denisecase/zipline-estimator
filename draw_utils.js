// draw_utils.js

export function createLine(x1, y1, x2, y2, stroke = "#000", strokeWidth = 1, opacity = 1) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", stroke);
  line.setAttribute("stroke-width", strokeWidth);
  line.setAttribute("stroke-opacity", opacity);
  return line;
}

export function createCircle(cx, cy, r, fill = "black") {
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("cx", cx);
  circle.setAttribute("cy", cy);
  circle.setAttribute("r", r);
  circle.setAttribute("fill", fill);
  return circle;
}

export function createRect(x, y, width, height, fill = "black") {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("fill", fill);
  return rect;
}

export function createText(x, y, text, fontSize = "10", fill = "black") {
  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("x", x);
  label.setAttribute("y", y);
  label.setAttribute("font-size", fontSize);
  label.setAttribute("fill", fill);
  label.textContent = text;
  return label;
}
