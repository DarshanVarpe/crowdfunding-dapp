// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// --- THIS IS THE FIX: Changed the import statement ---
import "./Crowdfunding.sol";

contract CrowdfundingFactory {
    address public owner;
    bool public paused;

    struct Campaign {
        address campaignAddress;
        address owner;
        string name;
        uint256 creationTime;
    }

    Campaign[] public campaigns;
    mapping(address => Campaign[]) public userCampaigns;

    error Factory__NotOwner();
    error Factory__Paused();

    event CampaignCreated(
        address indexed campaignAddress,
        address indexed owner,
        string name,
        uint256 goal,
        uint256 deadline
    );

    constructor() {
        owner = msg.sender;
    }

    function createCampaign(
        string memory _name,
        string memory _description,
        uint256 _goal,
        uint256 _durationInDays
    ) external {
        if (paused) {
            revert Factory__Paused();
        }
        
        Crowdfunding newCampaign = new Crowdfunding(
            msg.sender,
            _name,
            _description,
            _goal,
            _durationInDays
        );
        address campaignAddress = address(newCampaign);

        Campaign memory campaign = Campaign({
            campaignAddress: campaignAddress,
            owner: msg.sender,
            name: _name,
            creationTime: block.timestamp
        });

        campaigns.push(campaign);
        userCampaigns[msg.sender].push(campaign);
        
        emit CampaignCreated(
            campaignAddress,
            msg.sender,
            _name,
            _goal,
            newCampaign.deadline()
        );
    }

    function getUserCampaigns(address _user) external view returns (Campaign[] memory) {
        return userCampaigns[_user];
    }

    function getAllCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }

    function togglePause() external {
        if (msg.sender != owner) {
            revert Factory__NotOwner();
        }
        paused = !paused;
    }
}