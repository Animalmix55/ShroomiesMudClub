// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

/* ---------------------------------------------------------------------------------------- */
/* Author: Cory Cherven                                                                     */
/* Twitter: @animalmix55                                                                    */
/* Note: The objective is always to improve web3. If you see something you like, please use */
/*       it for your project. Keep web3 open source, always use an MIT license.             */
/* ---------------------------------------------------------------------------------------- */

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
    /**
     * A mapping of batch identifiers to the number minted inside them.
     */
    mapping(string => uint16) public mintedInBatch;
    /**
     * A mapping of secondary collection NFTs that have already
     * been utilized to mint the main collection.
     */
    mapping(uint16 => bool) public isSpent;

    // ---------------------- WHITELIST VARIABLES -------------------------

    struct WhitelistMinted {
        uint16 mainCollection;
        uint16 secondaryCollection;
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
         * The minters in this whitelisted mint
         * mapped to the number minted.
         * @dev ONLY INCLUDES user whitelist mints, not
         *      batch or secondary whitelist mints.
         */
        mapping(address => WhitelistMinted) userMinted;
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
    function updateWhitelistMint(uint256 _startDate, uint256 _endDate)
        public
        onlyOwner
    {
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
    function updatePublicMint(uint16 _maxPerTransaction, uint256 _startDate)
        public
        onlyOwner
    {
        publicMint.maxPerTransaction = _maxPerTransaction;
        publicMint.startDate = _startDate;
    }

    /**
     * Allows the owner of the contract to update the mint price
     * @dev onlyOwner
     */
    function updateMintPrice(uint256 _price) public onlyOwner {
        mintPrice = _price;
    }

    /**
     * Updates the current active mint, whether secondary (false) or main (true).
     * @dev onlyOwner
     */
    function updateMainCollectionMinting(bool _mainCollectionMinting)
        public
        onlyOwner
    {
        mainCollectionMinting = _mainCollectionMinting;
    }

    /**
     * Updates all of the information needed for switching sub collections.
     * @dev onlyOwner
     * @param _publicMaxPerTransaction - the public transaction max.
     * @param _publicStartDate - the public start date in unix seconds.
     * @param _wlStartDate - the whitelist start date in unix seconds.
     * @param _wlEndDate - the end date of the whitelist in unix seconds.
     * @param _price - the price of the mint.
     * @param _mainCollectionMinting - a bool indicating if the main collection or secondary is minting.
     */
    function batchMintUpdate(
        uint16 _publicMaxPerTransaction,
        uint256 _publicStartDate,
        uint256 _wlStartDate,
        uint256 _wlEndDate,
        uint256 _price,
        bool _mainCollectionMinting
    ) external onlyOwner {
        updateMintPrice(_price);
        updatePublicMint(_publicMaxPerTransaction, _publicStartDate);
        updateWhitelistMint(_wlStartDate, _wlEndDate);
        updateMainCollectionMinting(_mainCollectionMinting);
    }

    /**
     * A helpful owner-only function to allow minting to specific wallets in bulk.
     * @param _amounts - an array of mint amounts
     * @param _addresses - a parallel array to _amounts containing target addresses for each amount.
     * @param _mainCollection - indicated if the mint is on the main collection (true) or secondary (false).
     */
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
            localMinted += _amounts[i];
            transactionQuantity += _amounts[i];
            require(transactionQuantity <= remaining, "Supply overflow");

            // DISTRIBUTE THE TOKENS
            for (uint16 j = 1; j <= _amounts[i]; j++) {
                _mint(_addresses[i], lastMinted + j);
            }

            lastMinted += _amounts[i];
        }

        totalSupply += transactionQuantity;
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
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        if (tokenId >= maxSupply - mainCollectionSize + 1)
            return
                bytes(mainBaseURI).length > 0
                    ? string(abi.encodePacked(mainBaseURI, tokenId.toString()))
                    : "";
        return
            bytes(secondaryBaseURI).length > 0
                ? string(abi.encodePacked(secondaryBaseURI, tokenId.toString()))
                : "";
    }

    /**
     * Gets the number of mints using the userWhitelistMint function on each
     * (main and secondary) whitelists already completed.
     * @param _user - the user about which to query mints.
     */
    function getUserWhitelistMints(address _user)
        external
        view
        returns (uint16 main, uint16 secondary)
    {
        main = whitelistMint.userMinted[_user].mainCollection;
        secondary = whitelistMint.userMinted[_user].secondaryCollection;
    }

    /**
     * Gets a hash to sign for preminting.
     * @param _minter - the minter for the desired mint.
     * @param _quantity - the quantity to mint.
     * @param _mainCollection - if the mint will be main (true) or secondary (false).
     * @param _nonce - the nonce to use for this transaction (> last).
     */
    function getUserWhitelistHash(
        address _minter,
        uint16 _quantity,
        bool _mainCollection,
        uint16 _nonce
    ) external pure returns (bytes32) {
        return
            VerifySignature.getMessageHash(
                abi.encodePacked(_minter, _quantity, _mainCollection, _nonce)
            );
    }

    /**
     * Gets a hash to participate in a whitelist batch mint.
     * @param _minter - the minter for the desired mint.
     * @param _mainCollection - if the mint will be main (true) or secondary (false).
     * @param _batch - an identifier for the target batch to mint into.
     * @param _batchSize - the max size of a given batch.
     */
    function getWhitelistPasswordHash(
        address _minter,
        string calldata _batch,
        bool _mainCollection,
        uint16 _batchSize,
        uint256 _validUntil
    ) external pure returns (bytes32) {
        return
            VerifySignature.getMessageHash(
                abi.encodePacked(_minter, _batch, _mainCollection, _batchSize, _validUntil)
            );
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
    function userWhitelistMint(
        uint16 _quantity,
        bool _mainCollection,
        uint16 _nonce,
        bytes calldata _signature
    ) public payable nonReentrant {
        require(
            VerifySignature.verify(
                mintSigner,
                abi.encodePacked(
                    msg.sender,
                    _quantity,
                    _mainCollection,
                    _nonce
                ),
                _signature
            ),
            "Invalid sig"
        );
        require(mintPrice * _quantity == msg.value, "Bad value");
        require(mainCollectionMinting == _mainCollection, "Not minting col.");
        require(lastMintNonce[msg.sender] < _nonce, "Nonce used");
        require(
            whitelistMint.startDate <= block.timestamp &&
                whitelistMint.endDate >= block.timestamp,
            "No mint"
        );

        lastMintNonce[msg.sender] = _nonce; // update nonce

        if (_mainCollection) whitelistMint.userMinted[msg.sender].mainCollection += _quantity;
        else whitelistMint.userMinted[msg.sender].secondaryCollection += _quantity;

        _mint(msg.sender, _quantity, _mainCollection);
    }

    /**
     * Mints in the premint stage by using a signed transaction from a centralized whitelist.
     * The message signer is expected to only sign messages when they fall within the whitelist
     * specifications.
     *
     * @param _quantity - the number to mint
     * @param _mainCollection - true if minting the main collection, false otherwise (secondary).
     * @param _batch - the batch identifier for the given mint.
     * @param _signature - the signature given by the centralized whitelist authority, signed by
     *                    the account specified as mintSigner.
     */
    function batchWhitelistMint(
        uint16 _quantity,
        bool _mainCollection,
        string calldata _batch,
        uint16 _batchSize,
        uint256 _validUntil,
        bytes calldata _signature
    ) public payable nonReentrant {
        require(mintPrice * _quantity == msg.value, "Bad value");
        require(mintedInBatch[_batch] + _quantity <= _batchSize, "batch full");
        require(_validUntil >= block.timestamp, "Tx expired");
        require(
            VerifySignature.verify(
                mintSigner,
                abi.encodePacked(
                    msg.sender,
                    _batch,
                    _mainCollection,
                    _batchSize,
                    _validUntil
                ),
                _signature
            ),
            "Invalid sig"
        );
        require(mainCollectionMinting == _mainCollection, "Not minting col.");
        require(
            whitelistMint.startDate <= block.timestamp &&
                whitelistMint.endDate >= block.timestamp,
            "No mint"
        );
        mintedInBatch[_batch] += _quantity;

        _mint(msg.sender, _quantity, _mainCollection);
    }

    /**
     * Allows holders of unspent secondary NFTs to mint the main collection in whitelist.
     * @param heldIds - the ids of secondary collection NFTs to "spend" to use to mint
     *                  on the main collection. Does not do anything (like burn) secondary NFTs.
     */
    function secondaryHolderWhitelistMint(uint16[] calldata heldIds) external payable nonReentrant {
        require(mintPrice * heldIds.length == msg.value, "Bad value");
        require(mainCollectionMinting, "Not main");
        require(
            whitelistMint.startDate <= block.timestamp &&
                whitelistMint.endDate >= block.timestamp,
            "No mint"
        );

        for (uint16 i; i < heldIds.length; i++) {
            require(heldIds[i] <= maxSupply - mainCollectionSize, "not secondary");
            require(ownerOf(heldIds[i]) == msg.sender, "not owner");
            require(!isSpent[heldIds[i]], "id spent");

            isSpent[heldIds[i]] = true;
        }

        _mint(msg.sender, uint16(heldIds.length), true);
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
        require(block.timestamp >= publicMint.startDate, "No mint");
        require(_quantity <= publicMint.maxPerTransaction, "Exceeds max");
        require(_quantity * mintPrice == msg.value, "Invalid value");

        _mint(msg.sender, _quantity, mainCollectionMinting);
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

    // ---------------------------- INTERNAL FUNCTIONS --------------------------------

    function _mint(
        address _user,
        uint16 _quantity,
        bool _mainMint
    ) internal {
        require(_quantity >= 1, "Zero mint");

        uint16 remaining;
        uint16 lastMinted;
        if (_mainMint) {
            lastMinted = (maxSupply - mainCollectionSize) + mainMinted;
            remaining = mainCollectionSize - mainMinted;
            mainMinted += _quantity;
        } else {
            lastMinted = secondaryMinted;
            remaining = maxSupply - mainCollectionSize - secondaryMinted;
            secondaryMinted += _quantity;
        }

        require(remaining > 0, "Mint over");
        require(_quantity <= remaining, "Not enough");

        // DISTRIBUTE THE TOKENS
        totalSupply += _quantity;

        for (uint16 i = 1; i <= _quantity; i++) {
            _safeMint(_user, lastMinted + i);
        }
    }
}
