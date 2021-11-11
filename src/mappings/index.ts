import { ADDRESS_ZERO } from '@protofire/subgraph-toolkit'
import {
	Approval,
	ApprovalForAll,
	Transfer,
	Mint
} from "../../generated/artblocks/artblocks";

import { transfer } from "./transfer"

import {
	tokens,
	accounts,
	blocks,
	transactionsMeta,
	collections
} from "../modules";

export function handleMint(event: Mint): void {
	let blockNumber = event.block.number
	let blockId = blockNumber.toString()
	let txHash = event.transaction.hash
	let timestamp = event.block.timestamp

	let block = blocks.getOrCreateBlock(blockId, timestamp, blockNumber)
	block.save()

	let meta = transactionsMeta.getOrCreateTransactionMeta(
		txHash.toHexString(),
		blockId,
		txHash,
		event.transaction.from,
		event.transaction.gasLimit,
		event.transaction.gasPrice,
	)
	meta.save()

	let to = event.params._to.toHex()
	let tokenId = event.params._tokenId.toHex()
	let collectionId = event.params._projectId.toHex()

	let collection = collections.getOrCreateCollection(collectionId)
	collection.save()

	let token = tokens.addCollection(tokenId, collectionId)
	token.owner = to
	token.save()

}


export function handleTest(event: Transfer): void {
	let token = tokens.getOrCreateToken(event.params.tokenId.toString(), event.params.to.toString())
	token.save()
}

export function handleTransfer(event: Transfer): void {

	let from = event.params.from.toHex()
	let to = event.params.to.toHex()
	let tokenId = event.params.tokenId.toHex()
	let blockNumber = event.block.number
	let blockId = blockNumber.toString()
	let txHash = event.transaction.hash
	let timestamp = event.block.timestamp

	let block = blocks.getOrCreateBlock(blockId, timestamp, blockNumber)
	block.save()

	let meta = transactionsMeta.getOrCreateTransactionMeta(
		txHash.toHexString(),
		blockId,
		txHash,
		event.transaction.from,
		event.transaction.gasLimit,
		event.transaction.gasPrice,
	)
	meta.save()

	if (from == ADDRESS_ZERO) {
		transfer.handleMint(event.params.to, tokenId, timestamp, blockId)
	} else if (to == ADDRESS_ZERO) {
		transfer.handleBurn(event.params.from, tokenId, timestamp, blockId)
	} else {
		transfer.handleRegularTransfer(event.params.from, event.params.to, tokenId, timestamp, blockId)
	}

}

export function handleApproval(event: Approval): void {
	let tokenId = event.params.tokenId.toHex()
	let ownerAddress = event.params.owner
	let approvedAddress = event.params.approved
	let blockNumber = event.block.number
	let blockId = blockNumber.toString()
	let txHash = event.transaction.hash
	let timestamp = event.block.timestamp

	let meta = transactionsMeta.getOrCreateTransactionMeta(
		txHash.toHexString(),
		blockId,
		txHash,
		event.transaction.from,
		event.transaction.gasLimit,
		event.transaction.gasPrice,
	)
	meta.save()

	let block = blocks.getOrCreateBlock(blockId, timestamp, blockNumber)
	block.save()

	let approved = accounts.getOrCreateAccount(approvedAddress)
	approved.save()

	let owner = accounts.getOrCreateAccount(ownerAddress)
	owner.save()

	let token = tokens.addApproval(tokenId, approvedAddress.toHex())
	token.save()
}

export function handleApprovalForAll(event: ApprovalForAll): void {
	let ownerAddress = event.params.owner
	let operatorAddress = event.params.operator
	let blockNumber = event.block.number
	let blockId = blockNumber.toString()
	let txHash = event.transaction.hash
	let timestamp = event.block.timestamp

	let meta = transactionsMeta.getOrCreateTransactionMeta(
		txHash.toHexString(),
		blockId,
		txHash,
		event.transaction.from,
		event.transaction.gasLimit,
		event.transaction.gasPrice,
	)
	meta.save()

	let block = blocks.getOrCreateBlock(blockId, timestamp, blockNumber)
	block.save()

	let owner = accounts.getOrCreateAccount(ownerAddress)
	owner.save()

	let operator = accounts.getOrCreateAccount(operatorAddress)
	operator.save()

	let operatorOwner = accounts.getOrCreateOperatorOwner(owner.id, operator.id, event.params.approved)
	operatorOwner.save()

}

