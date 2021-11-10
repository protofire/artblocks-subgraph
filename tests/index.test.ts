import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { clearStore, test, assert, newMockEvent } from "matchstick-as/assembly/index"
import { Transfer } from "../generated/artblocks/artblocks"
import { handleTest } from "../src/mappings"
import { tests } from "../src/modules"

export function runTests() {
	test("MyTest",
		() => {

			let addressTo = new Address(6)
			let from = tests.helpers.params.getAddress("from", new Address(5))
			let to = tests.helpers.params.getAddress("to", addressTo)
			let tokenId = tests.helpers.params.getBigInt("tokenId", new BigInt(666))

			let event = tests.helpers.events.addParamsToEvent(
				[from, to, tokenId],
				newMockEvent() as ethereum.Event
			) as Transfer

			handleTest(event)

			assert.fieldEquals("Token", "666", "owner", addressTo.toString())

			clearStore()
		}
	)
}