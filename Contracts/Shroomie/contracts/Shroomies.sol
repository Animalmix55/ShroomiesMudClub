// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Signer.sol";

contract Shroomies is ERC721, Ownable, ReentrancyGuard {
    using Strings for uint256;
    /**
    * To please Etherscan, 
    * totalSupply is actually the current supply.
    * @dev reduces when tokens are burnt
    */
    uint256 public totalSupply;
    /**
     * The maximum supply to be minted, after which
     * mints will be cut off. Collection-wide.
     * @dev constant
     */
    uint16 public maxSupply;
    /**
     * The size of the main collection.
     * @dev the size of the secondary collection is maxSupply - mainCollectionSize
     */
    uint16 public mainCollectionSize;
    /**
     * The number minted in the secondary collection.
     * @dev only ever increases.
     */
    uint16 public secondaryMinted;
    /**
     * The number minted in the main collection.
     * @dev only ever increases.
     */
    uint16 public mainMinted;
    /**
     * The cost to mint in the current mint.
     */
    uint256 public mintPrice;
    /**
     * The base URI for the main collection.
     */
    string private mainBaseURI;
    /**
     * The base URI for the secondary (not main) collection.
     */
    string private secondaryBaseURI;
    /**
     * Indicates if the main collection is currently minting.
     */
    bool public mainCollectionMinting;
    /**
     * The signing address for cryptographic verification on whitelists.
     */
    address private mintSigner;
    /**
     * The last nonce used to sign a whitelist mint transaction.
     */
    mapping(address => uint16) public lastMintNonce;

    // ---------------------- WHITELIST VARIABLES -------------------------

    struct WhitelistMinted {
        uint256 mainCollection;
        uint256 secondaryCollection;
    }

    struct WhitelistedMint {
        /**
         * The start date in unix seconds
         */
        uint256 startDate;
        /**
         * The end date in unix seconds
         */
        uint256 endDate;
        /**
         * The total number of tokens minted in this whitelist
         */
        uint16 totalMinted;
        /**
         * The minters in this whitelisted mint
         * mapped to the number minted
         */
        mapping(address => WhitelistMinted) minted;
    }

    /**
     * An exclusive mint for members granted
     * presale from influencers
     */
    WhitelistedMint public whitelistMint;

    // ---------------------- PUBLIC SALE VARIABLES -------------------------

    struct PublicMint {
        /**
         * The start date in unix seconds
         */
        uint256 startDate;
        /**
         * The maximum per transaction
         */
        uint16 maxPerTransaction;
    }

    /**
     * The public mint for everybody.
     */
    PublicMint public publicMint;

    // ---------------------- CONSTRUCTOR -------------------------

    constructor(
        uint16 _maxSupply,
        uint16 _mainCollectionSupply,
        uint16 _publicTransactionMax,
        uint256 _mintPrice,
        address _signer,
        uint256 _whitelistStart,
        uint256 _whitelistEnd,
        uint256 _publicStart
    ) ERC721("Shroomies Mud Club", "SMC") {
        require(_maxSupply > 0, "Zero supply");

        maxSupply = _maxSupply;
        mainCollectionSize = _mainCollectionSupply;
        mintPrice = _mintPrice;

        mintSigner = _signer;

        whitelistMint.startDate = _whitelistStart;
        whitelistMint.endDate = _whitelistEnd;

        PublicMint memory pMint;
        pMint.startDate = _publicStart;
        pMint.maxPerTransaction = _publicTransactionMax;

        publicMint = pMint;
    }

    // ---------------------- EXTERNAL/PUBLIC METHODS -------------------------

    // ---------- OWNER ONLY -----------

    /**
     * Sets the base URI for all main collection tokens
     *
     * @dev be sure to terminate with a slash. onlyOwner.
     * @param _uri - the target base uri (ex: 'https://google.com/')
     */
    function setMainBaseURI(string calldata _uri) external onlyOwner {
        mainBaseURI = _uri;
    }

    /**
     * Sets the base URI for all secondary collection tokens
     *
     * @dev be sure to terminate with a slash. onlyOwner.
     * @param _uri - the target base uri (ex: 'https://google.com/')
     */
    function setSecondaryBaseURI(string calldata _uri) external onlyOwner {
        secondaryBaseURI = _uri;
    }

     /**
     * Allows the contract owner to update the signer used for presale mints.
     * @param _signer the signer's address
     * @dev onlyOwner
     */
    function setSigner(address _signer) external onlyOwner {
        mintSigner = _signer;
    }

    /**
     * Updates the whitelist mint's characteristics
     *
     * @param _startDate - the start date for that mint in UNIX seconds
     * @param _endDate - the end date for that mint in UNIX seconds
     * @dev onlyOwner
     */
    function updateWhitelistMint(
        uint256 _startDate,
        uint256 _endDate
    ) public onlyOwner {
        whitelistMint.startDate = _startDate;
        whitelistMint.endDate = _endDate;
    }

    /**
     * Updates the public mint's characteristics
     *
     * @param _maxPerTransaction - the maximum amount allowed in a wallet to mint in the public mint
     * @param _startDate - the start date for that mint in UNIX seconds
     * @dev onlyOwner
     */
    function updatePublicMint(
        uint16 _maxPerTransaction,
        uint256 _startDate
    ) public onlyOwner {
        publicMint.maxPerTransaction = _maxPerTransaction;
        publicMint.startDate = _startDate;
    }

    /** 
    * Allows the owner of the contract to update the mint price
    * @dev onlyOwner
    */
    function updateMintPrice(
        uint256 _price
    ) public onlyOwner {
        mintPrice = _price;
    }

    function batchMintUpdate(
        uint16 _publicMaxPerTransaction,
        uint256 _publicStartDate,
        uint256 _wlStartDate,
        uint256 _wlEndDate,
        uint256 _price
    ) external onlyOwner {
        updateMintPrice(_price);
        updatePublicMint(_publicMaxPerTransaction, _publicStartDate);
        updateWhitelistMint(_wlStartDate, _wlEndDate);
    }

    function ownerMintTo(
        uint16[] calldata _amounts,
        address[] calldata _addresses,
        bool _mainCollection
    ) public onlyOwner nonReentrant {
        require(_amounts.length == _addresses.length, "Length mismatch");

        uint16 transactionQuantity;
        uint16 remaining;
        uint16 lastMinted;
        uint16 localMinted;
        if (_mainCollection) {
            lastMinted = (maxSupply - mainCollectionSize) + mainMinted;
            remaining = mainCollectionSize - mainMinted;
            localMinted = mainMinted;
        } else {
            lastMinted = secondaryMinted;
            remaining = maxSupply - mainCollectionSize - lastMinted;
            localMinted = lastMinted;
        }
        
        for (uint16 i; i < _amounts.length; i++) {
            uint16 amount = _amounts[i];
            address target = _addresses[i];

            localMinted += amount;
            transactionQuantity += amount;
            require(transactionQuantity <= remaining, "Supply overflow");

            // DISTRIBUTE THE TOKENS
            for (uint16 j = 1; j <= amount; j++) {
                _mint(target, lastMinted + j);
            }
        }

        if (_mainCollection) mainMinted = localMinted;
        else secondaryMinted = localMinted;
    }

    // ---------- PUBLICALLY OPEN -----------

    /**
     * Burns the provided token id if you own it.
     * Reduces the supply by 1.
     *
     * @param _tokenId - the ID of the token to be burned.
     */
    function burn(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender, "You do not own this token");

        totalSupply--;
        _burn(_tokenId);
    }

    /**
     * Retreives the URI for the given token. The main and secondary collections have different base URIs.
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        uint256 mainCollectionStart = maxSupply - mainCollectionSize + 1;
        if (tokenId >= mainCollectionStart) return bytes(mainBaseURI).length > 0 ? string(abi.encodePacked(mainBaseURI, tokenId.toString())) : "";
        return bytes(secondaryBaseURI).length > 0 ? string(abi.encodePacked(secondaryBaseURI, tokenId.toString())) : "";
    }

    function getWhitelistMints(address _user)
        external
        view
        returns (WhitelistMinted memory)
    {
        return whitelistMint.minted[_user];
    }

    function getPremintHash(
        address _minter,
        uint16 _quantity,
        bool _mainCollection,
        uint16 _nonce
    ) public pure returns (bytes32) {
        return
            VerifySignature.getMessageHash(_minter, _quantity, _mainCollection, _nonce);
    }

    /**
     * Mints in the premint stage by using a signed transaction from a centralized whitelist.
     * The message signer is expected to only sign messages when they fall within the whitelist
     * specifications.
     *
     * @param _quantity - the number to mint
     * @param _mainCollection - true if minting the main collection, false otherwise (secondary).
     * @param _nonce - a random nonce which indicates that a signed transaction hasn't already been used.
     * @param _signature - the signature given by the centralized whitelist authority, signed by
     *                    the account specified as mintSigner.
     */
    function premint(
        uint16 _quantity,
        bool _mainCollection,
        uint16 _nonce,
        bytes calldata _signature
    ) public payable nonReentrant {
        require(
            VerifySignature.verify(
                mintSigner,
                msg.sender,
                _quantity,
                _mainCollection,
                _nonce,
                _signature
            ),
            "Invalid sig"
        );
        require(mainCollectionMinting || !_mainCollection, "Not minting col.");
        require(_quantity >= 1, "Zero mint");
        require(lastMintNonce[msg.sender] < _nonce, "Nonce used");
        require(
            whitelistMint.startDate <= block.timestamp &&
                whitelistMint.endDate >= block.timestamp,
            "No mint"
        );
        require(mintPrice * _quantity == msg.value, "Bad value");

        uint16 remaining;
        uint16 lastMinted;
        if (_mainCollection) {
            lastMinted = (maxSupply - mainCollectionSize) + mainMinted;
            remaining = mainCollectionSize - mainMinted;
            mainMinted += _quantity;
            whitelistMint.minted[msg.sender].mainCollection += _quantity;
        } else {
            lastMinted = secondaryMinted;
            remaining = maxSupply - mainCollectionSize - secondaryMinted;
            secondaryMinted += _quantity;
            whitelistMint.minted[msg.sender].secondaryCollection += _quantity;
        }
        
        require(remaining > 0, "Mint over");
        require(_quantity <= remaining, "Not enough");

        totalSupply += _quantity;
        whitelistMint.totalMinted += _quantity;
        lastMintNonce[msg.sender] = _nonce; // update nonce

        // DISTRIBUTE THE TOKENS
        for (uint16 i = 1; i <= _quantity; i++) {
            _safeMint(msg.sender, lastMinted + i);
        }
    }

    /**
     * Mints the given quantity of tokens provided it is possible to.
     *
     * @notice This function allows minting in the public sale
     *         or at any time for the owner of the contract.
     *
     * @param _quantity - the number of tokens to mint
     */
    function mint(uint16 _quantity) public payable nonReentrant {
        uint16 remaining;
        uint16 lastMinted;
        if (mainCollectionMinting) {
            lastMinted = (maxSupply - mainCollectionSize) + mainMinted;
            remaining = mainCollectionSize - mainMinted;
            mainMinted += _quantity;
        } else {
            lastMinted = secondaryMinted;
            remaining = maxSupply - mainCollectionSize - secondaryMinted;
            secondaryMinted += _quantity;
        }

        require(remaining > 0, "Mint over");
        require(_quantity >= 1, "Zero mint");
        require(_quantity <= remaining, "Not enough");
        require(block.timestamp >= publicMint.startDate, "No mint");
        require(_quantity <= publicMint.maxPerTransaction, "Exceeds max");
        require(
            _quantity * mintPrice == msg.value,
            "Invalid value"
        );

        // DISTRIBUTE THE TOKENS
        totalSupply += _quantity;

        for (uint16 i = 1; i <= _quantity; i++) {
            _safeMint(msg.sender, lastMinted + i);
        }
    }

    /**
     * Withdraws balance from the contract to the owner (sender).
     * @param _amount - the amount to withdraw, much be <= contract balance.
     */
    function withdraw(uint256 _amount) external onlyOwner {
        require(address(this).balance >= _amount, "Invalid amt");

        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Trans failed");
    }

    /**
     * The receive function, does nothing
     */
    receive() external payable {
        // NOTHING TO SEE HERE...
    }
}
