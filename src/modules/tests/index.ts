import { Address, Bytes, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { newMockEvent } from "matchstick-as"


export namespace tests {
	export namespace helpers {

		function getNewParam(name: string, value: ethereum.Value): ethereum.EventParam {
			return new ethereum.EventParam(name, value)
		}

		export namespace events {
			export function getNewEvent(params: ethereum.EventParam[]): ethereum.Event {
				let event = newMockEvent() as ethereum.Event
				event.parameters = []
				for (let index = 0; index < params.length; index++) {
					event.parameters.push(params[index])
				}
				return event
			}
		}
		export namespace params {

			export function getI32(name: string, value: i32): ethereum.EventParam {
				return getNewParam(name, ethereum.Value.fromI32(value))
			}

			export function getString(name: string, value: string): ethereum.EventParam {
				return getNewParam(name, ethereum.Value.fromString(value))
			}

			export function getBytes(name: string, value: Bytes): ethereum.EventParam {
				return getNewParam(name, ethereum.Value.fromBytes(value))
			}

			export function getBoolean(name: string, value: boolean): ethereum.EventParam {
				return getNewParam(name, ethereum.Value.fromBoolean(value))
			}

			export function getBigInt(name: string, value: BigInt): ethereum.EventParam {
				return getNewParam(name, ethereum.Value.fromUnsignedBigInt(value))
			}

			export function getAddress(name: string, value: Address): ethereum.EventParam {
				return getNewParam(name, ethereum.Value.fromAddress(value))
			}

		}
	}
}