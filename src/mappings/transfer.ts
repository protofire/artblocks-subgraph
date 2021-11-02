import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
	accounts,
	tokens
} from "../modules";

export namespace transfer {

	export function handleMint(to: Bytes, tokenId: string, timestamp: BigInt, blockId: string): void {
		let account = accounts.getOrCreateAccount(to)
		account.save()

		let token = tokens.mintToken(tokenId, to.toHex())
		token.save()
	}


	export function handleBurn(from: Bytes, tokenId: string, timestamp: BigInt, blockId: string): void {

		let account = accounts.getOrCreateAccount(from)
		account.save()

		let token = tokens.burnToken(tokenId)
		token.save()
	}

	export function handleRegularTransfer(from: Bytes, to: Bytes, tokenId: string, timestamp: BigInt, blockId: string): void {

		let seller = accounts.getOrCreateAccount(from)
		seller.save()

		let buyer = accounts.getOrCreateAccount(to)
		buyer.save()

		let token = tokens.changeOwner(tokenId, buyer.id)
		token.save()

	}
}