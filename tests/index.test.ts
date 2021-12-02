import { Address, BigInt } from "@graphprotocol/graph-ts"
import { ADDRESS_ZERO } from "@protofire/subgraph-toolkit"
import { clearStore, test, assert } from "matchstick-as/assembly/index"
import { Transfer, Mint, Approval, ApprovalForAll } from "../generated/artblocks/artblocks"
import { handleTest, handleMint, handleTransfer, handleApproval, handleApprovalForAll } from "../src/mappings"
import { accounts, tests as testsModule, transactions } from "../src/modules"

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

test("handleRegularTransfer",
	() => {
		let from = Address.fromString("0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f7")
		let to = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")
		let tokenId = BigInt.fromI32(666)

		let event = changetype<Transfer>(testsModule.helpers.events.getNewEvent(
			[
				testsModule.helpers.params.getAddress("from", from),
				testsModule.helpers.params.getAddress("to", to),
				testsModule.helpers.params.getBigInt("tokenId", tokenId)
			]
		))
		handleTransfer(event)

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

		// check buyer
		let buyerId = to.toHexString()
		assert.fieldEquals("Account", buyerId, "id", buyerId)

		// check token
		let entityTokenId = tokenId.toHexString()
		assert.fieldEquals("Token", entityTokenId, "owner", buyerId)

		// check seller
		let sellerId = from.toHexString()
		assert.fieldEquals("Account", sellerId, "id", sellerId)

		// check transfer
		let transferId = transactions.helpers.getNewTransactionId(sellerId, buyerId, event.block.timestamp)
		assert.fieldEquals("Transfer", transferId, "from", sellerId)
		assert.fieldEquals("Transfer", transferId, "to", buyerId)
		assert.fieldEquals("Transfer", transferId, "token", entityTokenId)
		assert.fieldEquals("Transfer", transferId, "block", blockId)

		clearStore()
	}
)

test("handleMintTransfer",
	() => {
		let from = Address.fromString(ADDRESS_ZERO)
		let to = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")
		let tokenId = BigInt.fromI32(666)

		let event = changetype<Transfer>(testsModule.helpers.events.getNewEvent(
			[
				testsModule.helpers.params.getAddress("from", from),
				testsModule.helpers.params.getAddress("to", to),
				testsModule.helpers.params.getBigInt("tokenId", tokenId)
			]
		))
		handleTransfer(event)

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

		// check buyer
		let buyerId = to.toHexString()
		assert.fieldEquals("Account", buyerId, "id", buyerId)

		// check token
		let entityTokenId = tokenId.toHexString()
		assert.fieldEquals("Token", entityTokenId, "owner", buyerId)

		// check transfer
		let sellerId = from.toHexString()
		let transferId = transactions.helpers.getNewTransactionId(sellerId, buyerId, event.block.timestamp)
		assert.fieldEquals("Mint", transferId, "from", sellerId)
		assert.fieldEquals("Mint", transferId, "to", buyerId)
		assert.fieldEquals("Mint", transferId, "token", entityTokenId)
		assert.fieldEquals("Mint", transferId, "block", blockId)

		clearStore()
	}
)

test("handleBurn",
	() => {
		let from = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")
		let to = Address.fromString(ADDRESS_ZERO)
		let tokenId = BigInt.fromI32(666)

		let event = changetype<Transfer>(testsModule.helpers.events.getNewEvent(
			[
				testsModule.helpers.params.getAddress("from", from),
				testsModule.helpers.params.getAddress("to", to),
				testsModule.helpers.params.getBigInt("tokenId", tokenId)
			]
		))
		handleTransfer(event)

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

		// check seller
		let buyerId = to.toHexString()
		let sellerId = from.toHexString()
		assert.fieldEquals("Account", sellerId, "id", sellerId)

		// check token
		let entityTokenId = tokenId.toHexString()
		assert.fieldEquals("Token", entityTokenId, "owner", buyerId)

		// check transfer
		let transferId = transactions.helpers.getNewTransactionId(sellerId, buyerId, event.block.timestamp)
		assert.fieldEquals("Burn", transferId, "from", sellerId)
		assert.fieldEquals("Burn", transferId, "to", buyerId)
		assert.fieldEquals("Burn", transferId, "token", entityTokenId)
		assert.fieldEquals("Burn", transferId, "block", blockId)

		clearStore()
	}
)

test("handleApproval",
	() => {
		let owner = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")
		let approved = Address.fromString("0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f7")
		let tokenId = BigInt.fromI32(666)

		let event = changetype<Approval>(testsModule.helpers.events.getNewEvent(
			[
				testsModule.helpers.params.getAddress("owner", owner),
				testsModule.helpers.params.getAddress("approved", approved),
				testsModule.helpers.params.getBigInt("tokenId", tokenId)
			]
		))
		handleApproval(event)

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

		// check owner
		let ownerId = owner.toHexString()
		// TODO: assert should support types

		assert.fieldEquals("Account", ownerId, "address", owner.toHex())

		// check approved
		let approvedId = approved.toHexString()
		assert.fieldEquals("Account", approvedId, "address", approved.toHex())

		// check token
		let entityTokenId = tokenId.toHexString()
		assert.fieldEquals("Token", entityTokenId, "owner", ownerId)
		assert.fieldEquals("Token", entityTokenId, "approval", approvedId)

		clearStore()
	}
)

test("handleApprovalForAll",
	() => {
		let owner = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")
		let operator = Address.fromString("0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f7")
		let approved = false

		let event = changetype<ApprovalForAll>(testsModule.helpers.events.getNewEvent(
			[
				testsModule.helpers.params.getAddress("owner", owner),
				testsModule.helpers.params.getAddress("operator", operator),
				testsModule.helpers.params.getBoolean("approved", approved),
			]
		))
		handleApprovalForAll(event)

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

		// check owner
		// TODO: assert should support types
		let ownerId = owner.toHexString()
		assert.fieldEquals("Account", ownerId, "address", owner.toHex())

		// check approved
		let operatorId = operator.toHexString()
		assert.fieldEquals("Account", operatorId, "address", operator.toHex())

		// check OperatorOwner
		let operatorOwnerId = accounts.helpers.getOperatorOwnerId(ownerId, operatorId)
		assert.fieldEquals("OperatorOwner", operatorOwnerId, "owner", ownerId)
		assert.fieldEquals("OperatorOwner", operatorOwnerId, "operator", operatorId)
		assert.fieldEquals("OperatorOwner", operatorOwnerId, "approved", approved.toString())

		clearStore()
	}
)
