import { Address, BigInt } from "@graphprotocol/graph-ts"
import { clearStore, test, assert } from "matchstick-as/assembly/index"
import { Transfer, Mint } from "../generated/artblocks/artblocks"
import { handleTest, handleMint } from "../src/mappings"
import { tests as testsModule } from "../src/modules"

test("testing matschtick",
	() => {
		let from = Address.fromString("0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f7") // this works
		let to = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")
		let tokenId = BigInt.fromI32(666)

		let event = changetype<Transfer>(testsModule.helpers.events.getNewEvent(
			[
				testsModule.helpers.params.getAddress("from", from),
				testsModule.helpers.params.getAddress("to", to),
				testsModule.helpers.params.getBigInt("tokenId", tokenId)
			]
		))
		handleTest(event)
		assert.fieldEquals("Token", tokenId.toHexString(), "owner", to.toHexString())
		clearStore()
	}
)

test("handleMint",
	() => {
		let to = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")
		let tokenId = BigInt.fromI32(666)
		let projectId = BigInt.fromI32(1989)

		let event = changetype<Mint>(testsModule.helpers.events.getNewEvent(
			[
				testsModule.helpers.params.getAddress("to", to),
				testsModule.helpers.params.getBigInt("tokenId", tokenId),
				testsModule.helpers.params.getBigInt("projectId", projectId)
			]
		))
		handleMint(event)

		// check block
		let blockId = event.block.number.toString()
		assert.fieldEquals("Block", blockId, "timestamp", event.block.timestamp.toString())
		assert.fieldEquals("Block", blockId, "number", blockId)

		// check meta
		let txId = event.transaction.hash.toHexString()
		assert.fieldEquals("TransactionMeta", txId, "block", blockId)
		assert.fieldEquals("TransactionMeta", txId, "hash", txId)
		assert.fieldEquals("TransactionMeta", txId, "from", event.transaction.from.toHexString())
		assert.fieldEquals("TransactionMeta", txId, "gasLimit", event.transaction.gasLimit.toString())
		assert.fieldEquals("TransactionMeta", txId, "gasPrice", event.transaction.gasPrice.toString())

		// check collection
		let collectionId = event.params._projectId.toHex()
		assert.fieldEquals("Collection", collectionId, "id", collectionId)

		// check token
		let entityTokenId = tokenId.toHexString()
		assert.fieldEquals("Token", entityTokenId, "collection", collectionId)
		assert.fieldEquals("Token", entityTokenId, "owner", to.toHexString())

		clearStore()
	}
)
