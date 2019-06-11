var MLabValidators = MLabValidators || {

    isEc2SecurityGroupId: function(id) {
      var value = id.trim();

      if (value.indexOf("sg-") === 0) {
        var hex = value.substring(3);
        if (hex.length < 8) {
          return null;
        }
        if (hex.search(/^[0-9a-f]*$/) !== 0) {
          return null;
        }
      } else {
        return null;
      }
      return value;
    },

    parseSixteen: function(ip) {
      if(!ip.endsWith("/16")) {
        return null;
      }

      return ip;
    },


    parseCIDR: function(ip) {
      if(ip === null) {
        return null;
      }

      var match = MLabValidators.getCidrRegexMatch(ip);
      if(match) {
        // validate IP address
        for(var i = 1; i <= 4; i++) {
          var n = parseInt(match[i]);
          if(n < 0 || n > 255) {
            return null;
          }
        }

        return ip;
      }
      return null;
    },

    isBaseAddress: function(value) {
      // N.B.: only works for IPv4 addresses.
      var ip = MLabValidators.parseCIDR(value);
      if (ip === null) {
        return null;
      }
      var baseAddress = MLabValidators.getBaseAddressCidrBlock(value);
      return ip.localeCompare(baseAddress) === 0;
    },

    getBaseAddressCidrBlock: function(value) {
      // N.B.: only works for IPv4 addresses.
      var ip = MLabValidators.parseCIDR(value);
      if (ip === null) {
        return null;
      }
      var match = MLabValidators.getCidrRegexMatch(ip);

      var addressValue = 0;
      for (var i = 1; i <= 4; i++) {
        var n = parseInt(match[i]);
        addressValue <<= 8;
        addressValue += n;
      }

      // Apply bitmask to the address.
      // Read more about CIDR blocks here: https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_blocks
      var maskLength = parseInt(match[5]);
      var bitMask = 0;
      for (var i = 0; i < maskLength; i++) {
        bitMask <<= 1;
        bitMask++;
      }
      bitMask <<= 32 - maskLength;
      var baseAddressValue = addressValue & bitMask;

      var baseAddress = "";
      for (var i = 0; i < 4; i++) {
        // Get each octet of the address and add it to the head of the string.
        var octetValue = baseAddressValue & 0xFF;
        var baseAddressOctet = (i === 0) ? octetValue.toString() + "/" : octetValue.toString() + ".";
        baseAddress = baseAddressOctet + baseAddress;
        baseAddressValue >>>= 8;
      }

      baseAddress += maskLength;
      return baseAddress;
    },

    cidrBlockIsPubliclyRoutable: function(value) {
      // N.B.: only works for IPv4 addresses.
      var ip = MLabValidators.parseCIDR(value);
      if (ip === null) {
        return null;
      }

      var privateCidrBlocks = [
        "10.0.0.0/8",
        "172.16.0.0/12",
        "192.168.0.0/16"
      ];

      for (var i = 0; i < privateCidrBlocks.length; i++) {
        var privateCidrBlock = privateCidrBlocks[i];
        if (MLabValidators.compareCidrBlockSizes(ip, privateCidrBlock) < 0) {
          // Provided CIDR block is larger than the current private CIDR block, so it can't
          // be entirely part of this private CIDR block.
          continue;
        }

        if (MLabValidators.cidrBlockIsSubnet(ip, privateCidrBlock)) {
          return false;
        }
      }
      return true;
    },

    cidrBlockIsSubnet: function(providedCidrBlock, networkCidrBlock) {
      // N.B.: Only works on IPv4. Assumes values of the following form: "w.x.y.z/n"
      //       (e.g. results from MLabValidators.parseCIDR)
      var providedMatch = MLabValidators.getCidrRegexMatch(providedCidrBlock);
      var selectedNetworkMatch = MLabValidators.getCidrRegexMatch(networkCidrBlock);

      // Provided CIDR block range is larger than the selected network.
      if (MLabValidators.compareCidrBlockSizes(providedCidrBlock, networkCidrBlock) < 0) {
        return false;
      }
      var networkSizedProvidedCidrBlock = providedMatch[1] + "." + providedMatch[2] + "." + providedMatch[3] + "." + providedMatch[4] + "/" + selectedNetworkMatch[5];
      var compareVal = MLabValidators.getBaseAddressCidrBlock(networkSizedProvidedCidrBlock).localeCompare(networkCidrBlock);
      return compareVal === 0;
    },

    compareCidrBlockSizes: function(first, second) {
      // N.B.: Only works on IPv4. Assumes values of the following form: "w.x.y.z/n"
      //       (e.g. results from MLabValidators.parseCIDR)
      var firstMatch = MLabValidators.getCidrRegexMatch(first);
      var secondMatch = MLabValidators.getCidrRegexMatch(second);
      var firstMaskSize = parseInt(firstMatch[5]);
      var secondMaskSize = parseInt(secondMatch[5]);

      // returns negative if first CIDR block contains more addresses,
      //         positive if second CIDR block contains more addresses,
      //         0 if they contain the same amount of addresses.
      return firstMaskSize - secondMaskSize;
    },

    getCidrRegexMatch: function(cidr) {
      var CIDR_REGEX = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,3})$/;
      return CIDR_REGEX.exec(cidr);
    }
};

$(document).ready(function() {

  $.validator.addMethod("ec2SecurityGroup",
    function(value, element) {
      if (value === null) {
        return null;
      }

      value = value.trim();

      if (value.indexOf("sg-") === 0) {
        return MLabValidators.isEc2SecurityGroupId(value);
      }

      return value;
    },
    "Invalid EC2 Security Group");

  $.validator.addMethod("ec2SecurityGroupId",
    function(value, element) {
      if (value === null) {
        return null;
      }
      return MLabValidators.isEc2SecurityGroupId(value);
    },
    "Invalid EC2 Security Group ID (e.g. sg-XXXXXXXX");


  $.validator.addMethod("ec2AccountId",
    function(value, element) {
      value = value.replace(/-/g, "");

      if(value.length !== 12) {
        return null;
      }
      try {
        parseInt(value);
      } catch(err) {
        return null;
      }

      return value;
    },
    "Invalid AWS Account ID");


  $.validator.addMethod("ec2VpcId",
    function(value, element) {
      var parts = value.split('-');
      var type = parts[0];
      var id = parts[1] || '';
      return (type === 'vpc' && (id.length === 8 || id.length === 17)) ? value : null;
    },
    "Invalid VPC ID");

  // CIDR block validators

  $.validator.addMethod("cidr",
    function(value, element) {
      return MLabValidators.parseCIDR(value.trim());
    },
    "Invalid format. Must be expressed as a /16 IPv4 CIDR block.");

  $.validator.addMethod("sixteen",
    function(value, element) {
      return MLabValidators.parseSixteen(value.trim());
    },
    "Not a /16 range");

  $.validator.addMethod("baseAddress",
    function(value, element) {
      return MLabValidators.isBaseAddress(value.trim());
    },
    function(value, element){
      return 'Address must be base address of CIDR block range. Did you mean "' + MLabValidators.getBaseAddressCidrBlock(element.value) + '"?';
    });

  $.validator.addMethod("privateCidr",
    function(value, element) {
      return !MLabValidators.cidrBlockIsPubliclyRoutable(value.trim());
    },
    "Not a subspace of the <a target=\"_blank\" href=\"https://tools.ietf.org/html/rfc1918#section-3\">RFC 1918</a> IPv4 private address space.");
});