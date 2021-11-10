import { Address, Bytes, BigInt, ethereum } from "@graphprotocol/graph-ts"

export namespace tests {
	export namespace helpers {
		function getNewParam(name: string, value: ethereum.Value) {
			return new ethereum.EventParam(name, value)
		}

		export namespace events {
			export function addParamsToEvent(params: ethereum.EventParam[], e: ethereum.Event): ethereum.Event {
				let event = e
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