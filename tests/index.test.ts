import { Address, BigInt } from "@graphprotocol/graph-ts"
import { clearStore, test, assert, newMockEvent } from "matchstick-as/assembly/index"
import { Transfer } from "../generated/artblocks/artblocks"
import { handleTest } from "../src/mappings"
import { tests as testsModule } from "../src/modules"

test("always pass", () => {
	let tru = true
	assert.assertTrue(tru)
	// clearStore()
})

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
