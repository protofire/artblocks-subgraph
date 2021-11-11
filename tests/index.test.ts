import { Address, BigInt } from "@graphprotocol/graph-ts"
import { clearStore, test, assert } from "matchstick-as/assembly/index"
import { Transfer } from "../generated/artblocks/artblocks"
import { handleTest } from "../src/mappings"
import { tests as testsModule } from "../src/modules"


test("MyTest",
	() => {
		let from = new Address(5)
		let to = new Address(6)
		let tokenId = new BigInt(666)

		let event = changetype<Transfer>(testsModule.helpers.events.getNewEvent(
			[
				testsModule.helpers.params.getAddress("from", from),
				testsModule.helpers.params.getAddress("to", to),
				testsModule.helpers.params.getBigInt("tokenId", tokenId)
			]
		))

		handleTest(event)

		assert.fieldEquals("token", tokenId.toString(), "owner", to.toString())
	}
)
