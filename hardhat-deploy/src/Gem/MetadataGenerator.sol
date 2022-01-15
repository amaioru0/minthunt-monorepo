// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import 'base64-sol/base64.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import './HexStrings.sol';
import './ToColor.sol';
/// @title NFTSVG
/// @notice Provides a function for generating an SVG associated with a Uniswap NFT
library MetadataGenerator {

  using Strings for uint256;
  using HexStrings for uint160;
  using ToColor for bytes3;

  function generateSVGofTokenById(uint256 tokenId, bytes3 color, bytes3 color2) internal pure returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">',
        '<path id="Path_1418" data-name="Path 1418" d="M146.247,146.247H365.754V365.754H146.247Z" transform="translate(-105.985 256) rotate(-45)" fill="',
          color.toColor(),
          '"/>',
        '<g id="gems" transform="translate(0)">',
        '<g id="Gem_28_">',
      '<g id="Group_647" data-name="Group 647">',
        '<path id="Path_1408" data-name="Path 1408" d="M512,256a14.066,14.066,0,0,1-4.5,10.5l-241,241A14.066,14.066,0,0,1,256,512l-30-83.5,30-59.7L368.8,256l55.3-30Z" fill="#',
         color2.toColor(),
        '"/>',
        '<path id="Path_1409" data-name="Path 1409" d="M256,0l30,83.5-30,59.7L143.2,256,73.773,286,0,256a14.066,14.066,0,0,1,4.5-10.5l241-241A14.066,14.066,0,0,1,256,0Z" fill="#',
         color2.toColor(),
        '"/>',
      '</g>',
    '</g>',
    '<g id="asd" data-name="asd" transform="translate(0)">',
      '<path id="Path_1410" data-name="Path 1410" d="M256,368.8V512a14.066,14.066,0,0,1-10.5-4.5l-241-241A14.066,14.066,0,0,1,0,256H143.2Z" transform="translate(0)" fill="#',
         color2.toColor(),
      '"/>',
      '<path id="Path_1411" data-name="Path 1411" d="M512,256H368.8L256,143.2V0a14.066,14.066,0,0,1,10.5,4.5l241,241A14.066,14.066,0,0,1,512,256Z" transform="translate(0)" fill="#',
        color2.toColor(),
      '"/>',
    '</g>',
  '</g>',
'</svg>'
    ));

    return svg;
  }

  function tokenURI(address owner, uint256 tokenId, bytes3 color, bytes3 color2, uint256 suffix, string[] memory suffixes) internal pure returns (string memory) {

      string memory name = string(abi.encodePacked('Gem ', suffixes[suffix]));
      string memory description = string(abi.encodePacked('Gem #', tokenId.toString()));
      string memory image = Base64.encode(bytes(generateSVGofTokenById(tokenId, color, color2)));
      
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
                              '", "external_url":"https://treasurehuntnft.com/gem/',
                              tokenId.toString(),
                              '", "attributes": [{"trait_type": "color", "value": "#',
                              color.toColor(),
                              '"}, {"trait_type": "color2", "value": "#',
                              color2.toColor(),
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

  function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
      if (_i == 0) {
          return "0";
      }
      uint j = _i;
      uint len;
      while (j != 0) {
          len++;
          j /= 10;
      }
      bytes memory bstr = new bytes(len);
      uint k = len;
      while (_i != 0) {
          k = k-1;
          uint8 temp = (48 + uint8(_i - _i / 10 * 10));
          bytes1 b1 = bytes1(temp);
          bstr[k] = b1;
          _i /= 10;
      }
      return string(bstr);
  }

}
