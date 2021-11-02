import { ADDRESS_ZERO } from '@protofire/subgraph-toolkit'
import {
	Approval,
	ApprovalForAll,
	Transfer
} from "../../generated/artblocks/artblocks";

import { transfer } from "./transfer"

import {
	tokens,
	accounts
} from "../modules";



export function handleTransfer(event: Transfer): void {

	let from = event.params.from.toHex()
	let to = event.params.to.toHex()
	let tokenId = event.params.tokenId.toHex()
	let blockNumber = event.block.number
	let blockId = blockNumber.toString()
	let txHash = event.transaction.hash
	let timestamp = event.block.timestamp

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

	let owner = accounts.getOrCreateAccount(ownerAddress)
	owner.save()

	let operator = accounts.getOrCreateAccount(operatorAddress)
	operator.save()

	let operatorOwner = accounts.getOrCreateOperatorOwner(owner.id, operator.id, event.params._approved)
	operatorOwner.save()

}

