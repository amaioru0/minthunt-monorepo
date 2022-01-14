import React from "react";
import Svg, { Path, G } from "react-native-svg";


export default function UserLocationMarker(props) {
  return (
    <Svg width={30} height={31} viewBox="0 0 418.004 418.004" {...props}>
  <G id="Group_617" data-name="Group 617" transform="translate(-925.189 -2222.078)">
    <G id="Component_1_2" data-name="Component 1 – 2" transform="translate(926.017 2223.018)">
      <G id="compass" transform="matrix(0.695, -0.719, 0.719, 0.695, 0, 205.445)">
        <G id="Group_614" data-name="Group 614" transform="translate(0 0)">
          <Path id="Path_1137" data-name="Path 1137" d="M282.113,3.485A11.917,11.917,0,0,0,269.19.879l-261.8,107.1a11.908,11.908,0,0,0,2.38,22.729l122.8,22.325,22.337,122.8a11.9,11.9,0,0,0,10.46,9.711c.417.036.833.06,1.238.06a11.922,11.922,0,0,0,11.02-7.4l107.1-261.8A11.9,11.9,0,0,0,282.113,3.485Z" fill="#f7cb15" stroke="#f06ea9" stroke-width="1"/>
        </G>
      </G>
      <G id="Group_615" data-name="Group 615" transform="translate(196.015 3.207) rotate(43)">
        <G id="Group_15" data-name="Group 15" transform="translate(0 0)">
          <G id="Group_13" data-name="Group 13" transform="translate(0 0)">
            <Path id="Path_18" data-name="Path 18" d="M3.772,0,149.1,150.958s-15.13,87.96-25.337,125.237c-6.412,12.919-17.364,3.338-18.216,3.386C102.3,279.764-.45,13.992,0,8.824S.835,2.7,3.772,0Z" fill="#fff335"/>
          </G>
        </G>
      </G>
    </G>
  </G>
    </Svg>
  );
}