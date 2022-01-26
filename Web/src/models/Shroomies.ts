/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { ContractOptions } from "web3-eth-contract";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type Approval = ContractEventLog<{
  owner: string;
  approved: string;
  tokenId: string;
  0: string;
  1: string;
  2: string;
}>;
export type ApprovalForAll = ContractEventLog<{
  owner: string;
  operator: string;
  approved: boolean;
  0: string;
  1: string;
  2: boolean;
}>;
export type OwnershipTransferred = ContractEventLog<{
  previousOwner: string;
  newOwner: string;
  0: string;
  1: string;
}>;
export type Transfer = ContractEventLog<{
  from: string;
  to: string;
  tokenId: string;
  0: string;
  1: string;
  2: string;
}>;

export interface Shroomies extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): Shroomies;
  clone(): Shroomies;
  methods: {
    /**
     * See {IERC721-approve}.
     */
    approve(
      to: string,
      tokenId: number | string | BN
    ): NonPayableTransactionObject<void>;

    /**
     * See {IERC721-balanceOf}.
     */
    balanceOf(owner: string): NonPayableTransactionObject<string>;

    /**
     * See {IERC721-getApproved}.
     */
    getApproved(
      tokenId: number | string | BN
    ): NonPayableTransactionObject<string>;

    /**
     * See {IERC721-isApprovedForAll}.
     */
    isApprovedForAll(
      owner: string,
      operator: string
    ): NonPayableTransactionObject<boolean>;

    /**
     * The last nonce used to sign a whitelist mint transaction.
     */
    lastMintNonce(arg0: string): NonPayableTransactionObject<string>;

    /**
     * Indicates if the main collection is currently minting.
     */
    mainCollectionMinting(): NonPayableTransactionObject<boolean>;

    /**
     * The size of the main collection.
     */
    mainCollectionSize(): NonPayableTransactionObject<string>;

    /**
     * The number minted in the main collection.
     */
    mainMinted(): NonPayableTransactionObject<string>;

    /**
     * The maximum supply to be minted, after which mints will be cut off. Collection-wide.
     */
    maxSupply(): NonPayableTransactionObject<string>;

    /**
     * The cost to mint in the current mint.
     */
    mintPrice(): NonPayableTransactionObject<string>;

    /**
     * See {IERC721Metadata-name}.
     */
    name(): NonPayableTransactionObject<string>;

    /**
     * Returns the address of the current owner.
     */
    owner(): NonPayableTransactionObject<string>;

    /**
     * See {IERC721-ownerOf}.
     */
    ownerOf(tokenId: number | string | BN): NonPayableTransactionObject<string>;

    /**
     * The public mint for everybody.
     */
    publicMint(): NonPayableTransactionObject<{
      startDate: string;
      maxPerTransaction: string;
      0: string;
      1: string;
    }>;

    /**
     * Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.
     */
    renounceOwnership(): NonPayableTransactionObject<void>;

    /**
     * See {IERC721-safeTransferFrom}.
     */
    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: number | string | BN
    ): NonPayableTransactionObject<void>;

    /**
     * See {IERC721-safeTransferFrom}.
     */
    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: number | string | BN,
      _data: string | number[]
    ): NonPayableTransactionObject<void>;

    /**
     * The number minted in the secondary collection.
     */
    secondaryMinted(): NonPayableTransactionObject<string>;

    /**
     * See {IERC721-setApprovalForAll}.
     */
    setApprovalForAll(
      operator: string,
      approved: boolean
    ): NonPayableTransactionObject<void>;

    /**
     * See {IERC165-supportsInterface}.
     */
    supportsInterface(
      interfaceId: string | number[]
    ): NonPayableTransactionObject<boolean>;

    /**
     * See {IERC721Metadata-symbol}.
     */
    symbol(): NonPayableTransactionObject<string>;

    /**
     * To please Etherscan,  totalSupply is actually the current supply.
     */
    totalSupply(): NonPayableTransactionObject<string>;

    /**
     * See {IERC721-transferFrom}.
     */
    transferFrom(
      from: string,
      to: string,
      tokenId: number | string | BN
    ): NonPayableTransactionObject<void>;

    /**
     * Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.
     */
    transferOwnership(newOwner: string): NonPayableTransactionObject<void>;

    /**
     * An exclusive mint for members granted presale from influencers
     */
    whitelistMint(): NonPayableTransactionObject<{
      startDate: string;
      endDate: string;
      totalMinted: string;
      0: string;
      1: string;
      2: string;
    }>;

    /**
     * be sure to terminate with a slash. onlyOwner.
     * Sets the base URI for all main collection tokens
     * @param _uri - the target base uri (ex: 'https://google.com/')
     */
    setMainBaseURI(_uri: string): NonPayableTransactionObject<void>;

    /**
     * be sure to terminate with a slash. onlyOwner.
     * Sets the base URI for all secondary collection tokens
     * @param _uri - the target base uri (ex: 'https://google.com/')
     */
    setSecondaryBaseURI(_uri: string): NonPayableTransactionObject<void>;

    /**
     * onlyOwner
     * Allows the contract owner to update the signer used for presale mints.
     * @param _signer the signer's address
     */
    setSigner(_signer: string): NonPayableTransactionObject<void>;

    /**
     * onlyOwner
     * Updates the whitelist mint's characteristics
     * @param _endDate - the end date for that mint in UNIX seconds
     * @param _startDate - the start date for that mint in UNIX seconds
     */
    updateWhitelistMint(
      _startDate: number | string | BN,
      _endDate: number | string | BN
    ): NonPayableTransactionObject<void>;

    /**
     * onlyOwner
     * Updates the public mint's characteristics
     * @param _maxPerTransaction - the maximum amount allowed in a wallet to mint in the public mint
     * @param _startDate - the start date for that mint in UNIX seconds
     */
    updatePublicMint(
      _maxPerTransaction: number | string | BN,
      _startDate: number | string | BN
    ): NonPayableTransactionObject<void>;

    /**
     * onlyOwner
     * Allows the owner of the contract to update the mint price
     */
    updateMintPrice(
      _price: number | string | BN
    ): NonPayableTransactionObject<void>;

    /**
     * onlyOwner
     * Updates the current active mint, whether secondary (false) or main (true).
     */
    updateMainCollectionMinting(
      _mainCollectionMinting: boolean
    ): NonPayableTransactionObject<void>;

    batchMintUpdate(
      _publicMaxPerTransaction: number | string | BN,
      _publicStartDate: number | string | BN,
      _wlStartDate: number | string | BN,
      _wlEndDate: number | string | BN,
      _price: number | string | BN,
      _mainCollectionMinting: boolean
    ): NonPayableTransactionObject<void>;

    ownerMintTo(
      _amounts: (number | string | BN)[],
      _addresses: string[],
      _mainCollection: boolean
    ): NonPayableTransactionObject<void>;

    /**
     * Burns the provided token id if you own it. Reduces the supply by 1.
     * @param _tokenId - the ID of the token to be burned.
     */
    burn(_tokenId: number | string | BN): NonPayableTransactionObject<void>;

    /**
     * See {IERC721Metadata-tokenURI}.
     * Retreives the URI for the given token. The main and secondary collections have different base URIs.
     */
    tokenURI(
      tokenId: number | string | BN
    ): NonPayableTransactionObject<string>;

    getWhitelistMints(
      _user: string
    ): NonPayableTransactionObject<[string, string]>;

    getPremintHash(
      _minter: string,
      _quantity: number | string | BN,
      _mainCollection: boolean,
      _nonce: number | string | BN
    ): NonPayableTransactionObject<string>;

    /**
     * Mints in the premint stage by using a signed transaction from a centralized whitelist. The message signer is expected to only sign messages when they fall within the whitelist specifications.
     * @param _mainCollection - true if minting the main collection, false otherwise (secondary).
     * @param _nonce - a random nonce which indicates that a signed transaction hasn't already been used.
     * @param _quantity - the number to mint
     * @param _signature - the signature given by the centralized whitelist authority, signed by                    the account specified as mintSigner.
     */
    premint(
      _quantity: number | string | BN,
      _mainCollection: boolean,
      _nonce: number | string | BN,
      _signature: string | number[]
    ): PayableTransactionObject<void>;

    /**
     * Mints the given quantity of tokens provided it is possible to.This function allows minting in the public sale         or at any time for the owner of the contract.
     * @param _quantity - the number of tokens to mint
     */
    mint(_quantity: number | string | BN): PayableTransactionObject<void>;

    /**
     * Withdraws balance from the contract to the owner (sender).
     * @param _amount - the amount to withdraw, much be <= contract balance.
     */
    withdraw(_amount: number | string | BN): NonPayableTransactionObject<void>;
  };
  events: {
    Approval(cb?: Callback<Approval>): EventEmitter;
    Approval(options?: EventOptions, cb?: Callback<Approval>): EventEmitter;

    ApprovalForAll(cb?: Callback<ApprovalForAll>): EventEmitter;
    ApprovalForAll(
      options?: EventOptions,
      cb?: Callback<ApprovalForAll>
    ): EventEmitter;

    OwnershipTransferred(cb?: Callback<OwnershipTransferred>): EventEmitter;
    OwnershipTransferred(
      options?: EventOptions,
      cb?: Callback<OwnershipTransferred>
    ): EventEmitter;

    Transfer(cb?: Callback<Transfer>): EventEmitter;
    Transfer(options?: EventOptions, cb?: Callback<Transfer>): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "Approval", cb: Callback<Approval>): void;
  once(event: "Approval", options: EventOptions, cb: Callback<Approval>): void;

  once(event: "ApprovalForAll", cb: Callback<ApprovalForAll>): void;
  once(
    event: "ApprovalForAll",
    options: EventOptions,
    cb: Callback<ApprovalForAll>
  ): void;

  once(event: "OwnershipTransferred", cb: Callback<OwnershipTransferred>): void;
  once(
    event: "OwnershipTransferred",
    options: EventOptions,
    cb: Callback<OwnershipTransferred>
  ): void;

  once(event: "Transfer", cb: Callback<Transfer>): void;
  once(event: "Transfer", options: EventOptions, cb: Callback<Transfer>): void;
}