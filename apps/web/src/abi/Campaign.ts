const CampaignABI = [
  {
    "type": "constructor",
    "inputs": [
      { "name": "_owner", "type": "address", "internalType": "address" },
      { "name": "_tokenAddress", "type": "address", "internalType": "address" },
      { "name": "_goalAmount", "type": "uint256", "internalType": "uint256" },
      { "name": "_deadline", "type": "uint256", "internalType": "uint256" },
      { "name": "_metadataURI", "type": "string", "internalType": "string" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claimFunds",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "contributions",
    "inputs": [
      { "name": "", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "deadline",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "donate",
    "inputs": [
      { "name": "_amount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "donateWithPermit",
    "inputs": [
      { "name": "_donor", "type": "address", "internalType": "address" },
      { "name": "_amount", "type": "uint256", "internalType": "uint256" },
      { "name": "_permitDeadline", "type": "uint256", "internalType": "uint256" },
      { "name": "_v", "type": "uint8", "internalType": "uint8" },
      { "name": "_r", "type": "bytes32", "internalType": "bytes32" },
      { "name": "_s", "type": "bytes32", "internalType": "bytes32" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "endCampaign",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "endedByOwner",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "fundsClaimed",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "goalAmount",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "metadataURI",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "string", "internalType": "string" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "address", "internalType": "address" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "refund",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "token",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "address", "internalType": "contract IERC20" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalDonations",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "updateMetadataURI",
    "inputs": [
      { "name": "_newMetadataURI", "type": "string", "internalType": "string" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "CampaignEnded",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Claimed",
    "inputs": [
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Donated",
    "inputs": [
      { "name": "donor", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MetadataUpdated",
    "inputs": [
      { "name": "oldMetadataURI", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "newMetadataURI", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Refunded",
    "inputs": [
      { "name": "donor", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "CampaignHasBeenEnded",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CampaignHasEnded",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CampaignNotEnded",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CampaignNotEndedByOwner",
    "inputs": []
  },
  {
    "type": "error",
    "name": "DonationMustBePositive",
    "inputs": []
  },
  {
    "type": "error",
    "name": "FundsAlreadyClaimed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "MetadataURICannotBeEmpty",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NoContributionToRefund",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotOwner",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PermitDeadlineExpired",
    "inputs": []
  },
  {
    "type": "error",
    "name": "TransferFailed",
    "inputs": []
  }
] as const;

export const campaignABI = CampaignABI; 