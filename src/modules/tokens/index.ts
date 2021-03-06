import { ADDRESS_ZERO } from '@protofire/subgraph-toolkit'
import { log } from '@graphprotocol/graph-ts'
import { Token } from "../../../generated/schema";


export namespace tokens {
	export function getOrCreateToken(tokenId: string, accountId: string): Token {
		let token = Token.load(tokenId)
		if (token == null) {
			token = new Token(tokenId)
			token.owner = accountId
		}
		return token as Token
	}

	export function loadToken(tokenId: string): Token {
		let token = Token.load(tokenId)
		if (token == null) {
			// maybe it should be created or loaded
			log.info(
				"@@@@@ at func: {} msg: {}",
				["loadToken",
					"Couldn't find token w/ id: " + tokenId]
			)
			log.critical("", [""])
		}
		return token as Token
	}

	export function mintToken(
		tokenId: string, owner: string
	): Token {
		let token = getOrCreateToken(tokenId, owner)
		token.burned = false
		return token as Token
	}

	export function burnToken(
		tokenId: string,
		owner: string
	): Token {
		let token = getOrCreateToken(tokenId, owner)
		token.burned = true
		token.owner = ADDRESS_ZERO
		return token as Token
	}


	export function changeOwner(tokenId: string, owner: string): Token {
		let token = getOrCreateToken(tokenId, owner)
		token.owner = owner
		return token as Token
	}

	export function setApproval(tokenId: string, approval: string, owner: string): Token {
		let token = getOrCreateToken(tokenId, owner)
		token.approval = approval
		return token as Token
	}
	export function addCollection(tokenId: string, collectionId: string, owner: string): Token {
		let token = getOrCreateToken(tokenId, owner)
		token.collection = collectionId
		return token as Token
	}
}
