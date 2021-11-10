import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { clearStore, test, assert, newMockEvent } from "matchstick-as/assembly/index"
import { Transfer } from "../generated/artblocks/artblocks"
import { handleTest } from "../src/mappings"
import { tests as testsModule } from "../src/modules"


test("MyTest",
	() => {

		let addressTo = new Address(6)
		let from = testsModule.helpers.params.getAddress("from", new Address(5))
		let to = testsModule.helpers.params.getAddress("to", addressTo)
		let tokenId = testsModule.helpers.params.getBigInt("tokenId", new BigInt(666))

		let event = testsModule.helpers.events.addParamsToEvent(
			[from, to, tokenId],
			newMockEvent() as ethereum.Event
		) as Transfer

		handleTest(event)

		assert.fieldEquals("Token", "666", "owner", addressTo.toString())

		clearStore()
	}
)
