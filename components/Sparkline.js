import React from "react";
import { Svg, Path } from "react-native-svg";

export default function Sparkline({ color }) {
  const width = 80;
  const height = 40;

  // Example curve path (looks like your design)
  const curve =
    "M5 30 C 20 10, 40 10, 60 30 S 95 50, 120 25";

  return (
    <Svg width={width} height={height} viewBox="0 0 120 50">
      <Path
        d={curve}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </Svg>
  );
}
