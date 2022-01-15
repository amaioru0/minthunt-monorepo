// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import 'base64-sol/base64.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import './HexStrings.sol';
import './ToColor.sol';

contract TreasureMapGenerator  {

  using Strings for uint256;
  using HexStrings for uint160;
  using ToColor for bytes3;

  function generateSVGofTokenById(string memory mapType, string memory range, bytes3 color) internal pure returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">',
        '<g>',
          '<g transform="translate(-47.629 -108.293)">',
            '<g transform="translate(53.833 57.167)">',
              '<path d="M423.067,332.526H69.4a15.564,15.564,0,0,1-15.565-15.565V94.732A15.564,15.564,0,0,1,69.4,79.167H423.065a15.564,15.564,0,0,1,15.565,15.565V316.964A15.561,15.561,0,0,1,423.067,332.526Z" transform="translate(-53.833 -22.096)" fill="#f7cb15"/>',
              '<path d="M406.125,190.262a15.78,15.78,0,0,1,2.706-8.286L421.35,163.5a15.772,15.772,0,0,0-.039-17.752l-12.263-17.923a15.774,15.774,0,0,1-2.742-9.567,15.774,15.774,0,0,0-16.071-16.431l-5.346.106c-.48.01-.96,0-1.44-.036L356.167,99.94a15.787,15.787,0,0,1-7.015-2.223L326.846,84.268A15.785,15.785,0,0,0,313.758,82.8l-21.324,7.038a15.759,15.759,0,0,1-7.266.623l-24.429-3.637a15.749,15.749,0,0,0-7.1.568l-19.428,6.177.776,30.647a1.067,1.067,0,0,1-2.06.418L221.993,96.77l-27.285,3.18a15.6,15.6,0,0,1-2.174.1l-27.15-.6a15.788,15.788,0,0,1-6.675-1.645L136.28,86.655a15.775,15.775,0,0,0-12.613-.628L102.917,93.89a15.792,15.792,0,0,1-9.305.581l-3.287-.8a15.772,15.772,0,0,0-18.4,21.077l1.787,4.568a15.774,15.774,0,0,1,.82,8.628L71.1,146.411l17.871,12.314a1.5,1.5,0,0,1-1.227,2.685l-19.064-4.963c-.029.062-.057.125-.088.184L58.588,176.794a15.776,15.776,0,0,0,1.793,16.841l14.753,18.512A15.766,15.766,0,0,1,78.537,223l-1.484,22.709a15.81,15.81,0,0,1-.97,4.511l-.612,1.634,16.574-.677a1.449,1.449,0,0,1,.61,2.789L71.406,262.7,66.8,274.984a15.773,15.773,0,0,0-.716,8.542l2.573,13.259a15.773,15.773,0,0,0,11.16,12.164l14.444,4.119a15.782,15.782,0,0,0,8.257.106l22.756-5.86a15.784,15.784,0,0,1,9.583.547L155.3,315.7a15.769,15.769,0,0,0,12.9-.719l18.073-9.354a15.834,15.834,0,0,1,4.06-1.44L202.6,279.56a1.144,1.144,0,0,1,2.145.742l-5.134,24.79c.47.2.934.418,1.388.662l17.772,9.585a15.765,15.765,0,0,0,13.6.656l23.534-9.9a15.82,15.82,0,0,1,2.579-.833l27.628-6.356a15.813,15.813,0,0,1,5.653-.259l27.43,3.712a15.757,15.757,0,0,1,2.887.672l26.377,8.825a15.763,15.763,0,0,0,8.063.514l25.366-5.014a15.759,15.759,0,0,1,4.618-.223l6.182.612a15.774,15.774,0,0,0,16.74-19.972l-1.886-6.7a15.834,15.834,0,0,1-.589-4.049l-.42-29.049-.368-8.356-21.7-18.444a2.013,2.013,0,0,1,2.005-3.422l19.044,7.074-.324-7.349c-.018-.418-.021-.838-.005-1.256Z" transform="translate(-48.873 -17.573)" fill="#fede3a"/>',
            '</g>',
          '</g>',
          '<text transform="translate(74 124)" fill="#f7cb15" font-size="45" font-family="Roboto-Medium, Roboto" font-weight="500"><tspan x="0" y="0">',
          mapType,
          '</tspan></text>',
          '<text transform="translate(151 168)" fill="#f7cb15" font-size="45" font-family="Roboto-Medium, Roboto" font-weight="500"><tspan x="0" y="0">Map</tspan></text>',
          '<text transform="translate(261 61)" fill="#f7cb15" font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500"><tspan x="0" y="0">range</tspan></text>',
          '<text data-name="color " transform="translate(261 82)" fill="#f7cb15" font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500"><tspan x="0" y="0">color </tspan></text>',
          '<text data-name="#B75486" transform="translate(302 83)" fill="#f7cb15" font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500"><tspan x="0" y="0">#',
          color.toColor(),
          '</tspan></text>',
          '<text data-name="0.005" transform="translate(302 63)" fill="#f7cb15" font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500"><tspan x="0" y="0">',
          range,
          '</tspan></text>',
        '</g>',
      '</svg>'
    ));

    return svg;
  }

  function tokenURI(uint256 tokenId, string memory mapType, string memory range, bytes3 color) public view returns (string memory) {

      string memory name = string(abi.encodePacked(mapType, 'Map'));
      string memory description = string(abi.encodePacked('TreasureMap #', tokenId.toString()));
      string memory image = Base64.encode(bytes(generateSVGofTokenById(mapType, range, color)));
      
      return
          string(
              abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                          abi.encodePacked(
                              '{"name":"',
                              name,
                              '", "description":"',
                              description,
                              '", "external_url":"https://minthunt.io',
                              tokenId.toString(),
                              '", "attributes": [{"trait_type": "range", "value": "',
                              range,
                              '"}, {"trait_type": "type", "value": "',
                              mapType,
                              '"}, {"trait_type": "color", "value": "',
                              color.toColor(),
                              '"}],',
                              '"image": "',
                              'data:image/svg+xml;base64,',
                              image,
                              '"}'
                          )
                        )
                    )
              )
          );
  }

}